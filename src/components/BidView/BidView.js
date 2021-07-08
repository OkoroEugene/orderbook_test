import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ({ bids }) {

    const [zoom, setZoom] = useState(1);
    
    const getBuyWall = (bid) => {
        const last_item = bids.length - 1;
        const output = ((bid.total / (bids[last_item].total)) * 100 * zoom).toFixed(0);
        return `${output}%`;
    }

    return (
        <>
            <View style={styles.itemRow}>
                <Text style={styles.text1}>TOTAL</Text>
                <Text style={styles.text2}>PRICE</Text>
            </View>
            
            {bids && bids.map((bid, i) => <View key={i} style={{ position: 'relative' }}>
                <View style={styles.itemRow}>
                    <Text style={styles.text1}>{bid.total}</Text>
                    <Text style={styles.text2}>{bid.price}</Text>
                </View>

                <View style={styles.buyWall(getBuyWall(bid))} />
            </View>)}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80
    },
    itemRow: {
        backgroundColor: '#112431',
        borderBottomWidth: 1,
        borderBottomColor: '#1d3e54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        height: 30,
    },
    buyWall: val => ({
        backgroundColor: 'green',
        position: 'absolute',
        right: 0,
        width: `${val}`,
        height: '100%',
        flexDirection: 'row-reverse',
        opacity: .2
    }),
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text1: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc'
    },
    text2: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc'
    },
})