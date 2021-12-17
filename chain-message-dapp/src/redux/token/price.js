const SET_PRICE = 'SET_PRICE';

export function setPrice(price) {
    return {
        type: SET_PRICE,
        price
    }
}

const defaultPrice = 0;

function price(state=defaultPrice, action) {
    switch (action.type) {
        case SET_PRICE:
            return {
                price: action.price,
                priceSet: true
            };
        default:
            return state;
    }
}

export default price;