import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CategoryItem from './CategoryItem';
import {commonListFooter} from '../../utils/CommonUtils';
import {BACKGROUND_COLOR} from '../../utils/Constant';

/**
 * 首页商品集瀑布流
 * @returns {Element}
 * @constructor
 */
const CollectionListView = props => {
  const [refreshing, setRefreshing] = useState(false);
  const waterfallRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const numColumns = props.numColumns ?? 1;

  const renderItem = ({item, index}) => {
    return (
      <View
        key={item.toString() + index}
        style={[styles.item, index % numColumns !== 0 ? {marginLeft: 12} : {}]}>
        <CategoryItem item={item} />
      </View>
    );
  };

  const onRefresh = () => {
    if (props.onRefresh) {
      setRefreshing(true);
      props.onRefresh?.(() => {
        setRefreshing(false);
      });
    }
  };

  const onEndReached = () => {
    // 模拟加载更多数据
    if (!!props.dataList && props.dataList.length < 10) {
      props.onEndReached?.(() => {
        setRefreshing(false);
      });
    }
  };

  function renderEmptyData() {
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 100,
          paddingRight: 10,
        }}>
        <Image
          style={{width: 120, height: 120}}
          source={require('../../../../rawfile/dev/media/icon/ic_search_empty.svg')}
        />
        <Text style={{fontSize: 14, color: '#282828'}}>{'暂无数据'}</Text>
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

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    if (!!viewableItems && viewableItems.length > 0) {
      if (viewableItems[0].index > 1) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  function renderTopButton() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          alignItems: 'flex-end',
          bottom: -12,
          right: -10,
        }}
        onPress={() => {
          waterfallRef.current.scrollToOffset({
            offset: 0,
            animated: true,
          });
        }}>
        <Image
          style={{width: 86, height: 86}}
          source={require('../../../../rawfile/dev/media/icon/ic_back_top_button.png')}
        />
      </TouchableOpacity>
    );
  }

  function renderWaterfall() {
    return (
      <View style={styles.container}>
        <FlatList
          ref={waterfallRef}
          keyExtractor={(item, index) => item.toString() + '_' + index}
          renderItem={renderItem}
          data={props.dataList}
          numColumns={numColumns}
          ListFooterComponent={renderFooter()}
          ListEmptyComponent={renderEmptyData()}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onViewableItemsChanged={handleViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          refreshing={refreshing}
          style={styles.waterfall}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          {...props}
        />
        {showScrollTop && renderTopButton()}
      </View>
    );
  }

  return renderWaterfall();
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR,
  },
  waterfall: {
    flex: 1,
    width: '100%',
    paddingTop: 5,
  },
  item: {
    flex: 1,
  },
  footer: {
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    backgroundColor: BACKGROUND_COLOR,
    textAlign: 'center',
  },
  empty: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  buttonDelete: {
    marginBottom: 20,
  },
});

export default CollectionListView;
