import {Alert, Linking} from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidStyle,
} from '@notifee/react-native';
import {isIOS} from './utils';
import {BLUE} from './UI';
import {getRoute} from './RootNavigation';

export const createNotifChannels = async () => {
  if (isIOS) {
    let settings = await notifee.requestPermission();
    if (settings?.authorizationStatus)
      return notifee.setNotificationCategories([
        {id: 'class'},
        {id: 'chat'},
        {id: 'comment'},
        {id: 'inapp'},
      ]);
    else
      return Alert.alert(
        'Need notifications approval',
        `We'll notify of your bookings updates, coaches' comments and messages`,
        [
          {
            text: 'Go to settings',
            onPress: () =>
              Linking.openURL('App-Prefs:com.rgonline.app&path=notifications'),
          },
          {text: 'Close', style: 'destructive'},
        ],
        {cancelable: true},
      );
  }
  if (!isIOS) {
    let channel = await notifee.isChannelCreated('class');
    if (channel) return true;
    if (!channel)
      return await Promise.all([
        notifee.createChannel({
          id: 'class',
          name: 'Class',
          sound: 'default',
          vibration: true,
          importance: AndroidImportance.HIGH, // AndroidImportance.DEFAULT,
          visibility: AndroidVisibility.PUBLIC,
        }),
        notifee.createChannel({
          id: 'chat',
          name: 'Chats',
          sound: 'default',
          vibration: true,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        }),
        notifee.createChannel({
          id: 'comment',
          name: 'Comments',
          sound: 'default',
          vibration: true,
          importance: AndroidImportance.HIGH, // AndroidImportance.DEFAULT,
          visibility: AndroidVisibility.PUBLIC,
        }),
        notifee.createChannel({
          id: 'inapp',
          name: 'In-app silent',
          vibrationPattern: [200, 200],
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        }),
      ]);
  }
};

export const parseNotif = mesg => {
  let data = JSON.parse(mesg.data.data),
    {type, id, uid, to} = data,
    isevent = type.includes('class'),
    cancld = type.includes('cancel'),
    iscomnt = type == 'comment',
    ispassed = iscomnt || (isevent && to < Date.now()),
    actual = isevent && !cancld && !ispassed,
    ischat = type == 'chat',
    {name: screen, params} = getRoute(),
    inFocus = ischat
      ? screen == 'Chat' && (p?.id == id || p?.uid == uid)
      : (screen == 'Event' && params?.id == id) ||
        (cancld && screen == 'Profile'); // for cancelled class, 'in focus' also is when we are on 'Profile' screen
  return Object.assign(data, {
    isevent,
    cancld,
    iscomnt,
    ispassed,
    actual,
    ischat,
    screen,
    inFocus,
  });
};

export const showNotif = async ({notification: not, data}) => {
  await createNotifChannels();
  await notifee.displayNotification({
    ...not,
    id: JSON.parse(data.data).id,
    data,
    android: {
      style: {
        type: AndroidStyle.BIGTEXT,
        text: not.body.replaceAll('\n', '<br>'),
      },
      vibrationPattern: [200, 200, 200, 200],
      channelId: 'inapp',
      smallIcon: 'ic_small_icon',
      color: BLUE, // Set color of icon (Optional, defaults to white)
      pressAction: {id: 'default'},
    },
    ios: {
      foregroundPresentationOptions: {sound: false},
      pressAction: {id: 'default'},
    },
  });
};
