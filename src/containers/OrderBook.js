import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateOrderBids} from '../actions/OrderBooks/UpdateBids';
import {updateOrderAsks} from '../actions/OrderBooks/UpdateAsks';
import {clearOrders} from '../actions/OrderBooks/ClearOrders';
import { useCallback } from 'react';

function OrderBook(props) {
    const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    const {
        updateOrderBids, 
        updateOrderAsks,
        clearOrders,
        orderbook:{
            order_books: {bids,asks}
        }
    } = props;

    const subscribe_msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD'
    })

    const unsubscribe_msg = JSON.stringify({
        event: 'unsubscribe',
        channel: 'book',
    })

    const connectAll = () => {
        wss.onmessage = (msg) => onMessageReceived(msg);
        wss.onopen = () => {
            wss.send(subscribe_msg);
        }
    }

    const disconnectAll = () => {
        clearOrders();
        wss.send(unsubscribe_msg);
        wss.close();
    }

    const onMessageReceived = (msg) => {
        const payload = JSON.parse(msg.data);
        const snapshot = payload[1];

        if (Array.isArray(snapshot)) {
            const payload_data = {
                price: parseFloat(snapshot[0]).toFixed(2),
                count: snapshot[1],
                amount: parseFloat(snapshot[2]).toFixed(2),
            }
            
            if (typeof payload_data.count === 'number') {
                if (payload_data.amount > '0.00') {
                    updateOrderBids(payload_data);
                }
    
                else {
                    updateOrderAsks(payload_data);
                }
            }
        }
    }

    return (
        <View>
            <Text>Hello there!</Text>

            {/* {bids.map((e, i) => <Text key={i}>{e.price}</Text>)} */}
        </View>
    );
}

function mapStateToProps(state) {
    return {
      orderbook: state.orderbook,
    }
  }
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({
      updateOrderBids,
      updateOrderAsks,
      clearOrders
  }, dispatch);
  
  export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);