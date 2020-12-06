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
   @Author: Kris - SeduceMap Command
*/
package client.command.commands.gm2;

import client.MapleDisease;
import client.MapleCharacter;
import client.MapleClient;
import client.command.Command;
import server.life.MobSkillFactory;
import server.maps.MapleMap;

import java.util.Collection;

public class SeduceMapCommand extends Command {
    {
        setDescription("Applies debuff seduce on the whole map");
    }

    @Override
    public void execute(MapleClient c, String[] params) {

        MapleCharacter player = c.getPlayer();

        try {
            Collection<MapleCharacter> characters = player.getMap().getAllPlayers();
            
            for (MapleCharacter victim : characters) {
                if (victim.getId() != player.getId()) {
                    victim.giveDebuff(MapleDisease.SEDUCE, MobSkillFactory.getMobSkill(128, 7));
                }
            }
        } catch (Exception ex) {
            player.yellowMessage("Invalid Command");
        }
    }
}
