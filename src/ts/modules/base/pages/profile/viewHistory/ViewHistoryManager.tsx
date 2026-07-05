import bridge from '../../../utils/bridge';
import {ProductInfo} from '../../detail/data/DetailBean';
import {ProductDetailApis} from '../../detail/data/ProductDetailApis';
import {ViewHistoryModel} from './model/ViewHistoryModel';

export const PREFERENCE_KEY_VIEW_HISTORY_LIST = 'view_history';

export class ViewHistoryManager {
  private static instance: ViewHistoryManager | undefined;

  private constructor() {}

  public static getInstance() {
    if (!ViewHistoryManager.instance) {
      ViewHistoryManager.instance = new ViewHistoryManager();
    }
    return ViewHistoryManager.instance;
  }

  addViewHistory(productId: string) {
    this.getViewHistory().then(res => {
      let hisList: ViewHistoryModel[] = [];
      let productInfoTmp: ProductInfo =
        ProductDetailApis.getProductDetail(productId);
      let curVH: ViewHistoryModel = {
        id: productInfoTmp.id,
        banners: productInfoTmp.banners,
        title: productInfoTmp.title,
        price: productInfoTmp.price,
        viewTime: new Date().getTime(),
      };
      if (!!res) {
        hisList = res as ViewHistoryModel[];
        hisList = hisList.filter(item => item.id !== productId);
        hisList = [curVH, ...hisList];
      } else {
        hisList = [curVH];
      }
      bridge.setOhPrefData(PREFERENCE_KEY_VIEW_HISTORY_LIST, hisList);
    });
  }

  getViewHistory(): Promise<ViewHistoryModel[]> {
    let res = new Promise<ViewHistoryModel[]>((resolve, reject) => {
      bridge.getOhPrefData(
        res => {
          resolve(res as ViewHistoryModel[]);
        },
        PREFERENCE_KEY_VIEW_HISTORY_LIST,
        [],
      );
    });
    return res;
  }

  updateHistory(items: ViewHistoryModel[]) {
    bridge.setOhPrefData(PREFERENCE_KEY_VIEW_HISTORY_LIST, items);
  }
}
