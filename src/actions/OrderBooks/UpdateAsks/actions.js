import * as types from '../../types';

export function update_order_book_asks(payload) {
    return {
        type: types.UPDATE_ORDER_BOOK_ASKS,
        payload
    }
}