
var common = [1003077, 1003148, 1003149, 1003919, 1004002, 1004026, 1004027, 1004028, 1004029, 1004093, 1004612, 1004613, 1004614, 1004721, 1005102, 1005103, 1005019, 1052298, 1050389, 1053228, 1053229, 1052293, 1052294, 1052292, 1052354, 1052976, 1052449, 1050229, 1050299, 1053040, 1052762, 1042348, 1042347, 1042333, 1042334, 1048000, 1049000, 1062089, 1062176, 1062208, 1073240, 1073241, 1102652, 1072484, 1072531, 1072824, 1072848, 1102839, 1102249, 1012511, 1012518, 1012551, 1012607, 1012044, 1082550, 1022048];
var uncommon = [1000095, 1000096, 1000097, 1000061, 1001088, 1001103, 1001119, 1001120, 1004602, 1004708, 1004790, 1004957, 1004975, 1004796, 1050256, 1051312, 1052586, 1050418, 1051487, 1053177, 1050463, 1051530, 1050514, 1052408, 1053106, 1051352, 1051572, 1052845, 1042357, 1061141, 1062247, 1070031, 1071048, 1072662, 1102373, 1073129, 1073226, 1072998, 1073254, 1082685, 1082700, 1102396, 1102243, 1012527, 1012573, 1032063, 1032175, 1004397, 1042162, 1062112];
var rare = [1001070, 1001071, 1004581, 1004700, 1004884, 1004894, 1004895, 1005060, 1005324, 1000090, 1001112, 1000089, 1001111, 1004952, 1004659, 1053180, 1051459, 1053018, 1050444, 1051512, 1053250, 1053251, 1050516, 1051586, 1050384, 1051454, 1050381, 1051451, 1051544, 1052576, 1052852, 1052853, 1042232, 1051602, 1053472, 1053164, 1082684, 1082723, 1080009, 1081015, 1073085, 1073282, 1071090, 1102869, 1073373, 1073372, 1012661, 1042349, 1053257];
var urare = [1003459, 1004463, 1004881, 1004973, 1004974, 1005061, 1005352, 1004503, 1005139, 1000091, 1001113, 1005391, 1053242, 1053187, 1053252, 1053446, 1053434, 1053301, 1050392, 1051463, 1051303, 1053344, 1053345, 1051617, 1053460, 1053459, 1073247, 1082722, 1073270, 1082728, 1070073, 1102310, 1102809, 1102849, 1073354, 1073303, 1005528, 1072507];


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
						"Hello #h #!\r\n\r\nWant to try your luck at the #r#eNX Gachapon?#n#k You can earn assorted up to date NX EQUIPMENTS! \r\nRemember that each spin will cost you a\r\n\r\n#i5220020##t5220020#");
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
