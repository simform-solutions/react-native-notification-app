/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform
} from 'react-native';
import styles from './styles/AppStyle';
import { checkPermission, createNotificationChannel, createNotificationListeners } from '../services/firebaseConfig';
 
class App extends Component {
  
  componentDidMount() {
    checkPermission();
    createNotificationChannel();
    createNotificationListeners();
  }

  render() {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.subcontainer}>
            <View><Text style={styles.textStyle}>RNFirebase</Text></View>
          </SafeAreaView>
        </View>
      );
    }
};

export default App;
