import {createStore, applyMiddleware, combineReducers} from 'redux';
import accounts, {defaultAccounts} from './accounts/accounts';
import balance, {defaultBalance} from './accounts/balance';
import price, {defaultPrice} from './token/price';
import provider, {defaultProvider} from './provider/provider';
import signer, {defaultSigner} from './provider/signer';

import thunkMiddleware from 'redux-thunk'

import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
    accounts,
    balance,
    price,
    provider,
    signer
});

const initialState = {
    accounts: defaultAccounts,
    balance: defaultBalance,
    price: defaultPrice,
    provider: defaultProvider,
    signer: defaultSigner
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return combinedReducer(state, action);
    }
}

const initStore = () => {
    return createStore(rootReducer, bindMiddleware([thunkMiddleware]))
}

export default createWrapper(initStore);
