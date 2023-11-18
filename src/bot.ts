import { Intents } from "oceanic.js";
import { StellarClient } from "./helpers/StellarClient";
import { getBotConfig } from "./utils/config.util";
import { setGlobalDispatcher, Agent } from "undici";

setGlobalDispatcher(new Agent({ connect: { timeout: 20_000 } }));

const config = getBotConfig();

async function initializeBot() {
  const client = new StellarClient(config, {
    auth: `Bot ${config["TOKEN"]}`,
    gateway: {
      intents:
        Intents.GUILDS | Intents.MESSAGE_CONTENT | Intents.GUILD_MESSAGES,
    },
    allowedMentions: {
      roles: true,
      users: true,
      everyone: true,
      repliedUser: true,
    },
  });

  await client.connect();
}

initializeBot();