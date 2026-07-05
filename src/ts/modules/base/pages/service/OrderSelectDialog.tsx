import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PictureUtils} from '../../utils/PictureUtils';
import {
  BACK_BUTTON_COLOR,
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../utils/Constant';
import OrderApi from '../myorder/OrderApi';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import OrderItem from './view/OrderItem';

export function OrderSelectDialog(props) {
  const onSureCallback: (orderInfo: OrderInfo) => void = props.onSureCallback;
  const dismiss: () => void = props.dismiss;
  const [orderInfoList, setOrderInfoList] = useState<OrderInfo[]>([]);
  const [selectOrderIndex, setSelectOrderIndex] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    OrderApi.getInstance()
      .getAll()
      .then(orderList_ => {
        orderList_ = orderList_.sort((a, b) => b.orderTime - a.orderTime);
        setOrderInfoList(orderList_);
      });
  }, []);

  function renderItem(orderInfo: OrderInfo, index: number) {
    return (
      <OrderItem
        key={orderInfo.orderNo}
        orderInfo={orderInfo}
        index={index}
        selectIndex={selectOrderIndex}
        onItemSelect={(index: number) => {
          setSelectOrderIndex(prev => (prev === index ? undefined : index));
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 30,
        paddingHorizontal: 16,
        height: '100%',
        paddingBottom: BottomReactHeight,
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          width: '100%',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, color: 'black'}}>{'订单选择'}</Text>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            backgroundColor: BACK_BUTTON_COLOR,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            dismiss?.();
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

      <View style={{flex: 1, width: '100%', marginTop: 20}}>
        {orderInfoList && orderInfoList.length > 0 ? (
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            {orderInfoList?.map((item, index) => renderItem(item, index))}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#999'}}>暂无数据</Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            width: '100%',
            marginTop: 10,
            height: 46,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 23,
            backgroundColor:
              selectOrderIndex !== undefined ? THEME_COLOR : '#00000066',
          }}
          disabled={selectOrderIndex === undefined}
          onPress={() => {
            if (selectOrderIndex !== undefined) {
              onSureCallback(orderInfoList[selectOrderIndex]);
              dismiss?.();
            }
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
            发送
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
