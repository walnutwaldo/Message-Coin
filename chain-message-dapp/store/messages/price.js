const SET_PRICE = 'SET_PRICE';

export const defaultPrice = {
    price: 0,
    priceSet: false
};

export function setPrice(price) {
    return {
        type: SET_PRICE,
        price
    }
}

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