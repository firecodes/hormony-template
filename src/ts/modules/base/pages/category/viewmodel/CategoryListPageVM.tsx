import {useEffect, useState} from 'react';
import {
  MOCK_PRODUCT_LIST,
  MOCK_PRODUCT_LIST1,
  ProductCardItem,
} from '../../search/data/mockData/MockData';
import {WindowInfo} from '../../../utils/WindowInfo';

export function CategoryListPageVM(props) {
  const tag = props.tag;
  const {foldStatus} = WindowInfo();
  // 用状态管理数据（供View使用）
  // 定义所有状态，遵循 Hooks 顶层调用规则
  const [productList, setProductList] = useState<ProductCardItem[]>([]);

  const getProductList = (pageNum: number = 0) => {
    if (pageNum > 1) {
      //模拟总数只有2页
      return;
    }
    getList(pageNum, tag).then(res => {
      setProductList(prev => [
        ...prev,
        ...res,
        ...(foldStatus === 1 ? res : []),
      ]);
    });
  };

  async function getList(
    pageNum: number = 0,
    tag: number = 0,
  ): Promise<ProductCardItem[]> {
    const getManTag = (title: string) => {
      if (title?.startsWith('男士')) {
        return title;
      } else if (title?.startsWith('女士')) {
        return title.replace('女士', '男士');
      } else {
        return '男士' + title;
      }
    };

    const getLadyTag = (title: string) => {
      if (title?.startsWith('女士')) {
        return title;
      } else if (title?.startsWith('男士')) {
        return title.replace('男士', '女士');
      } else {
        return '女士' + title;
      }
    };

    return new Promise(resolve => {
      let resData = JSON.parse(
        JSON.stringify(pageNum === 0 ? MOCK_PRODUCT_LIST : MOCK_PRODUCT_LIST1),
      ) as ProductCardItem[];
      if (tag === 0) {
        resData.forEach(item => {
          item.title = getManTag(item.title);
          item.banner = item.banner.replace('mock_', 'mock2_');
          item.productId = item.productId.replace('product_10', 'product_20');
        });
        resolve(resData);
      } else if (tag === 1) {
        resData.forEach(item => {
          item.title = getLadyTag(item.title);
          item.banner = item.banner.replace('mock2_', 'mock_');
          item.productId = item.productId.replace('product_20', 'product_10');
        });
        resolve(resData);
      } else {
        resolve([]);
      }
    });
  }

  // 初始化加载数据
  useEffect(() => {
    getProductList(0);
  }, []);

  // 暴露状态和方法给组件
  return {
    productList,
    foldStatus,
    getProductList, // 如需分页加载，暴露方法
  };
}
