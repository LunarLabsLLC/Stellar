import Keyv from "keyv";

export class DatabaseService {

    private static keyv: Keyv;

    public static init(config: any) {
        this.keyv = new Keyv(config["MONGO URI"] + "/" + config["DATABASE NAME"])

        this.keyv.on('error', err => console.log('Connection Error', err));
    }
}