import {useEffect, useRef, useState} from 'react';
import {
  HomeRepository,
  IHomeRepository,
} from '../../home/repository/HomeRepository';
import {CategoryData} from '../../home/model/CategoryData';
import {WindowInfo} from '../../../utils/WindowInfo';
import {
  CategoryCollectionRepository,
  Collections,
  ICategoryCollectionRepository,
} from '../repositry/CategoryPageRepositry';

export function CategoryPageVM(props) {
  const {foldStatus} = WindowInfo();
  const repositoryCategory: IHomeRepository = new HomeRepository();
  const repositoryCollection: ICategoryCollectionRepository =
    new CategoryCollectionRepository();
  const [collectionList, setCollectionList] = useState<Collections[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectIndex, setSelectIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoData, setIsNoData] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [topIndex, setTopIndex] = useState(0);

  const getCategoryData = () => {
    repositoryCategory.getCategoryData().then(res => {
      if (res && res.length > 0) {
        setCategoryData(res);
      } else {
        setCategoryData([]);
      }
    });
  };

  const getProductList = (pageNum: number = 0, tag: number = 0) => {
    if (pageNum > 1) {
      //模拟总数只有2页
      return;
    }
    repositoryCollection.getCollectionList(pageNum, tag).then(res => {
      setCollectionList(prev => [
        ...prev,
        ...res,
        ...(foldStatus === 1 ? res : []),
      ]);
    });
  };

  // 初始化加载数据
  useEffect(() => {
    props?.index && setSelectIndex(props?.index);
    getCategoryData();
    collectionList.length < 15 && getProductList(0, topIndex);
  }, []);

  useEffect(() => {
    setCollectionList([]);
    setIsLoading(true);
    if (topIndex === 2) {
      setIsLoading(false);
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      getProductList(0, topIndex);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectIndex, topIndex]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [collectionList.length]);

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    if (!!viewableItems && viewableItems.length > 0) {
      if (viewableItems[0].index > 1) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    }
  });

  // 暴露状态和方法给组件
  return {
    categoryData,
    collectionList,
    setCollectionList,
    getProductList, // 如需分页加载，暴露方法
    selectIndex,
    setSelectIndex,
    isLoading,
    setIsLoading,
    isNoData,
    setIsNoData,
    showScrollTop,
    setShowScrollTop,
    handleViewableItemsChanged,
    topIndex,
    setTopIndex,
    foldStatus,
  };
}
