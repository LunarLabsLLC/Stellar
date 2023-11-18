import Keyv from 'keyv';
import KeyvMongo from '@keyv/mongo';
import { LogService } from "../service/LogService";
import LogManager from '../managers/LogManager';

class GuildSettingsDb {
  private keyv: Keyv;

  constructor() {
    const uri = 'mongodb://user:pass@localhost:27017/dbname';
    const collection = 'guildSettings';

    const keyv = new Keyv(uri, { store: new KeyvMongo(uri, { collection }) });

    keyv.on('error', err => LogManager.log(err. error, "Connection Error"));

    this.keyv = keyv;
  }

  async setSetting(guildId: string, setting: string, value: any): Promise<void> {
    await this.keyv.set(`${guildId}:${setting}`, value);
  }

  async getSetting(guildId: string, setting: string): Promise<any> {
    return await this.keyv.get(`${guildId}:${setting}`);
  }

  async deleteSetting(guildId: string, setting: string): Promise<boolean> {
    return await this.keyv.delete(`${guildId}:${setting}`);
  }
}

export default GuildSettingsDb;