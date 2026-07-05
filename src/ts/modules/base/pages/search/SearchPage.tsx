import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {HistorySearchItem, HotSearchItem} from './data/bean/SearchBean';
import {SearchPageVM} from './data/SearchPageVM';
import bridge from '../../utils/bridge';
import HomeListView from '../home/HomeListView';
import {
  BACKGROUND_COLOR,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {ProductCardItem} from './data/mockData/MockData';
import {RenderCommonDialog, withDelay} from '../../utils/CommonUtils';
import {WindowInfo} from '../../utils/WindowInfo';
import {Toast} from '../../utils/ToastManager';

function SearchPage(props) {
  const [hotSearchList, setHotSearchList] = useState([]);
  const [searchTxt, setSearchTxt] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState<HistorySearchItem[]>([]);
  const [modalDeleteAllVisible, setModalDeleteAllVisible] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  // 创建 ref 关联到 TextInput
  const inputRef = useRef(null);
  const {foldStatus} = WindowInfo();
  const [isLoading, setIsLoading] = useState(true);
  const isInit = useRef(false);

  const [searchResList, setSearchResList] = useState<ProductCardItem[]>([]);

  function onRequestSearchingData(onCallback?: () => void) {
    if (!searchTxt?.trim() || searchTxt?.trim().length === 0) {
      Toast.show('请输入搜索内容');
      return;
    }
    !onCallback && setIsLoading(true);
    SearchPageVM.getSearchResult(searchTxt)
      .then(list => {
        setSearchResList(list);
      })
      .finally(() => {
        onCallback?.();
        !onCallback && setIsLoading(false);
      });
  }

  useEffect(() => {
    let searchKey = props.searchKey;
    setSearchTxt(searchKey);
    SearchPageVM.getHotSearchList().then(data => {
      setHotSearchList(data);
      setIsLoading(false);
      isInit.current = true;
    });
    SearchPageVM.getSearchHistoryList().then(data => {
      setSearchHistory(data);
      setIsLoading(false);
      isInit.current = true;
    });
  }, []);

  useEffect(() => {
    if (isInit.current && searchTxt?.trim().length > 0) {
      doSearch(false, searchTxt?.trim());
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setNativeProps({
            selection: {
              start: searchTxt.length,
              end: searchTxt.length,
            },
          });
        }
      }, 0);
    }
  }, [searchTxt]);

  function renderHotSearchListItem(item: HotSearchItem, index: number) {
    let indexColor = index < 3 ? THEME_COLOR : '#222';
    let defStyle = {color: '#222', fontSize: 14};
    return (
      <TouchableOpacity
        key={String(index)}
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
        activeOpacity={1}
        onPress={() => {
          setSearchTxt(item.label);
        }}>
        <Text style={[defStyle, {color: indexColor}]}>{index + 1 + '. '}</Text>
        <Text style={defStyle}>{item.label}</Text>
        <View style={{flex: 1}} />
        <Text style={defStyle}>{'热度 ' + item.hotRate}</Text>
      </TouchableOpacity>
    );
  }

  function reflushHistoryList(list: HistorySearchItem[]) {
    let showList = [];
    if (!!list) {
      list.forEach(item => {
        showList.push(item);
      });
    }
    setSearchHistory(showList);
  }

  function doSearch(blur: boolean = false, inputSearch?: string) {
    if (
      (!searchTxt?.trim() || searchTxt?.trim().length === 0) &&
      (!inputSearch?.trim() || inputSearch?.trim().length === 0)
    ) {
      Toast.show('请输入搜索内容');
      return;
    }
    // 处理搜索历史列表
    SearchPageVM.addSearchHistory(
      inputSearch && inputSearch.trim().length > 0
        ? inputSearch.trim()
        : searchTxt.trim(),
    ).then(() => {
      SearchPageVM.getSearchHistoryList().then(list => {
        reflushHistoryList(list);
      });
    });

    // 调用 blur() 方法
    if (inputRef.current && blur) {
      inputRef.current.blur();
    }
    // 展示搜索结果列表
    setIsSearchMode(true);
  }

  function renderSearchBar() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 40,
          marginTop: 10,
          alignItems: 'center',
          paddingHorizontal: foldStatus === 1 ? 24 : 16,
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e5e7e9',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (isSearchMode) {
                setIsSearchMode(false);
                setSearchResList([]);
              } else {
                bridge.back('');
              }
            }}>
            <Image
              style={{width: 24, height: 24}}
              source={require('../../../../rawfile/dev/media/icon/ic_left_arrow.svg')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: 12,
            height: 40,
            borderRadius: 20,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: '#e5e7e9',
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/ic_search.svg')}
            style={{width: 16, height: 16, marginLeft: 12, opacity: 0.7}}
          />
          <TextInput
            ref={inputRef}
            style={{
              color: '#282828',
              fontSize: 14,
              flex: 1,
              marginLeft: 10,
              height: '100%',
              alignItems: 'center',
            }}
            cursorColor={THEME_COLOR}
            placeholder={'请输入搜索内容'}
            placeholderTextColor={'#00000064'}
            returnKeyType="search"
            value={searchTxt}
            onSubmitEditing={() => {
              doSearch(true);
            }}
            onChangeText={text => {
              setSearchTxt(text);
            }}
            onFocus={() => {
              setIsSearchMode(false);
            }}
          />
          {/*删除*/}
          {searchTxt?.trim().length > 0 && (
            <TouchableOpacity
              style={{
                paddingLeft: 8,
              }}
              onPress={() => {
                setSearchTxt('');
                setIsSearchMode(false);
              }}>
              <Image
                style={{
                  width: 16,
                  height: 16,
                  opacity: 0.5,
                }}
                source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
              />
            </TouchableOpacity>
          )}
          {/*搜索按钮*/}
          <TouchableOpacity
            onPress={() => {
              if (isSearchMode) {
                withDelay(() => {
                  onRequestSearchingData();
                }, 500).then();
              }
              doSearch();
            }}>
            <Text
              style={{
                color: THEME_COLOR,
                fontSize: 14,
                width: 56,
                marginRight: 6,
                textAlign: 'center',
              }}>
              {'搜索'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderHotSearchTitle() {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 20,
          paddingHorizontal: 14,
        }}>
        <Image
          source={require('../../../../rawfile/dev/media/icon/ic_hot_search.svg')}
          style={{width: 26, height: 26}}
        />
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 4,
          }}>
          {'热搜榜'}
        </Text>
      </View>
    );
  }

  function renderHotSearchList() {
    return (
      <View style={{width: '100%', flex: 1, marginTop: 16}}>
        {hotSearchList.map((item, index) =>
          renderHotSearchListItem(item, index),
        )}
      </View>
    );
  }

  function renderHistorySearchAction() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 40,
          alignItems: 'center',
        }}>
        <Text style={{color: '#282828aa', fontSize: 14}}>{'历史搜索'}</Text>
        <View style={{flex: 1}}></View>
        {!deleteMode && (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.618}
            onPress={() => {
              setDeleteMode(true);
            }}>
            <Image
              source={require('../../../../rawfile/dev/media/icon/ic_delete.svg')}
            />
            <Text style={{color: '#282828aa', fontSize: 14, marginLeft: 4}}>
              {'删除'}
            </Text>
          </TouchableOpacity>
        )}

        {deleteMode && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setModalDeleteAllVisible(true);
              }}>
              <Text
                style={{color: '#282828aa', fontSize: 14, marginHorizontal: 4}}>
                {'全部删除'}
              </Text>
            </TouchableOpacity>
            <View
              style={{width: 1, backgroundColor: '#282828aa', height: 20}}
            />
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              activeOpacity={0.618}
              onPress={() => {
                setDeleteMode(false);
              }}>
              <Text style={{color: '#282828aa', fontSize: 14, marginLeft: 5}}>
                {'完成'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  function renderHistorySearch() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        {renderHistorySearchAction()}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: 10,
            columnGap: 10,
            alignItems: 'flex-start',
          }}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity
              key={item.latestSearch}
              style={{
                backgroundColor: '#e0e0e0',
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              activeOpacity={1}
              onPress={() => {
                if (deleteMode) {
                  let currList = [];
                  searchHistory.forEach(itemList => {
                    if (item.latestSearch !== itemList.latestSearch) {
                      currList.push(itemList);
                    }
                  });
                  SearchPageVM.updateSearchHistoryList(currList).then(() => {
                    SearchPageVM.getSearchHistoryList().then(list => {
                      reflushHistoryList(list);
                    });
                  });
                } else {
                  setSearchTxt(item.label);
                }
              }}>
              <Text style={{fontSize: 14, color: '#282828aa'}}>
                {item.label}
              </Text>
              {deleteMode && (
                <Image
                  source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
                  style={{
                    marginLeft: 5,
                    width: 10,
                    height: 10,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function renderDeleteAllModal() {
    return RenderCommonDialog(
      modalDeleteAllVisible,
      () => {
        setModalDeleteAllVisible(false);
      },
      '确定要清空所有搜索历史吗？',
      '取消',
      '删除',
      () => {
        setModalDeleteAllVisible(false);
      },
      () => {
        SearchPageVM.updateSearchHistoryList([]).then(list => {
          setModalDeleteAllVisible(false);
          setDeleteMode(false);
          reflushHistoryList([]);
        });
      },
    );
  }

  function renderSearchResult() {
    return (
      <HomeListView
        isFromHome={false}
        dataList={searchResList}
        setDataList={setSearchResList}
        requestFunc={onRequestSearchingData}
        searchActionTxt={searchTxt?.trim()}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingTop: TopReactHeight,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      {renderSearchBar()}
      <View
        style={{
          width: '100%',
          flex: 1,
          marginTop: 10,
          paddingHorizontal: foldStatus === 1 ? 8 : 0,
        }}>
        {!isSearchMode && (
          <View style={{width: '100%', flex: 1}}>
            {searchHistory?.length > 0 && renderHistorySearch()}
            {renderHotSearchTitle()}
            {renderHotSearchList()}
          </View>
        )}
        {isSearchMode && renderSearchResult()}
      </View>
      {renderDeleteAllModal()}
      {isLoading && (
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
      )}
    </View>
  );
}

export default SearchPage;
