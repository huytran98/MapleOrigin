/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
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

/*
   @Author: Alec
*/
package client.command.commands.gm0;

import client.MapleCharacter;
import client.MapleClient;
import client.command.Command;
import server.expeditions.MapleExpeditionBossLog;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BossLogCommand extends Command {
    {
        setDescription("Check your daily/weekly boss kills.");
    }

    @Override
    public void execute(MapleClient c, String[] params) {
        List<MapleCharacter> chars = new ArrayList<>();
        MapleCharacter player = c.getPlayer();
        if (player.gmLevel() > 1 && params.length > 0) { // we can check all the players boss records across hwid
            MapleCharacter victim = c.getWorldServer().getPlayerStorage().getCharacterByName(params[0]);
            if (victim != null) {
                List<MapleCharacter> allChars = victim.getCharactersByHWID();
                chars.addAll(allChars);
            } else
                player.dropMessage(6, "Unknown player.");
        } else {
            chars.add(c.getPlayer());
        }
        for (MapleCharacter mapleCharacter : chars) {
            Map<String, String> bossMap = MapleExpeditionBossLog.getDailyBossEntries(mapleCharacter.getId(), player.gmLevel() <= 1 || params.length == 0);
            bossMap.putAll(MapleExpeditionBossLog.getWeeklyBossEntries(mapleCharacter.getId(), player.gmLevel() <= 1 || params.length == 0));
            if (!bossMap.isEmpty()) {
                if (player.gmLevel() > 1)
                    player.message(mapleCharacter.getName() + "'s boss count for the day: ");
                else
                    player.message("Your boss count for the day: ");
                bossMap.forEach((k, v) -> player.message("You have killed " + k + ": " + v + "times.)"));
            }
        }
    }
}
