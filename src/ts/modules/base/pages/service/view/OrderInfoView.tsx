import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import * as React from 'react';
import {THEME_COLOR} from '../../../utils/Constant';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import {CartDto} from '../../search/data/mockData/MockData';
import {getPictureResource} from '../../../utils/CommonUtils';

function OrderInfoView(props) {
  const orderInfo: OrderInfo = props?.data?.content
    ? JSON.parse(props.data.content)
    : undefined;

  function renderOrderInfo(cartDto: CartDto, index: number) {
    return (
      <View
        key={String(index)}
        style={{
          width: '100%',
          flexDirection: 'row',
          overflow: 'hidden',
          paddingHorizontal: 10,
        }}>
        <Image
          source={getPictureResource(cartDto.banner)}
          style={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            borderRadius: 12,
            marginVertical: 10,
          }}
        />
        <View
          style={{
            marginLeft: 12,
            paddingRight: 12,
            backgroundColor: '#FFF',
            justifyContent: 'space-between',
            marginVertical: 12,
            flex: 1,
          }}>
          <View>
            <Text
              style={{
                width: '100%',
                fontSize: 12,
                lineHeight: 18,
                includeFontPadding: false,
              }}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {cartDto.title}
            </Text>
            <Text style={{color: THEME_COLOR, fontSize: 10, marginTop: 4}}>
              {cartDto.serviceDesc}
            </Text>
          </View>
          {renderPrice(cartDto)}
        </View>
      </View>
    );
  }

  function renderPrice(cartDto: CartDto) {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: THEME_COLOR,
            fontSize: 12,
            marginBottom: 3,
            marginLeft: -2,
          }}>
          {'￥'}
        </Text>
        <Text
          style={{
            color: THEME_COLOR,
            fontSize: 22,
            marginLeft: -3,
            fontWeight: '500',
          }}>
          {cartDto?.price}
        </Text>
        {cartDto?.dashPrice && cartDto?.dashPrice !== cartDto?.price && (
          <Text
            style={{
              color: '#999',
              textDecorationLine: 'line-through',
              textDecorationColor: '#999',
              marginBottom: 3,
              textDecorationStyle: 'solid',
              fontSize: 12,
              marginLeft: 4,
            }}>
            {'￥'}
          </Text>
        )}
        {cartDto?.dashPrice && cartDto?.dashPrice !== cartDto?.price && (
          <Text
            style={[
              {
                color: '#999',
                textDecorationLine: 'line-through',
                textDecorationColor: '#999',
                marginBottom: 3,
                textDecorationStyle: 'solid',
              },
              {
                fontSize: 12,
                marginLeft: -3,
              },
            ]}>
            {cartDto?.dashPrice}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#FFF',
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          props.onOrderClick?.(orderInfo);
        }}>
        <View>
          {orderInfo?.skuInfo?.map((value: CartDto, index: number) =>
            renderOrderInfo(value, index),
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default OrderInfoView;
