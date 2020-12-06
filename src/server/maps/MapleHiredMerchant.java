/*
This file is part of the OdinMS Maple Story Server
Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation version 3 as published by
the Free Software Foundation. You may not use, modify or distribute
this program under any other version of the GNU Affero General Public
License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package server.maps;

import client.MapleCharacter;
import client.MapleClient;
import client.inventory.*;
import client.inventory.manipulator.MapleInventoryManipulator;
import client.inventory.manipulator.MapleKarmaManipulator;
import client.processor.npc.FredrickProcessor;
import java.sql.Statement;
import config.YamlConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.Lock;
import net.server.audit.locks.factory.MonitoredReentrantLockFactory;
import net.server.Server;
import server.MapleItemInformationProvider;
import tools.DatabaseConnection;
import tools.FilePrinter;
import tools.MaplePacketCreator;
import tools.Pair;
import net.server.audit.locks.MonitoredLockType;
import server.MapleTrade;

/**
 *
 * @author XoticStory
 * @author Ronan - concurrency protection
 */
public class MapleHiredMerchant extends AbstractMapleMapObject {
    private int ownerId, itemId, mesos = 0;
    private int channel, world;
    private long start;
    private String ownerName = "";
    private String description = "";
    private MapleCharacter[] visitors = new MapleCharacter[3];
    private final List<MaplePlayerShopItem> items = new LinkedList<>();
    private List<Pair<String, Byte>> messages = new LinkedList<>();
    private List<SoldItem> sold = new LinkedList<>();
    private AtomicBoolean open = new AtomicBoolean();
    private boolean published = false;
    private MapleMap map;
    private Lock visitorLock = MonitoredReentrantLockFactory.createLock(MonitoredLockType.VISITOR_MERCH, true);

    public MapleHiredMerchant(final MapleCharacter owner, String desc, int itemId) {
        this.setPosition(owner.getPosition());
        this.start = System.currentTimeMillis();
        this.ownerId = owner.getId();
        this.channel = owner.getClient().getChannel();
        this.world = owner.getWorld();
        this.itemId = itemId;
        this.ownerName = owner.getName();
        this.description = desc;
        this.map = owner.getMap();
    }

    public void broadcastToVisitorsThreadsafe(final byte[] packet) {
        visitorLock.lock();
        try {
            broadcastToVisitors(packet);
        } finally {
            visitorLock.unlock();
        }
    }
    
    private void broadcastToVisitors(final byte[] packet) {
        for (MapleCharacter visitor : visitors) {
            if (visitor != null) {
                visitor.getClient().announce(packet);
            }
        }
    }

    public byte[] getShopRoomInfo() {
        visitorLock.lock();
        try {
            byte count = 0;
            if (this.isOpen()) {
                for (MapleCharacter visitor : visitors) {
                    if (visitor != null) {
                        count++;
                    }
                }
            } else {
                count = (byte) (visitors.length + 1);
            }
            
            return new byte[]{count, (byte) (visitors.length + 1)};
        } finally {
            visitorLock.unlock();
        }
    }
    
    public boolean addVisitor(MapleCharacter visitor) {
        visitorLock.lock();
        try {
            int i = this.getFreeSlot();
            if (i > -1) {
                visitors[i] = visitor;
                broadcastToVisitors(MaplePacketCreator.hiredMerchantVisitorAdd(visitor, i + 1));
                this.getMap().broadcastMessage(MaplePacketCreator.updateHiredMerchantBox(this));
                
                return true;
            }
            
            return false;
        } finally {
            visitorLock.unlock();
        }
    }

    public void removeVisitor(MapleCharacter visitor) {
        visitorLock.lock();
        try {
            int slot = getVisitorSlot(visitor);
            if (slot < 0) { //Not found
                return;
            }
            if (visitors[slot] != null && visitors[slot].getId() == visitor.getId()) {
                visitors[slot] = null;
                broadcastToVisitors(MaplePacketCreator.hiredMerchantVisitorLeave(slot + 1));
                this.getMap().broadcastMessage(MaplePacketCreator.updateHiredMerchantBox(this));
            }
        } finally {
            visitorLock.unlock();
        }
    }

    public int getVisitorSlotThreadsafe(MapleCharacter visitor) {
        visitorLock.lock();
        try {
            return getVisitorSlot(visitor);
        } finally {
            visitorLock.unlock();
        }
    }
    
    private int getVisitorSlot(MapleCharacter visitor) {
        for (int i = 0; i < 3; i++) {
            if (visitors[i] != null && visitors[i].getId() == visitor.getId()){
                return i;
            }
        }
        return -1; //Actually 0 because of the +1's.
    }

    private void removeAllVisitors() {
        visitorLock.lock();
        try {
            for (int i = 0; i < 3; i++) {
                MapleCharacter visitor = visitors[i];
                
                if (visitor != null) {
                    visitor.setHiredMerchant(null);
                    
                    visitor.getClient().announce(MaplePacketCreator.leaveHiredMerchant(i + 1, 0x11));
                    visitor.getClient().announce(MaplePacketCreator.hiredMerchantMaintenanceMessage());
                    
                    visitors[i] = null;
                }
            }
            
            this.getMap().broadcastMessage(MaplePacketCreator.updateHiredMerchantBox(this));
        } finally {
            visitorLock.unlock();
        }
    }
    
    private void removeOwner(MapleCharacter owner) {
        if (owner.getHiredMerchant() == this) {
            owner.announce(MaplePacketCreator.hiredMerchantOwnerLeave());
            owner.announce(MaplePacketCreator.leaveHiredMerchant(0x00, 0x03));
            owner.setHiredMerchant(null);
        }
    }

    public void withdrawMesos(MapleCharacter chr) {
        if (isOwner(chr)) {
            synchronized (items) {
                chr.withdrawMerchantMesos();
            }
        }
    }
    
    public void takeItemBack(int slot, MapleCharacter chr) {
        synchronized (items) {
            MaplePlayerShopItem shopItem = items.get(slot);
            if(shopItem.isExist()) {
                if (shopItem.getBundles() > 0) {
                    Item iitem = shopItem.getItem().copy();
                    iitem.setQuantity((short) (shopItem.getItem().getQuantity() * shopItem.getBundles()));
                    
                    if (!MapleInventory.checkSpot(chr, iitem)) {
                        chr.announce(MaplePacketCreator.serverNotice(1, "Have a slot available on your inventory to claim back the item."));
                        chr.announce(MaplePacketCreator.enableActions());
                        return;
                    }
                    
                    MapleInventoryManipulator.addFromDrop(chr.getClient(), iitem, true);
                }
                
                removeFromSlot(slot);
                chr.announce(MaplePacketCreator.updateHiredMerchant(this, chr));
            }
        }
    }
    
    private static boolean canBuy(MapleClient c, Item newItem) {    // thanks xiaokelvin (Conrad) for noticing a leaked test code here
        return MapleInventoryManipulator.checkSpace(c, newItem.getItemId(), newItem.getQuantity(), newItem.getOwner()) && MapleInventoryManipulator.addFromDrop(c, newItem, false);
    }
    
    private int getQuantityLeft(int itemid) {
        synchronized (items) {
            int count = 0;
            
            for (MaplePlayerShopItem mpsi : items) {
                if (mpsi.getItem().getItemId() == itemid) {
                    count += (mpsi.getBundles() * mpsi.getItem().getQuantity());
                }
            }
            
            return count;
        }
    }
    
    public void buy(MapleClient c, int item, short quantity) {
        synchronized (items) {
            MaplePlayerShopItem pItem = items.get(item);
            Item newItem = pItem.getItem().copy();
            
            newItem.setQuantity((short) ((pItem.getItem().getQuantity() * quantity)));
            if (quantity < 1 || !pItem.isExist() || pItem.getBundles() < quantity) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            } else if (newItem.getInventoryType().equals(MapleInventoryType.EQUIP) && newItem.getQuantity() > 1) {
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            
            MapleKarmaManipulator.toggleKarmaFlagToUntradeable(newItem);
            int price = Math.min(pItem.getPrice() * quantity, Integer.MAX_VALUE);
            if (c.getPlayer().getMeso() >= price) {
                if (canBuy(c, newItem)) {
                    c.getPlayer().gainMeso(-price, false);
                    price -= MapleTrade.getMerchantFee(price);  // thanks BHB for pointing out trade fees not applying here
                    
                    synchronized (sold) {
                        sold.add(new SoldItem(c.getPlayer().getName(), pItem.getItem().getItemId(), newItem.getQuantity(), price));
                    }

                    pItem.setBundles((short) (pItem.getBundles() - quantity));
                    if (pItem.getBundles() < 1) {
                        pItem.setDoesExist(false);
                    }

                    if(YamlConfig.config.server.USE_ANNOUNCE_SHOPITEMSOLD) {   // idea thanks to Vcoc
                        announceItemSold(newItem, price, getQuantityLeft(pItem.getItem().getItemId()));
                    }

                    MapleCharacter owner = Server.getInstance().getWorld(world).getPlayerStorage().getCharacterById(ownerId);
                    if (owner != null) {
                        owner.addMerchantMesos(price);
                    } else {
                        try (Connection con = DatabaseConnection.getConnection()) {

                            long merchantMesos = 0;
                            try (PreparedStatement ps = con.prepareStatement("SELECT MerchantMesos FROM characters WHERE id = ?")) {
                                ps.setInt(1, ownerId);
                                try (ResultSet rs = ps.executeQuery()) {
                                    if (rs.next()) {
                                        merchantMesos = rs.getInt(1);
                                    }
                                }
                            }
                            merchantMesos += price;

                            try (PreparedStatement ps = con.prepareStatement("UPDATE characters SET MerchantMesos = ? WHERE id = ?", Statement.RETURN_GENERATED_KEYS)) {
                                ps.setInt(1, (int) Math.min(merchantMesos, Integer.MAX_VALUE));
                                ps.setInt(2, ownerId);
                                ps.executeUpdate();
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                } else {
                    c.getPlayer().dropMessage(1, "Your inventory is full. Please clear a slot before buying this item.");
                    c.announce(MaplePacketCreator.enableActions());
                    return;
                }
            } else {
                c.getPlayer().dropMessage(1, "You don't have enough mesos to purchase this item.");
                c.announce(MaplePacketCreator.enableActions());
                return;
            }
            try {
                if (pItem.isExist())
                    this.saveItem(pItem, false);
                else
                    this.deleteItem(pItem);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    private void announceItemSold(Item item, int mesos, int inStore) {
        String qtyStr = (item.getQuantity() > 1) ? " x " + item.getQuantity() : "";
        
        MapleCharacter player = Server.getInstance().getWorld(world).getPlayerStorage().getCharacterById(ownerId);
        if(player != null && player.isLoggedinWorld()) {
            player.dropMessage(6, "[Hired Merchant] Item '" + MapleItemInformationProvider.getInstance().getName(item.getItemId()) + "'" + qtyStr + " has been sold for " + mesos + " mesos. (" + inStore + " left)");
        }
    }

    public void forceClose() {
        map.broadcastMessage(MaplePacketCreator.removeHiredMerchantBox(getOwnerId()));
        map.removeMapObject(this);

        MapleCharacter owner = Server.getInstance().getWorld(world).getPlayerStorage().getCharacterById(ownerId);

        visitorLock.lock();
        try {
            setOpen(false);
            removeAllVisitors();

            if (owner != null) { // owner exists on the world
                if (owner.isLoggedinWorld() && this == owner.getHiredMerchant()) { // owner is inside their store
                    closeOwnerMerchant(owner);
                } else {
                    clearInexistentItems();
                }

                FilePrinter.print(FilePrinter.FREDRICK + ownerName + ".txt", "Closing player merchant, owner not in shop, nothing to update.");
                for (MaplePlayerShopItem mpsi : getItems()) {
                    if (mpsi.isExist()) {
                        FilePrinter.print(FilePrinter.FREDRICK + ownerName + ".txt", "Owner not in shop: adding " + mpsi.getBundles() + " " + mpsi.getItem().getItemId() + " to Frederick.");
                        if (mpsi.getItem().getInventoryType().equals(MapleInventoryType.EQUIP))
                            printEquipStats((Equip) mpsi.getItem(), ownerName);
                    }
                }
                owner.setHasMerchant(false);
            } else { // owner is offline
                try {
                    clearInexistentItems();
                    Connection con = DatabaseConnection.getConnection();
                    PreparedStatement ps = con.prepareStatement("UPDATE characters SET HasMerchant = 0 WHERE id = ?");
                    ps.setInt(1, ownerId);
                    ps.executeUpdate();

                    ps.close();
                    con.close();
                    FilePrinter.print(FilePrinter.FREDRICK + ownerName + ".txt", "Closing offline player merchant nothing to update.");
                    for (MaplePlayerShopItem mpsi : getItems()) {
                        if (mpsi.isExist()) {
                            FilePrinter.print(FilePrinter.FREDRICK + ownerName + ".txt", "Owner offline: adding " + mpsi.getBundles() + " " + mpsi.getItem().getItemId() + " to Frederick.");
                            if (mpsi.getItem().getInventoryType().equals(MapleInventoryType.EQUIP))
                                printEquipStats((Equip) mpsi.getItem(), ownerName);
                        }
                    }
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }

        } finally {
            visitorLock.unlock();
        }

        Server.getInstance().getWorld(world).unregisterHiredMerchant(this);

        map = null;
    }

    public void closeOwnerMerchant(MapleCharacter chr) {
        if(this.isOwner(chr)) {
            this.closeShop(chr.getClient(), false);
            chr.setHasMerchant(false);
        }
    }
    
    private void closeShop(MapleClient c, boolean timeout) {
        map.removeMapObject(this);
        map.broadcastMessage(MaplePacketCreator.removeHiredMerchantBox(ownerId));
        c.getChannelServer().removeHiredMerchant(ownerId);
        
        this.removeAllVisitors();
        this.removeOwner(c.getPlayer());

        try {
            List<MaplePlayerShopItem> copyItems = getItems();
            if (check(c.getPlayer(), copyItems) && !timeout) {
                for (MaplePlayerShopItem mpsi : copyItems) {
                    if(mpsi.isExist()) {
                        FilePrinter.print(FilePrinter.FREDRICK + c.getPlayer().getName() + ".txt", "Closing merchant: adding " + mpsi.getBundles() + " " + mpsi.getItem().getItemId() + " to inventory.");
                        if (mpsi.getItem().getInventoryType().equals(MapleInventoryType.EQUIP)) {
                            MapleInventoryManipulator.addFromDrop(c, mpsi.getItem(), false);
                            printEquipStats((Equip) mpsi.getItem(), c.getPlayer().getName());
                        } else {
                            MapleInventoryManipulator.addById(c, mpsi.getItem().getItemId(), (short) (mpsi.getBundles() * mpsi.getItem().getQuantity()), mpsi.getItem().getOwner(), -1, mpsi.getItem().getFlag(), mpsi.getItem().getExpiration());
                        }
                    }
                }
                // clear items from merchant so they get deleted from merchant
                synchronized (items) {
                    items.clear();
                }
            } else {
                for (MaplePlayerShopItem mpsi : copyItems) {
                    if (mpsi.isExist()) {
                        FilePrinter.print(FilePrinter.FREDRICK + c.getPlayer().getName() + ".txt", "Inventory full: adding " + mpsi.getBundles() + " " + mpsi.getItem().getItemId() + " to Frederick.");
                        if (mpsi.getItem().getInventoryType().equals(MapleInventoryType.EQUIP))
                            printEquipStats((Equip) mpsi.getItem(), c.getPlayer().getName());
                    }
                }
            }

            try {
                this.saveItems(timeout);
                // clear items after we save so we don't delete merchant items
                synchronized (items) {
                    items.clear();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Server.getInstance().getWorld(world).unregisterHiredMerchant(this);
    }

    private void printEquipStats(Equip e, String ownerName) {
        FilePrinter.print(FilePrinter.FREDRICK + ownerName + ".txt", "equip stats: " + e.getStats() + " | slots=" + e.getUpgradeSlots() + ", level=" + e.getLevel() + ", itemlevel=" + e.getItemLevel());
        e.getStats();
    }

    public synchronized void visitShop(MapleCharacter chr) {
        visitorLock.lock();
        try {
            if (this.isOwner(chr)) {
                this.setOpen(false);
                this.removeAllVisitors();

                chr.announce(MaplePacketCreator.getHiredMerchant(chr, this, false));
            } else if (!this.isOpen()) {
                chr.announce(MaplePacketCreator.getMiniRoomError(18));
                return;
            } else if (!this.addVisitor(chr)) {
                chr.announce(MaplePacketCreator.getMiniRoomError(2));
                return;
            } else {
                MapleCharacter owner = Server.getInstance().getWorld(world).getPlayerStorage().getCharacterById(ownerId);
                boolean ownerHasGroup;
                if (owner == null) {
                    try (Connection c = DatabaseConnection.getConnection()) {
                        try (PreparedStatement ps = c.prepareStatement("SELECT group_id from characters where id=?")) {
                            ps.setInt(1, this.getOwnerId());
                            try (ResultSet rs = ps.executeQuery()) {
                                if (rs.next())
                                    ownerHasGroup = rs.getString("group_id") != null && !rs.getString("group_id").isEmpty();
                                else {
                                    chr.dropMessage(1, "You cannot visit a " + (chr.hasGroup() ? "standard" : "league") + " store on a " + (chr.hasGroup() ? "league" : "standard") + " character.");
                                    chr.announce(MaplePacketCreator.enableActions());
                                    removeVisitor(chr);
                                    return;
                                }
                            }
                        }
                    } catch (Exception e) {
                        chr.dropMessage(1, "You cannot visit a " + (chr.hasGroup() ? "standard" : "league") + " store on a " + (chr.hasGroup() ? "league" : "standard") + " character.");
                        chr.announce(MaplePacketCreator.enableActions());
                        removeVisitor(chr);
                        return;
                    }
                } else {
                    ownerHasGroup = owner.hasGroup();
                }

                if ((chr.hasGroup() && !ownerHasGroup) || (!chr.hasGroup() && ownerHasGroup)) {
                    chr.dropMessage(1, "You cannot visit a " + (chr.hasGroup() ? "standard" : "league") + " store on a " + (chr.hasGroup() ? "league" : "standard") + " character.");
                    chr.announce(MaplePacketCreator.enableActions());
                    removeVisitor(chr);
                    return;
                } else {
                    chr.announce(MaplePacketCreator.getHiredMerchant(chr, this, false));
                }
            }
            chr.setHiredMerchant(this);
        } finally {
            visitorLock.unlock();
        }
    }

    public String getOwner() {
        return ownerName;
    }
    
    public void clearItems() {
        synchronized (items) {
            items.clear();
        }
    }

    public int getOwnerId() {
        return ownerId;
    }

    public String getDescription() {
        return description;
    }

    public MapleCharacter[] getVisitors() {
        visitorLock.lock();
        try {
            MapleCharacter[] copy = new MapleCharacter[3];
            for(int i = 0; i < visitors.length; i++) copy[i] = visitors[i];
                    
            return copy;
        } finally {
            visitorLock.unlock();
        }
    }

    public List<MaplePlayerShopItem> getItems() {
        synchronized (items) {
            return Collections.unmodifiableList(items);
        }
    }
    
    public boolean hasItem(int itemid) {
        for(MaplePlayerShopItem mpsi : getItems()) {
            if(mpsi.getItem().getItemId() == itemid && mpsi.isExist() && mpsi.getBundles() > 0) {
                return true;
            }
        }
        
        return false;
    }

    public boolean addItem(MaplePlayerShopItem item) {
        synchronized (items) {
            if (items.size() >= 10) return false;
            
            items.add(item);
            return true;
        }
    }

    public void clearInexistentItems() {
        synchronized(items) {
            List<Integer> itemsToClear = new ArrayList<>();
            for (int i = items.size() - 1; i >= 0; i--) {
                if (!items.get(i).isExist()) {
                    itemsToClear.add(items.remove(i).getItem().getInventoryItemId());
                }
            }

            if (itemsToClear.size() > 0) {
                try (Connection con = DatabaseConnection.getConnection()) {
                    ItemFactory.MERCHANT.deleteItems(this.ownerId, con, itemsToClear, false);
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
    }
    
    private void removeFromSlot(int slot) {
        try {
            this.deleteItem(items.remove(slot));
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
    
    private int getFreeSlot() {
        for (int i = 0; i < 3; i++) {
            if (visitors[i] == null) {
                return i;
            }
        }
        return -1;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public boolean isPublished() {
        return published;
    }
    
    public boolean isOpen() {
        return open.get();
    }

    public void setOpen(boolean set) {
        open.getAndSet(set);
        published = true;
    }

    public int getItemId() {
        return itemId;
    }

    public boolean isOwner(MapleCharacter chr) {
        return chr.getId() == ownerId;
    }
    
    public void sendMessage(MapleCharacter chr, String msg) {
        String message = chr.getName() + " : " + msg;
        byte slot = (byte) (getVisitorSlot(chr) + 1);
        
        synchronized (messages) {
            messages.add(new Pair<>(message, slot));
        }
        broadcastToVisitorsThreadsafe(MaplePacketCreator.hiredMerchantChat(message, slot));
    }
    
    public List<MaplePlayerShopItem> sendAvailableBundles(int itemid) {
        List<MaplePlayerShopItem> list = new LinkedList<>();
        List<MaplePlayerShopItem> all = new ArrayList<>();
        
        if(!open.get()) return list;
        
        synchronized (items) {
            for(MaplePlayerShopItem mpsi : items) all.add(mpsi);
        }
        
        for(MaplePlayerShopItem mpsi : all) {
            if(mpsi.getItem().getItemId() == itemid && mpsi.getBundles() > 0 && mpsi.isExist()) {
                list.add(mpsi);
            }
        }
        return list;
    }

    public void saveItem(MaplePlayerShopItem item, boolean isNew) throws SQLException {
        try (Connection con = DatabaseConnection.getConnection()) {
            if (isNew)
                item.getItem().setInventoryItemId(-1);
            ItemFactory.MERCHANT.saveMerchantItems(Collections.singletonList(new Pair<>(item.getItem(), item.getItem().getInventoryType())),
                    Collections.singletonList(item.getBundles()), this.ownerId, con);

            FredrickProcessor.insertFredrickLog(this.ownerId);
        }
    }

    private void deleteItem(MaplePlayerShopItem pItem) throws SQLException {
        if (pItem.getItem().getInventoryItemId() > 0)
            ItemFactory.MERCHANT.deleteItemByInventoryItemId(pItem.getItem().getInventoryItemId());
    }

    public void saveItems(boolean shutdown) throws SQLException {
        saveItems(shutdown, null, false);
    }

    public void saveItems(boolean shutdown, Connection con, boolean keepConnection) throws SQLException {
        List<Pair<Item, MapleInventoryType>> itemsWithType = new ArrayList<>();
        List<Short> bundles = new ArrayList<>();
        boolean hasEmptyBundle = false;
        final String deleteEmptyBundlesQuery = "DELETE i FROM inventoryitems i join inventorymerchant m using(inventoryitemid) where m.bundles=0 and m.characterid=" + getOwnerId();

        for (MaplePlayerShopItem pItems : getItems()) {
            Item newItem = pItems.getItem();
            short newBundle = pItems.getBundles();
            
            if (shutdown) { //is "shutdown" really necessary?
                newItem.setQuantity((short) (pItems.getItem().getQuantity()));
            } else {
                newItem.setQuantity((short) (pItems.getItem().getQuantity()));
            }
            if (newBundle > 0) {
                itemsWithType.add(new Pair<>(newItem, newItem.getInventoryType()));
                bundles.add(newBundle);
            } else {
                hasEmptyBundle = true;
            }
        }
        con = con == null ? DatabaseConnection.getConnection() : con;

        if (hasEmptyBundle) {
            try (PreparedStatement psCleanMerchant = con.prepareStatement(deleteEmptyBundlesQuery)) {
                psCleanMerchant.executeUpdate();
            }
        }
        ItemFactory.MERCHANT.saveMerchantItems(itemsWithType, bundles, this.ownerId, con);
        if (!keepConnection)
            con.close();

        FredrickProcessor.insertFredrickLog(this.ownerId);
    }

    private static boolean check(MapleCharacter chr, List<MaplePlayerShopItem> items) {
        List<Pair<Item, MapleInventoryType>> li = new ArrayList<>();
        for (MaplePlayerShopItem item : items) {
            Item it = item.getItem().copy();
            it.setQuantity((short)(it.getQuantity() * item.getBundles()));
            
            li.add(new Pair<>(it, it.getInventoryType()));
        }
        
        return MapleInventory.checkSpotsAndOwnership(chr, li);
    }
    
    public int getChannel() {
        return channel;
    }

    public int getTimeOpen() {
        double openTime = (System.currentTimeMillis() - start) / 60000;
        openTime /= 1440;   // heuristics since engineered method to count time here is unknown
        openTime *= 1318;
        
        return (int) Math.ceil(openTime);
    }

    public void clearMessages() {
        synchronized (messages) {
            messages.clear();
        }
    }
    
    public List<Pair<String, Byte>> getMessages() {
        synchronized (messages) {
            List<Pair<String, Byte>> msgList = new LinkedList<>();
            for(Pair<String, Byte> m : messages) {
                msgList.add(m);
            }
            
            return msgList;
        }
    }

    public int getMapId() {
        return map.getId();
    }
    
    public MapleMap getMap() {
        return map;
    }

    public List<SoldItem> getSold() {
        synchronized (sold) {
            return Collections.unmodifiableList(sold);
        }
    }

    public int getMesos() {
        return mesos;
    }

    @Override
    public MapleMapObjectType getType() {
        return MapleMapObjectType.HIRED_MERCHANT;
    }
    
    @Override
    public void sendDestroyData(MapleClient client) {}
    
    @Override
    public void sendSpawnData(MapleClient client) {
        client.announce(MaplePacketCreator.spawnHiredMerchantBox(this));
    }

    public class SoldItem {

        int itemid, mesos;
        short quantity;
        String buyer;

        public SoldItem(String buyer, int itemid, short quantity, int mesos) {
            this.buyer = buyer;
            this.itemid = itemid;
            this.quantity = quantity;
            this.mesos = mesos;
        }

        public String getBuyer() {
            return buyer;
        }

        public int getItemId() {
            return itemid;
        }

        public short getQuantity() {
            return quantity;
        }

        public int getMesos() {
            return mesos;
        }
    }
}
