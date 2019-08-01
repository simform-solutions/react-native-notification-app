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
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firebase from 'react-native-firebase';

class App extends Component {
  
  componentDidMount() {
    this.checkPermission();
    this.createNotificationChannel();
    this.createNotificationListeners();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
  async getToken() {
    // Use this token to send notification to specific device
    fcmToken = await firebase.messaging().getToken();
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }


  // As of Android 8.0 (API Level 26), notifications must specify a Notification Channel or they will not appear.
  async createNotificationChannel() {
    // Build a channel
    const channelId = new firebase.notifications.Android.Channel("Default", "Default", firebase.notifications.Android.Importance.High);
    // Create the channel
    await firebase.notifications().android.createChannel(channelId);
  }
  
  // Show notification when app is open
  showForegroundNotification(notification) {
      let notification_to_be_displayed = new  firebase.notifications.Notification({
          data: notification.data,
          sound: 'default',
          show_in_foreground: true,
          title: notification.title,
          body: notification.body
      });

      if(Platform.OS == "android") {
        notification_to_be_displayed
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setChannelId("Default")
        .android.setVibrate(1000);
      }
      firebase.notifications().displayNotification(notification_to_be_displayed);
  }


  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showForegroundNotification(notification);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
      } 
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
    }
    
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }
  

  render() {
      return (
        <Fragment>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}>
              <Header />
              {global.HermesInternal == null ? null : (
                <View style={styles.engine}>
                  <Text style={styles.footer}>Engine: Hermes</Text>
                </View>
              )}
              <View style={styles.body}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Step One</Text>
                  <Text style={styles.sectionDescription}>
                    Edit <Text style={styles.highlight}>App.js</Text> to change this
                    screen and then come back to see your edits.
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>See Your Changes</Text>
                  <Text style={styles.sectionDescription}>
                    <ReloadInstructions />
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Debug</Text>
                  <Text style={styles.sectionDescription}>
                    <DebugInstructions />
                  </Text>
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Learn More</Text>
                  <Text style={styles.sectionDescription}>
                    Read the docs to discover what to do next:
                  </Text>
                </View>
                <LearnMoreLinks />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
      );
    }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
