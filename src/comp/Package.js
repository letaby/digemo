import React from 'react';
import {View, StyleSheet, Text, Pressable, Alert} from 'react-native';
import Purchases from 'react-native-purchases';

export default ({pack, setIsPurchasing, goBack}) => {
  const {
    product: {title, description, priceString},
  } = pack;

  const onPress = async () => {
    setIsPurchasing(true);
    try {
      const {purchaserInfo} = await Purchases.purchasePackage(pack);
      if (typeof purchaserInfo.entitlements.active['entl1']) goBack();
    } catch (e) {
      if (!e.userCancelled) Alert.alert('Error purchasing package', e.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Pressable {...{onPress}} style={st.container}>
      <View style={st.left}>
        <Text style={st.title}>{title}</Text>
        <Text style={st.terms}>{description}</Text>
      </View>
      <Text style={st.title}>{priceString}</Text>
    </Pressable>
  );
};

const st = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  terms: {
    color: 'darkgrey',
  },
});
