
var common = [1702209, 1702100, 1702562, 1702330, 1702350, 1702397, 1702436, 1702635, 1702645, 1702787, 1702805, 1702838, 1702873, 1702881, 1702889, 1702309];
var uncommon = [1702348, 1702882, 1702660, 1702302, 1702426, 1702480, 1702528, 1702676, 1702694, 1702695, 1702733, 1702760, 1702772, 1702785, 1092108]; 
var rare = [1702966, 1092032, 1702571, 1702640, 1702810, 1702367, 1702368, 1702399, 1702450, 1702457, 1702668, 1702675, 1702701, 1702779, 1702617, 1702696, 1702892];
var urare = [1702504, 1702557, 1702798, 1702570, 1702718, 1702737, 1702817, 1702859, 1702917, 17025651702902, 1702928, 1702790, 1702860, 1702786, 1702612, 1702703, 1702756, 1702870, 1702861];


function getRandom(min, max) {
    if (min > max) {
        return(-1);
    }

    if (min == max) {
        return(min);
    }

    return(min + parseInt(Math.random() * (max - min + 1)));
}

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

        
		if (status == 0) { // confirm selection with yes/no
			cm.sendYesNo("#i3991013##i3991023##i3991006##i3991000##i3991002##i3991007##i3991000##i3991015##i3991014##i3991013#\r\n" + 
						"Hello #h #!\r\n\r\nWant to try your luck at the #r#eNX Gachapon?#n#k You can earn assorted up to date NX WEAPONS! \r\nRemember that each spin will cost you a\r\n\r\n#i5220020##t5220020#");
        } else if (status == 1) { // finalize the purchase
		    var vp = cm.getPlayer().getClient().getVotePoints();
            if (!cm.haveItem(5220020, 1)) {
				cm.sendOk("Sorry you do not have an #i5220020##e#b#z5220020##n#k! #i5220020##e#b#z5220020##k#n can be purchased from Mia in the FM.");
            } else if (cm.getPlayer().getInventory(Packages.client.inventory.MapleInventoryType.EQUIP).isFull(0)) {
                cm.sendOk("Your inventory is full! Please make room and try again.");
            } else {
				var roll = getRandom(0, 10); // random number from 0-10 to decide which array to choose from
				var item = -1;
				if (roll >= 0 && roll <= 4)
					item = common[getRandom(0, common.length - 1)];
				else if (roll >= 5 && roll <= 7)
					item = uncommon[getRandom(0, uncommon.length - 1)];
				else if (roll >= 8 && roll <= 9)
					item = rare[getRandom(0, rare.length - 1)];
				else if (roll == 10)
					item = urare[getRandom(0, urare.length - 1)];
				
				if (item != -1) {					
					cm.gainItem(5220020, -1);
					cm.gainItem(item, 1);
					cm.sendOk("#b#eCongratulations!#n#k You have obtained a #e#b#v" + item + "##z" + item + "#");
				}
            }
            cm.dispose();
        }
	}
}
