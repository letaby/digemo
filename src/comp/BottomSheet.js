import React, {useCallback} from 'react';
import {StatusBar} from 'react-native';
import {RootSiblingParent} from 'react-native-root-siblings';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {paddBottom, wheight} from '../commons/utils';
import {AbsLoader, handleComponent, ModalBack, Toaster} from '../commons/UI';

// On Android RNGH does not work by default because modals are not located under React Native Root view in native hierarchy. To fix that, components need to be wrapped with gestureHandlerRootHOC (it's no-op on iOS and web).

export default ({load, height = wheight * 0.9, goBack, ...r}) => {
  const backdropComponent = () => <ModalBack onPress={goBack} />,
    onAnimate = useCallback((i1, i2) => i1 > 0 && i2 < 1 && goBack(), []);
  return (
    <RootSiblingParent>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="dark-content" />
      <BottomSheet
        ref={r.reff}
        snapPoints={r.snaps || [1, height]}
        containerHeight={height}
        index={r.index || 1}
        handleHeight={0}
        {...{onAnimate, backdropComponent, handleComponent}}>
        {r.scroll ? (
          <BottomSheetScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 28 + paddBottom,
            }}>
            {r.children}
          </BottomSheetScrollView>
        ) : (
          r.children
        )}
      </BottomSheet>
      {load && <AbsLoader />}
      {Toaster}
    </RootSiblingParent>
  );
};
