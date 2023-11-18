
/**
 * Credit:
 * Orginal Author: Dani Hyders
 * Taken from Hydrabank https://github.com/hydrabank/fish-sdk/blob/master/src/lib/LogManager.js
 */
import chalk from "chalk";

const LogFormat = `[${chalk.bold("%t")}] [%c] [%ts] %m`;

export default class LogManager {
  /**
   * Logs a message to the console in the standard format.
   * Note: Thread does not actually need to be a separate thread, as JavaScript is mostly single-threaded. It can be used to specify different components of the Fish SDK.
   * @param {string} message The message to output to console.
   * @param {string} channel The channel the message should be sent to.
   * @param {string} thread The thread the message should be labelled under. Defaults to "LOG".
   */
  static log(message: string, channel: string = "log", thread: string = "StellarClient") {
    switch (channel) {
      case "error":
        console.error(LogManager.formatLoggable(message, chalk.red(channel.toUpperCase()), thread));
        break;
      case "warn":
        console.warn(LogManager.formatLoggable(message, chalk.yellow(channel.toUpperCase()), thread));
        break;
      case "info":
        console.info(LogManager.formatLoggable(message, chalk.blue(channel.toUpperCase()), thread));
        break;
      case "debug":
        console.debug(LogManager.formatLoggable(message, chalk.magenta(channel.toUpperCase()), thread));
        break;
      case "load":
        console.log(LogManager.formatLoggable(message, chalk.cyan(channel.toUpperCase()), thread));
        break;
      default:
        console.log(LogManager.formatLoggable(message, chalk.green(channel.toUpperCase()), thread));
        break;
    }
  }

  static formatLoggable(message: string, channel: string, thread: string) {
    const formattedMessage = LogFormat.replace("%t", thread)
      .replace("%c", chalk.bold(channel))
      .replace("%ts", chalk.green.bold(new Date().toISOString()))
      .replace("%m", message);
    return formattedMessage;
  }
}