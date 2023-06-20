import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
// import SplashScreen from 'react-native-splash-screen';
// import codePush from 'react-native-code-push';
import {Button, SafeArea, Container} from '../commons/UI';

export default ({navigation: {navigate}}) => {
  return (
    <SafeArea>
      <Container style={{padding: 20, justifyContent: 'flex-end'}}>
        <Button title="Create a wallet" onPress={() => navigate('NewWallet')} />
        <Button
          title="Import a wallet"
          transp
          onPress={() => navigate('ImportWallet')}
          style={{marginTop: 20}}
        />
      </Container>
    </SafeArea>
  );
};
