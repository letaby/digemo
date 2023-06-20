import React, {useEffect} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react-lite';
import {ethers} from 'ethers';
import {provider} from './utils';
import useStore from './Store';

export default observer(pr => {
  const {wallet, setBalance} = useStore();

  useEffect(() => {
    if (wallet) {
      provider
        .getBalance(wallet) //(check.address)
        .then(bal => setBalance(bal ? ethers.formatEther(bal) : 0));
    }
  }, [!wallet]);

  return <View style={{flex: 1}} {...pr} />;
});
