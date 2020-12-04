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
/* Amon
 * 
 * @Author Stereo
 * Adobis's Mission I : Breath of Lava <Level 1> (280020000)
 * Adobis's Mission I : Breath of Lava <Level 2> (280020001)
 * Last Mission : Zakum's Altar (280030000)
 * Zakum Quest NPC 
 * Helps players leave the map
 */
 
 importPackage(Packages.server.expeditions);
 
function start() {
    if(cm.getMapId() == 270050100) {
        if(!cm.getEventInstance().isEventCleared()) cm.sendYesNo("If you leave now, you'll have to start over. Are you sure you want to leave?");
        else cm.sendYesNo("Pink Bean has been defeated! You guys sure are true heroes of this land! In no time, Temple of Time will shine again as bright as ever, all thanks to your efforts! Hooray to our heroes!! Are you ready to go now?");
		
    } else {
        cm.sendYesNo("If you leave now, you'll have to start over. Are you sure you want to leave?");
    }
}

function action(mode, type, selection) {
    if (mode < 1)
        cm.dispose();
        
    else if(!cm.getEventInstance().isEventCleared())
    {
        cm.warp(270050000);
        cm.dispose();
    }
    else {
        if (cm.reachedRewardLimit(MapleExpeditionType.PINKBEAN)) {
            cm.getClient().getWorldServer().removeUnclaimed(MapleExpeditionBossLog.BossLogEntry.PINKBEAN, cm.getPlayer().getId());
			cm.getPlayer().dropMessage(6,"You have already reached your limit on GMLs for this boss");
            cm.warp(270050000);
            cm.dispose();
        } else if (!cm.getEventInstance().giveEventReward(cm.getPlayer())) {
            cm.sendNext("Please make room in your inventory first!");
            cm.dispose();
        } else {
            cm.getClient().getWorldServer().removeUnclaimed(MapleExpeditionBossLog.BossLogEntry.PINKBEAN, cm.getPlayer().getId());
            cm.warp(270050000);
            cm.dispose();
        }
    }
}
