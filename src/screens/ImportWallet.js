import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {ethers} from 'ethers';
import {
  AbsLoader,
  Button,
  Container,
  GRAY,
  Input,
  KeyboardContainer,
  SafeArea,
  Text14,
  Text16,
} from '../commons/UI';
import useStore from '../commons/Store';
import {observer} from 'mobx-react-lite';

export default observer(() => {
  const {setWallet} = useStore();

  const [phrase, setPhrase] = useState(
      'light hurdle afford normal purse celery glare excite amateur echo gas fancy hotel theory airport wrong expire chase',
    ),
    [load, setLoad] = useState(false);

  const handleImport = async () => {
    setLoad(true);
    let text = phrase.trim();
    setPhrase(text);
    try {
      let check = ethers.Wallet.fromPhrase(text);
      if (check?.address) setWallet(check.address);
      else alert(`Haven't found a wallet by this phrase`);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeArea>
      <KeyboardContainer>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled">
          <Text14 style={{color: GRAY}}>
            Paste your wallet recovery (private) phrase
          </Text14>
          <Input
            autoFocus
            multiline
            defaultValue={phrase}
            placeholder="Enter recovery phrase"
            onChangeText={setPhrase}
            returnKeyType="send"
            onSubmitEditing={handleImport}
            style={{marginTop: 8}}
          />
          <Button
            title="Add a wallet"
            onPress={handleImport}
            style={{marginTop: 16}}
          />
        </ScrollView>
      </KeyboardContainer>
      {load && <AbsLoader />}
    </SafeArea>
  );
});
