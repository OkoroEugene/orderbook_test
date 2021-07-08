import * as actions from './actions';

export function updateOrderAsks(payload) {
    return async (dispatch, getState) => {
        dispatch(actions.update_order_book_asks(payload))
    }
}