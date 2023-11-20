import { parseTOML } from "./common.util";

export function getBotConfig() {
	return parseTOML(`${getConfigDir()}/bot.toml`);
}

function getConfigDir() {
	return `${__dirname}/../../configs`;
}