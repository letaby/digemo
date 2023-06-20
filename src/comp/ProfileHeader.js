import React, {useCallback, useState} from 'react';
import {Alert, View} from 'react-native';
import styled from 'styled-components/native';
import {observer} from 'mobx-react-lite';
import {useFocusEffect} from '@react-navigation/native';
import useStore from '../commons/Stores';
import {ages, copytext, isIOS, wwidth} from '../commons/utils';
import {
  SocIcon,
  UserPic,
  Text14,
  Text12,
  Row,
  RowCentered,
  Press,
  GRAY,
  DGRAY,
  Text18,
  SettingsIcon,
  Medium16,
  Touch,
  GREEN,
  Medium18,
  Text10,
  BACKGREEN,
  BORDERGRAY,
  BLUE,
  BACKBLUE,
  shadow4,
} from '../commons/UI';

export default observer(({navigate}) => {
  const {
      auth: {profile, logout},
      client: {handleLogout, balance},
    } = useStore(),
    {phone, bio, age, email, stat, ...p} = profile,
    [showSets, setShowSets] = useState(false),
    toggleSets = () => setShowSets(!showSets);

  useFocusEffect(useCallback(() => () => setShowSets(false), []));

  const askLogout = () =>
    Alert.alert(
      'Log out?',
      undefined,
      [
        {
          text: 'Log out',
          onPress: () => (logout(), handleLogout()),
          style: 'destructive',
        },
        {text: 'Close'},
      ],
      {cancelable: true},
    );

  return (
    <>
      <Press onPress={toggleSets}>
        <HeadRow>
          <UserPic big {...p} style={{height: 144}} />
          <View style={{flex: 1, flexShrink: 1, marginTop: 6}}>
            <RowCentered style={{}}>
              <Text18 style={{flex: 1}} numberOfLines={1}>
                {p.name}
              </Text18>
              <SettingsIcon style={{marginLeft: 20, marginVertical: -4}} />
            </RowCentered>
            <Bio numberOfLines={1} selectable>
              {ages.find(a => a.id >= age).name + ' ' + (bio || '')}
            </Bio>
            <Row>
              <Touch
                onPress={
                  phone
                    ? toggleSets
                    : () => navigate('EditProfile', {phone: '1'})
                }>
                <Bio style={{color: GRAY}} numberOfLines={1} selectable>
                  {phone || 'add contact'}
                </Bio>
              </Touch>
            </Row>
            <RowCentered style={{marginTop: 12}}>
              <Touch onPress={() => navigate('Balance')}>
                <StatCircle style={{backgroundColor: 'white', marginRight: 28}}>
                  {/* <Row> */}
                  {/* <Dollar>$</Dollar> */}
                  <StatNum style={{color: BLUE}}>{balance}</StatNum>
                  {/* </Row> */}
                  <StatCap style={{left: 28, color: BLUE}}>$, balance</StatCap>
                </StatCircle>
              </Touch>
              <Press>
                <StatsComp
                  row
                  num1={stat?.classes || 0}
                  cap1={'classes'}
                  num2={Math.round(stat?.hours || 0)}
                  cap2={'hours'}
                />
              </Press>
            </RowCentered>
          </View>
        </HeadRow>
      </Press>
      {showSets && (
        <PressPopup onPress={toggleSets}>
          <SettingsView style={shadow4}>
            <Touch onPress={() => copytext(email)}>
              <RowCentered style={{paddingVertical: 10}}>
                <SocIcon {...p} />
                <Email numberOfLines={1}>{email}</Email>
              </RowCentered>
            </Touch>
            <Touch onPress={() => navigate('EditProfile')}>
              <Setting>Edit profile</Setting>
            </Touch>
            <Touch onPress={askLogout}>
              <Setting>Log out</Setting>
            </Touch>
          </SettingsView>
        </PressPopup>
      )}
    </>
  );
});

export const StatsComp = ({colored, desc1, desc2, row, ...r}) => {
  let greentx = colored && {color: GREEN},
    Wrap = row ? Row : View;
  return (
    <Wrap {...r}>
      <RowCentered style={desc1 && {flex: 1}}>
        <StatCircle style={colored ? {backgroundColor: BACKGREEN} : statBorder}>
          <StatNum style={greentx}>{Math.round(r.num1)}</StatNum>
          <StatCap style={greentx}>{r.cap1}</StatCap>
        </StatCircle>
        {desc1 && <StatDesc style={greentx}>{desc1}</StatDesc>}
      </RowCentered>
      <RowCentered style={[desc1 && {flex: 1}, !row && {marginTop: 20}]}>
        <StatCircle style={colored ? {backgroundColor: BACKBLUE} : statBorder}>
          <StatNum>{Math.round(r.num2)}</StatNum>
          <StatCap>{r.cap2}</StatCap>
        </StatCircle>
        {desc2 && <StatDesc>{desc2}</StatDesc>}
      </RowCentered>
    </Wrap>
  );
};

let statBorder = {borderColor: BORDERGRAY, borderWidth: 1, marginRight: 28};

export let PressPopup = styled(Press)`
    position: absolute;
    top: 0;
    height: 100%;
    width: ${wwidth}px;
    z-index: 1;
  `,
  SettingsView = styled.View`
    background: white;
    align-self: flex-end;
    min-width: 180px;
    max-width: 240px;
    border-radius: 18px;
    padding: 8px 16px;
    margin: 24px 24px 0 0;
  `,
  Setting = styled(Medium16)`
    color: ${DGRAY};
    padding: 10px 0;
  `;

let HeadRow = styled(Row)`
    padding-right: 24px;
    margin: 0 -24px 0 -4px;
  `,
  Bio = styled(Text14)`
    color: ${DGRAY};
    margin-top: 5px;
  `,
  Email = styled(Text14)`
    color: ${GRAY};
    max-width: 160px;
  `,
  StatCircle = styled.View`
    justify-content: center;
    align-items: center;
    /* background: white */
    width: 50px;
    height: 50px;
    border-radius: 25px;
  `,
  StatNum = styled(Medium18)`
    font-size: ${isIOS ? 19 : 16.5}px;
    color: ${DGRAY};
  `,
  StatCap = styled(Text10)`
    font-size: ${isIOS ? 9 : 8}px;
    color: ${DGRAY};
    position: absolute;
    top: 2px;
    left: 33px;
    z-index: 1;
  `,
  StatDesc = styled(Text14)`
    line-height: ${isIOS ? 15 : 13}px;
    color: ${DGRAY};
    margin-left: 16px;
  `,
  Dollar = styled(Text12)`
    color: ${BLUE};
    margin: 2px 0 0 -2px;
  `;
