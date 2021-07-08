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

            new_bids = new_bids.sort((a, b) => b.price - a.price);

            //if amount == 1 remove from bids
            if (count === 0 && amount === '1.00') {
                new_bids.splice(index, 1);
            }

            //get total algo
            if (new_bids.length > 0) {
                new_bids.map(function(bid, index){
                    if (new_bids[index - 1] && new_bids[index - 1].total) {
                        new_bids[index].total = (parseFloat(new_bids[index - 1].total) + parseFloat(bid.amount)).toFixed(2);
                    }
                    else{
                        new_bids[index].total = parseFloat(bid.amount).toFixed(2);
                    }
                });
            }

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

            new_asks = new_asks.sort((a, b) => b.price - a.price);

            //if amount == -1 remove from asks
            if (count === 0 && amount === '-1.00') {
                new_asks.splice(index, 1);
            }

            //get total algo
            if (new_asks.length > 0) {
                new_asks.map(function(bid, index){
                    if (new_asks[index - 1] && new_asks[index - 1].total) {
                        new_asks[index].total = (parseFloat(new_asks[index - 1].total) + parseFloat(bid.amount)).toFixed(2);
                    }
                    else{
                        new_asks[index].total = parseFloat(bid.amount).toFixed(2);
                    }
                });
            }

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