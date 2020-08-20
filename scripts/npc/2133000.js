/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2018 RonanLana

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

/**
 * @author: Ronan
 * @npc: Ellin
 * @map: 300030100 - Deep Fairy Forest
 * @func: Ellin PQ start
*/

var status = 0;
var em = null;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
        if (mode == -1) {
                cm.dispose();
        } else {
                if (mode == 0 && status == 0) {
                        cm.dispose();
                        return;
                }
                if (mode == 1)
                        status++;
                else
                        status--;

                if (status == 0) {
                        em = cm.getEventManager("EllinPQ");
                        if(em == null) {
                                cm.sendOk("The Ellin PQ has encountered an error.");
                                cm.dispose();
                                return;
                        }

                        if (!cm.isLeader())
                            cm.sendSimple("#e#b<Party Quest: Forest of Poison Haze>\r\n#k#n" + em.getProperty("party") + "\r\n\r\nWould you like to assemble or join a team to solve the puzzles of the #bForest of Poison Haze#k? Have your #bparty leader#k talk to me or make yourself a party.#b\r\n#L0#I want to participate in the party quest.\r\n#L2#I would like to hear more details.\r\n#L3#I would like to claim a prize.");
                        else
                            cm.sendSimple("#e#b<Party Quest: Forest of Poison Haze>\r\n#k#n" + em.getProperty("party") + "\r\n\r\nWould you like to assemble or join a team to solve the puzzles of the #bForest of Poison Haze#k?#b\r\n#L0#My party is ready, let's go.\r\n#L2#I would like to hear more details.\r\n#L3#I would like to claim a prize.");
                } else if (status == 1) {
                        if (selection == 0) {
                                if (cm.getParty() == null) {
                                        cm.sendOk("You can participate in the party quest only if you are in a party.");
                                        cm.dispose();
                                } else if(!cm.isLeader()) {
                                        cm.sendOk("Your party leader must talk to me to start this party quest.");
                                        cm.dispose();
                                } else {
                                        var eli = em.getEligibleParty(cm.getParty());
                                        if(eli.size() > 0) {
                                                if(!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                                        cm.sendOk("Another party has already entered the #rParty Quest#k in this channel. Please try another channel, or wait for the current party to finish.");
                                                }
                                        }
                                        else {
                                                cm.sendOk("You cannot start this party quest yet, because either your party is not in the range size, some of your party members are not eligible to attempt it or they are not in this map. If you're having trouble finding party members, try Party Search.");
                                        }
                                        
                                        cm.dispose();
                                }
                        } else if (selection == 1) {
                                var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                                cm.sendOk("Your Party Search status is now: #b" + (psState ? "enabled" : "disabled") + "#k. Talk to me whenever you want to change it back.");
                                cm.dispose();
                        } else if (selection == 2) {
                                cm.sendOk("#e#b<Party Quest: Forest of Poison Haze>#k#n\r\nIn this PQ, your mission is to progressively make your way through the woods, taking on all baddies in your path, solving many puzzles you encounter and rallying yourselves to take the best of teamwork to overcome time limits and powerful creatures. Clearing the final boss, your team have a chance to obtain a marble that, #bwhen dropped by the fountain at the exit map#k, will guarantee the team extra prizes. Good luck.");
                                cm.dispose();
                        }
                        else {
                                cm.sendSimple("So, what prize do you want to obtain?\r\n" +
                                        "#k#L0##v1032060# #e#b#z1032060##n#k for #r5 #e#b#z4001198##k#n\r\n" +
                                        "#k#L1##v1032061# #e#b#z1032061##n#k for #r10 #e#b#z4001198##k#n (plus previous)\r\n" +
                                        "#k#L2##v1032101# #e#b#z1032101##n#k for #r20 #e#b#z4001198##k#n (plus previous)\r\n" +
                                        "#k#L3##v1032186# #e#b#z1032186##n#k for #r30 #e#b#z4001198##k#n (plus previous)\r\n"
                                );
                        }
                } else if (status == 2) {
                    if (cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).isFull(0)) {
                        cm.sendNext("Please make room on your inventory first!");
                        cm.dispose();
                    } else {
                        if (selection == 0) {
                                if (!cm.haveItem(1032060) && cm.haveItem(4001198, 5)) {
                                        cm.gainItem(4001198, -5);
                                        cm.gainItem(1032060, 1);
                                        cm.dispose();
                                } else {
                                        cm.sendOk("You either have Altair Earrings already or you do not have 10 Altair Fragments.");
                                        cm.dispose();
                                }
                        } else if (selection == 1){
                                if (cm.haveItem(1032060) && !cm.haveItem(1032061) && cm.haveItem(4001198, 10)) {
                                        cm.gainItem(4001198, -10);
                                        cm.gainItem(1032060,-1);
                                        cm.gainItem(1032061, 1);
                                        cm.dispose();
                                } else {
                                       cm.sendOk("You either already have Glittering Altair Earrings or you do not have 10 Altair Fragments.");
                                       cm.dispose();
                                }
                        } else if (selection == 2){
                                if (cm.haveItem(1032061) && !cm.haveItem(1032101) && cm.haveItem(4001198, 20)) {
                                        cm.gainItem(4001198, -20);
                                        cm.gainItem(1032061,-1);
                                        cm.gainItem(1032101, 1);
                                        cm.dispose();
                                } else {
                                        cm.sendOk("You either already have Brilliant Altair Earrings or you do not have 20 Altair Fragments.");
                                        cm.dispose();
                                }
                        } else if (selection == 3){
                                if (cm.haveItem(1032101) && !cm.haveItem(1032186) && cm.haveItem(4001198, 30)) {
                                        cm.gainItem(4001198, -30);
                                        cm.gainItem(1032101,-1);
                                        cm.gainItem(1032186, 1);
                                        cm.dispose();
                                } else {
                                        cm.sendOk("You either already have Bright Altair Earrings or you do not have 30 Altair Fragments.");
                                        cm.dispose();
                                }
                        }
                    }
                }
        }
}
