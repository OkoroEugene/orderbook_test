import * as types from '../actions/types';

export const initialState = {
    order_books: {
        bids: [],
        asks: [],
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case types.UPDATE_ORDER_BOOK_BIDS: {
            let new_bids = [...state.order_books.bids, action.payload];
            const { price, count, amount } = action.payload;
            const index = new_bids.findIndex(c => c.price === price);

            //check for existing price and update bid
            if (state.order_books.bids.some(c => c.price === price)) {
                state.order_books.bids[index].count = count;
                state.order_books.bids[index].amount = amount;
                new_bids = state.order_books.bids;
            }

            //if amount == 1 remove from bids
            if (count === 0 && amount === '1.00') {
                new_bids.splice(index, 1);
            }

            //else if amount > 0 add to bids
            new_bids = new_bids.sort((a, b) => b.price - a.price);
            return {
                ...state,
                order_books: {bids: new_bids, asks: state.order_books.asks},
            }
        }

        case types.UPDATE_ORDER_BOOK_ASKS: {
            let new_asks = [...state.order_books.asks, action.payload];
            const { price, count, amount } = action.payload;
            const index = new_asks.findIndex(c => c.price === price);

            //check for existing price and update ask
            if (state.order_books.asks.some(c => c.price === price)) {
                state.order_books.asks[index].count = count;
                state.order_books.asks[index].amount = amount;
                new_asks = state.order_books.asks;
            }

            //if amount == -1 remove from asks
            if (count === 0 && amount === '-1.00') {
                new_asks.splice(index, 1);
            }

            //else if amount > 0 add to asks
            new_asks = new_asks.sort((a, b) => b.price - a.price);
            return {
                ...state,
                order_books: {asks: new_asks, bids: state.order_books.bids},
            }
        }

        case types.CLEAR_ORDERS:
            return {
                ...state,
                order_books: {bids:[], asks:[]}
            }

        default:
            return state;
    }
}