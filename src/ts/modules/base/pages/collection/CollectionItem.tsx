import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import bridge from '../../utils/bridge';
import {formatCommonDate2, getPictureResource} from '../../utils/CommonUtils';
import {THEME_COLOR} from '../../utils/Constant';
import {CollectProductInfo} from '../detail/data/DetailBean';

const CollectionItem = props => {
  function renderLabel(item: CollectProductInfo) {
    return (
      <Text
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 5,
        }}
        numberOfLines={1}
        ellipsizeMode="tail">
        {item.label.map((label, index) => (
          <Text
            key={String(index)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: THEME_COLOR,
                fontSize: 10,
              }}>
              {label}
            </Text>
            {index !== item.label.length - 1 && (
              <Text
                style={{fontSize: 10, color: THEME_COLOR, textAlign: 'center'}}>
                {' '}
                |{' '}
              </Text>
            )}
          </Text>
        ))}
      </Text>
    );
  }

  function renderImage(item: CollectProductInfo) {
    let source = getPictureResource(item.banners[0]);
    return (
      <Image
        source={source}
        style={{
          borderRadius: 12,
          width: 100,
          height: 100,
          objectFit: 'cover',
          marginRight: 20,
        }}
      />
    );
  }

  function renderTags(item: CollectProductInfo) {
    let txt = '';
    item.tags.map((tag, index) => {
      txt += tag;
      if (index !== item.tags.length - 1) {
        txt += ',';
      }
    });
    return (
      <Text
        style={{
          fontSize: 10,
          color: THEME_COLOR,
          borderWidth: 0.5,
          borderRadius: 2,
          marginTop: 6,
          borderColor: THEME_COLOR,
          paddingHorizontal: 1,
          paddingTop: 1,
          marginRight: 8,
        }}
        numberOfLines={1}
        ellipsizeMode={'tail'}>
        {txt}
      </Text>
    );
  }

  function renderPrice(item: CollectProductInfo) {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 8,
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: THEME_COLOR,
            fontWeight: '500',
            fontSize: 10,
            paddingBottom: 1,
          }}>
          {'￥'}
        </Text>
        <Text
          style={{
            color: THEME_COLOR,
            fontWeight: '500',
            fontSize: 16,
            marginLeft: -3,
          }}>
          {item.price}
        </Text>
        {item.dashPrice?.length > 0 && (
          <Text
            style={[
              {
                color: '#999999',
                fontSize: 10,
                paddingBottom: 1.5,
                textDecorationLine: 'line-through',
                textDecorationColor: '#999999',
                marginLeft: 5,
                textDecorationStyle: 'solid',
              },
              {marginLeft: 5},
            ]}>
            {'￥'}
          </Text>
        )}
        <Text
          style={[
            {
              color: '#999999',
              fontSize: 10,
              paddingBottom: 1.5,
              textDecorationLine: 'line-through',
              textDecorationColor: '#999999',
              marginLeft: 5,
              textDecorationStyle: 'solid',
            },
            {marginLeft: -3},
          ]}>
          {item.dashPrice}
        </Text>
      </View>
    );
  }

  function singleItem(item: CollectProductInfo) {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 12,
          padding: 12,
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderRadius: 12,
          marginHorizontal: 16,
          flex: 1,
        }}
        onPress={() => {
          bridge.pushUrl('Detail', JSON.stringify(item));
        }}>
        {renderImage(item)}
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'column',
            flex: 1,
          }}>
          <Text
            style={{
              width: '100%',
              fontSize: 12,
              marginTop: 2,
              marginBottom: 4,
              fontWeight: '500',
              lineHeight: 18,
              color: '#333',
              includeFontPadding: true,
            }}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.title}
          </Text>
          {!item.isOffTheShelf &&
            !!item.label &&
            item.label.length > 0 &&
            renderLabel(item)}
          {!item.isOffTheShelf &&
            !!item.tags &&
            item.tags.length > 0 &&
            renderTags(item)}
          <View style={{flex: 1}}></View>
          {!item.isOffTheShelf && renderPrice(item)}
          {item.isOffTheShelf && (
            <Text style={{fontSize: 12, color: '#00000066'}}>商品已下架</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      {props.showTime && props.item.collectTime && (
        <Text
          style={{
            marginLeft: 16,
            fontSize: 14,
            lineHeight: 20,
            includeFontPadding: true,
            marginBottom: 12,
            marginTop: 4,
          }}>
          {formatCommonDate2(new Date(props.item.collectTime))}
        </Text>
      )}
      {singleItem(props.item)}
    </View>
  );
};

export default CollectionItem;
