import {View} from 'react-native';
import {CommonTitle, Loading} from '../../utils/CommonUtils';
import {CategoryListPageVM} from './viewmodel/CategoryListPageVM';
import {useEffect, useState} from 'react';
import WaterFlowView from '../home/WaterFlowView';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  TopReactHeight,
} from '../../utils/Constant';

const CategoryListPage = props => {
  const {productList, getProductList, foldStatus} = CategoryListPageVM({
    tag: props.tag,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [productList.length]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: TopReactHeight,
        paddingBottom: BottomReactHeight,
      }}>
      {CommonTitle(props.title)}
      {isLoading && Loading()}
      {!isLoading && (
        <WaterFlowView
          numColumns={foldStatus === 1 ? 4 : 2}
          keyExtractor={(item: any, index: number) =>
            item.toString() + '_' + index
          }
          waterStyle={{marginTop: 10}}
          searchResList={productList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            setTimeout(() => {
              if (productList.length <= (foldStatus === 1 ? 16 : 10)) {
                getProductList(1);
              }
            }, 200);
          }}
        />
      )}
    </View>
  );
};

export default CategoryListPage;
