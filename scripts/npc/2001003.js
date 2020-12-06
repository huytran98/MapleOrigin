
var common = [1000043, 1003048, 1003058, 1004099, 1004443, 1052046, 1004694, 1004887, 1004909, 1005270, 1005290, 1005291, 1012502, 1012709, 1004816, 1022274, 1022243, 1012489, 1012669, 1032034, 1004635, 1042362, 1042363, 1042364, 1050187, 1070067, 1051228, 1071083, 1004665, 1050443, 1051511, 1004683, 1102894, 1050408, 1051477, 1073121, 1051264, 1004081, 1052655, 1072856, 1052145, 1052178];
var uncommon = [1005292, 1003043, 1004048, 1004413, 1004417, 1004419, 1005049, 1005050, 1005255, 1005256, 1005257, 1005253, 1053366, 1073316, 1012603, 1032038, 1102359, 1102288, 1022279, 1004438, 1022276, 1022173, 1022207, 1012176, 1004386, 1004157, 1004156, 1004703, 1004640, 1042360, 1050386, 1051456, 1052660, 1051284, 1050234, 1050360, 1052901, 1053146, 1053292, 1072337, 1072529, 1072531, 1073324, 1073325, 1012611, 1012612, 1053116, 1004879, 1004880, 1053118, 1053119];
var rare = [1004418, 1004692, 1005289, 1005075, 1005271, 1004540, 1052948, 1102859, 1102789, 1005445, 1005444, 1053509, 1053508, 1073398, 1073397, 1032321, 1005272, 1050507, 1051577, 1073322, 1004862, 1004863, 1053109, 1053110, 1073181, 1073182, 1082713, 1082714, 1012412, 1012482, 1102906, 1103068, 1004806, 1082694, 1053059, 1073155, 1042349, 1050414, 1051483, 1052671, 1005092, 1050481, 1051548, 1073258, 1072779];
var urare = [1053255, 1004453, 1005416, 1005417, 1053491, 1053492, 1005288, 1004701, 1050417, 1051486, 1073128, 1005046, 1053243, 1053244, 1103058, 1005069, 1005268, 1053372, 1053371, 1073319, 1102900, 1102811, 1032315, 1000050, 1050227, 1001076, 1051278, 1005113, 1053285, 1073265, 1005123, 1053296, 1073268, 1102837, 1005310, 1053399, 1053400];


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
