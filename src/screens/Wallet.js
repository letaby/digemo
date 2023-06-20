import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
  AbsLoader,
  Button,
  Container,
  Input,
  SafeArea,
  Text16,
  Press,
  Text28,
  Caption,
  Row,
  Medium14,
  GRAY,
  Loader,
  Medium16,
  RowCentered,
  PageImage,
} from '../commons/UI';
import {observer} from 'mobx-react-lite';
import useStore from '../commons/Store';
import {copytext, paddBottom} from '../commons/utils';
import {Image, ScrollView, View} from 'react-native';

export default observer(({navigation: {navigate}}) => {
  const {wallet, balance, logout} = useStore(),
    [load, setLoad] = useState(false),
    [nft, setNft] = useState(null);

  useEffect(() => {
    if (balance != null)
      setTimeout(
        () =>
          setNft(
            'https://lh3.googleusercontent.com/4Cux9v_WF_yWQ1T0SBn2fAeU9glmPnYb7dAv_oHR9sof9SY6VxH3KPzE7xhDbH5Sc_OdQBs7TKGvDQonGRCmZjzMdHjLTrFJgfRS4us=w350',
          ),
        1000,
      );
  }, [balance == null]);

  return (
    <SafeArea>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingBottom: paddBottom + 32,
        }}>
        <Caption style={{marginTop: 0}}>Wallet Address:</Caption>
        <RowCentered>
          <Press
            onPress={() => copytext(wallet)}
            style={{flex: 1, marginRight: 12}}>
            <Text16 style={{marginTop: 4}}>{wallet}</Text16>
          </Press>
          <Press onPress={logout}>
            <Medium16 style={{color: GRAY, paddingVertical: 6}}>
              Log out
            </Medium16>
          </Press>
        </RowCentered>
        <Caption>ETH BALANCE:</Caption>
        {balance == null ? (
          <Row>
            <Loader small />
          </Row>
        ) : (
          <Text28>{balance}</Text28>
        )}

        {balance != null && (
          <Button
            transp
            title="Get history"
            onPress={() => navigate('History')}
            style={{marginTop: 12}}
          />
        )}

        {balance != null && (
          <>
            <Caption style={{marginBottom: 8}}>NFT:</Caption>
            {nft?.includes('://') ? (
              <>
                <PageImage source={{uri: nft}} />
                <Text16 style={{marginTop: 12}}>Pixelmon #3859</Text16>
                <RowCentered>
                  <View style={{flex: 1, marginRight: 12}}>
                    <Text16>Token: 3859 (ERC-721)</Text16>
                    <Text16>Creator: Pixelmon: Deployer</Text16>
                  </View>
                  <Image
                    source={{
                      uri: 'https://storage.googleapis.com/nftimagebucket/tokensinfo/6b91fa9f1208b470a3fec8d0a7878805.png',
                    }}
                    style={{width: 32, height: 32, borderRadius: 8}}
                  />
                </RowCentered>
              </>
            ) : nft ? (
              <Text16 style={{color: GRAY}}>no nft</Text16>
            ) : (
              <Row>
                <Loader small />
              </Row>
            )}
          </>
        )}
      </ScrollView>
      {load && <AbsLoader />}
    </SafeArea>
  );
});
