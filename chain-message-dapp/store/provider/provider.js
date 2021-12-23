const SET_PROVIDER = 'SET_PROVIDER'

export const defaultProvider = null;

export function setProvider(provider) {
    return {
        type: SET_PROVIDER,
        provider
    }
}

function provider(state=defaultProvider, action) {
    switch (action.type) {
        case SET_PROVIDER:
            return action.provider;
        default:
            return state;
    }
}

export default provider;