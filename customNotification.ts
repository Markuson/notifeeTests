import notifee, { EventType } from '@notifee/react-native';
import { Platform } from 'react-native';

class CustomNotification {

    channel = 'default'

    onBackgroundOpen = (callback:any) => {
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            console.log('MARKUS BACKGROUND NOTIFICATION OPEN type: ', type)
            console.log('MARKUS BACKGROUND NOTIFICATION OPEN detail: ', detail)
            const { notification } = detail;
            if (type === EventType.PRESS || type === EventType.DISMISSED) {
                callback(notification);
            }
        })
    };

    onQuitStateOpen = (callback: any) => {
        notifee.getInitialNotification().then((remoteMessage) => {
            console.log('MARKUS QUIT NOTIFICATION OPEN type: ', remoteMessage)
            if (remoteMessage) {
                const { notification } = remoteMessage
                callback(notification);
            }
        })
    };

    cancel = async (id: string | undefined = undefined) => {
        if (id) {
            await notifee.cancelNotification(id);
        }
    };

    cancelAll = async () => {
        await notifee.cancelAllNotifications();
    };

    createChannel = async (channel: string = this.channel) => {
        console.log("MARKUS PLATFORM: ", Platform.OS)
        if (Platform.OS == 'android') {
            const channelId = await notifee.createChannel({
                id: channel,
                name: channel,
            });

            console.log('FCM Notification Android channel name: ', channelId)
        }
        if (Platform.OS == 'ios'){
            await notifee.setNotificationCategories([
                {
                    id: 'default',
                    actions: [
                        {
                            id: 'go',
                            title: 'open app',
                        },
                        {
                            id: 'dismiss',
                            title: 'dismiss',
                        },
                    ],
                },
            ]);

        }
    };

    launch = async (data: any, brand: string = 'defult', badgeCount:number = 1, channelId: string = this.channel) => {
            let id = Date.now().toString()
            let notificationId = await notifee.displayNotification({
                id,
                title:'test title',
                body: 'test Body',
                android: {
                    channelId,
                    groupId: channelId,
                    badgeCount,
                    pressAction: {
                        id: 'default',
                        launchActivity: 'com.dometicapp.MainActivity'
                    },
                },
                ios:{
                    badgeCount,
                    sound: "default",
                    categoryId: 'default',
                }
            });
            return notificationId
    };
};

export const customNotification = new CustomNotification