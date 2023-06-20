import {Platform, Dimensions, Alert, Linking} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {ethers} from 'ethers';
import {EtherscanProvider} from '@ethersproject/providers';
import Toast from 'react-native-toast-message';
import Toast2 from 'react-native-root-toast';
import Clipboard from '@react-native-clipboard/clipboard';
import fire from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy';
import {rootNavg} from './RootNavigation';

let utc = require('dayjs/plugin/utc'),
  zone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(zone);

export const db = fire(),
  dbUsers = db.collection('users'),
  dbEvents = db.collection('events'),
  dbCoaches = db.collection('coaches'),
  dbOrders = db.collection('orders'),
  dbPassed = db.collection('passed'),
  dbChats = myid => rdb.ref('chats').orderByChild('uid').equalTo(myid),
  dbBooks = myid =>
    dbEvents.where('clientsIds', 'array-contains', myid || '00');
// .where(`active`, '==', true); // + ДАТЫ

export const layout = Dimensions.get('window'),
  {width: wwidth, height} = layout,
  isIOS = Platform.OS == 'ios',
  wheight = height, //- (isIOS ? 20 : 0),
  hasIosIsland = isIOS && height / wwidth > 2,
  paddTop = hasIosIsland ? 44 : isIOS ? 20 : 0,
  paddBottom = hasIosIsland ? 12 : 0,
  tabbarHeight = 62 + paddBottom,
  modalHeight = wheight - paddTop,
  localStor = new MMKV(),
  SUPPORT = 'anastasia_bunny@mail.ru',
  headerHeight = isIOS ? 44 : 56; // if (ios && presentation == 'modal') =56 px

export const provider = ethers.getDefaultProvider('homestead', {
    infura: '7f7e8c0b59ed4f3da8ddcf170e60c0fc', //// alchemy: 'aapMqfzpdrEtq7iZatPNrTNm4MjAwSEr',
  }),
  scanProvider = new EtherscanProvider(
    'homestead',
    'HAT8X6XXUZYIM3RSANNPT7MGWFFE3Z261U',
  );

export const getLocal = () => localStor.getString('wallet'),
  setLocal = adr => localStor.set('wallet', adr);

export const openRefundPlcy = () =>
  Linking.openURL('https://bloss.am/refunds').catch(
    () => (
      alert(
        `Couldn't launch your browser app. The policy link is copied, go to a browser and paste it there`,
      ),
      Clipboard.setString('https://bloss.am/refunds')
    ),
  );

export const dayAgo = () => Date.now() - 24 * 60 * 60000;

export const copyAlert = (title, desc, data, subj, adds) => {
  let proceed = () => (copytext(data), subj && contactsAlert(subj, data, 2));
  return Alert.alert(
    title,
    desc,
    (adds || []).concat([
      {text: 'Copy' + (subj ? ' & contact us' : ''), onPress: proceed},
      {text: 'Close', onPress: null, style: 'destructive'},
    ]),
    {cancelable: true},
  );
};

export const contactsAlert = (subj, text, isSecond) =>
  Alert.alert(
    (isSecond ? '2. ' : '') + 'Whatsapp or e-mail?',
    'Choose the way to contact us',
    [
      {
        text: 'Whatsapp',
        onPress: () =>
          Linking.openURL(
            `https://wa.me/79126144799?text=${subj}\n ${text}`,
          ).catch(
            () => (
              Clipboard.setString(
                `https://wa.me/79126144799?text=${subj}\n${text}`,
              ),
              alert(
                `Couldn't launch your Whatsapp app. The link with your data is copied, please, open your BROWSER and paste the copied link. It will open Whatsapp with pretyped message`,
              )
            ),
          ),
      },
      {
        text: 'E-mail',
        onPress: () =>
          Linking.openURL(
            `mailto:${SUPPORT}?subject=${subj}&body=${text}`,
          ).catch(
            () => (
              Clipboard.setString(
                `TO: ${SUPPORT}\nSUBJECT: ${subj}\n\n${text}`,
              ),
              alert(
                `Couldn't launch your mail app. The data is copied, please, open your mail app, start a new letter and paste the copied data.\nOur support e-mail will be in the first line`,
              )
            ),
          ),
      },
      {text: 'Close', onPress: null, style: 'destructive'},
    ],
    {cancelable: true},
  );

export const contactSuprt = ({myid, id, orderID}) => {
  let {constants, OS, Version} = Platform,
    {Brand, Manufacturer, Model} = constants;
  let mess = `Hello! My user id is ${myid}, my device is ${
    (Brand || Manufacturer || '') +
    ' ' +
    (Model || (isIOS ? 'iPhone' : '')) +
    ' (' +
    OS +
    ' ' +
    Version
  }).\nI have an issue${
    id || orderID
      ? ' with the ' + (orderID ? `order ${orderID}` : `booking ${id}`)
      : ''
  }: `;
  return copyAlert(
    `1. Copy your data`,
    `Please, press Copy these data and then paste it into your message\n\n${mess}`,
    mess,
    orderID ? 'ORDER ISSUE.' : id ? 'BOOKING ISSUE' : 'COMMON SUPPORT.',
  );
};

export const tmzn = () => new Date().getTimezoneOffset() / -60; //dayjs.tz.guess()

// export const timezoneName = new Intl.DateTimeFormat().resolvedOptions()
// .timeZone;

export const getDay = from => dayjs(from).format('YYYY-MM-DD');

export const getBalance = obj =>
  obj
    ? parseFloat(
        Object.values(obj)
          .reduce((res, curr) => res + (curr.sum || 0), 0)
          .toFixed(1),
      )
    : 0;

export const handleRoutesCheck = () => {
  let {
      index: rootIndex,
      routes: [route0],
    } = rootNavg.current.getRootState(),
    isInTabNavgIndex = rootIndex == 0 && route0.state?.index,
    isINProfileStack = isInTabNavgIndex == 3,
    isINChatStack = isInTabNavgIndex == 2;
  return {isINProfileStack, isINChatStack};
};

export const getFreeSlots = ({id, from, to}, busies0) => {
  let now = Date.now(),
    in45min = now + 45 * 60000;
  if (to < in45min) return []; // remove slots ending in less than 45 min
  if (!busies0[0]) return [{id, from, to}];
  let busies = orderBy(busies0, 'from');
  // first
  let splitted = [{id, from, to: busies[0].from}];
  // from second to last-1
  if (busies[1])
    busies.forEach(
      ({from: bFrom}, i) =>
        i != 0 && splitted.push({id, from: busies[i - 1].to, to: bFrom}),
    );
  // + last
  splitted.push({id, from: busies[busies.length - 1].to, to});
  return splitted.filter(
    s => s.to > in45min && s.to - s.from >= 30 * 60000, //  only ending in 45+ mins & have duration minimum 30 mins
  );
};

export const durtnText = (num, full) => {
  let hh = Math.floor(num / 60),
    mm = num % 60;
  return (
    (hh ? hh + ((full ? ' hour' : 'h') + (mm ? ' ' : '')) : '') +
    (mm ? mm + (full ? ' min' : 'm') : '')
  );
};

export const copytext = tx => (
  Clipboard.setString(tx), showToast2('copied', 500)
);

export const showToast = (text, dur, offset, onPress) =>
  Toast.show({
    position: 'bottom',
    visibilityTime: dur || 2500,
    type: 'basic',
    text1: text,
    bottomOffset: offset || tabbarHeight + 150,
    onPress: onPress ? () => (onPress(), Toast.hide()) : Toast.hide,
  });

export const showToast2 = (text, dur, pos, onPress) =>
  Toast2.show(` ${text}  `, {
    duration: dur || 2500,
    shadow: false,
    position: pos || Toast2.positions.CENTER,
    hideOnPress: true,
    onPress,
  });

export const ages = [
  {id: 5, name: '3-5 y.o.'},
  {id: 8, name: '6-8 y.o.'},
  {id: 14, name: '9-14 y.o.'},
  {id: 17, name: '15-17 y.o.'},
  {id: 25, name: '18-25 y.o.'},
  {id: 35, name: '26-35 y.o.'},
  {id: 99, name: '36+ y.o.'},
];

export const titles = {
  1: 'Warm up',
  2: 'Stretching basics',
  3: 'Stretch like a pro',
  4: 'Lunges basics',
  5: 'Lunges like a pro',
};

export const descs = {
  1: `1. Лягте на бок и облокотитесь на руку. Поднимайте ногу выше, задержавшись в верхней точке на 10-15 секунд. Сделайте так несколько раз, а затем повторите с другой ногой.\n\n2. Сядьте и вытяните обе ноги вперед. Затем одну ногу положите на бок, согнув ее в колене. Всем телом тянитесь к стопе вытянутой ноги. В конечной точке нужно продержаться 10-15 секунд, а после поднимите корпус.`,
  2: `Сидя, разведите ноги в разные стороны. Тело наклоните вперед к полу, стараясь опуститься максимально ниже. В нижней точке продержитесь как можно дольше. В этом упражнении вы почувствуете жжение в сухожилиях под коленями.`,
  3: `Выполните классический выпад одной ногой вперед. Далее колено противоположной ноги положите на пол и опуститесь на локти (если тяжело, то упритесь руками в пол). Корпусом тянитесь вперед к ноге. Проделайте это с другой ногой.`,
  4: `Встаньте в боковую планку, опираясь на одну руку. Далее другой рукой возьмитесь за большой палец ноги и потяните ее вверх. Сначала пусть нога будет согнута, выпрямляйте ее постепенно. И сохраняйте равновесие. Повторите все с другой ногой.\n\nЭто сложное, но эффективное упражнение. Оно не рекомендуется новичкам.`,
  5: `Сделайте выпад одной ногой вперед, а колено противоположной ноги опустите на пол. Затем выпрямите ногу, что находится впереди, положив под бедро свернутый коврик или кубик. Повторите с другой ногой.`,
};

export const colors = [
  '#FFC08A',
  '#605884',
  '#B86C88',
  '#FF988C',
  '#273E65',
  '#0CA0AE',
  '#D9AE91',
  '#A77887',
  '#87CCC5',
  '#743F97',
  '#E1578A',
  '#4400B2',
  '#B9789F',
  '#C23A94',
  '#CE3D1D',
  '#922D25',
  '#F6522E',
  '#DCABAE',
  '#FF7A2F',
  '#EEDC7C',
  '#8EAF0C',
  '#77BD8B',
  '#117243',
  '#00CF91',
  '#2398AB',
  '#BDCCFF',
  '#51EAFF',
  '#5199FF',
];

export const getRate = obj => {
  let rates = Object.values(obj || {}),
    rate = rates[12] && rates.reduce((s, r) => s + r, 0) / rates.length;
  return rate?.toFixed(1);
};

export const dbQueryToObj = (query, setState) => {
  let obj = {};
  if (!query.empty)
    query.forEach(d => {
      let [id, doc] = [d.id, d.data()];
      doc.from && (doc.day = getDay(doc.from));
      return (obj[id] = doc);
    });
  if (setState) return setState(obj);
  else return obj;
};

export const capitalize = str => str[0].toUpperCase() + str.substring(1);

export const groupBy = (array, property) =>
  array.reduce((result, item) => {
    const value = item[property];
    (result[value] = result[value] || []).push(item);
    return result;
  }, {});

export const backupDB = async () => {
  let obj = {cafes: {}, menu: {}, staff: {}, users: {}};
  (await db.collection('places').get()).forEach(dc => {
    obj.cafes[dc.id] = dc.data();
  });
  const fileRef = stor().ref('/backupDB.json');
  var blob = new Blob([JSON.stringify(obj)], {type: 'application/json'});
  const task = fileRef.put(blob);
  try {
    await task.then(async () => {
      let url = await fileRef.getDownloadURL();
      console.log('backupDB = ', url);
    });
  } catch (e) {
    console.error('Ошибка с загрузкой в стор:\n' + e);
  }
};
