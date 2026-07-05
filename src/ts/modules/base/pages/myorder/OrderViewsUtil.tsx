import {Text, TouchableOpacity, View} from 'react-native';
import {THEME_COLOR} from '../../utils/Constant';
import * as React from 'react';
import {
  getBtnsWithStatus,
  ORDER_CHANGE_ADDRESS,
  ORDER_CONTACT_SERVICE,
} from './viewmodel/MyOrderVM';
import {OrderInfo} from '../orderinfo/model/OrderInfo';

export function buttonLeft(
  text: string,
  onClick: () => void,
  fromMyOrderPage: boolean = true,
) {
  return (
    <TouchableOpacity
      key={text}
      style={[
        {
          height: 24,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#999',
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8,
        },
        fromMyOrderPage
          ? {}
          : {
              height: 32,
              borderRadius: 16,
              paddingHorizontal: 20,
            },
      ]}
      onPress={onClick}>
      <Text style={{fontSize: fromMyOrderPage ? 12 : 14}}>{text}</Text>
    </TouchableOpacity>
  );
}

export function buttonCenter(
  text: string,
  onClick: () => void,
  fromMyOrderPage: boolean = true,
) {
  return (
    <TouchableOpacity
      key={text}
      style={[
        {
          height: 24,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: THEME_COLOR,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8,
        },
        fromMyOrderPage
          ? {}
          : {
              height: 32,
              borderRadius: 16,
              paddingHorizontal: 20,
            },
      ]}
      onPress={onClick}>
      <Text style={{fontSize: fromMyOrderPage ? 12 : 14, color: THEME_COLOR}}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export function buttonRight(
  text: string,
  onClick: () => void,
  fromMyOrderPage: boolean = true,
) {
  return (
    <TouchableOpacity
      key={text}
      style={[
        {
          height: 24,
          borderRadius: 12,
          backgroundColor: THEME_COLOR,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8,
        },
        fromMyOrderPage
          ? {}
          : {
              height: 32,
              borderRadius: 16,
              paddingHorizontal: 20,
            },
      ]}
      onPress={onClick}>
      <Text style={{fontSize: fromMyOrderPage ? 12 : 14, color: '#FFF'}}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export function getBtnWithStatus(
  orderInfo: OrderInfo,
  onItemClickBtn: (tag: number, orderInfo_: OrderInfo) => void,
  fromMyOrderPage: boolean = true,
) {
  const btnList = getBtnsWithStatus(orderInfo?.status).filter(
    item =>
      fromMyOrderPage ||
      (item.tag !== ORDER_CHANGE_ADDRESS && item.tag !== ORDER_CONTACT_SERVICE),
  );
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15,
      }}>
      {btnList.map((item, index) => {
        if (index === 0) {
          if (btnList.length === 1) {
            return buttonRight(
              item.text,
              () => {
                onItemClickBtn(item.tag, orderInfo);
              },
              fromMyOrderPage,
            );
          } else {
            return buttonLeft(
              item.text,
              () => {
                onItemClickBtn(item.tag, orderInfo);
              },
              fromMyOrderPage,
            );
          }
        } else if (index === 1) {
          if (btnList.length === 3) {
            return buttonCenter(
              item.text,
              () => {
                onItemClickBtn(item.tag, orderInfo);
              },
              fromMyOrderPage,
            );
          } else {
            return buttonRight(
              item.text,
              () => {
                onItemClickBtn(item.tag, orderInfo);
              },
              fromMyOrderPage,
            );
          }
        } else {
          return buttonRight(
            item.text,
            () => {
              onItemClickBtn(item.tag, orderInfo);
            },
            fromMyOrderPage,
          );
        }
      })}
    </View>
  );
}
