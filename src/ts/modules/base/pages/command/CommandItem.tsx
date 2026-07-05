import {
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../utils/Constant';
import {getProductInfoTag, ProductInfo} from '../detail/data/DetailBean';
import RnFabricView from '../../../../widget/RnFabricView';
import bridge from '../../utils/bridge';
import {LoginManager} from '../login/LoginManager';
import {WindowInfo} from '../../utils/WindowInfo';

function CommandItem(props) {
  let productInfo: ProductInfo = props.item;
  // 1. 改用useState持久化滑动状态，区分水平/垂直滑动
  const [isSliding, setIsSliding] = useState(false);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const touchStart = useRef({x: 0, y: 0}); // 记录初始x/y坐标
  const {foldStatus} = WindowInfo();

  function renderPrice() {
    return (
      <View style={styles.priceRoot}>
        <Text
          style={{
            marginLeft: -2,
            color: THEME_COLOR,
            marginBottom: 3,
            fontSize: 12,
          }}>
          {'￥'}
        </Text>
        <Text style={styles.price}>{productInfo?.price ?? ''}</Text>
        {productInfo?.dashPrice && productInfo.dashPrice.length > 0 && (
          <Text
            style={[
              {
                fontSize: 10,
                marginLeft: 4,
              },
              styles.decPrice,
            ]}>
            {'￥'}
          </Text>
        )}
        <Text
          style={[
            {
              fontSize: 12,
              marginLeft: -3,
            },
            styles.decPrice,
          ]}>
          {productInfo?.dashPrice}
        </Text>

        <View style={{flex: 1}} />
      </View>
    );
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gesture) => {
      touchStart.current = {x: gesture.x0, y: gesture.y0};
      setIsSliding(false);
      setIsVerticalScroll(false);
      return true;
    },

    onMoveShouldSetPanResponder: (_, gesture) => {
      const dx = gesture.moveX - touchStart.current.x;
      const dy = gesture.moveY - touchStart.current.y;
      const threshold = 5;

      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        setIsSliding(true);
        setIsVerticalScroll(false);
        return true;
      }
      if (Math.abs(dy) > threshold) {
        setIsVerticalScroll(true);
        setIsSliding(false);
        return false;
      }
      return isSliding;
    },

    onPanResponderMove: (_, gesture) => {
      const dx = gesture.moveX - touchStart.current.x;
      const dy = gesture.moveY - touchStart.current.y;
      const threshold = 5;

      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        setIsSliding(true);
        setIsVerticalScroll(false);
      } else if (Math.abs(dy) > threshold) {
        setIsVerticalScroll(true);
        setIsSliding(false);
      }
    },

    onPanResponderRelease: (_, gesture) => {
      const dx = gesture.moveX - touchStart.current.x;
      const dy = gesture.moveY - touchStart.current.y;
      const threshold = 5;

      // 纯点击触发跳转
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
        bridge.pushUrl('Detail', JSON.stringify({productId: productInfo.id}));
      }
      setIsSliding(false);
      setIsVerticalScroll(false);
    },

    onPanResponderTerminationRequest: () => {
      return isVerticalScroll;
    },

    onPanResponderEnd: (_, gesture) => {
      const dx = gesture.moveX - touchStart.current.x;
      const dy = gesture.moveY - touchStart.current.y;
      const threshold = 5;

      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
        bridge.pushUrl('Detail', JSON.stringify({productId: productInfo.id}));
      }
      setIsSliding(false);
      setIsVerticalScroll(false);
    },
  });

  const Banner = ({
    pictures,
    aspectRatio,
  }: {
    pictures: string[];
    aspectRatio: number;
  }) => {
    return (
      <RnFabricView
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
          height: 'auto',
        }}
        src={JSON.stringify({
          nativeViewName: 'SwiperPicture',
          pics: pictures,
          aspectRatio: aspectRatio,
          autoPlay: true,
        })}
        onReceiveData={recvData => {}}
      />
    );
  };

  function renderDetail() {
    return (
      <View style={styles.topRoot}>
        {productInfo?.pictures && (
          <View {...panResponder.panHandlers}>
            {foldStatus === 1 ? (
              <Banner pictures={productInfo?.pictures} aspectRatio={2} />
            ) : (
              <Banner pictures={productInfo?.pictures} aspectRatio={16 / 9} />
            )}
          </View>
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            bridge.pushUrl(
              'Detail',
              JSON.stringify({productId: productInfo.id}),
            );
          }}>
          <View style={{marginBottom: 12}}>
            {renderPrice()}
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
              {productInfo?.title}
            </Text>
            <View style={styles.tagsRoot}>
              {productInfo?.tags && (
                <Text style={styles.tagsText}>
                  {getProductInfoTag(productInfo?.tags)}
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {productInfo?.label?.map((label, index) => (
                  <View
                    key={String(index)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: THEME_COLOR, fontSize: 10}}>
                      {label}
                    </Text>
                    {index !== productInfo?.label?.length - 1 && (
                      <View style={styles.verLine} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function renderBottom() {
    return (
      <View style={styles.bottomRoot}>
        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => {
            if (!LoginManager.isLogin) {
              bridge.pushUrl('Login');
              return;
            }
            bridge.pushUrl('Service', JSON.stringify({productInfo}));
          }}>
          <Image
            style={{width: 20, height: 20, marginBottom: 4}}
            source={require('../../../../rawfile/dev/media/icon/cus_service.png')}
          />
          <Text style={{fontSize: 10, color: '#0000009f'}}>客服</Text>
        </TouchableOpacity>

        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={() => {
            props?.setShowSelector?.(1, productInfo);
          }}
          activeOpacity={0.618}
          style={styles.addToCartButton}>
          <Text style={{color: THEME_COLOR, fontSize: 14, fontWeight: '500'}}>
            {'加入购物车'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.618}
          onPress={() => {
            props?.setShowSelector?.(2, productInfo);
          }}
          style={styles.buyNowButton}>
          <Text style={{color: '#ffffff', fontSize: 14, fontWeight: '500'}}>
            {'立即购买'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const memoizedContent = useMemo(() => {
    return (
      <View style={styles.content}>
        {renderDetail()}
        {renderBottom()}
        <View style={styles.horLine} />
      </View>
    );
  }, [productInfo.id, productInfo.pictures, productInfo.price, productInfo.title, productInfo.tags, productInfo.label]);

  return memoizedContent;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  decPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationColor: '#999',
    marginBottom: 3,
    textDecorationStyle: 'solid',
  },
  priceRoot: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  price: {
    color: THEME_COLOR,
    fontSize: 22,
    marginLeft: -3,
    fontWeight: '500',
  },
  desRoot: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  desTitle: {
    fontSize: 12,
    color: '#999',
    marginRight: 3,
  },
  desContent: {
    height: 26,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  desItem: {
    fontSize: 12,
    color: '#777',
    marginLeft: 3,
  },
  topRoot: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 10,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  tagsRoot: {
    marginHorizontal: 16,
    flexDirection: 'row',
    marginTop: 6,
  },
  tagsText: {
    width: 'auto',
    fontSize: 10,
    color: THEME_COLOR,
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: THEME_COLOR,
    lineHeight: 12,
    paddingHorizontal: 1,
    textAlignVertical: 'center',
    marginRight: 6,
  },
  verLine: {
    marginHorizontal: 4,
    width: 1,
    height: 9,
    backgroundColor: THEME_COLOR,
  },
  horLine: {
    backgroundColor: BACKGROUND_COLOR,
    width: '100%',
    height: 12,
  },
  imageListTitle: {
    fontSize: 14,
    marginVertical: 12,
    paddingVertical: 5,
    marginLeft: 16,
    fontWeight: '500',
  },
  bottomRoot: {
    width: '100%',
    height: 56,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartDot: {
    top: 8,
    right: 8,
    position: 'absolute',
    borderRadius: 3,
    width: 6,
    height: 6,
    backgroundColor: THEME_COLOR,
  },
  serviceButton: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    width: 96,
    height: 32,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000000d',
  },
  buyNowButton: {
    width: 96,
    height: 32,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eee',
    backgroundColor: THEME_COLOR,
    marginRight: 6,
  },
});

export default CommandItem;
