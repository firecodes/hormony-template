import {useEffect, useRef, useState} from 'react';
import {WindowInfo} from '../../../utils/WindowInfo';
import bridge from '../../../utils/bridge';
import {CollectProductInfo} from '../../detail/data/DetailBean';

export const PAGE_SIZE: number = 8;

export const PREFERENCE_KEY_COLLECTION_LIST = 'collect';

export function CollectionsPageVM(props) {
  const {foldStatus} = WindowInfo();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [collectList, setCollectList] = useState<CollectProductInfo[]>([]);
  const [allCollectList, setAllCollectList] = useState<CollectProductInfo[]>(
    [],
  );
  const getCollectList = (pageNum: number = 0) => {
    if (pageNum > 1) {
      //模拟总数只有2页
      return;
    }
    setRefreshing(true);
    getList(pageNum).then(res => {
      setCollectList(prev => [...prev, ...res]);
      setRefreshing(false);
    });
  };

  async function getList(pageNum: number = 0): Promise<CollectProductInfo[]> {
    return new Promise<CollectProductInfo[]>(resolve => {
      let startIndex = pageNum * PAGE_SIZE;
      let endIndex = (pageNum + 1) * PAGE_SIZE;
      if (collectList.length > startIndex) {
        resolve([]);
      }
      if (allCollectList.length > 0) {
        if (allCollectList.length >= endIndex) {
          resolve(allCollectList.slice(startIndex, endIndex));
        } else if (allCollectList.length >= startIndex) {
          resolve(allCollectList.slice(startIndex, allCollectList.length));
        }
        resolve([]);
      } else {
        bridge.getOhPrefData(res => {
          if (res) {
            let collectList = JSON.parse(
              res.toString(),
            ) as CollectProductInfo[];
            setAllCollectList(collectList);
            if (collectList.length >= endIndex) {
              resolve(collectList.slice(startIndex, endIndex));
            } else if (collectList.length >= startIndex) {
              resolve(collectList.slice(startIndex, collectList.length));
            }
            resolve([]);
          } else {
            let defaultItem =
              require('../../../../../rawfile/dev/database/product/product_10004.json').data;
            defaultItem = {
              collectTime: new Date(
                new Date().getTime() - 24 * 60 * 60 * 1000,
              ).getTime(),
              ...defaultItem,
              id: 'product_100020',
              isOffTheShelf: true,
            };
            bridge.setOhPrefData(
              PREFERENCE_KEY_COLLECTION_LIST,
              JSON.stringify([defaultItem]),
            );
            resolve([defaultItem]);
          }
        }, PREFERENCE_KEY_COLLECTION_LIST);
      }
    });
  }

  // 初始化加载数据
  useEffect(() => {
    getCollectList(0);
  }, []);

  // 暴露状态和方法给组件
  return {
    collectList,
    foldStatus,
    getCollectList, // 如需分页加载，暴露方法
    refreshing,
    setRefreshing,
  };
}
