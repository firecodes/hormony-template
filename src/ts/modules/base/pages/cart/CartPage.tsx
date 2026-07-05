import {
  DeviceEventEmitter,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import bridge from '../../utils/bridge';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import CartItem from './CartItem';
import {CartDto} from '../search/data/mockData/MockData';
import WaterFlowView from '../home/WaterFlowView';
import {CartPageVM} from './viewmodel/CartPageVM';
import {LoginManager} from '../login/LoginManager';
import {
  BACKGROUND_COLOR,
  THEME_COLOR,
  BottomReactHeight,
  TopReactHeight,
} from '../../utils/Constant';
import {BackImage, RenderCommonDialog} from '../../utils/CommonUtils';
import {WindowInfo} from '../../utils/WindowInfo';
import {ProductSelector} from '../detail/productSelector/ProductSelector';
import SelectAllBtn from './SelectAllBtn';
import {showModal} from '../../utils/ModalUtils';

const TITLE_VIEW_HEIGHT = 47;
const PAY_VIEW_HEIGHT = 60;
const BOTTOM_LINE_HEIGHT = 1;

function CartPage(props) {
  const {foldStatus} = WindowInfo();
  const {
    productList,
    getProductList,
    getAllCartData,
    deleteCartData,
    delAllCartData,
    cartData,
    addCartData,
    minusCartData,
    isEdit,
    setIsEdit,
    selGoods,
    setSelGoods,
    isLogin,
    setIsLogin,
    delCartData,
    setDelCartData,
    isDeleteAll,
    setIsDeleteAll,
    totalPrice,
    setTotalPrice,
    changeData,
  } = CartPageVM();
  const [isNeedCloseDel, setIsNeedCloseDel] = useState(false);
  const [showSelector, setShowSelector] = useState(0);
  const [changeProData, setChangeProData] = useState(undefined);
  const CurrentPageName = props.concurrentRoot ? 'Cart' : 'Main';

  useEffect(() => {
    if (changeProData) {
      setShowSelector(1);
    }
  }, [changeProData]);

  function changeSpec(
    cartDto: CartDto,
    skuCode: string,
    count: number,
    skuDesc: string,
  ) {
    cartDto.skuCode = skuCode;
    cartDto.skuDesc = skuDesc;
    cartDto.count = count;
    changeData(cartDto, changeProData.selSkuCode, skuDesc);
    let selGoodsTemp = selGoods.filter(item => {
      if (
        item.productId === changeProData.id &&
        item.skuCode === changeProData.selSkuCode
      ) {
        item.skuCode = skuCode;
        item.skuDesc = skuDesc;
        item.count = count;
      }
      return true;
    });
    setSelGoods([...selGoodsTemp]);
  }

  const addFunc = useCallback(
    (cartDto: CartDto) => {
      addCartData(cartDto);
      const selGoodsTemp = selGoods.map(item => {
        if (
          item.productId === cartDto.productId &&
          item.skuCode === cartDto.skuCode
        ) {
          return {...item, count: cartDto.count};
        }
        return item;
      });
      setSelGoods(selGoodsTemp);
    },
    [selGoods],
  );

  const minusFunc = useCallback(
    (cartDto: CartDto) => {
      minusCartData(cartDto);
      const selGoodsTemp = selGoods.map(item => {
        if (
          item.productId === cartDto.productId &&
          item.skuCode === cartDto.skuCode
        ) {
          return {...item, count: cartDto.count};
        }
        return item;
      });
      setSelGoods(selGoodsTemp);
    },
    [selGoods],
  );

  const delFunc = useCallback((cartDto: CartDto) => {
    setDelCartData(cartDto);
  }, []);

  function renderDeleteDialog() {
    return RenderCommonDialog(
      delCartData !== undefined || (isDeleteAll && selGoods?.length > 0),
      () => {
        isDeleteAll ? setIsDeleteAll(false) : setDelCartData(undefined);
        setIsNeedCloseDel(true);
      },
      '是否确定删除？',
      '我再想想',
      '删除',
      () => {
        isDeleteAll ? setIsDeleteAll(false) : setDelCartData(undefined);
        setIsNeedCloseDel(true);
      },
      () => {
        if (isDeleteAll) {
          delAllCartData(selGoods);
          setSelGoods([]);
          setIsDeleteAll(false);
          setIsEdit(false);
        } else {
          deleteCartData(delCartData);
          let selGoodsTemp = selGoods.filter(item => {
            if (
              item.skuCode === delCartData.skuCode &&
              item.productId === delCartData.productId
            ) {
              return false;
            }
            return true;
          });
          setSelGoods(selGoodsTemp);
          setDelCartData(undefined);
        }
      },
    );
  }

  useEffect(() => {
    getAllCartData();
    productList.length < 8 && getProductList(0);
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === CurrentPageName) {
        getAllCartData();
      }
    });
    let loginStatus = DeviceEventEmitter.addListener('LoginData', param => {
      let loginData = param?.loginData;
      LoginManager.initLoginStatus(loginData);
      setIsLogin(LoginManager.isLogin);
    });
    return () => {
      onPageShow.remove();
      loginStatus.remove();
    };
  }, []);

  useEffect(() => {
    let totalPriceTemp = 0;
    selGoods.map(item => {
      if (item) {
        totalPriceTemp += Number(item.price) * item.count;
      }
    });
    setTotalPrice(totalPriceTemp);
  }, [selGoods, cartData]);

  useEffect(() => {
    let newSelGoods: CartDto[] = [];
    selGoods.forEach((item, index) => {
      cartData.forEach((item_, index_) => {
        if (
          item.productId === item_.productId &&
          item.skuCode === item_.skuCode
        ) {
          newSelGoods.push(item_);
        }
      });
    });
    setSelGoods(newSelGoods);
  }, [cartData]);

  function delAllCart() {
    setIsDeleteAll(true);
  }

  const onSpecClicked = useCallback((item: CartDto) => {
    setChangeProData({
      id: item.productId,
      selSkuCode: item.skuCode,
      selCount: item.count,
    });
  }, []);

  const selectShoppingCartData = useCallback(
    (item: CartDto, select: boolean) => {
      let findItem = null;
      let selGoodsTemp: CartDto[] = selGoods.filter(item_ => {
        if (
          item_.skuCode === item.skuCode &&
          item_.productId === item.productId
        ) {
          findItem = item_;
          return select;
        } else {
          return true;
        }
      });

      if (!findItem && select) {
        selGoodsTemp.push(item);
      }

      setSelGoods(selGoodsTemp);
    },
    [selGoods],
  );

  const EmptyView = () => (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <Image
        source={require('../../../../rawfile/dev/media/icon/cartEmpty.png')}
        style={{
          width: 160,
          height: 144,
          objectFit: 'contain',
          marginBottom: 26,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: '#000000',
          opacity: 0.4,
          marginBottom: 12,
        }}>
        {isLogin ? '购物车空空如也，去逛逛吧~' : '登录后可同步购物车中的商品'}
      </Text>
    </View>
  );

  const memoizedHeader = React.useMemo(
    () => (
      <View style={{flex: 1}}>
        {(!cartData || cartData.length === 0) && (
          <View
            style={{
              width: '100%',
              height: 340,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {EmptyView()}
          </View>
        )}
        {cartData && cartData?.length > 0 && (
          <FlatList
            data={cartData} // 数据源
            renderItem={({item, index}) => (
              <CartItem
                key={item.skuCode + item.productId + '_cart'}
                item={item}
                isEdit={isEdit}
                isNeedCloseDel={isNeedCloseDel}
                setIsNeedCloseDel={setIsNeedCloseDel}
                selectedGoods={selGoods}
                delFunc={delFunc}
                addFunc={addFunc}
                minusFunc={minusFunc}
                selectFunc={selectShoppingCartData}
                onSpecClicked={onSpecClicked}
              />
            )}
            keyExtractor={(item, index) => {
              return item.skuCode + item.productId + index;
            }}
            style={{marginTop: 10}}
          />
        )}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            marginTop: 8,
            marginBottom: 12,
            marginLeft: 7,
          }}>
          商品推荐
        </Text>
      </View>
    ),
    [foldStatus, isEdit, selGoods, cartData, isLogin, isNeedCloseDel],
  );

  const PriceOnHasSelGoods = () => (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingTop: 1.5,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 12, color: '#959496', marginRight: 2}}>
          {'已选' + selGoods.length + '件,'}
        </Text>
        <Text style={{fontSize: 12, color: '#333333'}}>合计:</Text>
        <Text style={{fontSize: 12, color: THEME_COLOR, marginRight: -2}}>
          ￥
        </Text>
        <Text style={{fontSize: 16, color: THEME_COLOR, marginTop: -2.5}}>
          {totalPrice}
        </Text>
      </View>
    </View>
  );

  const PriceOnNoSelGoods = () => (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{fontSize: 12, color: '#333333'}}>合计:</Text>
      <Text style={{fontSize: 12, color: THEME_COLOR, marginRight: -2}}>
        ￥
      </Text>
      <Text style={{fontSize: 16, color: THEME_COLOR}}>0</Text>
    </View>
  );

  const DelBottomBtn = () => (
    <TouchableOpacity
      style={{
        width: 76,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: THEME_COLOR,
      }}
      onPress={() => {
        delAllCart();
      }}>
      <Text style={{fontSize: 14, color: THEME_COLOR, fontWeight: '500'}}>
        删除
      </Text>
    </TouchableOpacity>
  );

  const PayBottomBtn = () => (
    <TouchableOpacity
      style={{
        width: 76,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        borderRadius: 16,
        backgroundColor: THEME_COLOR,
      }}
      onPress={() => {
        if (!isEdit) {
          if (selGoods.length > 0) {
            let itemList = [];
            selGoods.map(item => {
              itemList.push({
                skuCode: item.skuCode,
                count: item.count,
                productId: item.productId,
                price: item.price,
                dashPrice: item.dashPrice,
              });
            });
            bridge.pushUrl(
              'Submit',
              JSON.stringify({items: itemList, isFromCartPage: true}),
            );
          }
        }
      }}>
      <Text style={{fontSize: 14, color: '#FFF', fontWeight: '500'}}>结算</Text>
    </TouchableOpacity>
  );

  const BottomView = () => (
    <View>
      <View style={styles.shadowLine} />
      <View
        style={[
          styles.payView,
          {
            paddingHorizontal: foldStatus === 1 ? 24 : 16,
          },
          props.concurrentRoot
            ? {
                height: PAY_VIEW_HEIGHT + BottomReactHeight,
                paddingBottom: BottomReactHeight,
              }
            : {},
        ]}>
        <SelectAllBtn
          selectAll={selGoods.length === cartData.length}
          selCount={isEdit ? selGoods?.length ?? 0 : -1}
          onSelectChange={curSelAll => {
            let productListTemp = cartData.filter(() => true);
            setSelGoods(curSelAll ? productListTemp : []);
          }}
        />
        <View
          style={{
            height: '100%',
            width: '70%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {!isEdit &&
            (selGoods.length > 0 ? PriceOnHasSelGoods() : PriceOnNoSelGoods())}
          {isEdit ? DelBottomBtn() : PayBottomBtn()}
        </View>
      </View>
    </View>
  );

  const DataList = () => (
    <View
      style={{
        flex: 1,
        width: '100%',
        paddingHorizontal: foldStatus === 1 ? 8 : 0,
      }}>
      <WaterFlowView
        numColumns={foldStatus === 1 ? 4 : 2}
        keyExtractor={(item: any, index: number) =>
          item.skuCode + item.productId + '_list'
        }
        searchResList={productList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={memoizedHeader}
        waterStyle={{paddingTop: 0}}
        onEndReached={() => {
          if (productList.length <= 10) {
            getProductList(1);
          }
        }}
      />
    </View>
  );

  const ManageButton = () => (
    <TouchableOpacity
      style={{paddingVertical: 5}}
      onPress={() => {
        setIsEdit(!isEdit);
      }}>
      <Text style={{fontSize: 14, color: '#666'}}>
        {isEdit ? '退出管理' : '管理'}
      </Text>
    </TouchableOpacity>
  );

  function renderSelector() {
    let view = (
      <ProductSelector
        onSureCallback={(
          skuCode: string,
          count: number,
          price: string,
          dashPrice: string,
          skuDesc: string,
        ) => {
          let curDatas = cartData.filter(
            item =>
              item.skuCode === changeProData.selSkuCode &&
              item.productId === changeProData.id,
          );
          if (curDatas.length > 0) {
            changeSpec(curDatas[0], skuCode, count, skuDesc);
          }
        }}
        selSkuCode={changeProData?.selSkuCode}
        selCount={changeProData?.selCount}
        dismiss={() => {
          setShowSelector(0);
        }}
        productInfo={{id: changeProData?.id}}
      />
    );
    return showModal(
      view,
      showSelector !== 0,
      () => {
        setShowSelector(0);
      },
      {
        isFill: true,
        viewHeight: 599,
        expandHeight: 599,
        clickInnerClose: true,
      },
    );
  }

  return (
    <View
      style={[
        styles.content,
        props.concurrentRoot && (!cartData || cartData.length === 0)
          ? {paddingBottom: BottomReactHeight}
          : {},
      ]}>
      <View
        style={[
          styles.titleView,
          {paddingHorizontal: foldStatus === 1 ? 24 : 16},
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.concurrentRoot && BackImage()}
          <Text
            style={{
              fontSize: props.concurrentRoot ? 20 : 24,
              fontWeight: '500',
            }}>
            购物车
          </Text>
        </View>
        {isLogin && cartData?.length > 0 && ManageButton()}
      </View>

      <View style={styles.contentView}>
        {isLogin ? DataList() : EmptyView()}
      </View>
      {cartData?.length > 0 && (
        <View
          style={
            props.concurrentRoot ? styles.rootBottom : styles.commonBottom
          }>
          {isLogin && BottomView()}
        </View>
      )}
      {renderDeleteDialog()}
      {renderSelector()}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: TopReactHeight,
    backgroundColor: '#F1F3F5',
  },
  titleView: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentView: {
    flex: 1,
    width: '100%',
  },
  suggestTitle: {
    width: '100%',
    height: TITLE_VIEW_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  payView: {
    width: '100%',
    height: PAY_VIEW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginBottom: 1,
    transform: [{rotate: '90deg'}],
  },
  shadowLine: {
    width: '100%',
    height: BOTTOM_LINE_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
  },
  rootBottom: {
    height: PAY_VIEW_HEIGHT + BOTTOM_LINE_HEIGHT + BottomReactHeight,
    paddingBottom: BottomReactHeight,
  },
  commonBottom: {
    height: PAY_VIEW_HEIGHT + BOTTOM_LINE_HEIGHT,
  },
});

export default CartPage;
