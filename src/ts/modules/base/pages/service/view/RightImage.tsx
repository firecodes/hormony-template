import {Image, TouchableWithoutFeedback, View} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import {getPictureResource} from '../../../utils/CommonUtils';
import {getSource} from './LeftImage';

function RightImage(props) {
  const [imageHeight, setImageHeight] = useState<number>(0);

  const handleRightImageLoad = e => {
    setImageHeight(
      (120 / e.nativeEvent.source.width) * e.nativeEvent.source.height,
    );
  };

  return (
    <View
      style={{
        marginBottom: 16,
        marginRight: 16,
        alignSelf: 'flex-end',
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          props.onImageClick?.(props.data.content);
        }}>
        <Image
          source={getSource(props.data.content)}
          style={{
            width: 120,
            height: imageHeight,
            objectFit: 'contain',
            borderRadius: 12,
          }}
          resizeMode={'contain'}
          onLoad={handleRightImageLoad}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

export default RightImage;
