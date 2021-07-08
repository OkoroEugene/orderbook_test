import * as actions from './actions';

export function updateOrderBids(payload) {
    return async (dispatch, getState) => {
        dispatch(actions.update_order_book_bids(payload))
    }
}