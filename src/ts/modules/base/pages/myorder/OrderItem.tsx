import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import {formatFullDate, getPictureResource} from '../../utils/CommonUtils';
import {THEME_COLOR} from '../../utils/Constant';
import {getStatusString} from './viewmodel/MyOrderVM';
import bridge from '../../utils/bridge';
import {getBtnWithStatus} from './OrderViewsUtil';

export function OrderItem(
  orderInfo: OrderInfo,
  index: number,
  onItemClickBtn: (tag: number, orderInfo_: OrderInfo) => void,
) {
  return (
    <TouchableOpacity
      style={styles.itemView}
      key={orderInfo.orderNo}
      onPress={() => {
        bridge.pushUrl('OrderInfo', JSON.stringify({param: orderInfo}));
      }}>
      <View
        style={{
          width: '100%',
          height: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 13,
          paddingRight: 15,
        }}>
        <Text style={{fontSize: 12, color: '#999'}}>
          {formatFullDate(new Date(orderInfo.orderTime))}
        </Text>
        <Text style={{fontSize: 14, color: THEME_COLOR, fontWeight: '500'}}>
          {orderInfo ? getStatusString(orderInfo?.status) : ''}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          paddingRight: 15,
        }}>
        {orderInfo.skuInfo?.map((item_, index_) => {
          return (
            <View style={{flexDirection: 'row'}} key={String(index_)}>
              <Image
                source={getPictureResource(item_?.banner)}
                style={styles.productImage}
              />
              <View style={styles.productInfoContainer}>
                <Text
                  style={styles.productName}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  {item_.title}
                </Text>
                <Text style={styles.productSpec}>{item_.skuDesc}</Text>
              </View>
              <View style={styles.productPriceContainer}>
                <Text style={styles.productPriceCurrent}>¥ {item_.price}</Text>
                <Text style={styles.productSpec}>x{item_.count}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 12,
            alignItems: 'center',
            paddingRight: 15,
          }}>
          <Text style={{fontSize: 12, color: '#999'}}>
            {orderInfo.originalPrice && orderInfo.originalPrice !== 0
              ? '总价￥' + orderInfo.originalPrice
              : ''}
          </Text>
          {orderInfo.originalPrice !== orderInfo.finalPrice && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 12, color: '#999', marginLeft: 10}}>
                实付
              </Text>
              <Text style={{fontSize: 12}}> ￥</Text>
              <Text style={{fontSize: 18, fontWeight: '500', marginTop: -2}}>
                {orderInfo.finalPrice}
              </Text>
            </View>
          )}
        </View>
        {(orderInfo?.status !== 0 ||
          (orderInfo?.status === 0 &&
            orderInfo?.remainingTime > new Date().getTime())) &&
          getBtnWithStatus(orderInfo, onItemClickBtn)}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemView: {
    borderRadius: 12,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 12,
    paddingBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    margin: 12,
  },
  productInfoContainer: {
    flex: 1,
    paddingTop: 12,
  },
  productName: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
    fontWeight: '500',
    includeFontPadding: true,
  },
  productSpec: {
    fontSize: 12,
    color: '#000',
    opacity: 0.4,
    includeFontPadding: true,
  },
  productPriceContainer: {
    alignItems: 'flex-end',
    paddingLeft: 11,
    paddingTop: 12,
  },
  productPriceCurrent: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: true,
    color: '#000000E6',
    marginBottom: 9,
  },
});
