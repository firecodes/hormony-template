import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as React from 'react';
import bridge from '../../utils/bridge';
import {CategoryPageVM} from './viewmodel/CategoryPageVM';
import {useEffect, useRef, useState} from 'react';
import {
  BACKGROUND_COLOR,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {BackImage, Loading} from '../../utils/CommonUtils';
import {WindowInfo} from '../../utils/WindowInfo';
import CollectionListView from '../home/CollectionListView';

function CategoryPage(props) {
  const {
    categoryData,
    collectionList,
    getProductList,
    selectIndex,
    setSelectIndex,
    isLoading,
    showScrollTop,
    topIndex,
    setTopIndex,
    foldStatus,
  } = CategoryPageVM(props);
  const waterfallRef = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [columns, setColumns] = useState(foldStatus === 1 ? 4 : 2);

  useEffect(() => {
    setColumns(foldStatus === 1 ? 4 : 2);
  }, [foldStatus]);

  const renderCategoryItem = ({item, index}) => (
    <View style={styles.leftItem}>
      <TouchableOpacity
        style={styles.leftContent}
        onPress={() => {
          setSelectIndex(index);
        }}>
        <Text
          style={{
            color: selectIndex === index ? THEME_COLOR : '#666666',
            fontSize: 14,
          }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </View>
  );

  function topButton() {
    return (
      <TouchableOpacity
        style={styles.topButton}
        onPress={() => {
          waterfallRef.current.scrollToOffset({
            offset: 0,
            animated: true,
          });
        }}>
        <Image
          style={styles.topButtonImage}
          source={require('../../../../rawfile/dev/media/icon/ic_back_top_button.png')}
        />
      </TouchableOpacity>
    );
  }

  function topTabView(title: string, index: number) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setTopIndex(index);
          scrollViewRef.current.scrollTo({
            x: index === 0 ? 0 : index * 90 + 10,
            animated: true,
          });
        }}>
        <View
          style={[
            {
              backgroundColor: '#fff',
              height: 32,
              width: 90,
              borderRadius: 15,
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            },
            topIndex === index
              ? {backgroundColor: THEME_COLOR}
              : {backgroundColor: '#fff'},
          ]}>
          <Text
            style={[
              {fontSize: 12},
              topIndex === index ? {color: '#fff'} : {color: '#999'},
            ]}>
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.content}>
      <View
        style={[
          styles.categoryTitleView,
          {paddingHorizontal: foldStatus === 1 ? 24 : 16},
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.concurrentRoot && BackImage()}
          <Text
            style={{
              fontSize: props.concurrentRoot ? 20 : 24,
              fontWeight: '500',
            }}>
            分类
          </Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            bridge.pushUrl('Search');
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/ic_search_filled.svg')}
            style={{width: 40, height: 40}}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.container}>
        <View style={{width: foldStatus === 1 ? 121 : 100, paddingRight: 14}}>
          <FlatList
            data={categoryData} // 数据源
            renderItem={renderCategoryItem} // 渲染列表项
            keyExtractor={(item, index) => item + '_' + index} // 唯一标识
            style={styles.leftList}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingRight: foldStatus === 1 ? 24 : 16,
          }}>
          <View
            style={{
              width: '100%',
              marginBottom: 5,
              marginTop: 7,
            }}>
            <ScrollView
              horizontal={true}
              ref={scrollViewRef}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              showsHorizontalScrollIndicator={false}>
              <View style={{flexDirection: 'row', height: 40}}>
                {topTabView('男士系列', 0)}
                {topTabView('女士系列', 1)}
                {topTabView('儿童系列', 2)}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              width: '100%',
            }}>
            {isLoading ? (
              Loading()
            ) : (
              <CollectionListView
                numColumns={columns}
                key={columns}
                keyExtractor={(item: any, index: number) =>
                  item.toString() + '_' + index
                }
                dataList={collectionList}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  if (collectionList.length <= 10) {
                    getProductList(1, topIndex);
                  }
                }}
              />
            )}
          </View>
        </View>
      </View>
      {showScrollTop && topButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: TopReactHeight,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  categoryTitleView: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  leftList: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  rightList: {
    width: '100%',
    paddingLeft: 3,
  },
  topButton: {
    position: 'absolute',
    alignItems: 'flex-end',
    bottom: -12,
    right: -10,
  },
  topButtonImage: {
    width: 86,
    height: 86,
  },
  footer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodata: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  nodataText: {
    fontSize: 12,
    color: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  empty: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 120,
    height: 120,
  },
  emptyText: {
    fontSize: 14,
    color: '#282828',
  },
  leftItem: {
    flex: 1,
    height: 48,
    width: '100%',
  },
  leftContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});
export default CategoryPage;
