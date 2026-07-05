import {
  HistoryModel,
  HistorySearchItem,
  HotSearchItem,
} from './bean/SearchBean';
import {
  HISTORY_SEARCH_MOCK,
  HOT_SEARCH_MOCK,
  MOCK_PRODUCT_LIST,
  MOCK_PRODUCT_LIST1,
  ProductCardItem,
} from './mockData/MockData';
import {HttpUtils} from '../../../utils/httpUtils';
import {filterProduct} from '../../../utils/CommonUtils';

export class SearchPageVM {
  static _history: HistoryModel = new HistoryModel();
  static _isInit: boolean = false;
  static _refreshTimes: number = 0;

  /**
   * 获取热搜榜
   */
  static getHotSearchList(): Promise<HotSearchItem[]> {
    const list = HOT_SEARCH_MOCK;
    return HttpUtils._simulateDelay(list);
  }

  static getSearchHistoryList(): Promise<HistorySearchItem[]> {
    if (!SearchPageVM._isInit) {
      SearchPageVM._history.list = HISTORY_SEARCH_MOCK;
      SearchPageVM._isInit = true;
    }
    return HttpUtils._simulateDelay(SearchPageVM._history.list);
  }

  static addSearchHistory(label: string) {
    const newSearch: HistorySearchItem = {
      label,
      latestSearch: new Date().getTime(),
    };
    const idx = SearchPageVM._history.list.findIndex(
      item => item.label === label,
    );
    if (idx >= 0) {
      SearchPageVM._history.list.splice(idx, 1);
    }
    SearchPageVM._history.list.unshift(newSearch);
    return Promise.resolve();
  }

  static updateSearchHistoryList(list: HistorySearchItem[]) {
    SearchPageVM._history.list = list;
    return Promise.resolve();
  }

  static getSearchResult(searchTxt: string): Promise<ProductCardItem[]> {
    let list: ProductCardItem[] = [];
    MOCK_PRODUCT_LIST.forEach(item => {
      if (!searchTxt || item.title.indexOf(searchTxt) >= 0) {
        list.push(item);
      }
    });
    return HttpUtils._simulateDelay(list);
  }

  static addSearchResult(
    searchTxt: string,
    defList: ProductCardItem[],
    filters: [string[], number[][], string[]],
    curPageNum: number,
  ): Promise<ProductCardItem[]> {
    if (curPageNum > 1) {
      return HttpUtils._simulateDelay(defList);
    }
    let list: ProductCardItem[] = [];
    if (defList.length > 0) {
      defList.map(item1 => {
        list.push(item1);
      });
    }
    let mockList = curPageNum === 0 ? MOCK_PRODUCT_LIST : MOCK_PRODUCT_LIST1;
    if (filters) {
      mockList = filterProduct(filters, mockList);
    }
    mockList.forEach(item => {
      if (item.title.indexOf(searchTxt) >= 0) {
        list.push(item);
      }
    });
    return HttpUtils._simulateDelay(list);
  }
}
