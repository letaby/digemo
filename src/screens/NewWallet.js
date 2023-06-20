import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useStore from '../commons/Store';
import {
  AbsLoader,
  Container,
  SafeArea,
  Text18,
  Touch,
  Text16,
  GRAY,
  Text14,
  Button,
} from '../commons/UI';
import {copytext} from '../commons/utils';
import {observer} from 'mobx-react-lite';

export default observer(() => {
  const {wallet, phrase, createWallet} = useStore();

  useEffect(() => {
    createWallet();
  }, []);

  if (!wallet || !phrase)
    return (
      <Container>
        <AbsLoader />
      </Container>
    );

  const Item = ({tx}) => (
    <Touch onPress={() => copytext(tx)}>
      <Text18>{tx}</Text18>
    </Touch>
  );

  return (
    <SafeArea>
      <Container style={{padding: 20}}>
        <Text16 style={{color: GRAY}}>Your wallet:</Text16>
        <Item tx={wallet} />
        <Text16 style={{color: GRAY, marginTop: 32}}>Secret phrase:</Text16>
        <Item tx={phrase} />
        <Text14 style={{color: GRAY, marginTop: 12}}>
          Tap the phrase to copy it and then save it somewhere in a secure
          place. You'll use it to restore this wallet in any other Etherium
          service. If you lose this phrase, you will lose access to your wallet
        </Text14>
        <Button
          title="Done"
          onPress={() => navigate('Wallet')}
          style={{marginTop: 32}}
        />
      </Container>
    </SafeArea>
  );
});
