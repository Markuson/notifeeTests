import { FCMHelper } from './fcmHelper';

class fcmServices {
  // FCM Notificarion
  getRegisterFCM() {
    FCMHelper.register(
      this.onRegister,
    );
  };

  createFCMListeners() {
    FCMHelper.createNoitificationListeners(
      this.onRegister,
      this.onNotification, 
      this.onOpenNotification
    )
  };

  iosRegisterFCM() {
    FCMHelper.registerAppWithFCM()
  }

  // FCM Push Notification
  onRegister = function * (token:any) {
    console.log("onRegister FCMService", token);
    
  };

  onNotification = function* ( notificationList:any) {
    
  };

  onOpenNotification = async (notification:any) => {
    // TODO: Navigate to desired screen
    console.log("onOpenNotification FCMService", notification);
    let routeName: any = 'Tile'
    let params ={ isOnboarded: true };
    // notificationDetails.forEach((_notification: any) => {
    //   if (_notification.name == notification.body && _notification.screen != undefined) {
    //     routeName = _notification.screen
    //   }
    // });
    // let brandName = await AsyncStorage.getItem('brand');
    // console.log('MARCUS brand name: ', brandName);
    // if ((brandName == 'lmc' || brandName == 'eriba') && routeName == 'Climate') {
    //   routeName = routeName.concat('LMC')
    // }
    // navigate(routeName, params);
    // store.dispatch(NavigationActions.navigate({
    //   routeName,
    //   params
    // }));

  };
};

export const FCMService = new fcmServices();
