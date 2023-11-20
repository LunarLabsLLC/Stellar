// Ping command
export const pingCommand = {
  name: 'ping',
  description: 'Ping command to check if the bot is responsive',
  execute(message: any, args: any) {
    message.reply('Pong!');
  },
};
