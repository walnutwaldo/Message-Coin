import {createStore, combineReducers} from 'redux';
import accounts from './accounts/accounts';
import balance from './accounts/balance';
import price from './token/price';

const store = createStore(combineReducers({
    accounts,
    balance,
    price
}));

export default store;