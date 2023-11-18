import Keyv from 'keyv';
import KeyvMongo from '@keyv/mongo';
import { LogService } from "../service/LogService";
import LogManager from '../managers/LogManager';
import { DatabaseService } from '../service/DatabaseService';

class GuildSettingsDb {

  private keyv: Keyv;

  constructor(config: any) {
    const collection = 'guildSettings';

    const keyv = new Keyv(DatabaseService.getMongoURI(config), { store: new KeyvMongo(DatabaseService.getMongoURI(config), { collection }) });

    keyv.on('error', err => LogManager.log(err. error, "Connection Error"));

    this.keyv = keyv;
  }

  async setSetting(guildId: string, setting: string, value: any): Promise<void> {
    await this.keyv.set(`${guildId}:${setting}`, value);
  }


  async getSetting(guildId: string, setting: string): Promise<any> {
    const serializedValue = await this.keyv.get(`${guildId}:${setting}`);
    if (serializedValue) {
      return JSON.parse(serializedValue);
    }
    return null;
  }

  async deleteSetting(guildId: string, setting: string): Promise<boolean> {
    return await this.keyv.delete(`${guildId}:${setting}`);
  }
}

export default GuildSettingsDb;