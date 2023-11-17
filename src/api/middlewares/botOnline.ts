import { Middleware } from "@tsed/common"
import { InternalServerError } from "@tsed/exceptions"
import axios from "axios"

import { apiConfig } from "@configs"

const baseUrl = `http://127.0.0.1:${apiConfig.port}`

@Middleware()
export class BotOnline {

    async use() {

        const { data } = await axios.get(`${baseUrl}/health/check`, {
            params: {
                logIgnore: true
            }
        })
    
        if (!data?.online) throw new InternalServerError('Bot is offline')
    }

}