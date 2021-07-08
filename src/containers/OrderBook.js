import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, ScrollView, TouchableOpacity, } from 'react-native';
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

    const [connecting, setConnecting] = useState(false);
    const [disConnecting, setDisconnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [precision, setPrecision] = useState("P0");
    const [zoom, setZoom] = useState(1);

    const {
        updateOrderBids,
        updateOrderAsks,
        clearOrders,
        orderbook: {
            order_books: { bids, asks }
        }
    } = props;

    const wss = useRef(null);

    const subscribe_msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
        prec: precision
    })

    const unsubscribe_msg = JSON.stringify({
        event: 'unsubscribe',
        channel: 'book',
    })

    useEffect(() => {
        return () => {
            if (wss.current && wss.current.OPEN) {
                wss.current.close();
            }
        };
    }, []);

    const connectAll = useCallback(async () => {
        setConnected(false);
        setConnecting(true);

        wss.current = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        wss.current.onmessage = (msg) => onMessageReceived(msg);
        wss.current.onopen = () => {
            wss.current.send(subscribe_msg);
        }
    }, [updateOrderBids, updateOrderAsks])

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
                if (payload_data.amount > '0') {
                    updateBids(payload_data);
                }

                else {
                    updateAsks(payload_data);
                }
            }
        }
    }

    const updateBids = useCallback((payload_data) => {
        updateOrderBids(payload_data);
    }, [updateOrderBids])

    const updateAsks = useCallback((payload_data) => {
        updateOrderAsks(payload_data);
    }, [updateOrderBids])

    const disconnectAll = () => {
        setDisconnecting(true);
        wss.current.send(unsubscribe_msg);
        wss.current.close();

        wss.current.onclose = function (event) {
            clearOrders();
            setConnected(false);
            setDisconnecting(false);
        };
    }

    const disableRemPrec = precision === 'P0';
    const disableAddPrec = precision === 'P5';

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
                            btnText={disConnecting ? "Stopping..." : "Disonnect"}
                            btnStyles={styles.disconnectBtn}
                            onPress={disconnectAll}
                            disabled={!connected}
                        />
                    </View>
                </SafeAreaView>

                <View>
                    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                        <Button
                            btnText={"Zoom In"}
                            btnStyles={{width:"45%", height:40}}
                            onPress={() => setZoom(zoom + 1)}
                        />

                        <Button
                            btnText={"Zoom Out"}
                            btnStyles={{width:"45%", height:40}}
                            onPress={() => setZoom(zoom - 1)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ORDER BOOK</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={disableRemPrec ? ()=>{} : removePrecision}>
                        <Text style={[styles.precisionIcon, {
                            opacity: disableRemPrec ? 0.3 : 1
                        }
                        ]}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={addPrecision}>
                        <Text style={[styles.precisionIcon, {
                            opacity: disableAddPrec ? 0.3 : 1
                        }
                        ]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.bidContainer}>
                    <BidView
                        bids={bids}
                        zoom={zoom}
                    />
                </View>
                <View style={styles.askContainer}>
                    <AskView
                        asks={asks}
                        zoom={zoom}
                    />
                </View>
            </ScrollView>
        </View>
    );


    const addPrecision = async () => {
        disconnectAll();
        switch (precision) {
            case "P0":
                setPrecision("P1")
            case "P1":
                setPrecision("P2")
            case "P2":
                setPrecision("P3")
            case "P3":
                setPrecision("P4")
            case "P4":
                setPrecision("P5")
            default:
                setPrecision("P0")
        }

        await connectAll();
    }

    const removePrecision = async () => {
        disconnectAll();
        switch (precision) {
            case "P5":
                setPrecision("P4")
            case "P4":
                setPrecision("P3")
            case "P3":
                setPrecision("P2")
            case "P2":
                setPrecision("P1")
            case "P1":
                setPrecision("P0")
            default:
                setPrecision("P0")
        }

        await connectAll();
    }
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