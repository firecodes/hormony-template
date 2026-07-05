import {FlatList, Image, Text, View} from 'react-native';
import {
  commonListFooter,
  CommonTitle,
  formatCommonDate2,
  Loading,
} from '../../utils/CommonUtils';
import {CollectionsPageVM, PAGE_SIZE} from './viewmodel/CollectionsPageVM';
import React, {useEffect, useRef, useState} from 'react';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  TopReactHeight,
} from '../../utils/Constant';
import CollectionItem from './CollectionItem';
import {CollectProductInfo} from '../detail/data/DetailBean';

const CollectionPage = props => {
  const {collectList, refreshing, setRefreshing} = CollectionsPageVM(props);
  const [isLoading, setIsLoading] = useState(true);
  const waterfallRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
  }, [collectList.length]);

  function renderEmptyData() {
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 220,
          paddingRight: 10,
        }}>
        <Text style={{fontSize: 14, color: '#00000064'}}>{'暂无数据'}</Text>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View style={{width: '100%'}}>
        {commonListFooter(refreshing, props.dataList)}
      </View>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: CollectProductInfo;
    index: number;
  }) => {
    return (
      <View key={item.toString() + index} style={{}}>
        <CollectionItem
          item={item}
          showTime={
            index === 0 ||
            formatCommonDate2(new Date(item.collectTime)) !==
              formatCommonDate2(new Date(collectList[index - 1].collectTime))
          }
        />
      </View>
    );
  };

  const onEndReached = () => {
    // 模拟加载更多数据
    if (!!props.dataList && props.dataList.length < 10) {
      props.onEndReached?.(() => {
        setRefreshing(false);
      });
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: TopReactHeight,
        paddingBottom: BottomReactHeight,
      }}>
      {CommonTitle('我的收藏')}
      {isLoading && Loading()}
      {!isLoading && (
        <FlatList
          ref={waterfallRef}
          keyExtractor={(item, index) => item.toString() + '_' + index}
          renderItem={renderItem}
          data={collectList}
          numColumns={1}
          ListFooterComponent={renderFooter()}
          ListEmptyComponent={renderEmptyData()}
          onEndReached={onEndReached}
          refreshing={refreshing}
          style={{
            flex: 1,
            width: '100%',
            paddingTop: 5,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CollectionPage;
