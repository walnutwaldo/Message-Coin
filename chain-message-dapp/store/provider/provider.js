import {ethers} from "ethers";

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

export function refreshProvider(dispatch) {
    if (!window) {
        console.error("Error while refreshing provider: window does not exist");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setProvider(provider));
    return provider;
}

export default provider;