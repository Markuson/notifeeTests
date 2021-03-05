import firebaseMessaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { customNotification } from './customNotification'
import notifee, { EventType } from '@notifee/react-native';


export const messaging = firebaseMessaging();

class fcmHelper {
  register = (
    onRegister: any,
  ) => {
    this.checkPermission(onRegister);
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging.registerDeviceForRemoteMessages();
      await messaging.setAutoInitEnabled(true);
    }
  };

  checkPermission = async (onRegister: any) => {
    const authorizationStatus = await messaging.hasPermission();
    if (authorizationStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED) {
      //if user has permission
      console.log('fcm checkpermission true');
      this.getToken(onRegister);
    } else {
      //if user don't have permission
      console.log('fcm checkpermission false');
      this.requestPermission(onRegister);
    }
  };

  getToken = async (onRegister: (arg0: string) => void) => {
    const fcmToken = await messaging.getToken();
    if (fcmToken) {
      onRegister(fcmToken);
      console.log('User have a device token: fcm', fcmToken);
      customNotification.createChannel();
    } else {
      console.log('User does not have a device token: fcm');
    }
  };

  requestPermission = async (onRegister: any) => {
    if (messaging.isDeviceRegisteredForRemoteMessages) {
      await messaging.registerDeviceForRemoteMessages();
    }
    const authorizationStatus = await messaging.requestPermission({
      alert: true,
    });
    if (
      authorizationStatus === firebaseMessaging.AuthorizationStatus.AUTHORIZED || firebaseMessaging.AuthorizationStatus.NOT_DETERMINED
    ) {
      // this.getToken(onRegister)
      const token = await messaging.getToken();
      onRegister(token);
      console.log('Token fcm', token);
      customNotification.createChannel();
    } else if (
      authorizationStatus === firebaseMessaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  };

  deletedToken = () => {
    messaging.deleteToken().catch(error => {
      console.log('Delected token error fcm', error);
    });
  };

  createNoitificationListeners = (
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) => {
    // Background
    customNotification.onBackgroundOpen(async(notification: any) => {
      onOpenNotification
    });

    // Quit state
    customNotification.onQuitStateOpen(async(notification: any) => {
      onOpenNotification
    });

    // ForeGround
    messaging.onMessage(async (remoteMessage) => {
      console.log('FCM Foreground notification:', remoteMessage);
    })

    // Triggered when have  new token
    messaging.onTokenRefresh(token => {
      console.log('token was refreshed: fcm', token);
      onRegister(token);
      customNotification.createChannel();
    });

    messaging.setBackgroundMessageHandler(async payload => {
      console.log('Fcm: message received in background', payload);

        let brandName = 'default';
        const lastMessage = await customNotification.launch(payload.data, brandName, 0);
        console.log('Fcm: last message launched: ', lastMessage);
        
      onNotification(lastMessage)
    });
  };
  
};

export const FCMHelper = new fcmHelper();
