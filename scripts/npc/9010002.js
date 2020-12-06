/*
@author slasso
Mia Trophy NPC
*/

importPackage(Packages.tools);
importPackage(Packages.constants.inventory);
importPackage(Packages.client.inventory);

var status = 0;
var selectedItem;

var commonChairs = [3010085, 3010156, 3010049, 3010050, 3010054, 3010058, 3010099, 3012008, 3010130, 3010139, 3010219, 3010256, 3010299, 3010491, 3010490, 3010599, 3010615, 3010703, 3010798, 3012006, 3012016, 3013000];
var uncommonChairs = [3015229, 3010766, 3015228, 3015314, 3015416, 3015423, 3018002, 3018004, 3018006, 3019095, 3015425, 3015500, 3015628, 3015639, 3015640, 3015641, 3015759, 3015818, 3015962, 3016405, 3016406]; 
var rareChairs = [3016407, 3015035, 3015000, 3010754, 3018361, 3019207, 3019210, 3019223, 3019864, 3019890, 3019891, 3010752, 3010164, 3010574, 3010609, 3010634, 3010721, 3010726, 3010728, 3010743, 3010840, 3015089];
var urareChairs = [3015091, 3015306, 3019905, 3019904, 3019903, 3019902, 3015305, 3015279, 3015264, 3015241, 3015175, 3015092, 3010661, 3019859, 3015228, 3013003, 3013004];

var relaunchItems = [
    {id: 1142647 }, // origin medal
    {id: 5450000, expiration: 1 } // 1 day miu miu

];

var downtimeEXP = [
    {id: 5211048, expiration: 3 }, // 2x exp (3 hour)

];

var downtimeDROP = [
    {id: 5360042, expiration: 3 } // 2x drop (3 hour)

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
		if (status == 0) {
			cm.sendSimple("Hello #b#e#h ##n#k!\r\nWhat would you like to do?\r\n" +
			"#L1#Buy #r1 #b#e#z2049117##n#k for #r450mil #b#eMesos#n#k#l\r\n" +
			"#L2#Buy #r5,000 #b#eNX#n#k for #r5mil #b#eMesos#n#k#l\r\n" +
			"#L11#Buy #r100k #b#eNX#n#k for #r100mil #b#eMesos#n#k#l\r\n" +
			"#L3#Buy a #b#erandom chair#n#k for #r10mil #b#eMesos#n#k#l\r\n" +
			"#L4#Buy #r1 #b#e#z5072000##n#k for #r1mil #b#eMesos#n#k#l\r\n" +
			"#L5#Trade #r10 #b#e#z5072000##n#k for #r1 #b#e#z5076000##n#k#l\r\n" +
			"#L12#Trade #r100 #b#e#z5072000##n#k for #r10 #b#e#z5076000##n#k#l\r\n" +
			"#L6#Buy #r1 #b#eNX Gachapon Ticket#n#k for #r20,000 #b#eNX#n#k#l\r\n" +
			"#L7#Buy #r12 #b#eNX Gachapon Ticket#n#k for #r200,000 #b#eNX#n#k#l\r\n" +
			"#L8#Redeem your #e#bwipe hype#n#k starter pack!#l\r\n"
			//"#L9#Redeem your #e#bdowntime compensation 3h (EXP)#n#k#l\r\n" +
			//"#L10#Redeem your #e#bdowntime compensation 3h (Drop)#n#k#l\r\n"
			);
		} else if (status == 1) {
		    selectedItem = selection;
			if (selection == 1) {
			    cm.sendYesNo("Are you sure you want to buy #r1 #b#e#z2049117##n#k for #r450mil #b#eMesos#n#k?")
			} else if (selection == 2) {
			    cm.sendYesNo("Are you sure you want to buy #r5,000 #b#eNX#n#k for #r5mil #b#eMesos#n#k?")
			} else if (selection == 11) {
			    cm.sendYesNo("Are you sure you want to buy #r100,000 #b#eNX#n#k for #r100mil #b#eMesos#n#k?")
			} else if (selection == 3) {
			    cm.sendYesNo("Are you sure you want to buy a #b#erandom chair#n#k for #r10mil #b#eMesos#n#k?")
            } else if (selection == 4) {
			    cm.sendYesNo("Are you sure you want to buy #r1 #b#e#z5072000##n#k for #r1mil #b#eMesos#n#k?")
            } else if (selection == 5) {
			    cm.sendYesNo("Are you sure you want to trade #r10 #b#e#z5072000##n#k for #r1 #b#e#z5076000##n#k?")
			} else if (selection == 12) {
			    cm.sendYesNo("Are you sure you want to trade #r100 #b#e#z5072000##n#k for #r10 #b#e#z5076000##n#k?")
			} else if (selection == 6) {
			    cm.sendYesNo("Are you sure you want to buy #r1 #b#eNX Gachapon Ticket#n#k for #r20,000 #b#eNX#n#k?")
            } else if (selection == 7) {
			    cm.sendYesNo("Are you sure you want to buy #r12 #b#eNX Gachapon Ticket#n#k for #r200,000 #b#eNX#n#k?")
            } else if (selection == 8) {
			    cm.sendYesNo("Are you sure you want to redeem your #e#bwipe hype#n#k starter pack?")
            } else if (selection == 9) {
			    cm.sendYesNo("#r#e**WARNING**\r\nTHIS COUPON WILL ACTIVATE IMMEDIATELY UPON REDEEMING!#n#k\r\nAre you sure you want to redeem #r1 #e#bdowntime compensation 3h (EXP)")
            } else if (selection == 10) {
			    cm.sendYesNo("#r#e**WARNING**\r\nTHIS COUPON WILL ACTIVATE IMMEDIATELY UPON REDEEMING!#n#k\r\nAre you sure you want to redeem #r1 #e#bdowntime compensation 3h (Drop)?")
            }
        } else if (status == 2) {
			if (selectedItem == 1) {
			    if (cm.getMeso() < 450000000) {
                    cm.sendOk("Sorry, you do not have enough #b#eMesos#n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(2049117)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.gainMeso(-450000000);
					cm.gainItem(2049117, 1);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 1 Innocence Scroll 90%"));

					cm.sendOk("Here is your Innocence Scroll 90%!");
					cm.logLeaf("Innocence Scroll 90%");
                }
			} else if (selectedItem == 2) {
			    if (cm.getMeso() < 5000000) {
                    cm.sendOk("Sorry, you do not have enough #b#eMesos#n#k to make this purchase.");
                } else {
					cm.gainMeso(-5000000);
					cm.getPlayer().getCashShop().gainCash(1, 5000);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 5,000 NX"));

					cm.sendOk("Here is your 5,000 NX!");
					cm.logLeaf("5k NX");
                }
			}else if (selectedItem == 11) {
			    if (cm.getMeso() < 100000000) {
                    cm.sendOk("Sorry, you do not have enough #b#eMesos#n#k to make this purchase.");
                } else {
					cm.gainMeso(-100000000);
					cm.getPlayer().getCashShop().gainCash(1, 100000);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 100,000 NX"));

					cm.sendOk("Here is your 100,000 NX!");
					cm.logLeaf("100k NX");
                }
			} else if (selectedItem == 3) {
			    if (cm.getMeso() < 10000000) {
                    cm.sendOk("Sorry, you do not have enough #b#eMesos#n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(MapleInventoryType.SETUP).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {				
					var rarity = "";
					var roll = getRandom(0, 10); // random number from 0-10 to decide which array to choose from
					var item = -1;
					if (roll >= 0 && roll <= 4) {
						rarity = "a #r#ecommon#n#k";
						item = commonChairs[getRandom(0, commonChairs.length - 1)];
					} else if (roll >= 5 && roll <= 7) {
						rarity = "an #r#euncommon#n#k";
						item = uncommonChairs[getRandom(0, uncommonChairs.length - 1)];
					} else if (roll >= 8 && roll <= 9) {
						rarity = "a #r#erare#n#k";
						item = rareChairs[getRandom(0, rareChairs.length - 1)];
					} else if (roll == 10) {
						rarity = "an #r#eultra rare#n#k";
						item = urareChairs[getRandom(0, urareChairs.length - 1)];
					}
					
					if (item != -1) {	
						cm.gainMeso(-10000000);
						cm.gainItem(item, 1);
						cm.sendOk("Congratulations!#n#k You have obtained " + rarity + " chair!\r\n#e#b#v" + item + "# #z" + item + "#");
						cm.logLeaf("Chair ID: " + item);
					}
                }
			} else if (selectedItem == 4) {
			    if (cm.getMeso() < 1000000) {
                    cm.sendOk("Sorry, you do not have enough #b#eMesos#n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(5072000)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.gainMeso(-1000000);
					cm.gainItem(5072000, 1);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 1 Super Megaphone"));

					cm.sendOk("Here is your Super Megaphone!");
					cm.logLeaf("Super Megaphone");
                }
            } else if (selectedItem == 5) {
			    if (!cm.haveItem(5072000, 10)) {
                    cm.sendOk("Sorry, you do not have enough #b#e#z5072000##n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(5076000)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.gainItem(5072000, -10);
					cm.gainItem(5076000, 1);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 10 Item Megaphone"));

					cm.sendOk("Here is your 1 Item Megaphone!");
					cm.logLeaf("1 Item Megaphone");
                }
			} else if (selectedItem == 12) {
			    if (!cm.haveItem(5072000, 100)) {
                    cm.sendOk("Sorry, you do not have enough #b#e#z5072000##n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(5076000)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.gainItem(5072000, -100);
					cm.gainItem(5076000, 10);
					cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have earned 10 Item Megaphone"));

					cm.sendOk("Here is your 10 Item Megaphone!");
					cm.logLeaf("10 Item Megaphone");
                }
			} else if (selectedItem == 6) {
			    if (cm.getPlayer().getCashShop().getCash(1) < 20000) {
                    cm.sendOk("Sorry, you do not have enough #b#e#zMesos##n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(5220020)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.getPlayer().getCashShop().gainCash(1, -20000);
                    cm.gainItem(5220020, 1);
                    cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have paid 20,000 NX"));

                    cm.sendOk("Here is your NX Gachapon ticket!!");
                    cm.logLeaf("1 NX Gachapon");
                }
            } else if (selectedItem == 7) {
			    if (cm.getPlayer().getCashShop().getCash(1) < 200000) {
                    cm.sendOk("Sorry, you do not have enough #b#e#zMesos##n#k to make this purchase.");
                } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(5220020)).isFull(0)) {
                    cm.sendOk("Your inventory is full! Please make room and try again.");
                } else {
					cm.getPlayer().getCashShop().gainCash(1, -200000);
                    cm.gainItem(5220020, 12);
                    cm.getPlayer().announce(MaplePacketCreator.earnTitleMessage("You have paid 200,000 NX"));

                    cm.sendOk("Here is your NX Gachapon ticket bundle!!");
                    cm.logLeaf("12 NX Gachapon");
                }
            } else if (selectedItem == 8) {
                if (cm.getPlayer().getRewardPoints() != 1 && cm.getPlayer().getRewardPoints() != 3 && cm.getPlayer().getRewardPoints() != 5) {
                    cm.sendOk("You are not eligible to receive this reward!");
                } else {
                    var canHoldAll = true;
                    for (var i = 0; i < relaunchItems.length; i++) {
                        if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(relaunchItems[i].id)).isFull(0)) {
                            cm.sendOk("Your inventory is full! Please make room and try again.");
                            canHoldAll = false;
                            break;
                        }
                    }
                    if (canHoldAll) {
                        var itemStr = "";
                        cm.getPlayer().setRewardPoints(cm.getPlayer().getRewardPoints() - 1);
                        for (var i = 0; i < relaunchItems.length; i++) {
                            cm.gainItem(relaunchItems[i].id, selectedItem.quantity || 1, false, true, (relaunchItems[i].expiration * 1000 * 60 * 60 * 24) || -1);
                            itemStr += "#v" + relaunchItems[i].id + "##e#b#z" + relaunchItems[i].id + "##n#k\r\n";
                        }

                        cm.sendOk("Here is your #e#bwipe hype#n#k reward package! Enjoy your time here at MapleOrigin!\r\n" + itemStr);
                    }
                }
            } else if (selectedItem == 9) { // exp
                if (cm.getPlayer().getRewardPoints() != 2 && cm.getPlayer().getRewardPoints() != 3 && cm.getPlayer().getRewardPoints() != 4 && cm.getPlayer().getRewardPoints() != 5) {
                    cm.sendOk("You are not eligible to receive this reward!");
                } else {
                    var canHoldAll = true;
                    for (var i = 0; i < downtimeEXP.length; i++) {
                        if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(downtimeEXP[i].id)).isFull(0)) {
                            cm.sendOk("Your inventory is full! Please make room and try again.");
                            canHoldAll = false;
                            break;
                        }
                    }
                    if (canHoldAll) {
                        var itemStr = "";
						if (cm.getPlayer().getRewardPoints() == 5)
							cm.getPlayer().setRewardPoints(3);
						if (cm.getPlayer().getRewardPoints() == 3)
							cm.getPlayer().setRewardPoints(1);
						if (cm.getPlayer().getRewardPoints() == 4)
							cm.getPlayer().setRewardPoints(2);
						else
							cm.getPlayer().setRewardPoints(0);
							
                        for (var i = 0; i < downtimeEXP.length; i++) {
                            cm.gainItem(downtimeEXP[i].id, selectedItem.quantity || 1, false, true, (downtimeEXP[i].expiration * 1000 * 60 * 60) || -1);
                            itemStr += "#v" + downtimeEXP[i].id + "##e#b#z" + downtimeEXP[i].id + "##n#k\r\n";
                        }

                        cm.sendOk("Here is your #e#bdowntime compensation#n#k! We are sorry for the inconveniences!\r\n" + itemStr);
                    }
                }
            } else if (selectedItem == 10) { // exp
                if (cm.getPlayer().getRewardPoints() != 2 && cm.getPlayer().getRewardPoints() != 3 && cm.getPlayer().getRewardPoints() != 4 && cm.getPlayer().getRewardPoints() != 5) {
                    cm.sendOk("You are not eligible to receive this reward!");
                } else {
                    var canHoldAll = true;
                    for (var i = 0; i < downtimeDROP.length; i++) {
                        if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(downtimeDROP[i].id)).isFull(0)) {
                            cm.sendOk("Your inventory is full! Please make room and try again.");
                            canHoldAll = false;
                            break;
                        }
                    }
                    if (canHoldAll) {
                        var itemStr = "";
						if (cm.getPlayer().getRewardPoints() == 5)
							cm.getPlayer().setRewardPoints(3);
						if (cm.getPlayer().getRewardPoints() == 3)
							cm.getPlayer().setRewardPoints(1);
						if (cm.getPlayer().getRewardPoints() == 4)
							cm.getPlayer().setRewardPoints(2);
						else
							cm.getPlayer().setRewardPoints(0);
							
                        for (var i = 0; i < downtimeDROP.length; i++) {
                            cm.gainItem(downtimeDROP[i].id, selectedItem.quantity || 1, false, true, (downtimeDROP[i].expiration * 1000 * 60 * 60) || -1);
                            itemStr += "#v" + downtimeDROP[i].id + "##e#b#z" + downtimeDROP[i].id + "##n#k\r\n";
                        }

                        cm.sendOk("Here is your #e#bdowntime compensation#n#k! We are sorry for the inconveniences!\r\n" + itemStr);
                    }
                }
            }
			cm.dispose();
        }
    }
}

function getRandom(min, max) {
    if (min > max) {
        return(-1);
    }

    if (min == max) {
        return(min);
    }

    return(min + parseInt(Math.random() * (max - min + 1)));
}
