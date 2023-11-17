import { Store as RxStore } from "rxeta"
import { singleton } from "tsyringe"

interface State {

    authorizedAPITokens: string[]
    ready: {
        bot: boolean | null
    }
}

const initialState: State = {
    
    authorizedAPITokens: [],
    ready: {
        bot: false,
    }
}

@singleton()
export class Store extends RxStore<State> {

    constructor() {
        super(initialState)
    }
}