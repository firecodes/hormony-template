import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {EvaluateVM, PAGE_SIZE} from './viewmodel/EvaluateVM';
import {commonListFooter, CommonTitle, Loading} from '../../utils/CommonUtils';
import EvaluationItem from './EvaluationItem';
import {BottomReactHeight, TopReactHeight} from '../../utils/Constant';
import {WindowInfo} from '../../utils/WindowInfo';

function ProductAllEvalPage(props) {
  const {
    isLoading,
    proAllEval,
    getProAllEval,
    pageNum,
    onRefresh,
    refreshing,
    loadingMore,
  } = EvaluateVM({
    productId: props.productId,
  });
  const {foldStatus, foldable} = WindowInfo();
  const [columns, setColumns] = useState(foldStatus === 1 ? 6 : 3);

  useEffect(() => {
    getProAllEval(true, 0);
  }, [props.productId]);

  function renderFooter() {
    return (
      <View style={{width: '100%'}}>
        {commonListFooter(loadingMore, proAllEval)}
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: TopReactHeight,
        paddingBottom: BottomReactHeight,
      }}>
      {CommonTitle('全部评价')}
      {!refreshing && isLoading && Loading()}
      <FlatList
        data={proAllEval} // 数据源
        renderItem={({item, index}) => {
          return (
            <EvaluationItem
              item={item}
              showBotLine={index !== proAllEval?.length - 1}
            />
          );
        }} // 渲染列表项
        keyExtractor={(item, index) => item + '_' + index} // 唯一标识
        style={styles.list}
        key={String(columns)}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          proAllEval?.length >= pageNum * PAGE_SIZE &&
            getProAllEval(true, pageNum);
        }}
        ListFooterComponent={renderFooter()}
        // ListEmptyComponent={renderEmptyData()}
        onRefresh={onRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleRoot: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    marginVertical: 12,
    paddingVertical: 5,
    marginLeft: 16,
    fontWeight: '500',
  },
  count: {
    fontSize: 12,
    marginVertical: 12,
    paddingVertical: 5,
    marginLeft: 6,
    color: '#00000066',
  },
  rightTitle: {
    fontSize: 12,
    color: '#0000009e',
    marginRight: 6,
  },
  rightArrow: {
    width: 6,
    height: 12,
    opacity: 0.4,
    marginRight: 16,
    transform: [{rotate: '180deg'}],
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#E1E1E1',
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
    width: '100%',
  },
});

export default ProductAllEvalPage;
