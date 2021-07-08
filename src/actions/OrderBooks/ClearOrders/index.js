import * as actions from './actions';

export function clearOrders(payload) {
    return async (dispatch, getState) => {
        dispatch(actions.clear_orders())
    }
}