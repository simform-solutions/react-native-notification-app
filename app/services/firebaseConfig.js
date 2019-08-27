import firebase from 'react-native-firebase';

export const checkPermission  = async () =>  {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      getToken();
  } else {
      requestPermission();
  }
}

const getToken = async () => {
  fcmToken = await firebase.messaging().getToken();
}

const requestPermission = async () => {
  try {
      await firebase.messaging().requestPermission();
      getToken();
  } catch (error) {
      console.log('permission rejected');
  }
}


// As of Android 8.0 (API Level 26), notifications must specify a Notification Channel or they will not appear.
export const createNotificationChannel = async () => {
  const channelId = new firebase.notifications.Android.Channel("Default", "Default", firebase.notifications.Android.Importance.High);
  await firebase.notifications().android.createChannel(channelId);
}

// Show notification when app is open
const showForegroundNotification = (notification) => {
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


export const createNotificationListeners = async() => {
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      showForegroundNotification(notification);
  });

  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
    } 
  });

  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
  }
  
  this.messageListener = firebase.messaging().onMessage((message) => {
    //process data message
  });
}