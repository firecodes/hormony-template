import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WaterfallFlow from 'react-native-waterfall-flow';
import SearchResultItem from '../search/SearchResultItem';
import {BACKGROUND_COLOR} from '../../utils/Constant';
import bridge from '../../utils/bridge';

/**
 * 首页列表以及搜索结果组件
 * @returns {Element}
 * @constructor
 */
const WaterFlowView = props => {
  const [refreshing, setRefreshing] = useState(false);
  const waterfallRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const numColumns = props.numColumns ?? 1;
  const filtersRef = useRef(props.filters);
  useEffect(() => {
    filtersRef.current = props.filters;
  }, [props.filters]);

  const renderItem = ({item, index}) => {
    return (
      <View key={item.toString() + index} style={styles.item}>
        <SearchResultItem
          item={item}
          showType={props?.showType === undefined ? true : props?.showType}
          isFromHome={props?.isFromHome}
          onClick={() => {
            if (
              props?.isFromHome &&
              (!filtersRef.current ||
                (!filtersRef.current[0] &&
                  !filtersRef.current[1] &&
                  !filtersRef.current[2]))
            ) {
              bridge.pushUrl(
                'ProComd',
                JSON.stringify({productId: item.productId}),
              );
            } else {
              bridge.pushUrl(
                'Detail',
                JSON.stringify({productId: item.productId}),
              );
            }
          }}
        />
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
    if (!!props.searchResList && props.searchResList.length < 10) {
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
          height: '100%',
          justifyContent: props?.isFromHome ? 'flex-start' : 'center',
          alignItems: 'center',
          paddingBottom: props?.isFromHome ? undefined : 220,
        }}>
        <Image
          style={{width: 160, height: 160}}
          source={require('../../../../rawfile/dev/media/icon/ic_search_empty.svg')}
        />
        <Text style={{fontSize: 12, color: '#00000064'}}>{'暂无数据'}</Text>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View
        style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        {props.isLoadingMore && (
          <ActivityIndicator size="large" color="#999" animating={true} />
        )}
        {!props.isLoadingMore && (
          <View
            style={{
              marginVertical: 10,
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                color: '#999999',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              {'已经到达底部'}
            </Text>
          </View>
        )}
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
      <View style={[styles.container, props.rootStyle ? props.rootStyle : {}]}>
        <WaterfallFlow
          ref={waterfallRef}
          keyExtractor={(item, index) => item.toString() + '_' + index}
          renderItem={renderItem}
          data={props.searchResList}
          numColumns={numColumns}
          ListFooterComponent={renderFooter()}
          ListEmptyComponent={renderEmptyData()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          onRefresh={onRefresh}
          onViewableItemsChanged={handleViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          refreshing={refreshing}
          style={[
            styles.waterfall,
            props.waterStyle ? {...props.waterStyle} : {},
          ]}
          contentContainerStyle={[
            styles.contentContainer,
            props.contentStyle ? {...props.contentStyle} : {},
          ]}
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
    position: 'relative',
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 10,
  },
  waterfall: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    padding: 15,
    flex: 1,
  },
  item: {
    marginHorizontal: 6,
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

export default WaterFlowView;
