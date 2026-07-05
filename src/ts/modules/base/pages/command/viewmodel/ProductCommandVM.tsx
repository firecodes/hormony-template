import {useEffect, useState} from 'react';
import {ProductInfo} from '../../detail/data/DetailBean';
import CartDataApi from '../../cart/api/CartDataApi';
import {withDelay} from '../../../utils/CommonUtils';

export function ProductCommandVM(props) {
  const isMan = props.isMan ?? false;
  const [productCommandList, setProductCommandList] = useState<ProductInfo[]>(
    [],
  );
  const [numberOfCartData, setNumberOfCartData] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(0);

  const getProductCommandList = (pageNumPar: number = 0) => {
    if (pageNumPar > 1) {
      //模拟总数只有2页
      return;
    }
    if (pageNumPar === 0) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }
    withDelay(() => {
      let res: ProductInfo[] = [];
      if (isMan) {
        res = [
          require('../../../../../rawfile/dev/database/product/product_20001.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_20002.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_20003.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_20004.json')
            .data,
        ];
      } else {
        res = [
          require('../../../../../rawfile/dev/database/product/product_10001.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_10002.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_10003.json')
            .data,
          require('../../../../../rawfile/dev/database/product/product_10004.json')
            .data,
        ];
      }

      if (pageNumPar === 0 && props.productId) {
        let paramProIdIndex =
          (Number.parseInt(props.productId.toString().slice(12, 13)) - 1) % 4;
        res = [
          res[paramProIdIndex],
          ...res.filter((item, index) => index !== paramProIdIndex),
        ];
      }
      setProductCommandList(prevState => [...prevState, ...res]);
      setPageNum(pageNumPar + 1);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMore(false);
      }, 100);
    }).then();
  };

  function getAllCartData() {
    CartDataApi.getInstance()
      .getAllCartData()
      .then(res => {
        setNumberOfCartData(res.length);
      });
  }

  function addCartData(
    skuCode_: string,
    count_: number,
    productId_: string,
    price_: string,
    dashPrice_: string,
  ) {
    CartDataApi.getInstance()
      .createOrUpdate(skuCode_, count_, productId_, price_, dashPrice_)
      .then(() => {
        getAllCartData();
      });
  }

  useEffect(() => {
    getAllCartData();
    getProductCommandList(0);
  }, []);

  // 暴露状态和方法给组件
  return {
    productCommandList,
    getProductCommandList,
    setProductCommandList,
    numberOfCartData,
    addCartData,
    loadingMore,
    isLoading,
    pageNum,
    getAllCartData,
  };
}
