package net.server.task;

import client.MapleCharacter;
import config.YamlConfig;
import net.server.Server;
import net.server.world.World;
import tools.FilePrinter;

import java.util.Collection;

/**
 *
 * @author Shavit
 */
public class TimeoutTask extends BaseTask implements Runnable {
    @Override
    public void run() {
        long time = System.currentTimeMillis();
        Collection<MapleCharacter> chars = wserv.getPlayerStorage().getAllCharacters();
        for(MapleCharacter chr : chars) {
            if (chr.getClient() != null) {
                if (time - chr.getClient().getLastPacket() > YamlConfig.config.server.TIMEOUT_DURATION) {
                    FilePrinter.print(FilePrinter.DCS + chr.getClient().getAccountName(), chr.getName() + " auto-disconnected due to inactivity.");
                    chr.getClient().forceDisconnect();
                }
            } else {
                FilePrinter.printError(FilePrinter.ACCOUNT_STUCK,"chr: " + chr.getId() + " is stuck.. removing player from world");
                wserv.removePlayer(chr);
            }
        }
    }

    public TimeoutTask(World world) {
        super(world);
    }
}
