const SET_ACCOUNTS = 'SET_ACCOUNTS'

export const defaultAccounts = [];

export function setAccounts(accounts) {
    return {
        type: SET_ACCOUNTS,
        accounts
    }
}

function accounts(state=defaultAccounts, action) {
    switch (action.type) {
        case SET_ACCOUNTS:
            return action.accounts;
        default:
            return state;
    }
}

export default accounts;