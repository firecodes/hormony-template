import {CollectProductInfo, ProductInfo} from '../data/DetailBean';
import {ProductDetailApis} from '../data/ProductDetailApis';
import {useEffect, useState} from 'react';
import CartDataApi from '../../cart/api/CartDataApi';
import {CartDto} from '../../search/data/mockData/MockData';
import {getPictureResource} from '../../../utils/CommonUtils';
import bridge from '../../../utils/bridge';
import {Toast} from '../../../utils/ToastManager';
import {LoginManager} from '../../login/LoginManager';
import {ViewHistoryManager} from '../../profile/viewHistory/ViewHistoryManager';
import {PREFERENCE_KEY_COLLECTION_LIST} from '../../collection/viewmodel/CollectionsPageVM';

export function DetailPageVM(props) {
  const [cartData, setCartData] = useState<CartDto[]>([]);
  const [numberOfCartData, setNumberOfCartData] = useState<number>(0);
  const [productInfo, setProductInfo] = useState<ProductInfo>(undefined);
  const [isCollect, setIsCollect] = useState(false);

  const getProductDetail = (productId: string, isOffTheShelf?: boolean) => {
    let productInfoTmp: ProductInfo =
      ProductDetailApis.getProductDetail(productId);
    if (isOffTheShelf) {
      productInfoTmp.isOffTheShelf = isOffTheShelf;
    }
    if (!!productInfoTmp) {
      setProductInfo(productInfoTmp);
      bridge.getOhPrefData(res => {
        if (res) {
          let collectList = JSON.parse(JSON.stringify(res)) as string[];
          if (collectList && collectList.length > 0) {
            setIsCollect(collectList.includes(productInfoTmp.id));
          }
        }
      }, PREFERENCE_KEY_COLLECTION_LIST);
      ViewHistoryManager.getInstance().addViewHistory(productId);
    }
  };

  const getPictureRes = (imageName: string) => {
    return getPictureResource(imageName);
  };

  useEffect(() => {
    getAllCartData();
  }, []);

  function getAllCartData() {
    CartDataApi.getInstance()
      .getAllCartData()
      .then(res => {
        setCartData(res);
        setNumberOfCartData(res.length);
      });
  }

  function addCartData(
    skuCode: string,
    count: number,
    productId: string,
    price: string,
    dashPrice: string,
  ) {
    CartDataApi.getInstance()
      .createOrUpdate(skuCode, count, productId, price, dashPrice)
      .then(() => {
        getAllCartData();
      });
  }

  function collectPro(collected: boolean) {
    if (!LoginManager.isLogin) {
      bridge.pushUrl('Login');
      return;
    }
    if (productInfo?.id) {
      let collectProInfo: CollectProductInfo = {
        collectTime: new Date().getTime(),
        ...productInfo,
      };
      bridge.getOhPrefData(res => {
        if (res) {
          let collectList = JSON.parse(res.toString()) as CollectProductInfo[];
          if (collectList && collectList.length > 0) {
            let filterList = collectList.filter(
              item => item.id !== collectProInfo?.id,
            );
            if (collected) {
              filterList = [collectProInfo, ...filterList];
            }
            bridge.setOhPrefData(
              PREFERENCE_KEY_COLLECTION_LIST,
              JSON.stringify(filterList),
            );
          } else {
            bridge.setOhPrefData(
              PREFERENCE_KEY_COLLECTION_LIST,
              JSON.stringify(collected ? [collectProInfo] : []),
            );
          }
        } else {
          if (collected) {
            bridge.setOhPrefData(
              PREFERENCE_KEY_COLLECTION_LIST,
              JSON.stringify([collectProInfo]),
            );
          }
        }
      }, PREFERENCE_KEY_COLLECTION_LIST);
      setIsCollect(collected);
      if (collected) {
        Toast.show('收藏成功，可在“我的收藏”查看和管理哦～', 1000, 'center');
      } else {
        Toast.show('取消收藏成功', 1000, 'center');
      }
    }
  }

  // 暴露状态和方法给组件
  return {
    cartData,
    setCartData,
    getProductDetail,
    getPictureRes,
    getAllCartData,
    numberOfCartData,
    addCartData,
    productInfo,
    setProductInfo,
    isCollect,
    setIsCollect,
    collectPro,
  };
}
