import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootSiblingParent} from 'react-native-root-siblings';
// import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// const Drawer = createDrawerNavigator(),
let Stack = createNativeStackNavigator();
import {observer} from 'mobx-react-lite';
// import auth from '@react-native-firebase/auth';
import dayjs from 'dayjs';
require('dayjs/locale/en');
dayjs.locale('en');
import useStore, {StoresProvider} from './src/commons/Store.js';
import {rootNavg} from './src/commons/RootNavigation.js';
import EffectsProvider from './src/commons/EffectsProvider.js';
import Initial from './src/screens/Initial.js';
import NewWallet from './src/screens/NewWallet.js';
import ImportWallet from './src/screens/ImportWallet.js';
import Wallet from './src/screens/Wallet.js';
import History from './src/screens/History.js';
import {
  BlankText,
  BlankView,
  DGRAY,
  Toaster,
  WhiteStatusBar,
} from './src/commons/UI';
import {setLocal} from './src/commons/utils.js';

//0xa4d6c6b13b0bd159b9cf0af3eba3c95be4fdc2a2

const App = () => {
  //  useEffect(() => {
  //    setTimeout(() => SplashScreen.hide());
  //  }, []);
  // if (!onboard) return <Video {...{setOnboard}} />;
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {WhiteStatusBar}
      <StoresProvider>
        <EffectsProvider>
          <RootSiblingParent>
            <Routes />
          </RootSiblingParent>
        </EffectsProvider>
      </StoresProvider>
      {Toaster}
    </GestureHandlerRootView>
  );
};

class CodePushWrapperComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({status: 'Downloading...'});
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({status: 'Installing'});
        break;
    }
  }
  codePushDownloadDidProgress(progress) {
    this.setState({progress});
  }
  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    codePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }
  render() {
    if (this.state.status) {
      let {status, progress: prog} = this.state,
        whole = prog && (prog.totalBytes / 1000000).toFixed(1),
        done = prog && (prog.receivedBytes / 1000000).toFixed(1),
        Text = pr => <BlankText style={{color: DGRAY}} {...pr} />;
      return (
        <BlankView>
          <Text>{status}</Text>
          {prog && <Text>{`${done} / ${whole} MB`}</Text>}
        </BlankView>
      );
    }
    return <App />;
  }
}

let codePushOptions = {
  updateDialog: {
    appendReleaseDescription: true,
    title: `Download a small update with bug fixes (~1.1 MB)`,
  },
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  rollbackRetryOptions: {delayInHours: 1, maxRetryAttempts: 3},
};
CodePushWrapperComponent = codePush(codePushOptions)(CodePushWrapperComponent);
export default CodePushWrapperComponent;
// export default App;

let Routes = observer(() => {
  const mount = useRef(true),
    {wallet} = useStore();

  // useEffect(() => {
  //   setLocal('0xa4d6c6b13b0bd159b9cf0af3eba3c95be4fdc2a2');
  //   return () => (mount.current = false);
  // }, []);

  return (
    <NavigationContainer ref={rootNavg}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!wallet && (
          <>
            <Stack.Screen name="Initial" component={Initial} />
            <Stack.Screen name="ImportWallet" component={ImportWallet} />
          </>
        )}
        {wallet && (
          <>
            <Stack.Screen name="Wallet" component={Wallet} />
            <Stack.Screen
              name="History"
              component={History}
              options={{headerShown: true}}
            />
          </>
        )}
        <Stack.Screen name="NewWallet" component={NewWallet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
});
