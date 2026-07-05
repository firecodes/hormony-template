import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SearchPageVM} from '../search/data/SearchPageVM';
import WaterFlowView from './WaterFlowView';
import {WindowInfo} from '../../utils/WindowInfo';
import {ProductCardItem} from '../search/data/mockData/MockData';
import {showModal} from '../../utils/ModalUtils';
import {FilterDialog} from './FilterDialog';
import {filterProduct, withDelay} from '../../utils/CommonUtils';
import {THEME_COLOR} from '../../utils/Constant';

function HomeListView(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchFilterList, setSearchFilterList] = useState<ProductCardItem[]>(
    [],
  );
  const [filterModel, setFilterModel] = useState<boolean>(false);
  const {foldStatus} = WindowInfo();
  const [sorts, setSorts] = useState<number>(-1);
  const [showType, setShowType] = useState(true);
  const [filters, setFilters] = useState<[string[], number[][], string[]]>();
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const filterModelRef = useRef(filterModel);
  const searchFilterListRef = useRef(searchFilterList);
  const setDataListRef = useRef(props.setDataList);

  useEffect(() => {
    filterModelRef.current = filterModel;
    searchFilterListRef.current = searchFilterList;
    setDataListRef.current = props.setDataList;
  }, [filterModel, searchFilterList, props.setDataList]);

  useEffect(() => {
    setFilterModel(false);
    setFilters([null, null, null]);
    props?.onSetFilters?.([null, null, null]);
    props.requestFunc &&
      props.requestFunc(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const searchResListTemp: any[] = filterModelRef.current
      ? [...searchFilterListRef.current]
      : [...props.dataList];
    let newList: any[] = onSort(searchResListTemp);
    if (filterModelRef.current) {
      setSearchFilterList(newList);
    } else {
      setDataListRef.current && setDataListRef.current(newList);
    }
  }, [sorts]);

  function onSort(searchResListTemp: any[]) {
    let newList: any[] = [];
    if (sorts || sorts === 0) {
      if (sorts === 0) {
        newList = searchResListTemp.sort((a: any, b: any) => a.price - b.price);
      } else if (sorts === 1) {
        newList = searchResListTemp.sort((a: any, b: any) => b.price - a.price);
      } else if (sorts === 2) {
        newList = searchResListTemp.sort((a: any, b: any) =>
          a.sales - b.sales > 0 ? 1 : -1,
        );
      } else if (sorts === 3) {
        newList = searchResListTemp.sort((a: any, b: any) =>
          b.sales - a.sales > 0 ? 1 : -1,
        );
      }
    }
    return newList?.length > 0 ? newList : searchResListTemp;
  }

  useEffect(() => {
    onFilter();
  }, [filters]);

  function onFilter() {
    setShowFilterDialog(false);
    if (filters && filters.length > 0) {
      let selFilterLogistics: string[] = filters[0];
      let selFilterPrice: number[][] = filters[1];
      let selFilterSpec: string[] = filters[2];
      if (selFilterLogistics || selFilterPrice || selFilterSpec) {
        setFilterModel(true);
        let newList: any[] = onSort(filterProduct(filters, props.dataList));
        setSearchFilterList(newList);
      } else {
        setFilterModel(false);
        setSearchFilterList([]);
      }
    }
  }

  function renderSortItem(title: string, tag: number) {
    return (
      <TouchableOpacity
        onPress={() => {
          setSorts(sorts !== tag ? tag : tag + 1);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: !props.isFromHome ? 70 : undefined,
          }}>
          <Text>{title}</Text>
          <View style={{marginLeft: 3}}>
            <Image
              source={
                (tag === 0 && sorts === 0) || (tag === 2 && sorts === 2)
                  ? require('../../../../rawfile/dev/media/icon/search/sort_red.png')
                  : require('../../../../rawfile/dev/media/icon/search/sort.png')
              }
              style={{
                width: 6,
                height: 4,
                marginBottom: 2,
                transform: [{rotate: '180deg'}],
              }}
            />
            <Image
              source={
                (tag === 0 && sorts === 1) || (tag === 2 && sorts === 3)
                  ? require('../../../../rawfile/dev/media/icon/search/sort_red.png')
                  : require('../../../../rawfile/dev/media/icon/search/sort.png')
              }
              style={{width: 6, height: 4}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderFilterItem() {
    return (
      <TouchableOpacity
        onPress={() => {
          setShowFilterDialog(true);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: filterModel ? THEME_COLOR : '#000'}}>筛选</Text>
          <Image
            source={
              filterModel
                ? require('../../../../rawfile/dev/media/icon/search/filter_red.png')
                : require('../../../../rawfile/dev/media/icon/search/filter.png')
            }
            style={{width: 8, objectFit: 'contain', marginLeft: 3}}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function renderSortTab(paddingLeft?: number) {
    return (
      <View
        style={{
          width: '100%',
          height: 44,
          alignItems: 'center',
          paddingLeft: paddingLeft ?? 31,
          paddingRight: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flex: 1,
            height: 44,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: !props.isFromHome ? 'flex-start' : 'space-between',
          }}>
          {renderSortItem('价格', 0)}
          {renderSortItem('销量', 2)}
          {renderFilterItem()}
        </View>
        {!props.isFromHome && (
          <TouchableOpacity
            style={{marginLeft: 38}}
            onPress={() => {
              setShowType(!showType);
            }}>
            <Image
              source={
                showType
                  ? require('../../../../rawfile/dev/media/icon/search/show_type_switch_grid.png')
                  : require('../../../../rawfile/dev/media/icon/search/show_type_switch_list.png')
              }
              style={{width: 17, objectFit: 'contain'}}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderFilterDialog() {
    return showModal(
      FilterDialog({
        onDismiss: () => {
          setShowFilterDialog(false);
        },
        onSure: (filters_: [string[], number[][], string[]]) => {
          setFilters(filters_);
          props?.onSetFilters?.(filters_);
        },
      }),
      showFilterDialog,
      () => {
        setShowFilterDialog(false);
      },
      {
        isFill: true,
        viewHeight: 600,
        expandHeight: 600,
      },
    );
  }

  function renderLoading() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00000011',
        }}>
        <ActivityIndicator size="large" color="#999" animating={true} />
      </View>
    );
  }

  function getColumns() {
    if (showType) {
      return foldStatus === 1 ? 4 : 2;
    } else {
      return foldStatus === 1 ? 2 : 1;
    }
  }

  function renderList() {
    return (
      <View style={styles.container}>
        {!props?.ListHeaderComponent && renderSortTab()}
        <WaterFlowView
          numColumns={getColumns()}
          searchResList={filterModel ? searchFilterList : props.dataList}
          isLoadingMore={isLoadingMore}
          showType={showType}
          filters={filters}
          key={String(showType)}
          isFromHome={props?.isFromHome}
          ListHeaderComponent={
            !props?.ListHeaderComponent
              ? undefined
              : () => {
                  return (
                    <View style={{width: '100%'}}>
                      {props?.ListHeaderComponent}
                      {renderSortTab(20)}
                    </View>
                  );
                }
          }
          onEndReached={() => {
            if (isLoadingMore) {
              return;
            }
            if (!props.dataList || props.dataList?.length === 0) {
              return;
            }
            let curPageNum = pageNum + 1;
            if (!props.isFromHome && curPageNum < 2) {
              setIsLoadingMore(true);
              SearchPageVM.addSearchResult(
                props.searchActionTxt,
                filterModel ? searchFilterList : props.dataList,
                filters,
                curPageNum,
              ).then(list => {
                if (list.length !== props.dataList?.length) {
                  filterModel
                    ? setSearchFilterList(list)
                    : props.setDataList(list);
                  setPageNum(curPageNum);
                }
                withDelay(() => {
                  setIsLoadingMore(false);
                }, 1000).then();
              });
            } else if (props.isFromHome) {
              setIsLoadingMore(true);
              props.onEndReached?.((resultList: ProductCardItem[]) => {
                setIsLoadingMore(false);
                if (filterModel) {
                  setSearchFilterList(pre => [...pre, ...resultList]);
                }
              });
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderList()}
      {renderFilterDialog()}
      {isLoading && renderLoading()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default HomeListView;
