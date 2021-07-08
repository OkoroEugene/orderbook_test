import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ({ asks }) {

    const [zoom, setZoom] = useState(1);
    
    const getAskWall = (ask) => {
        const last_item = asks.length - 1;
        const output = ((ask.total / (asks[last_item].total)) * 100 * zoom).toFixed(0);
        return `${output}%`;
    }

    return (
        <>
            <View style={styles.itemRow}>
                <Text style={styles.text1}>TOTAL</Text>
                <Text style={styles.text2}>PRICE</Text>
            </View>
            
            {asks && asks.map((ask, i) => <View key={i} style={{ position: 'relative' }}>
                <View style={styles.itemRow}>
                    <Text style={styles.text1}>{ask.total}</Text>
                    <Text style={styles.text2}>{ask.price}</Text>
                </View>

                <View style={styles.buyWall(getAskWall(ask))} />
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
        backgroundColor: 'red',
        position: 'absolute',
        left: 0,
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