import * as types from '../actions/types';

export const initialState = {
    order_books: {
        bids: [],
        asks: [],
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}