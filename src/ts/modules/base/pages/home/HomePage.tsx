import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import * as React from 'react';
import bridge from '../../utils/bridge';
import {memo, useCallback, useEffect, useState} from 'react';
import HomeSearchView from '../../view/HomeSearchView';
import {HomePageProductVM, HomePageVM} from './viewmodel/HomePageVM';
import {SearchData} from './model/SearchData';
import {CategoryData} from './model/CategoryData';
import {BACKGROUND_COLOR, TopReactHeight} from '../../utils/Constant';
import {WindowInfo} from '../../utils/WindowInfo';
import RnFabricView from '../../../../widget/RnFabricView';
import HomeListView from './HomeListView';
import {ProductCardItem} from '../search/data/mockData/MockData';

function HomePage(props) {
  const {foldStatus, foldable} = WindowInfo();
  const {searchData, bannerData, categoryData} = HomePageVM();

  // 渲染列表项
  function RenderWaterFlow(header: {(): React.JSX.Element; (): any}) {
    const {homeProductList, getHomeProductList, setHomeProductList} =
      HomePageProductVM();
    const [filters, setFilters] = useState<[string[], number[][], string[]]>();
    const [pageNum, setPageNum] = useState(0);

    function onRequestHomeData(onCallback?: () => void) {
      getHomeProductList(pageNum);
      onCallback?.();
    }

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: foldStatus === 1 ? 8 : 0,
        }}>
        <HomeListView
          isFromHome={true}
          dataList={homeProductList}
          setDataList={setHomeProductList}
          ListHeaderComponent={header()}
          onSetFilters={(f?: [string[], number[][], string[]]) => {
            f !== filters && setFilters(f);
          }}
          requestFunc={onRequestHomeData}
          onEndReached={(
            finishCallback: (resultList: ProductCardItem[]) => void,
          ) => {
            setPageNum(pageNum + 1);
            getHomeProductList(pageNum + 1, finishCallback, filters);
          }}
        />
      </View>
    );
  }

  const HomeSearch = memo(({searchData}: {searchData: SearchData[]}) => {
    // 搜索组件点击处理函数
    const handleSearchClick = (key: SearchData) => {
      bridge.pushUrl('Search', JSON.stringify({searchKey: key.content}));
    };

    return (
      <HomeSearchView data={searchData} handleSearchClick={handleSearchClick} />
    );
  });

  const HomeBanner = memo(
    ({bannerData, foldStatus}: {bannerData: string[]; foldStatus: number}) => {
      return (
        <RnFabricView
          style={{
            width: '100%',
            aspectRatio: foldStatus === 1 ? 2 : 16 / 9,
            height: 'auto',
            borderRadius: 15,
            overflow: 'hidden',
          }}
          src={JSON.stringify({
            nativeViewName: 'SwiperPicture',
            pics: bannerData,
            aspectRatio: foldStatus === 1 ? 2 : 16 / 9,
          })}
          onReceiveData={recvData => {}}
        />
      );
    },
  );

  const HomeCategory = memo(
    ({
      categoryData,
      foldStatus,
      foldable,
    }: {
      categoryData: CategoryData[];
      foldStatus: number;
      foldable: boolean;
    }) => {
      return (
        <CategoryButtons
          data={categoryData}
          isCompleteShow={!foldable || foldStatus === 1}
          numOfRow={5}
        />
      );
    },
  );

  const CategoryButtons = ({data, isCompleteShow, numOfRow}) => {
    const [lines, setLines] = useState([]);
    const [windowW, setWindowW] = useState(0);
    const [buttonWidth, setButtonWidth] = useState<DimensionValue>(0);

    useEffect(() => {
      if (windowW !== 0) {
        let buttonW = isCompleteShow
          ? (((1 / numOfRow) * windowW) as DimensionValue)
          : (((1 / (numOfRow - 0.5)) * windowW) as DimensionValue);
        setButtonWidth(buttonW);
        let curLine = numOfRow;
        let curLineArr = [];
        let mLines = [];
        data.map((item, index) => {
          if (index < curLine) {
            curLineArr.push(item);
          }
          if (index === curLine - 1) {
            mLines.push(curLineArr);
            curLineArr = [];
            curLine += numOfRow;
          }
        });
        setLines(mLines);
      }
    }, [numOfRow, isCompleteShow, windowW]);

    const buttonContent = () => {
      return (
        <View style={styles.category1}>
          {buttonWidth > 0 &&
            lines.map((item1, index1) => (
              <View style={styles.categoryRow} key={index1}>
                {item1.map((item, index) => (
                  <TouchableOpacity
                    key={index + 1 + (index1 + 1)}
                    onPress={() => {
                      bridge.pushUrl(
                        'Category',
                        JSON.stringify({index: index1 * 5 + index}),
                      );
                    }}
                    style={[styles.categoryButton, {width: buttonWidth}]}>
                    <Image source={item.iconUrl} style={styles.categoryIcon} />
                    <Text style={styles.categoryText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
        </View>
      );
    };

    return (
      <View
        style={{width: '100%'}}
        onLayout={e => {
          setWindowW(e.nativeEvent.layout.width);
        }}>
        {!isCompleteShow ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.category}>
            {buttonContent()}
          </ScrollView>
        ) : (
          <View style={styles.category}>{buttonContent()}</View>
        )}
      </View>
    );
  };

  const RenderSectionHeader = memo(
    ({
      bannerData,
      categoryData,
      foldStatus,
      foldable,
    }: {
      bannerData: string[];
      categoryData: CategoryData[];
      foldStatus: number;
      foldable: boolean;
    }) => {
      const [contentWidth, setContentWidth] = useState(0);
      return (
        <View
          key={'header'}
          style={{width: '100%', paddingHorizontal: 6, marginTop: 12}}
          onLayout={event => {
            setContentWidth(event.nativeEvent.layout.width - 12);
          }}>
          <View style={{width: contentWidth}}>
            {contentWidth > 0 && (
              <HomeBanner bannerData={bannerData} foldStatus={foldStatus} />
            )}
            {contentWidth > 0 && (
              <HomeCategory
                categoryData={categoryData}
                foldStatus={foldStatus}
                foldable={foldable}
              />
            )}
          </View>
        </View>
      );
    },
  );

  const memoizedHeader = useCallback(
    () => (
      <RenderSectionHeader
        bannerData={bannerData}
        categoryData={categoryData}
        foldStatus={foldStatus}
        foldable={foldable}
      />
    ),
    [bannerData, categoryData, foldStatus, foldable],
  );

  return (
    <View style={styles.content}>
      <View
        style={[
          styles.homeTitleView,
          {paddingLeft: foldStatus === 1 ? 24 : 16},
        ]}>
        <Text style={styles.homeTitle}>首页</Text>
      </View>
      <HomeSearch searchData={searchData} />
      {RenderWaterFlow(memoizedHeader)}
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
  homeTitleView: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: '500',
  },
  homeSearchView: {
    height: 52,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  homeSearchIcon: {
    width: 18,
    height: 18,
    marginHorizontal: 10,
    opacity: 0.6,
  },
  homeSearchText: {
    flex: 1,
    fontSize: 13,
    textAlignVertical: 'center',
    color: '#555555',
  },
  category: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 13,
  },
  category1: {
    flexDirection: 'column',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#999999',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // 确保在最上层
  },
  loadingContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;
