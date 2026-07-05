import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {formatCommonDate, getPictureResource} from '../../utils/CommonUtils';
import React, {useEffect, useState} from 'react';
import {ProductEvalItem} from './model/EvaluateMockData';
import {WindowInfo} from '../../utils/WindowInfo';

function EvaluationItem(props) {
  const proItem: ProductEvalItem = props.item;
  const rateLight = require('../../../../rawfile/dev/media/icon/eval_light.png');
  const rateDark = require('../../../../rawfile/dev/media/icon/eval_dark.png');
  const {foldStatus} = WindowInfo();
  const [columns, setColumns] = useState(foldStatus === 1 ? 6 : 3);
  const [imageParentW, setImageParentW] = useState(0);

  useEffect(() => {
    setColumns(foldStatus === 1 ? 6 : 3);
  }, [foldStatus]);

  function getAvatar() {
    if (proItem?.userAvatar.toString()?.startsWith('file://')) {
      return {
        uri: proItem?.userAvatar,
        headers: {},
      };
    } else if (
      proItem?.userAvatar.toString()?.startsWith('data:image/png;base64,')
    ) {
      return {
        uri: proItem?.userAvatar,
      };
    } else {
      return getPictureResource(proItem?.userAvatar);
    }
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={[
          styles.content,
          {marginHorizontal: foldStatus === 1 ? 24 : 16},
        ]}>
        <Image source={getAvatar()} style={styles.avatar} />
        <View
          style={{flex: 1}}
          onLayout={event => {
            event.nativeEvent.layout.width !== imageParentW &&
              setImageParentW(event.nativeEvent.layout.width);
          }}>
          <View style={styles.useNameContainer}>
            <Text style={styles.userName}>{proItem?.userName}</Text>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              {[0, 1, 2, 3, 4].map((i, index) => {
                return (
                  <Image
                    key={String(index)}
                    source={proItem.rating > index ? rateLight : rateDark}
                    style={styles.rateIcon}
                  />
                );
              })}
            </View>
          </View>
          <Text style={styles.contentView}>{proItem?.content}</Text>
          <FlatList
            data={proItem?.mediaList} // 数据源
            renderItem={({item, index}) => {
              return (
                <Image
                  key={String(index)}
                  source={
                    item.startsWith('file://') ||
                    item.startsWith('http://') ||
                    item.startsWith('https://')
                      ? {uri: item}
                      : getPictureResource(item)
                  }
                  style={{
                    width: (imageParentW - (columns - 1) * 10) / columns,
                    height: (imageParentW - (columns - 1) * 10) / columns,
                    aspectRatio: 1,
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginLeft: index % columns !== 0 ? 10 : 0,
                    marginBottom:
                      proItem?.mediaList?.length > columns && index < columns
                        ? 10
                        : 0,
                  }}
                />
              );
            }} // 渲染列表项
            numColumns={columns}
            key={columns}
            scrollEnabled={false}
            style={{columnGap: 10, marginVertical: 4}}
            keyExtractor={(item, index) => item + '_' + index} // 唯一标识
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
          <Text style={styles.time}>
            {formatCommonDate(
              proItem?.date ? new Date(proItem.date) : new Date(),
            )}
          </Text>
        </View>
      </View>
      {props.showBotLine && <View style={styles.line} />}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
  },
  useNameContainer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 2,
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
  },
  rateIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 2,
  },
  contentView: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
    textAlignVertical: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
    includeFontPadding: true,
  },
  time: {
    fontSize: 10.5,
    color: '#999',
    lineHeight: 14.5,
    includeFontPadding: true,
    textAlignVertical: 'center',
    width: '100%',
    textAlign: 'right',
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#E1E1E1',
    marginHorizontal: 16,
  },
});

export default EvaluationItem;
