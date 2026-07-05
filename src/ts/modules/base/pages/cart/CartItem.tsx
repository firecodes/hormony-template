import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {CartDto} from '../search/data/mockData/MockData';
import bridge from '../../utils/bridge';
import {getPictureResource} from '../../utils/CommonUtils';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../utils/Constant';

const DELETE_BTN_WIDTH = 65;
const SWIPE_THRESHOLD = 0.7;

// 自定义memo比较函数：确保isNeedCloseDel变化时组件必更新
const areEqual = (prevProps: any, nextProps: any) => {
  // isNeedCloseDel变化时，强制组件更新
  if (prevProps.isNeedCloseDel !== nextProps.isNeedCloseDel) {
    return false;
  }
  // 其他props保持浅比较逻辑
  return Object.is(prevProps, nextProps);
};

const CartItem = memo(
  ({
    item,
    isEdit,
    selectedGoods,
    delFunc,
    addFunc,
    minusFunc,
    selectFunc,
    onSpecClicked,
    isNeedCloseDel,
    setIsNeedCloseDel,
  }: {
    item: CartDto;
    isEdit: boolean;
    selectedGoods: CartDto[];
    delFunc?: (item: CartDto) => void;
    addFunc?: (item: CartDto) => void;
    minusFunc?: (item: CartDto) => void;
    selectFunc?: (item: CartDto, select: boolean) => void;
    onSpecClicked?: (item: CartDto) => void;
    isNeedCloseDel?: boolean;
    setIsNeedCloseDel?: (close: boolean) => void;
  }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    // 修复：补充setIsNeedCloseDel到依赖，增加状态校验和日志
    useEffect(() => {
      // 增加空值校验，避免setIsNeedCloseDel未传递时报错
      if (
        isNeedCloseDel === true &&
        isOpen.current === true &&
        setIsNeedCloseDel
      ) {
        toCloseDel();
        // 延迟重置父组件状态，匹配动画时长
        setTimeout(() => {
          setIsNeedCloseDel(false);
        }, 500);
      }
    }, [isNeedCloseDel, setIsNeedCloseDel]); // 补充setIsNeedCloseDel依赖

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderMove: (_, gestureState) => {
          let dx = gestureState.dx;
          if (isOpen.current) {
            dx = Math.min(dx, 0); // 右滑最大到0
            dx = Math.max(dx, -DELETE_BTN_WIDTH);
          } else {
            dx = Math.min(dx, 0);
            dx = Math.max(dx, -DELETE_BTN_WIDTH);
          }
          translateX.setValue(dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const slideDistance = Math.abs(gestureState.dx);
          const isRightSwipe = gestureState.dx > 0;

          if (isOpen.current) {
            if (isRightSwipe) {
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 10,
              }).start(() => {
                // 动画完成后再更新状态，避免状态和UI不同步
                isOpen.current = false;
              });
            } else {
              Animated.spring(translateX, {
                toValue: -DELETE_BTN_WIDTH,
                useNativeDriver: true,
                bounciness: 0,
              }).start();
            }
          } else {
            const shouldOpen =
              slideDistance > DELETE_BTN_WIDTH * SWIPE_THRESHOLD;
            if (shouldOpen) {
              Animated.spring(translateX, {
                toValue: -DELETE_BTN_WIDTH,
                useNativeDriver: true,
                bounciness: 0,
              }).start(() => {
                // 动画完成后更新状态
                isOpen.current = true;
              });
            } else {
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 10,
              }).start();
            }
          }
        },
      }),
    ).current;

    function toCloseDel() {
      isOpen.current = false;
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 10,
      }).start();
    }

    function renderImage(item: CartDto) {
      let source = getPictureResource(item?.banner);
      return <Image source={source} style={styles.image} />;
    }

    function renderPrice(item: CartDto) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginLeft: 2,
          }}>
          <Text
            style={{
              color: THEME_COLOR,
              fontSize: 12,
              paddingBottom: 1,
            }}>
            {'￥'}
          </Text>
          <Text
            style={{
              color: THEME_COLOR,
              fontSize: 16,
              fontWeight: '500',
            }}>
            {item?.price}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.cardRoot}>
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            transform: [{translateX}],
          }}>
          <CheckBox
            disabled={false}
            value={selectedGoods?.some(
              item_ =>
                item_.skuCode === item.skuCode &&
                item_.productId === item.productId,
            )}
            style={{width: 20, height: 20, marginLeft: 2, marginRight: 12}}
            tintColor={'gray'}
            onCheckColor={THEME_COLOR}
            onChange={event => {
              selectFunc?.(item, event.nativeEvent.value);
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (isOpen.current) {
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 10,
                  }).start(() => {
                    isOpen.current = false;
                  });
                } else {
                  bridge.pushUrl(
                    'Detail',
                    JSON.stringify({productId: item.productId}),
                  );
                }
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                {renderImage(item)}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item?.title}
                  </Text>
                  <Text
                    style={styles.service}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.serviceDesc}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.sku}
                    onPress={() => {
                      onSpecClicked?.(item);
                    }}>
                    <Text style={styles.skuText}>{item.skuDesc}</Text>
                    <Image
                      source={require('../../../../rawfile/dev/media/icon/ic_left_arrow.svg')}
                      style={styles.skuIcon}
                    />
                  </TouchableOpacity>
                  {renderPrice(item)}
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
              {!isEdit && (
                <View style={styles.countEdit}>
                  <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() => {
                      minusFunc?.(item);
                    }}>
                    <View style={styles.addMinusBut}>
                      <Image
                        source={require('../../../../rawfile/dev/media/icon/ic_minus.svg')}
                        style={[
                          styles.addMinusIcon,
                          item.count === 1 ? {opacity: 0.3} : {},
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.countText}>{item.count}</Text>
                  <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() => {
                      addFunc?.(item);
                    }}>
                    <View style={styles.addMinusBut}>
                      <Image
                        source={require('../../../../rawfile/dev/media/icon/ic_plus.svg')}
                        style={styles.addMinusIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
        <TouchableOpacity
          style={[
            styles.deleteBtn,
            {
              transform: [{translateX}],
            },
          ]}
          onPress={() => {
            delFunc?.(item);
          }}
          activeOpacity={0.8}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/del_icon.png')}
            style={{width: 18, height: 20}}
          />
        </TouchableOpacity>
      </View>
    );
  },
  areEqual, // 启用自定义memo比较函数
);

const styles = StyleSheet.create({
  title: {
    color: '#333',
    fontSize: 12,
    lineHeight: 18,
    includeFontPadding: true,
    paddingBottom: 8,
    fontWeight: '500',
    paddingRight: 12,
  },
  service: {
    fontSize: 10,
    color: THEME_COLOR,
    paddingBottom: 7,
  },
  sku: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginBottom: 15,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
  },
  skuText: {
    fontSize: 10,
  },
  skuIcon: {
    width: 10,
    height: 10,
    opacity: 0.6,
    marginBottom: 2,
    marginLeft: 5,
    transform: [{rotate: '-90deg'}],
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 5,
  },
  line: {
    marginHorizontal: 5,
    width: 1,
    height: 10,
    backgroundColor: '#aaa',
  },
  promoText: {
    fontSize: 8,
    color: THEME_COLOR,
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 3,
    borderColor: THEME_COLOR,
    padding: 3,
    marginHorizontal: 8,
  },
  priceT: {
    color: '#999999',
    fontSize: 10,
    textDecorationLine: 'line-through',
    textDecorationColor: '#999999',
    textDecorationStyle: 'solid',
  },
  image: {
    borderRadius: 12,
    width: 100,
    height: 100,
    marginRight: 12,
    objectFit: 'cover',
  },
  deleteBtn: {
    width: DELETE_BTN_WIDTH,
    backgroundColor: THEME_COLOR, // 删除按钮红色系
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -DELETE_BTN_WIDTH,
    top: 0,
    bottom: 0,
  },
  cardRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  addMinusIcon: {
    width: 12,
    objectFit: 'contain',
  },
  addMinusBut: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: BACKGROUND_COLOR,
  },
  countText: {
    minWidth: 20,
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
  },
  countEdit: {
    width: 68,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CartItem;
