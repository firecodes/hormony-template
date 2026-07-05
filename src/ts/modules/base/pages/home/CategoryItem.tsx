import {Image, Text, TouchableOpacity, View} from 'react-native';
import {getPictureResource} from '../../utils/CommonUtils';
import bridge from '../../utils/bridge';
import React from 'react';
import {Collections} from '../category/repositry/CategoryPageRepositry';

const CategoryItem = props => {
  function renderImage(item: Collections) {
    let source = getPictureResource(item.icon);
    return (
      <Image
        source={source}
        style={{
          borderRadius: 12,
          width: '100%',
          height: undefined,
          aspectRatio: 1,
        }}
      />
    );
  }

  function renderItem(item: Collections) {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          marginBottom: 12,
          alignItems: 'flex-start',
        }}
        onPress={() => {
          bridge.pushUrl(
            'CategoryList',
            JSON.stringify({title: item.title, tag: item.tag}),
          );
        }}>
        {renderImage(item)}
        <Text
          style={{
            width: '100%',
            fontSize: 12,
            marginTop: 7,
            textAlign: 'center',
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

  return renderItem(props.item);
};

export default CategoryItem;
