const SET_MESSAGES_BALANCE = 'SET_MESSAGES_BALANCE';

export function setMessagesBalance(balance) {
    return {
        type: SET_MESSAGES_BALANCE,
        balance
    }
}

const defaultBalance = 0;

function balance(state=defaultBalance, action) {
    switch (action.type) {
        case SET_MESSAGES_BALANCE:
            return action.balance;
        default:
            return state;
    }
}

export default balance;