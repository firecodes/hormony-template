import {BannerData} from '../model/BannerData';
import {SearchData} from '../model/SearchData';
import {useEffect, useState} from 'react';
import {HomeRepository, IHomeRepository} from '../repository/HomeRepository';
import {CategoryData} from '../model/CategoryData';
import {ProductCardItem} from '../../search/data/mockData/MockData';
import {filterProduct} from '../../../utils/CommonUtils';

export function HomePageVM() {
  const repository: IHomeRepository = new HomeRepository();
  // 用状态管理数据（供View使用）
  // 定义所有状态，遵循 Hooks 顶层调用规则
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [bannerData, setBannerData] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  const getSearchData = () => {
    repository.getSearchData().then(res => {
      if (res && res.length > 0) {
        setSearchData(res);
      } else {
        setSearchData([]);
      }
    });
  };

  const getBannerData = () => {
    repository.getBannerData().then(res => {
      if (res && res.length > 0) {
        setBannerData(res);
      } else {
        setBannerData([]);
      }
    });
  };

  const getCategoryData = () => {
    repository.getCategoryData().then(res => {
      if (res && res.length > 0) {
        setCategoryData(res);
      } else {
        setCategoryData([]);
      }
    });
  };

  // 初始化加载数据
  useEffect(() => {
    getSearchData();
    getBannerData();
    getCategoryData();
  }, []);

  // 暴露状态和方法给组件
  return {
    searchData,
    bannerData,
    categoryData,
  };
}

export function HomePageProductVM() {
  const repository: IHomeRepository = new HomeRepository();
  // 用状态管理数据（供View使用）
  // 定义所有状态，遵循 Hooks 顶层调用规则
  const [homeProductList, setHomeProductList] = useState<ProductCardItem[]>([]);

  const getHomeProductList = (
    pageNum: number = 0,
    finishCallback?: (resultList: ProductCardItem[]) => void,
    filters?: [string[], number[][], string[]],
  ) => {
    if (pageNum > 1) {
      //模拟总数只有2页
      finishCallback?.([]);
      return;
    }
    repository.getProductList(pageNum).then(res => {
      if (!filters) {
        setHomeProductList(prev => [...prev, ...res]);
      } else {
        let filterRes = filterProduct(filters, res);
        finishCallback?.(filterRes);
      }
    });
  };

  // 暴露状态和方法给组件
  return {
    homeProductList,
    getHomeProductList,
    setHomeProductList,
  };
}
