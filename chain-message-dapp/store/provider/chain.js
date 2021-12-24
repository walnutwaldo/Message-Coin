const SET_CHAIN = 'SET_CHAIN'

export function setChain(chain) {
    return {
        type: SET_CHAIN,
        chain
    }
}

export const defaultChain = -1;

function chain(state=defaultChain, action) {
    switch (action.type) {
        case SET_CHAIN:
            return action.chain;
        default:
            return state;
    }
}

export default chain;