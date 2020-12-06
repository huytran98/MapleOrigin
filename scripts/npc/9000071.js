/*
  Donor Shop NPC
  @author slasso
*/

importPackage(Packages.tools);
importPackage(Packages.constants.inventory);
importPackage(Packages.client.inventory);

var status;
var exchangeItem = 4001435;
var equip = [1053549,1053548,1702951,1004279,1003171,1053217,1053218,1702783,1005142,1005149,1005150,1053302,1053303,1053304,1073321,1073308];
var medal = [1142070,1142071,1142072,1142073,1142200,1142201];
var chair = [3015174,3015325,3010739,3019866,3015339];
var misc = [1115089,1115178,2022306,2022307];

var item;
var type;
var costs = {
	equip:1,
	medal:1,
	chair:1,
	misc:1,
	fifty:50,
	hundred:100,
	hundredseventyfive:175,
	twohundred:200,
	twohundredfifty:250,
	threehundred:300,
	fivehundred:500,
	twothousandfive:2500,
};

function start() {
	status=-1;
	cm.sendSimple("You currently have #r#c" + exchangeItem + "# #b#e#z" + exchangeItem + "##k#n\r\nWhat would you like to do?\r\n" +
			"#L1# #bExchange #r#e#z" + exchangeItem + "##n#b for NX Items\r\n" +
			"#L2# #bExchange #r#e#z" + exchangeItem + "##n#b for Medals\r\n" +
			"#L3# #bExchange #r#e#z" + exchangeItem + "##n#b for Chairs\r\n" +
			"#L4# #bExchange #r#e#z" + exchangeItem + "##n#b for Misc Items\r\n"
	);
}

function action (m,t,s) {
    if (m < 1) {
        cm.dispose();
        return;
    } else {
        status++;
    }
    if (status == 0) {
        if (s == 1) {
			type = 'equip';
            var selStr = "#eNX Equip Exchange\n\r\nYou currently have #r#c" + exchangeItem + "# #b#e#z" + exchangeItem + "##k#n\r\n" + 
			"\r\n#L0##v" + equip[0] + "##e#z" + equip[0] + "# For #r2500 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L1##v" + equip[1] + "##e#z" + equip[1] + "# For #r2500 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L2##v" + equip[2] + "##e#z" + equip[2] + "# For #r500 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L3##v" + equip[3] + "##e#z" + equip[3] + "# For #r175 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L4##v" + equip[4] + "##e#z" + equip[4] + "# For #r175 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L5##v" + equip[5] + "##e#z" + equip[5] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L6##v" + equip[6] + "##e#z" + equip[6] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L7##v" + equip[7] + "##e#z" + equip[7] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L8##v" + equip[8] + "##e#z" + equip[8] + "# For #r100 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L9##v" + equip[9] + "##e#z" + equip[9] + "# For #r100 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L10##v" + equip[10] + "##e#z" + equip[10] + "# For #r100 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L11##v" + equip[11] + "##e#z" + equip[11] + "# For #r200 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L12##v" + equip[12] + "##e#z" + equip[12] + "# For #r200 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L13##v" + equip[13] + "##e#z" + equip[13] + "# For #r200 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L14##v" + equip[14] + "##e#z" + equip[14] + "# For #r50 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L15##v" + equip[15] + "##e#z" + equip[15] + "# For #r50 #b#e#z" + exchangeItem + "##k ";
            cm.sendSimple(selStr);
        } else if (s == 2) {
			type = 'medal';
            var selStr = "#eMedal Exchange\n\r\nYou currently have #r#c" + exchangeItem + "# #b#e#z" + exchangeItem + "##k#n\r\n" + 
			"\r\n#L0##v" + medal[0] + "##e#z" + medal[0] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L1##v" + medal[1] + "##e#z" + medal[1] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L2##v" + medal[2] + "##e#z" + medal[2] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L3##v" + medal[3] + "##e#z" + medal[3] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L4##v" + medal[4] + "##e#z" + medal[4] + "# For #r300 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L5##v" + medal[5] + "##e#z" + medal[5] + "# For #r300 #b#e#z" + exchangeItem + "##k ";
            cm.sendSimple(selStr);
        } else if (s == 3) {
			type = 'chair';
            var selStr = "#eChair Exchange\n\r\nYou currently have #r#c" + exchangeItem + "# #b#e#z" + exchangeItem + "##k#n\r\n" + 
			"\r\n#L0##v" + chair[0] + "##e#z" + chair[0] + "# For #r250 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L1##v" + chair[1] + "##e#z" + chair[1] + "# For #r500 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L2##v" + chair[2] + "##e#z" + chair[2] + "# For #r200 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L3##v" + chair[3] + "##e#z" + chair[3] + "# For #r250 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L4##v" + chair[4] + "##e#z" + chair[4] + "# For #r250 #b#e#z" + exchangeItem + "##k ";
            cm.sendSimple(selStr);
        } else if (s == 4) {
			type = 'misc';
            var selStr = "#eMisc Exchange\n\r\nYou currently have #r#c" + exchangeItem + "# #b#e#z" + exchangeItem + "##k#n\r\n" + 
			"\r\n#L0##v" + misc[0] + "##e#z" + misc[0] + "# For #r50 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L1##v" + misc[1] + "##e#z" + misc[1] + "# For #r50 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L2##v" + misc[2] + "##e#z" + misc[2] + "#[10] For #r50 #b#e#z" + exchangeItem + "##k " +
			"\r\n#L3##v" + misc[3] + "##e#z" + misc[3] + "#[10] For #r50 #b#e#z" + exchangeItem + "##k ";
            cm.sendSimple(selStr);
        } 
    } else if(status == 1) {
		if (type) {
			if (type == 'equip') item = equip[s];
			if (type == 'medal') item = medal[s];
			if (type == 'chair') item = chair[s];
			if (type == 'misc') item = misc[s];

			
			cm.sendYesNo("Are you sure you want to buy #i" + item + "##e#b#z" + item +"?");
		}
	} else if (status == 2) {
        var text = cm.getText();
			if (item == equip[0] || item == equip[1]){ // COST = 2500
				type ="twothousandfive";
			} else if (item == equip[2] || item == chair[1]) { // COST = 500
				type="fivehundred";
			} else if (item == equip[5] || item == equip[6] || item == equip[7] || item == medal[0] || item == medal[1] || item == medal[2] || item == medal[3] || item == medal[4] || item == medal[5]){ // COST = 300
				type ="threehundred";
			} else if (item == chair[0] || item == chair[3] || item == chair[4]){ // COST = 250
				type ="twohundredfifty";
			} else if (item == equip[11] || item == equip[12] || item == equip[13] || item == chair[2]){ // COST = 200
				type ="twohundred";
			} else if (item == equip[3] || item == equip[4]){ // COST = 175
				type ="hundredseventyfive";
			} else if (item == equip[8] || item == equip[9] || item == equip[10]){ // cost 100
				type ="hundred";
			} else if (item == equip[14] || item == equip[15] || item == misc[0] || item == misc[1] || item == misc[2] || item == misc[3]) { // COST = 50
				type ="fifty";
			}
			if (!cm.haveItem(4001435, costs[type])) {
                cm.sendOk("#e#rYou'll need " + costs[type] + "#b#e#z " + exchangeItem + "##k#n");
            } else if (cm.getPlayer().getInventory(ItemConstants.getInventoryType(item)).isFull(0)) {
                cm.sendOk("Your inventory is full! Please make room and try again.");
            } else {
				cm.gainItem(4001435, -costs[type]);
				if (item == misc[2] || item == misc[3]){
					cm.gainItem(item, 10);
				} else {
					cm.gainItem(item, 1);
				}
			}
		cm.dispose();
	}
	
}

