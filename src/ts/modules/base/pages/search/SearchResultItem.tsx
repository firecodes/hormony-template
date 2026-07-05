import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ProductCardItem} from './data/mockData/MockData';
import {getPictureResource} from '../../utils/CommonUtils';
import {THEME_COLOR} from '../../utils/Constant';

/**
 * 搜索结果页面
 * @returns {Element}
 * @constructor
 */
const SearchResultItem = props => {
  function renderLabel(item: ProductCardItem) {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 12,
        }}>
        {item.label.map((label, index) => (
          <View
            key={String(index)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: THEME_COLOR, fontSize: 10}}>{label.data}</Text>
            {index !== item.label.length - 1 && (
              <View
                style={{
                  marginHorizontal: 4,
                  width: 1,
                  height: 9,
                  backgroundColor: THEME_COLOR,
                }}
              />
            )}
          </View>
        ))}
      </View>
    );
  }

  function renderImage(item: ProductCardItem) {
    let source = getPictureResource(item.banner);
    return (
      <Image
        source={source}
        style={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomRightRadius: props.showType ? 0 : 12,
          borderBottomLeftRadius: props.showType ? 0 : 12,
          width: props.showType ? '100%' : 100,
          height: 100,
          marginVertical: props.showType ? 0 : 10,
          marginLeft: props.showType ? 0 : 10,
          objectFit: 'cover',
        }}
      />
    );
  }

  function renderPromotion(item: ProductCardItem) {
    let txt = '';
    item.promotion.map((promotion, index) => {
      txt += promotion;
      if (index !== item.promotion.length - 1) {
        txt += ',';
      }
    });
    return (
      <View style={{width: 'auto', flexDirection: 'row'}}>
        <Text
          style={{
            width: 'auto',
            fontSize: 10,
            color: THEME_COLOR,
            borderWidth: 0.5,
            borderRadius: 2,
            marginTop: 6,
            borderColor: THEME_COLOR,
            lineHeight: 12,
            paddingHorizontal: 1,
            textAlignVertical: 'center',
            marginHorizontal: 12,
          }}>
          {txt}
        </Text>
        <View style={{flex: 1, height: 1}}></View>
      </View>
    );
  }

  function renderPrice(item: ProductCardItem) {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 8,
          alignItems: 'flex-end',
          paddingHorizontal: 10,
        }}>
        <Text style={{color: THEME_COLOR, fontSize: 12, paddingBottom: 1}}>
          {'￥'}
        </Text>
        <Text style={{color: THEME_COLOR, fontSize: 18, fontWeight: '500'}}>
          {item.price}
        </Text>
        {item.dashPrice && (
          <Text
            style={{
              color: '#00000064',
              fontSize: 10,
              textDecorationLine: 'line-through',
              textDecorationColor: '#00000064',
              marginLeft: 5,
              marginBottom: 2,
              textDecorationStyle: 'solid',
            }}>
            {'￥' + item.dashPrice}
          </Text>
        )}
      </View>
    );
  }

  function renderSales(item: ProductCardItem) {
    return (
      <Text
        style={{
          color: '#aaa',
          fontSize: 10,
          paddingHorizontal: 12,
          marginTop: 2,
        }}>
        {'已售' + (item.sales > 9999 ? '9999+' : item.sales)}
      </Text>
    );
  }

  function renderItem(item: ProductCardItem) {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          marginBottom: 12,
          backgroundColor: '#fff',
          borderRadius: 12,
          alignItems: 'flex-start',
          flexDirection: props.showType ? 'column' : 'row',
        }}
        onPress={() => {
          props.onClick();
        }}>
        {renderImage(item)}
        <View style={{flex: 1, width: '100%', paddingBottom: 10}}>
          <Text
            style={{
              width: '100%',
              fontSize: 12,
              paddingHorizontal: 12,
              marginTop: 8,
              marginBottom: 4,
              lineHeight: 18,
              textAlignVertical: 'center',
            }}>
            {item.title}
          </Text>
          {!!item.label && item.label.length > 0 && renderLabel(item)}
          {!!item.promotion &&
            item.promotion.length > 0 &&
            renderPromotion(item)}
          <View style={{flex: 1}} />
          {renderPrice(item)}
          {renderSales(item)}
        </View>
      </TouchableOpacity>
    );
  }

  return renderItem(props.item);
};

export default SearchResultItem;
