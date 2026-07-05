import React, {useEffect, useState} from 'react';
import {commonListFooter, CommonTitle, Loading} from '../../utils/CommonUtils';

import {
  DeviceEventEmitter,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {ProductCommandVM} from './viewmodel/ProductCommandVM';
import bridge from '../../utils/bridge';
import CommandItem from './CommandItem';
import {ProductInfo} from '../detail/data/DetailBean';
import {ProductSelector} from '../detail/productSelector/ProductSelector';
import {showModal} from '../../utils/ModalUtils';
import {LoginManager} from '../login/LoginManager';

const ProductCommandPage = props => {
  const {
    productCommandList,
    getProductCommandList,
    numberOfCartData,
    addCartData,
    loadingMore,
    isLoading,
    pageNum,
    getAllCartData,
  } = ProductCommandVM(props);
  const [selector, setSelector] = useState<[number, ProductInfo]>([
    0,
    undefined,
  ]);

  const renderCategoryItem = ({item, index}) => (
    <View style={{width: '100%'}}>
      <CommandItem
        item={item}
        setShowSelector={(tag: number, productInfo: ProductInfo) => {
          setSelector([tag, productInfo]);
        }}
      />
    </View>
  );

  function renderSelectorModal() {
    let view = (
      <ProductSelector
        onSureCallback={(
          skuCode: string,
          count: number,
          price: string,
          dashPrice: string,
        ) => {
          if (!LoginManager.isLogin) {
            bridge.pushUrl('Login');
          } else {
            if (selector[0] === 1) {
              addCartData(skuCode, count, selector[1].id, price, dashPrice);
            } else if (selector[0] === 2) {
              bridge.pushUrl(
                'Submit',
                JSON.stringify({
                  items: [
                    {
                      skuCode: skuCode,
                      count: count,
                      productId: selector[1].id,
                      price: price,
                      dashPrice: dashPrice,
                    },
                  ],
                }),
              );
            }
          }
        }}
        dismiss={() => {
          setSelector([0, undefined]);
        }}
        productInfo={selector[1]}
      />
    );
    return showModal(
      view,
      selector[0] !== 0,
      () => {
        setSelector([0, undefined]);
      },
      {
        isFill: true,
        viewHeight: 599,
        expandHeight: 599,
        clickInnerClose: true,
      },
    );
  }

  function renderFooter() {
    return (
      <View style={{width: '100%'}}>
        {commonListFooter(loadingMore, productCommandList)}
      </View>
    );
  }

  useEffect(() => {
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === 'ProComd') {
        getAllCartData();
      }
    });

    return () => {
      onPageShow.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {CommonTitle('', 'black', () => (
        <TouchableOpacity
          style={{overflow: 'visible'}}
          onPress={() => {
            bridge.pushUrl('Cart', '');
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/ic_black_cart.svg')}
            style={{width: 24, height: 24}}
          />
          {LoginManager.isLogin && numberOfCartData > 0 && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#FFF',
                backgroundColor: THEME_COLOR,
                position: 'absolute',
                right: -1,
                top: -1,
              }}></View>
          )}
        </TouchableOpacity>
      ))}
      <FlatList
        data={productCommandList} // 数据源
        renderItem={renderCategoryItem} // 渲染列表项
        keyExtractor={(item, index) => item + '_' + index} // 唯一标识
        style={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!loadingMore && productCommandList?.length >= 4) {
            getProductCommandList(pageNum);
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter()}
      />
      {renderSelectorModal()}
      {isLoading && Loading()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: TopReactHeight,
    paddingBottom: BottomReactHeight,
    backgroundColor: BACKGROUND_COLOR,
  },
  list: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default ProductCommandPage;
