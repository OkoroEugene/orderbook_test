import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function OrderBook(props) {
    useEffect(() => {
        const subscribe_msg = JSON.stringify({
            event: 'subscribe',
            channel: 'book',
            symbol: 'tBTCUSD'
        })

        const unsubscribe_msg = JSON.stringify({
            event: 'unsubscribe',
            channel: 'book',
        })

        const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        wss.onmessage = (msg) => onMessageReceived(msg);
        wss.onopen = () => {
            wss.send(subscribe_msg);
        }

        return (() => {
            if (wss.OPEN && !wss.CONNECTING) {
                wss.send(unsubscribe_msg);
                wss.close();
            }
        })
    })

    const onMessageReceived = (msg) => {
        const payload = JSON.parse(msg.data);
        const snapshot = payload[1];

        if (Array.isArray(snapshot)) {
            const payload_data = {
                price: parseFloat(snapshot[0]).toFixed(2),
                count: snapshot[1],
                amount: parseFloat(snapshot[2]).toFixed(2),
            }
            // console.log(payload_data);
        }
    }

    return (
        <View>
            <Text>Hello there!</Text>
        </View>
    );
}

export default OrderBook;