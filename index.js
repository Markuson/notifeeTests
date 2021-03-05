/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { FCMService } from './fcmServices';

FCMService.iosRegisterFCM();
FCMService.createFCMListeners();

AppRegistry.registerComponent(appName, () => App);
