import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, ScrollView, } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateOrderBids } from '../actions/OrderBooks/UpdateBids';
import { updateOrderAsks } from '../actions/OrderBooks/UpdateAsks';
import { clearOrders } from '../actions/OrderBooks/ClearOrders';
import { useCallback } from 'react';
import BidView from '../components/BidView/BidView';
import AskView from '../components/AskView/AskView';
import Button from '../components/Button/Button';

function OrderBook(props) {
    let wss;

    const [ready, setReady] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);

    const {
        updateOrderBids,
        updateOrderAsks,
        clearOrders,
        orderbook: {
            order_books: { bids, asks }
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
        setConnected(false);
        setConnecting(true);
        setReady(false);
        wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        wss.onmessage = (msg) => onMessageReceived(msg);
        wss.onopen = () => {
            wss.send(subscribe_msg);
        }
    }

    const disconnectAll = () => {
        clearOrders();
        wss.send(unsubscribe_msg);
        wss.close();
        setReady(true);
        setConnected(false);
    }

    const onMessageReceived = (msg) => {
        setConnecting(false);
        setConnected(true);
        const payload = JSON.parse(msg.data);
        const snapshot = payload[1];

        if (Array.isArray(snapshot)) {
            const payload_data = {
                price: parseFloat(snapshot[0]).toFixed(2),
                count: snapshot[1],
                amount: parseFloat(snapshot[2]).toFixed(2),
                total: parseFloat(0).toFixed(2)
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
        <View style={styles.container}>
            <View style={styles.nav}>
                <SafeAreaView>
                    <View style={styles.navContent}>
                        <Button
                            btnText={connecting ? "Connecting..." : connected ? "Connected" : "Connect"}
                            btnStyles={styles.connectBtn}
                            onPress={connectAll}
                            loading={connecting}
                            disabled={connected}
                        />

                        <Button
                            btnText="Disonnect"
                            btnStyles={styles.disconnectBtn}
                            onPress={disconnectAll}
                            disabled={ready}
                        />
                    </View>
                </SafeAreaView>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ORDER BOOK</Text>
                <View style={styles.headerIcons}>
                    <Pressable>
                        <Text style={styles.precisionIcon}>-</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={styles.precisionIcon}>+</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.bidContainer}>
                    <BidView bids={bids} />
                </View>
                <View style={styles.askContainer}>
                    <AskView asks={asks} />
                </View>
            </ScrollView>

            {/* {bids.map((e, i) => <Text key={i}>{e.price}</Text>)} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nav: {
        backgroundColor: '#112431'
    },
    navContent: {
        padding: 20
    },
    header: {
        backgroundColor: '#112431',
        borderBottomWidth: 1,
        borderBottomColor: '#1d3e54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        height: 50
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    },
    precisionIcon: {
        fontSize: 30,
        paddingHorizontal: 5,
        color: '#fff'
    },
    content: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    bidContainer: {
        width: '50%'
    },
    askContainer: {
        width: '50%'
    },
    connectBtn:{
        backgroundColor: '#5CB65D', 
        marginTop: 20
    },
    disconnectBtn:{
        backgroundColor: '#D9554F', 
        marginTop: 20
    }
})

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