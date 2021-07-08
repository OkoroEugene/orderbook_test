import * as types from '../../types';

export function update_order_book_bids(payload){
    return {
        type: types.UPDATE_ORDER_BOOK_BIDS, 
        payload
    }
}