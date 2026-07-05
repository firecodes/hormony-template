import {Image, Text, View} from 'react-native';
import * as React from 'react';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import {formatFullDate, getPictureResource} from '../../../utils/CommonUtils';
import CheckBox from '@react-native-community/checkbox';
import {THEME_COLOR} from '../../../utils/Constant';

const OrderItem: React.FC<{
  orderInfo: OrderInfo;
  index: number;
  selectIndex: number | undefined;
  onItemSelect: (index: number) => void;
}> = ({orderInfo, index, selectIndex, onItemSelect}) => {
  return (
    <View
      style={{
        borderRadius: 12,
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 16,
        paddingBottom: 16,
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        overflow: 'hidden',
        paddingHorizontal: 13,
      }}>
      <View
        style={{
          width: '100%',
          height: 40,
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 12, color: '#999'}}>
          {formatFullDate(new Date(orderInfo.orderTime))}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          flex: 1,
        }}>
        <CheckBox
          value={index === selectIndex}
          style={{width: 20, height: 20}}
          onCheckColor={THEME_COLOR}
          animationDuration={0}
          onValueChange={(value: boolean) => onItemSelect(index)}
        />
        <View style={{flex: 1, paddingRight: 15}}>
          {orderInfo.skuInfo?.map((item_, index_) => {
            return (
              <View
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}
                key={String(index_)}>
                <Image
                  source={getPictureResource(item_?.banner)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    margin: 12,
                  }}
                />
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 8,
                      lineHeight: 18,
                      fontWeight: '500',
                      includeFontPadding: true,
                    }}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {item_.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#000',
                      opacity: 0.4,
                      includeFontPadding: true,
                    }}>
                    {item_.skuDesc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default React.memo(OrderItem);
