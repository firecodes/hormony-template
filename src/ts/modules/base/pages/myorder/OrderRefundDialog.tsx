import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import CheckBox from '@react-native-community/checkbox';
import {PictureUtils} from '../../utils/PictureUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../utils/Constant';

const reasonList: string[] = [
  '买贵了/少用优惠券',
  '不想要了',
  '空包裹',
  '快递/物流一直未送到',
  '商品破损已拒签',
];

export function OrderRefundDialog(props) {
  const orderInfo: OrderInfo = props.orderInfo;
  const onSureCallback: (orderInfo: OrderInfo) => void = props.onSureCallback;
  const onDismiss: () => void = props.onDismiss;
  const [selReason, setSelReason] = useState('');

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
      }}>
      <View style={styles.contentView}>
        <View style={styles.titleView}>
          <Text style={{fontSize: 18, color: 'black'}}>{'退款原因'}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={styles.closeView}
            onPress={() => {
              onDismiss?.();
            }}>
            <Image
              source={PictureUtils.getIcon('ic_close')}
              style={{
                width: 18,
                height: 18,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 12,
            backgroundColor: '#fff',
            marginTop: 16,
          }}>
          {reasonList.map((item, index) => (
            <View
              key={String(index)}
              style={{
                height: 58,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
              }}>
              <Text>{item}</Text>
              <CheckBox
                disabled={false}
                value={selReason === item}
                style={{width: 20, height: 20}}
                tintColor={'gray'}
                onCheckColor={THEME_COLOR}
                onChange={() => setSelReason(selReason === item ? '' : item)}
              />
            </View>
          ))}
        </View>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={styles.sureButton}
          onPress={() => {
            orderInfo.refundReason = selReason;
            onSureCallback(orderInfo);
            onDismiss?.();
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
            确定
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {
    width: '100%',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: '100%',
    paddingBottom: BottomReactHeight,
  },
  titleView: {
    flexDirection: 'row',
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeView: {
    width: 40,
    height: 40,
    backgroundColor: '#e9e9e9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: BACKGROUND_COLOR,
  },
  sureButton: {
    width: '100%',
    height: 46,
    marginTop: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: THEME_COLOR,
  },
});
