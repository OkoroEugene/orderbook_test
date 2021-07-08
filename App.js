import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import OrderBook from './src/containers/OrderBook';
import {Provider} from 'react-redux';
import store from './src/store/createStore';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <OrderBook />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64717a',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
