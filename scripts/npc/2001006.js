/*
@author slasso
Kuma Trophy Exchange NPC
*/

importPackage(Packages.tools);
importPackage(Packages.constants.inventory);
importPackage(Packages.client.inventory);

var trophy = 4000038;
var status = 0;
var selectedItem;

var items = [
      { id: 2049100, cost: 50 }, // Chaos
      { id: 2049003, cost: 45 }, // CSS 20%
      { id: 4001017, cost: 30 }, // Eye of Fire
      { id: 4031179, cost: 30 }, // Piece of Cracked dimension
      { id: 5041000, cost: 5, expiration: 90 }, // VIP Teleport Rock
      { id: 5130000, cost: 8, expiration: 90 }, // charm
      { id: 5510000, cost: 10, expiration: 90 }, // wheel
      { id: 5030000, cost: 15, expiration: 7 }, // Mushroom House Elf 7 day
      { id: 5030002, cost: 15, expiration: 7 }, // homely coffee house merchant 7 day
      { id: 5030004, cost: 15, expiration: 7 }, // cashier teddy bear 7 day
      { id: 5030008, cost: 15, expiration: 7 }, // robot stand 7 day
      { id: 5030012, cost: 15, expiration: 7 }, // tiki torch store 7 day
	  { id: 5050000, cost: 25 }, // AP Reset
	  { id: 5050001, cost: 5 }, // SP(1) Reset
	  { id: 5050002, cost: 10 }, // SP(2) Reset
	  { id: 5050003, cost: 15 }, // SP(3) Reset
	  { id: 5050004, cost: 25 }, // SP(40 Reset
      { id: 2043001, cost: 10 }, // One-Handed Sword for ATT 60%
      { id: 2043101, cost: 10 }, // One-Handed Axe for ATT 60%
      { id: 2043201, cost: 10 }, // One-Handed BW for ATT 60%
      { id: 2043301, cost: 10 }, // Dagger for ATT 60%
      { id: 2043701, cost: 10 }, // Wand for ATT 60%
      { id: 2043801, cost: 10 }, // Staff for ATT 60%
      { id: 2044001, cost: 10 }, // Two-Handed Sword for ATT 60%
      { id: 2044101, cost: 10 }, // Two-Handed Axe for ATT 60%
      { id: 2044201, cost: 10 }, // Two-Handed BW for ATT 60%
      { id: 2044301, cost: 10 }, // Spear for ATT 60%
      { id: 2044401, cost: 10 }, // Pole arm for ATT 60%
      { id: 2044501, cost: 10 }, // Bow for ATT 60%
      { id: 2044601, cost: 10 }, // Crossbow for ATT 60%
      { id: 2044701, cost: 10 }, // Claw for ATT 60%
      { id: 2044801, cost: 10 }, // Knuckler for ATT 60%
      { id: 2044901, cost: 10 } // Gun for ATT 60%
  ];

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1)
		cm.dispose();
	else {
		if (mode == 0 && status == 0)
			cm.dispose();

		if (mode == 1)
			status++;
		else
			status--;

		if (status == 0) { // first shop page
		    var welcomeStr = "Hello #b#e#h ##n#k, you have a chance to obtain Event Trophy from any monster. You currently have #r#c" + trophy + "# #b#e#z" + trophy + "##k#n\r\nWhat would you like to do?\r\n";

			for (var i = 0; i < items.length; i++) {
			    var item = items[i];

			    var expStr = "";
			    if (Math.floor(item.id / 1000) == 5030 )
			        expStr = "[" + item.expiration + " Day] ";
			    welcomeStr += "#L" + (i+1) + "# Buy #r" + (item.quantity || 1) + " #b#e" + expStr + "#z" + item.id + "##n#k for #r" + item.cost + " #b#e#z" + trophy + "##k#n#l\r\n";
			}
		    cm.sendSimple(welcomeStr);
        } else if (status == 1) { // confirm selection with yes/no
			var item = items[selection - 1];
			var shopStr = "Are you sure you want to purchase #r" + (item.quantity || 1) + " #b#e#z" + item.id + "##n#k for #r" + item.cost + " #b#e#z" + trophy + "##k#n#l\r\n";
            selectedItem = item;
		    cm.sendYesNo(shopStr);
        } else if (status == 2) { // finalize the purchase
            if (!cm.haveItem(trophy, selectedItem.cost)) {
                cm.sendOk("Sorry, you do not have enough #b#e#z" + trophy + "##n#k to make this purchase.");
            } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(selectedItem.id)).isFull(0)) {
                cm.sendOk("Your inventory is full! Please make room and try again.");
            } else {
                cm.gainItem(trophy, -selectedItem.cost);
                cm.gainItem(selectedItem.id, selectedItem.quantity || 1, false, true, (selectedItem.expiration * 1000 * 60 * 60 * 24) || -1);

                cm.sendOk("Thank you and congrats! Here's your #b#e#z" + selectedItem.id + "##n#k!");
            }
            cm.dispose();
        }
    }
}
