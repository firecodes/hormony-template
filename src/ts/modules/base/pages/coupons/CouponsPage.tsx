import {
  Animated,
  FlatList,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {CommonTitle} from '../../utils/CommonUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import bridge from '../../utils/bridge';
import CouponsVM from './viewmodel/CouponsVM';
import {CouponItem} from './model/CouponModel';
import {ReductionTypes, ScenarioStatus} from './mockData/Types';
import {getScenarioStatus} from './mockData/Service';
import CheckBox from '@react-native-community/checkbox';
import {WindowInfo} from '../../utils/WindowInfo';
import {getTag} from '../profile/MyPointPage';

export function renderListItem(
  coupon: CouponItem,
  index: number,
  isSelect: boolean = false,
  selectedId: CouponItem[] = [],
  totalMoney: number = 0,
  onSelect?: (coupon: CouponItem) => void,
) {
  const _status: ScenarioStatus = getScenarioStatus(coupon, totalMoney);
  const canNotUse =
    _status === ScenarioStatus.HAS_USED || _status === ScenarioStatus.EXPIRE;

  const getResource = () => {
    if (_status === ScenarioStatus.HAS_USED) {
      return require('../../../../rawfile/dev/media/icon/ic_coupon_used.svg');
    } else if (_status === ScenarioStatus.EXPIRE) {
      return require('../../../../rawfile/dev/media/icon/ic_coupon_expired.svg');
    }
  };

  const getTagView = () => {
    return <Image source={getResource()} style={styles.disableIcon} />;
  };

  return (
    <View
      style={[
        styles.itemView,
        {opacity: isSelect && _status === ScenarioStatus.LESS_FULL ? 0.5 : 1},
      ]}>
      <View style={styles.itemLeft}>
        {coupon?.amountRule.discountType ===
        ReductionTypes.DISCOUNT_REDUCTION ? (
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: THEME_COLOR,
              lineHeight: 28,
              includeFontPadding: true,
            }}>
            {(Number(coupon?.amountRule.discountCoefficient) * 10).toFixed(1)}
            <Text
              style={{
                fontWeight: '300',
                fontSize: 12,
              }}>
              折
            </Text>
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 12,
              color: THEME_COLOR,
            }}>
            ￥
            <Text
              style={{
                fontWeight: '500',
                color: THEME_COLOR,
                includeFontPadding: true,
                lineHeight: 28,
                fontSize: 24,
              }}>
              {coupon.amountRule.discountAmount}
            </Text>
          </Text>
        )}
        <Text
          style={{
            fontSize: 10,
            lineHeight: 18,
            includeFontPadding: true,
            color: THEME_COLOR,
            marginTop: 2,
          }}>
          {getTag(coupon.amountRule)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '48%',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 14, fontWeight: '500'}}>
          {coupon.couponName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: THEME_COLOR,
            marginTop: 6,
          }}>
          全品类可用
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: THEME_COLOR,
            marginTop: 4,
          }}>
          {coupon.endTime + ' 23:59' + ' 到期'}
        </Text>
      </View>
      {!isSelect ? (
        <TouchableOpacity
          disabled={canNotUse}
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !canNotUse ? 1 : 0,
          }}
          onPress={() => {
            bridge.pushUrl('Category', '');
          }}>
          <Text style={styles.itemButton}>使用</Text>
        </TouchableOpacity>
      ) : (
        <View style={{width: '24%', alignItems: 'flex-end'}}>
          <CheckBox
            disabled={canNotUse || _status === ScenarioStatus.LESS_FULL}
            value={
              selectedId.filter(item => item.couponID === coupon.couponID)
                .length > 0
            }
            style={{
              width: 20,
              height: 20,
              marginRight: 16,
              opacity:
                !canNotUse && _status !== ScenarioStatus.LESS_FULL ? 1 : 0,
            }}
            tintColor={'gray'}
            onCheckColor={THEME_COLOR}
            onChange={() => onSelect(coupon)}
          />
        </View>
      )}
      {canNotUse && getTagView()}
    </View>
  );
}

function CouponsPage(props) {
  const {selectTab, setSelectTab, dataList} = CouponsVM();
  const {foldStatus} = WindowInfo();

  const [itemLayouts, setItemLayouts] = useState<
    Array<{x: number; width: number}>
  >(Array(4).fill({x: 0, width: 0}));

  // 动画值
  const barTranslateX = useRef(new Animated.Value(0)).current;

  // 底部条动画（选中切换时）
  useEffect(() => {
    const targetLayout = itemLayouts[selectTab];
    if (targetLayout) {
      Animated.parallel([
        Animated.timing(barTranslateX, {
          toValue: targetLayout.x,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectTab, itemLayouts]);

  // 记录标签布局信息
  const handleItemLayout = (index: number) => (e: LayoutChangeEvent) => {
    const {x, width} = e.nativeEvent.layout;
    setItemLayouts(prev => {
      const newLayouts = [...prev];
      newLayouts[index] = {x: x + 15, width: width - 30};
      return newLayouts;
    });
  };

  function topTab(title: string, index: number) {
    return (
      <TouchableOpacity
        style={[
          {
            paddingHorizontal: 15,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        onLayout={handleItemLayout(index)}
        onPress={() => {
          setSelectTab(index);
        }}>
        <Text
          style={
            selectTab !== index
              ? {
                  color: '#999',
                }
              : {}
          }>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.content}>
      {CommonTitle('优惠券')}
      <View
        style={{
          paddingHorizontal: foldStatus === 1 ? 24 : 16,
          flex: 1,
          width: '100%',
        }}>
        <View
          style={[
            styles.tabView,
            {paddingHorizontal: foldStatus === 1 ? 170 : 0},
          ]}>
          {topTab('全部', 0)}
          {topTab('可用', 1)}
          {topTab('已用', 2)}
          {topTab('已过期', 3)}
          <Animated.View
            style={[
              styles.animView,
              {
                width: itemLayouts?.[selectTab].width ?? 28,
                transform: [{translateX: barTranslateX}],
              },
            ]}
          />
        </View>
        <FlatList
          style={{width: '100%', flex: 1, paddingBottom: 16, marginTop: 16}}
          data={dataList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.couponID} // 唯一标识
          renderItem={({item, index}) => renderListItem(item, index)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: TopReactHeight,
    paddingBottom: BottomReactHeight,
    backgroundColor: BACKGROUND_COLOR,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  itemView: {
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    height: 89,
    marginBottom: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemLeft: {
    flexDirection: 'column',
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemButton: {
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 5,
    textAlign: 'center',
    color: '#fff',
    textAlignVertical: 'center',
  },
  disableIcon: {
    width: 80,
    height: 80,
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.1,
  },
  tabView: {
    width: '100%',
    height: 40,
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  animView: {
    width: 28,
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: THEME_COLOR,
    position: 'absolute',
    bottom: 0,
  },
});

export default CouponsPage;
