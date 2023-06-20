import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {observer} from 'mobx-react-lite';
import orderBy from 'lodash/orderBy';
import useStore from '../commons/Store';
import {scanProvider, setLocal} from '../commons/utils';
import {
  AbsLoader,
  Button,
  Container,
  Input,
  SafeArea,
  Text16,
  Toaster,
  Press,
  Text28,
  Caption,
  Text14,
  GRAY,
  BlankText,
} from '../commons/UI';
import dayjs from 'dayjs';
import {ethers} from 'ethers';

export default observer(() => {
  const {wallet, history, setHistory} = useStore(),
    [load, setLoad] = useState(!history);

  const getHistory = async () => {
    try {
      await scanProvider.getHistory(wallet).then(res => {
        let his = res.filter(t => t.data == '0x');
        setLoad(false);
        setHistory(orderBy(his, 'timestamp', 'desc'));
      });
    } catch (err) {
      console.warn('err == ', err);
    }
  };

  useEffect(() => {
    if (!history) getHistory();
    // setLocal('0xA4D6c6B13b0Bd159B9cF0AF3EBA3c95Be4fdC2a2');
  }, []);

  if (!history)
    return (
      <Container>
        <AbsLoader />
      </Container>
    );

  //   const array = orderBy();

  return (
    <SafeArea>
      <FlatList
        data={history}
        {...{keyExtractor, renderItem}}
        contentContainerStyle={{flexGrow: 1, padding: 20}}
        ListHeaderComponent={<Text28>ETH transactions</Text28>}
        ListEmptyComponent={
          <BlankText style={{marginTop: 16}}>No ETH transactions yet</BlankText>
        }
      />
      {load && <AbsLoader />}
    </SafeArea>
  );
});

let keyExtractor = e => e.hash;

let renderItem = ({item: tr}) => (
  <View style={{paddingVertical: 6}}>
    <Text16 style={{color: GRAY}}>
      {dayjs(tr.timestamp * 1000).format('D MMM YYYY HH:mm')}
    </Text16>
    <Text16 numberOfLines={1} style={{paddingVertical: 2}}>
      From {tr.from}
    </Text16>
    <Text16 style={{paddingVertical: 2}} numberOfLines={1}>
      To {tr.to}
    </Text16>
    {/* {console.log('tr.value == ', ethers.formatEther(BigInt(tr.value)))} */}

    <Text14>ETH {ethers.formatEther(BigInt(tr.value))}</Text14>
  </View>
);

let hss = [
  {
    accessList: null,
    blockHash:
      '0xa596eb19fa0eee080dd26ae44ede7ab181b8a921b5d6138eff01534467aa98ff',
    blockNumber: 6475849,
    chainId: 0,
    confirmations: 11046675,
    creates: null,
    data: '0x',
    from: '0xA4bf5Ee7dC4A7D1d39850081e8EA1f8E8085a23B',
    gasLimit: [Object],
    gasPrice: [Object],
    hash: '0x02f168759723489d112c171975d577ea73b862571cd782b8e88fdd3945a7346f',
    nonce: 1,
    timestamp: 1538991954,
    to: '0xA4D6c6B13b0Bd159B9cF0AF3EBA3c95Be4fdC2a2',
    transactionIndex: 0,
    type: 0,
    value: [Object],
  },
  {
    accessList: null,
    blockHash:
      '0x1e3ab2a2aeeb08054259bba291e582fa962e3f1feb2a5f5737eb937c514eff8e',
    blockNumber: 6475856,
    chainId: 0,
    confirmations: 11046668,
    creates: null,
    data: '0x',
    from: '0xA4D6c6B13b0Bd159B9cF0AF3EBA3c95Be4fdC2a2',
    gasLimit: [Object],
    gasPrice: [Object],
    hash: '0x7e190a00b43021a66e4c57e5d0d8f8f91b9ef5bdb9b6a780425d42dcf4b4fbcb',
    nonce: 1,
    timestamp: 1538992068,
    to: '0xacFfDF74960f084b0aAef88757cE142ea1bCB5e2',
    transactionIndex: 1,
    type: 0,
    value: [Object],
  },
];
