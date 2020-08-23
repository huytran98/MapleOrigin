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
package scripting.reactor;

import client.MapleClient;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.script.ScriptException;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import scripting.AbstractScriptManager;
import server.maps.MapleReactor;
import server.maps.ReactorDropEntry;
import tools.DatabaseConnection;
import tools.FilePrinter;

/**
 * @author Lerk
 */
public class ReactorScriptManager extends AbstractScriptManager {

    private static ReactorScriptManager instance = new ReactorScriptManager();
    
    public static ReactorScriptManager getInstance() {
        return instance;
    }
    
    private Map<Integer, List<ReactorDropEntry>> drops = new HashMap<>();
    private Map<String, NashornScriptEngine> scripts = new HashMap<>();
    
    public void onHit(MapleClient c, MapleReactor reactor) {
        try {
            NashornScriptEngine iv = getReactorScript(reactor.getId(), c);
            if (iv == null) return;
            
            ReactorActionManager rm = new ReactorActionManager(c, reactor, iv);
            iv.put("rm", rm);
            iv.invokeFunction("hit");
        } catch (final NoSuchMethodException e) {} //do nothing, hit is OPTIONAL
        
          catch (final ScriptException | NullPointerException e) {
            FilePrinter.printError(FilePrinter.REACTOR + reactor.getId() + ".txt", e);
        }
    }

    public void act(MapleClient c, MapleReactor reactor) {
        try {
            NashornScriptEngine iv = getReactorScript(reactor.getId(), c);
            if (iv == null) return;
            
            ReactorActionManager rm = new ReactorActionManager(c, reactor, iv);
            iv.put("rm", rm);
            iv.invokeFunction("act");
        } catch (final ScriptException | NoSuchMethodException | NullPointerException e) {
            FilePrinter.printError(FilePrinter.REACTOR + reactor.getId() + ".txt", e);
        }
    }

    public List<ReactorDropEntry> getDrops(int rid) {
        List<ReactorDropEntry> ret = drops.get(rid);
        if (ret == null) {
            ret = new LinkedList<>();
            try {
                Connection con = DatabaseConnection.getConnection();
                try (PreparedStatement ps = con.prepareStatement("SELECT itemid, chance, questid FROM reactordrops WHERE reactorid = ? AND chance >= 0")) {
                    ps.setInt(1, rid);
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            ret.add(new ReactorDropEntry(rs.getInt("itemid"), rs.getInt("chance"), rs.getInt("questid")));
                        }
                    }
                }
                
                con.close();
            } catch (Throwable e) {
                FilePrinter.printError(FilePrinter.REACTOR + rid + ".txt", e);
            }
            drops.put(rid, ret);
        }
        return ret;
    }

    public void clearDrops() {
        drops.clear();
    }

    public void touch(MapleClient c, MapleReactor reactor) {
        touching(c, reactor, true);
    }

    public void untouch(MapleClient c, MapleReactor reactor) {
        touching(c, reactor, false);
    }

    private void touching(MapleClient c, MapleReactor reactor, boolean touching) {
        try {
            NashornScriptEngine iv = getReactorScript(reactor.getId(), c);
            if (iv == null) return;
            
            ReactorActionManager rm = new ReactorActionManager(c, reactor, iv);
            iv.put("rm", rm);
            if (touching) {
                iv.invokeFunction("touch");
            } else {
                iv.invokeFunction("untouch");
            }
        } catch (final ScriptException | NoSuchMethodException | NullPointerException ute) {
            FilePrinter.printError(FilePrinter.REACTOR + reactor.getId() + ".txt", ute);
        }
    }

    private NashornScriptEngine getReactorScript(int reactorId, MapleClient c) {
        String scriptPath = "reactor/" + reactorId + ".js";
        NashornScriptEngine iv = scripts.get(scriptPath);
        if (iv != null) {
            return iv;
        }

        iv = getScriptEngine(scriptPath, c);
        if (iv == null) {
            return null;
        }

        scripts.put(scriptPath, iv);
        return iv;
    }

    public void reloadReactorScripts() {
        scripts.clear();
    }

}
