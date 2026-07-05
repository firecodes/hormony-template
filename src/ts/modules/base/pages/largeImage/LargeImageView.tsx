import React, {useRef, useState} from 'react';
import {
  View,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {BACK_BUTTON_COLOR, BottomReactHeight} from '../../utils/Constant';
import bridge from '../../utils/bridge';
import {PictureUtils} from '../../utils/PictureUtils';
import {getPictureResource} from '../../utils/CommonUtils';
import {getSource} from '../service/view/LeftImage';

const {width: screenWidth} = Dimensions.get('window');
const MIN_SCALE = 1;
const MAX_SCALE = 10;

const LargeImageView = props => {
  const uri = props.uri;
  const [scale, setScale] = useState(MIN_SCALE);
  const imageRef = useRef(null);
  const panResponder = useRef(null);
  const initial = useRef({
    scale: MIN_SCALE,
    distance: 0,
    touches: [],
  });

  const [imageHeight, setImageHeight] = useState<number>(0);

  const handleImageLoad = e => {
    const {width: originWidth, height: originHeight} = e.nativeEvent.source;
    const calculatedHeight = (screenWidth / originWidth) * originHeight;
    setImageHeight(calculatedHeight);
  };

  // 初始化手势响应器
  React.useEffect(() => {
    panResponder.current = PanResponder.create({
      // 强制捕获所有触摸事件
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false, // 不允许其他组件中断手势

      onPanResponderGrant: e => {
        const touches = e.nativeEvent.touches;
        initial.current.touches = touches;
        initial.current.scale = scale;

        if (touches.length === 2) {
          initial.current.distance = getDistance(touches);
        }
      },

      onPanResponderMove: e => {
        const touches = e.nativeEvent.touches;
        if (touches.length === 2) {
          const currentDistance = getDistance(touches);
          if (initial.current.distance === 0) {
            initial.current.distance = currentDistance;
            return;
          }

          // 计算缩放比例
          const scaleRatio = currentDistance / initial.current.distance;
          const newScale = initial.current.scale * scaleRatio;

          // 限制缩放范围
          if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
            setScale(newScale);
          }
        }
      },

      onPanResponderRelease: () => {
        initial.current.distance = 0;
        initial.current.touches = [];
      },

      onPanResponderTerminate: () => {
        initial.current.distance = 0;
        initial.current.touches = [];
      },
    });
  }, [scale]);

  // 计算双指距离（确保触摸点顺序正确）
  const getDistance = touches => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.imageContainer}
        {...panResponder.current?.panHandlers}>
        <Image
          ref={imageRef}
          source={getSource(uri)}
          style={{
            resizeMode: 'contain',
            width: screenWidth * scale,
            height: imageHeight * scale,
          }}
          resizeMode="contain"
          onLoad={handleImageLoad}
        />
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => bridge.back('')}>
        <Image
          source={PictureUtils.getIcon('ic_left_arrow_white')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    width: 40,
    height: 40,
    marginTop: 40,
    backgroundColor: BACK_BUTTON_COLOR,
    borderRadius: 20,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
});

export default LargeImageView;
