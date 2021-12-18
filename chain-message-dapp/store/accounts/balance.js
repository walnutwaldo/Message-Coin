const SET_MESSAGES_BALANCE = 'SET_MESSAGES_BALANCE';
const SET_ETH_BALANCE = 'SET_ETH_BALANCE';

export const defaultBalance = {
    eth: 0,
    messages: 0
};

export function setMessagesBalance(balance) {
    return {
        type: SET_MESSAGES_BALANCE,
        balance
    }
}

export function setEthBalance(balance) {
    return {
        type: SET_ETH_BALANCE,
        balance
    }
}

function balance(state=defaultBalance, action) {
    switch (action.type) {
        case SET_MESSAGES_BALANCE:
            return {
                ...state,
                messages: action.balance
            };
        case SET_ETH_BALANCE:
            return {
                ...state,
                eth: action.balance
            };
        default:
            return state;
    }
}

export default balance;