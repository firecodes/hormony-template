import {Image, TouchableWithoutFeedback, View} from 'react-native';
import * as React from 'react';
import {useState} from 'react';
import {getPictureResource} from '../../../utils/CommonUtils';

export function getSource(content: any) {
  if (typeof content !== 'string') {
    return content;
  } else if (content.startsWith('http') || content.startsWith('file')) {
    return {uri: content};
  } else {
    return getPictureResource(content);
  }
}

function LeftImage(props) {
  const [imageHeight, setImageHeight] = useState<number | undefined>(0);

  const handleImageLoad = e => {
    const {width: originWidth, height: originHeight} = e.nativeEvent.source;
    const calculatedHeight = (120 / originWidth) * originHeight;
    setImageHeight(calculatedHeight);
  };

  return (
    <View
      style={{
        marginBottom: 16,
        marginLeft: 16,
      }}>
      <TouchableWithoutFeedback
        style={{}}
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
          onLoad={handleImageLoad}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

export default LeftImage;
