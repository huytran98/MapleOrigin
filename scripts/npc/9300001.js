
importPackage(Packages.constants.game);
importPackage(Packages.client);

var status = 0;
var leaf = 4000313;
var stage = 0;
var amount = 0;
var jobs = new Array(0, 112,122,132,212,222,232,312,322,412,422,512,522);

function start() {
    if (cm.getPlayer().getLevel() >= 250) {
        cm.sendSimple("I see you've reached 250 ! What a remarkable milestone, now that you're level 250 you have the ability to trade jobs within your job tree!\r\n\#L1# Switch Job #l\r\n\#L2# Buy Skill Points #l\r\n");
    } else {
        cm.sendOk("Job changing is available for those who have achieved level 250!");
        cm.dispose();
    }
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 1) {
            if (selection == 1) {
                stage = 1;
                if (cm.haveItem(leaf, 250)) {
                    if (cm.getPlayer().getLevel() >= 250) {
                        cm.sendSimple("Which Job would you like to switch to?\r\n\#L1# Hero #l\r\n\#L2# Paladin #l\r\n\#L3# Dark Knight #l\r\n#L4# Fire Mage #l\r\n\#L5# Ice Mage #l\r\n\#L6# Bishop #l\r\n#L7# Bow Master #l\r\n\#L8# Crossbow Master #l\r\n#L9# Nightlord #l\r\n\#L10# Shadower #l\r\n#L11# Buccaneer #l\r\n\#L12# Corsair #l\r\n");
                    } else {
						var jobText = "Which Sub-Job would you like to switch to?\r\n";
						var success = true;
						if (MapleJob.getById(cm.getPlayer().getJobId()).isA(MapleJob.WARRIOR)) {
							if (cm.getPlayer().getJobId() != 112)
								jobText += "#L1# Hero #l\r\n";
							if (cm.getPlayer().getJobId() != 122)
								jobText += "#L2# Paladin #l\r\n";
							if (cm.getPlayer().getJobId() != 132)
								jobText += "#L3# Dark Knight #l\r\n";
                        } else if (MapleJob.getById(cm.getPlayer().getJobId()).isA(MapleJob.MAGICIAN)) {
							if (cm.getPlayer().getJobId() != 212)
								jobText += "#L4# F/P Mage #l\r\n";
							if (cm.getPlayer().getJobId() != 222)
								jobText += "#L5# I/L Mage #l\r\n";
							if (cm.getPlayer().getJobId() != 232)
								jobText += "#L6# Bishop #l\r\n";
						} else if (MapleJob.getById(cm.getPlayer().getJobId()).isA(MapleJob.BOWMAN)) {
							if (cm.getPlayer().getJobId() != 312)
								jobText += "#L7# Bowmaster #l\r\n";
							if (cm.getPlayer().getJobId() != 322)
								jobText += "#L8# Crossbow Master #l\r\n";
						} else if (MapleJob.getById(cm.getPlayer().getJobId()).isA(MapleJob.THIEF)) {
							if (cm.getPlayer().getJobId() != 412)
								jobText += "#L9# Night Lord #l\r\n";
							if (cm.getPlayer().getJobId() != 422)
								jobText += "#L10# Shadower #l\r\n";
						} else if (MapleJob.getById(cm.getPlayer().getJobId()).isA(MapleJob.PIRATE)) {
							if (cm.getPlayer().getJobId() != 512)
								jobText += "#L11# Buccaneer #l\r\n";
							if (cm.getPlayer().getJobId() != 522)
								jobText += "#L12# Corsair #l\r\n";
						} else {
							success = false;
                            cm.dispose();
                        }
						if (success)
							cm.sendSimple(jobText);
                    }
                } else {
                    cm.sendOk("Sorry, you currently don't have enough GML. You need 250 GML to change jobs.");
                    cm.dispose();
                }
            } else if (selection == 2) {
                stage = 2;
                if (cm.haveItem(leaf, 10)) {
                    cm.sendGetText("Hello#b #h ##k, How many Skill Points would you like to buy?\r\n#kYou currently have " + cm.getPlayer().getItemQuantity(leaf, false) + " GML.\r\n1 SP = 10 GML\r\n#kMaximum amount of Skill Points per transaction is 250 (2500 GML).\r\n\r\n");
                } else {
                    cm.sendOk("Sorry, you currently don't have enough GML. You need 10 or more GML to make a deal.");
                    cm.dispose();
                }
            } else {
                cm.dispose();
            }
        } else if (status == 2) {
            if (stage == 1) {
                cm.gainItem(leaf, -250);
				cm.resetSP();
                cm.changeJobById(jobs[selection]);
                cm.dispose();
            }
            if (stage == 2) {
                amount = cm.getText();
                if (amount > 0 && amount <= 250) {
                    cm.sendYesNo("We would like to confirm you want to buy " + amount + " Skill Points with " + amount * 10 + " GML.");
                } else {
                    cm.sendOk("Sorry, \r\n#kMaximum amount of Skill Points per transaction is 250 (2500 GML).");
                    cm.dispose();
                }
            }
        } else if (status == 3) {
            if (stage == 2) {
                if (cm.haveItem(leaf, amount * 10)) {
                    cm.gainItem(leaf, -(amount * 10));
                    cm.getPlayer().gainSp(amount, GameConstants.getSkillBook(cm.getPlayer().getJobId()), false);
                    cm.sendOk("Transaction Complete.\r\n#kYou have spent " + amount * 10 + " GML for " + amount + " Skill Points. Thank You.");
                    cm.dispose();
                } else {
                    cm.sendOk("Sorry, you currently don't have enough GML.");
                    cm.dispose();
                }
                cm.dispose();
            }
        } else {
            cm.dispose();
        }
    }
}



    