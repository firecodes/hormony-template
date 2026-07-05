import {OrderInfo} from './model/OrderInfo';
import React, {useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {PictureUtils} from '../../utils/PictureUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../utils/Constant';
import bridge from '../../utils/bridge';
import {Toast} from '../../utils/ToastManager';
import {formatFullDate} from '../../utils/CommonUtils';

export function LogisticsDialog(props) {
  const order: OrderInfo = props.orderInfo;
  const onDismiss: () => void = props.onDismiss;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 30,
        paddingBottom: BottomReactHeight,
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
            {'XX快递'}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              bridge.copyText(order?.logisticsCode, () => {
                Toast.show('复制成功!');
              });
            }}>
            <Text
              style={{
                width: 36,
                height: 20,
                borderWidth: 1,
                borderColor: THEME_COLOR,
                borderRadius: 10,
                fontSize: 10,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: THEME_COLOR,
                marginLeft: 8,
              }}>
              复制
            </Text>
          </TouchableWithoutFeedback>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#e9e9e9',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontWeight: '500',
          }}>
          {order.logisticsCode}
        </Text>
        <View
          style={{
            width: '100%',
            borderRadius: 12,
            marginTop: 16,
          }}>
          {order?.logisticsStatus?.map((item, index) => (
            <View
              key={String(index)}
              style={{
                minHeight: 59,
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  minHeight: 59,
                  marginRight: 18,
                }}>
                <View
                  style={{
                    height: 13,
                    width: 13,
                    borderRadius: 6.5,
                    borderWidth: 0.5,
                    borderColor: index === 0 ? THEME_COLOR : '#00000033',
                    backgroundColor: index === 0 ? THEME_COLOR : '#00000033',
                  }}
                />
                {index !== order.logisticsStatus.length - 1 && (
                  <Image
                    source={require('../../../../rawfile/dev/media/icon/dash_line.svg')}
                    style={{
                      height:
                        (order?.logisticsStatus?.length === 4 && index === 0) ||
                        (order?.logisticsStatus?.length === 5 && index === 1)
                          ? 64
                          : 47,
                      objectFit: 'cover',
                      alignSelf: 'center',
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  minHeight: 59,
                  flexDirection: 'column',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: index === 0 ? THEME_COLOR : '#999999',
                      fontWeight: '500',
                      marginRight: 18,
                    }}>
                    {item[0]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: index === 0 ? THEME_COLOR : '#999999',
                      fontWeight: '500',
                      marginRight: 18,
                    }}>
                    {formatFullDate(new Date(item[2]), 1)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#999999',
                    marginTop: 5,
                    marginBottom: 24,
                    marginRight: 16,
                  }}>
                  {item[1]}
                </Text>
              </View>
            </View>
          ))}
        </View>
        {order.deliveryPersonPhone && (
          <TouchableOpacity
            style={{
              width: '100%',
              height: 46,
              borderRadius: 23,
              backgroundColor: THEME_COLOR,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.7}
            onPress={() => {
              order.deliveryPersonPhone &&
                bridge.callPhone(order.deliveryPersonPhone);
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#fff',
                fontWeight: '500',
              }}>
              联系快递员
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
