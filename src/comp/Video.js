import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components/native';
import Video from 'react-native-video';
import {Medium16, Press, shadow2} from '../commons/UI';
import {wwidth} from '../commons/utils';

export default ({source, hasAccess}) => {
  const [paused, setPaused] = useState(!hasAccess),
    rest0 = 3,
    [rest, setRest] = useState(rest0),
    videoref = useRef();

  const toggle = useCallback(() => hasAccess && setPaused(!paused), [paused]);

  const onProgress = useCallback(
    ({currentTime: curr, seekableDuration: dur}) => {
      let restSec = Math.round(dur - curr);
      setRest(restSec || rest0);
    },
    [],
  );

  return (
    <StoryPress onPress={toggle}>
      <Video
        ref={videoref}
        {...{source, paused, onProgress}}
        progressUpdateInterval={1000}
        style={{width: wwidth, height: 1.5 * wwidth}}
        repeat
        resizeMode="cover"
      />
      <Medium16
        style={{
          position: 'absolute',
          bottom: 16,
          right: 24,
          color: 'white',
          ...shadow2,
        }}>
        00:{rest < 9 ? '0' + rest : rest}
      </Medium16>
    </StoryPress>
  );
};

let StoryPress = styled(Press)`
  width: ${wwidth}px;
  height: ${1.5 * wwidth}px;
  justify-content: center;
  align-items: center;
  margin: 0 -14px;
`;
