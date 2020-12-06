/*
@author slasso
Light GML Exchange NPC
*/

importPackage(Packages.tools);
importPackage(Packages.constants.inventory);
importPackage(Packages.client.inventory);

var gml = 4000313;
var vipGmlCost = 35;
var vipMesoCost = 50000000; // 50m
var status = 0;
var selectedItem;
var selectedType;

var itcg = [
    { id: 1102082, cost: 10 }, // Ragged Black Cape
    { id: 1102079, cost: 10 }, // Ragged Red Cape
    { id: 1082399, cost: 15 }, // Super stormcaster Gloves
    { id: 1072344, cost: 12 }, // Facestompers
    { id: 1102145, cost: 8 }, // Sirius Cloak
    { id: 2070016, cost: 12 } // Crystal Ilbi
];

var vegas = [
    { id: 5610000, cost: 8 }, // Vega's Spell 10%
    { id: 5610001, cost: 4 } // Vega's Spell 60%
];

var vipMats = {
    warrior: [
        { id: 4001190, quantity: 1 }, // marble
        { id: 4005000, quantity: 5 }, // Power Crystal x5
        { id: 4021009, quantity: 2 }, // star rock
        { id: 4000235, quantity: 1 }, // Manon's Tail
        { id: 4000243, quantity: 1 } // Griffey's Horn
    ],
    thief: [
        { id: 4001190, quantity: 1 }, // marble
        { id: 4005003, quantity: 5 }, // Luk Crystal x5
        { id: 4021009, quantity: 1 }, // star rock
        { id: 4000342, quantity: 1 }, // Kacchu Musha’s Fragment
   ],
    bowman: [
        { id: 4001190, quantity: 1 }, // marble
        { id: 4005002, quantity: 5 }, // Dex Crystal x5
        { id: 4021009, quantity: 1 }, // star rock
        { id: 4000224, quantity: 1 }, // Black Crow's Sabot
    ],
    magician: [
        { id: 4001190, quantity: 1 }, // marble
        { id: 4005001, quantity: 5 }, // Wisdom Crystal x5
        { id: 4021009, quantity: 1 }, // star rock
        { id: 4032013, quantity: 1 }, // bigfoot toe
    ],
    pirate: [
        { id: 4001190, quantity: 1 }, // marble
        { id: 4005000, quantity: 2 }, // Power Crystal x2
        { id: 4005002, quantity: 2 }, // Dex Crystal x2
        { id: 4021009, quantity: 2 }, // star rock x2
        { id: 4011007, quantity: 5 }, // Moon Rock x5
    ]
}

var vip = [
    { id: 1332120, cost: vipGmlCost, mats: vipMats['thief'], dragon: 1332050 }, // VIP Dagger (LUK)
    { id: 1332125, cost: vipGmlCost, mats: vipMats['thief'], dragon: 1332049}, // VIP Dagger (STR)
    { id: 1472117, cost: vipGmlCost, mats: vipMats['thief'], dragon: 1472052}, // VIP Claw

    { id: 1432081, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1432038 }, // VIP Spear
    { id: 1442111, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1442045 }, // VIP Polearm

    { id: 1302147, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1302059 }, // VIP One-Handed Sword
    { id: 1312062, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1312031 }, // VIP One-Handed Axe
    { id: 1322090, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1322052 }, // VIP One-Handed Blunt Weapon

    { id: 1402090, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1402036 }, // VIP Two-Handed Sword
    { id: 1412062, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1412026 }, // VIP Two-Handed Axe
    { id: 1422063, cost: vipGmlCost, mats: vipMats['warrior'], dragon: 1422028 }, // VIP Two-Handed Blunt Weapon

    { id: 1482079, cost: vipGmlCost, mats: vipMats['pirate'], dragon: 1482013 }, // VIP Knuckle
    { id: 1492079, cost: vipGmlCost, mats: vipMats['pirate'], dragon: 1492013 }, // VIP Gun

    { id: 1372078, cost: vipGmlCost, mats: vipMats['magician'], dragon: 1372032 }, // VIP Wand
    { id: 1382099, cost: vipGmlCost, mats: vipMats['magician'], dragon: 1382036 }, // VIP Staff

    { id: 1452106, cost: vipGmlCost, mats: vipMats['bowman'], dragon: 1452044 }, // VIP Bow
    { id: 1462091, cost: vipGmlCost, mats: vipMats['bowman'], dragon: 1462039 } // VIP Crossbow
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

        if (status == 0) { // first page
            var welcomeStr = "Hello #b#e#h ##n#k, you can obtain GML by completing boss runs. You currently have #r#c" + gml + "# #b#e#z" + gml + "##k#n\r\nWhat would you like to do?\r\n" +
                    "#L1#Buy iTCG Equips#l\r\n" +
                    "#L2#Buy VIP Weapons#l\r\n" +
                    "#L3#Buy Vega's Spells#l";

            cm.sendSimple(welcomeStr);
        } else if (status == 1) { // specific shop page
            var shopStr = " Exchange:#n#k\r\nYou currently have #r#c" + gml + "# #b#e#z" + gml + "##k#n\r\nWhat would you like to buy?\r\n";
		    if (selection == 1 || (selection == -1 && selectedType == 'itcg')) {
                shopStr = "#d#eiTCG" + shopStr;
                selectedType = "itcg";
                for (var i = 0; i < itcg.length; i++) {
                    var item = itcg[i];

                    shopStr += "#L" + (i+1) + "##n#k Buy #r" + (item.quantity || 1) + " #b#e#z" + item.id + "##n#k (#r" + item.cost + " GML)#l\r\n";
                }
            } else if (selection == 2 || (selection == -1 && selectedType == 'vip')) {
                shopStr = "#d#eVIP Exchange:#n#k\r\nVIP Weapons are very powerful and will require you to gather specific items. You can " +
                        "click on a weapon to view the materials needed. You currently have #r#c" + gml + "# #b#e#z" + gml + "##k#n\r\nWhat would you like to buy?\r\n";

                selectedType = "vip";
                for (var i = 0; i < vip.length; i++) {
                    var item = vip[i];
                    shopStr += "#L" + (i+1) + "##v" + item.id + "##b#e#z" + item.id + "##n#k#l\r\n";
               }
		    } else if (selection == 3 || (selection == -1 && selectedType == 'vegas')) {
                shopStr = "#d#eVega's Spell" + shopStr;
                selectedType = "vegas";
                for (var i = 0; i < vegas.length; i++) {
                    var item = vegas[i];

                    shopStr += "#L" + (i+1) + "##n#k Buy #r" + (item.quantity || 1) + " #b#e#z" + item.id + "##n#k (#r" + item.cost + " GML)#l\r\n";
					//shopStr += "#L" + (i+1) + "##n#k Buy #r" + (item.quantity || 10) + " #b#e#z" + item.id + "##n#k (#r" + (item.cost || 10) + " GML)#l\r\n";
                }
            }
            cm.sendSimple(shopStr);
        } else if (status == 2) { // confirm selection with yes/no
			var item = selectedType == "itcg" ? itcg[selection - 1] : (selectedType == "vip" ? vip[selection - 1] : vegas[selection - 1]);
			var shopStr = "";
            selectedItem = item;
			if (selectedType != "vip")
			    shopStr = "Are you sure you want to purchase #r" + (item.quantity || 1) + " #b#e#z" + item.id + "##n#k for #r" + item.cost + "#b#e #z" + gml + "#\r\n";
            else {
                shopStr += "You want a #b#e#z" + selectedItem.id + "##n#k? Please bring me the items below:\r\n";
                shopStr += "#v" + gml + "##r" + selectedItem.cost + " #b#e#z" + gml +"##n\r\n"
                shopStr += "#i4031138##r" + formatNumber(vipMesoCost) + "#b#e mesos#n\r\n"
                shopStr += "#v" + selectedItem.dragon + "# #r1 #b#e#z" + selectedItem.dragon + "##n\r\n"

                for (var i = 0; i < selectedItem.mats.length; i++) {
                    var mat = selectedItem.mats[i];
                    shopStr += "#v" + mat.id + "##r" + mat.quantity + " #b#e#z" + mat.id +"##n\r\n"
                }
            }

		    cm.sendYesNo(shopStr);
        } else if (status == 3) { // finalize the purchase
            if (selectedType == "vip" && !haveVipMats(cm, selectedItem)) {
                cm.sendOk("Sorry, you do not have all the required materials for #b#e#z" + selectedItem.id + "##n#k.");
            } else if (!cm.haveItem(gml, selectedItem.cost)) {
                cm.sendOk("Sorry, you do not have enough #b#e#z" + gml + "##n#k to make this purchase.");
            } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(selectedItem.id)).isFull(0)) {
                cm.sendOk("Your inventory is full! Please make room and try again.");
            } else if (selectedType != "vip") {
                cm.gainItem(gml, -selectedItem.cost);
                cm.gainItem(selectedItem.id, selectedItem.quantity || 1);
                cm.sendOk("Thank you and congrats! Here's your #b#e#z" + selectedItem.id + "##n#k!");
            } else { // deduct VIP mats, mesos, dragon weapon
                cm.gainItem(gml, -selectedItem.cost);
                cm.gainItem(selectedItem.dragon, -1);
                cm.gainMeso(-vipMesoCost);
                deductVipMats(cm, selectedItem.mats)
                cm.gainItem(selectedItem.id, 1);
                cm.sendOk("Here's your #b#e#z" + selectedItem.id + "##n#k. Congratulations and enjoy your powerful weapon!");
            }
            cm.dispose();
        }
    }
}

function haveVipMats(cm, item) {
    for (var i = 0; i < item.mats.length; i++) {
        var mat = item.mats[i];
        if (!cm.haveItem(mat.id, mat.quantity)) {
            return false;
        }
    }
    return cm.getMeso() >= vipMesoCost && cm.haveItem(gml, item.cost) && cm.haveItem(item.dragon, 1);
}

function deductVipMats(cm, mats) {
    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];
        cm.gainItem(mat.id, -mat.quantity);
    }
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/25377176#25377176
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
