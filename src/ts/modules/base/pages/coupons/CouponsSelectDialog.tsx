import React, {memo} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {DialogTitle} from '../../utils/CommonUtils';
import {CouponItem} from './model/CouponModel';
import {renderListItem} from './CouponsPage';
import CouponsSelectDialogVM from './viewmodel/CouponsSelectDialogVM';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../utils/Constant';
import {WindowInfo} from '../../utils/WindowInfo';

const CouponsSelectDialog = memo(
  ({
    totalMoney,
    onSure,
    onClose,
    selCounts,
  }: {
    totalMoney: number;
    onSure?: (selCoupons: CouponItem[], totalMinus: number) => void;
    onClose?: () => void;
    selCounts?: CouponItem[];
  }) => {
    const {dataList, totalMinus, selectedCoupons, setSelectedCoupons} =
      CouponsSelectDialogVM({totalMoney: totalMoney, selCounts: selCounts});
    const {foldStatus} = WindowInfo();

    function closeModel() {
      onClose?.();
    }

    const PriceOnNoSel = () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 12, color: '#333333'}}>可减:</Text>
        <Text style={{fontSize: 12, color: THEME_COLOR, marginRight: -2}}>
          ￥
        </Text>
        <Text style={{fontSize: 16, color: THEME_COLOR}}>0</Text>
      </View>
    );
    const PriceOnHasSel = () => (
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 12, color: '#aaa'}}>
            {'已选' + (selectedCoupons ? selectedCoupons?.length : 0) + '张'}
          </Text>
          <Text style={{fontSize: 12, color: '#333333', marginLeft: 10}}>
            可减:
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: THEME_COLOR,
              marginRight: -2,
              marginBottom: -2,
            }}>
            ￥
          </Text>
          <Text style={{fontSize: 16, color: THEME_COLOR}}>{totalMinus}</Text>
        </View>
      </View>
    );

    function contentView() {
      return (
        <View style={styles.contentView}>
          <View style={{flex: 1, paddingHorizontal: 16}}>
            {DialogTitle('选择优惠券', true, closeModel)}
            <FlatList
              style={{width: '100%', flex: 1, marginTop: 16}}
              data={dataList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.couponID} // 唯一标识
              renderItem={({item, index}) =>
                renderListItem(
                  item,
                  index,
                  true,
                  selectedCoupons,
                  totalMoney,
                  coupon => {
                    setSelectedCoupons(
                      !selectedCoupons ||
                        selectedCoupons.length === 0 ||
                        selectedCoupons[0].couponID !== coupon?.couponID
                        ? [coupon]
                        : undefined,
                    );
                  },
                )
              }
            />
          </View>
          <View
            style={{
              width: '100%',
              height: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 60 + (foldStatus === 1 ? 0 : BottomReactHeight),
              paddingHorizontal: 16,
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'flex-end',
              backgroundColor: '#fff',
              paddingBottom: foldStatus === 1 ? 0 : BottomReactHeight,
            }}>
            {selectedCoupons?.length > 0 ? PriceOnHasSel() : PriceOnNoSel()}
            <TouchableOpacity
              style={{
                marginLeft: 10,
                width: 80,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: THEME_COLOR,
              }}
              onPress={() => {
                onSure?.(selectedCoupons, totalMinus);
              }}>
              <Text style={{color: '#fff'}}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            closeModel();
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}>
            <TouchableWithoutFeedback>{contentView()}</TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  contentView: {
    width: '100%',
    height: 420,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 30,
    paddingTop: 16,
    overflow: 'hidden',
  },
  selButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: THEME_COLOR,
  },
  sureButton: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default CouponsSelectDialog;
