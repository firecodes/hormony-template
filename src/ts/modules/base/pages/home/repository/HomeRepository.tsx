// 本地模拟数据（模拟数据库/API返回）
import {SearchData} from '../model/SearchData';
import {CategoryData} from '../model/CategoryData';
import {
  MOCK_PRODUCT_LIST,
  MOCK_PRODUCT_LIST1,
  ProductCardItem,
} from '../../search/data/mockData/MockData';

const MOCK_SEARCH_DATA: SearchData[] = [
  new SearchData(1, '清洁用品'),
  new SearchData(2, '全棉用品'),
  new SearchData(3, '安睡香氛'),
  new SearchData(4, '运动休闲'),
  new SearchData(5, '美妆彩妆'),
];

const MOCK_BANNER_DATA: string[] = [
  'mock_homepage_banner2',
  'mock_homepage_banner3',
  'mock_homepage_banner4',
];

const MOCK_CATEGORY_DATA: CategoryData[] = [
  new CategoryData(
    'shu_cai_dou_zhi_pin',
    '精选',
    require('../../../../../rawfile/dev/media/icon/category/icon1.png'),
  ),
  new CategoryData(
    'ru_pin_hong_bei',
    '全棉用品',
    require('../../../../../rawfile/dev/media/icon/category/icon5.png'),
  ),
  new CategoryData(
    'rou_qin_dan',
    '运动休闲',
    require('../../../../../rawfile/dev/media/icon/category/icon2.png'),
  ),
  new CategoryData(
    'shui_guo_xian_hua',
    '成人服装',
    require('../../../../../rawfile/dev/media/icon/category/icon4.png'),
  ),
  new CategoryData(
    'dong_pin_mian_dian',
    '折扣商品',
    require('../../../../../rawfile/dev/media/icon/category/icon6.png'),
  ),
  new CategoryData(
    'hai_xian_shui_chan',
    '分类1',
    require('../../../../../rawfile/dev/media/icon/category/icon3.png'),
  ),
  new CategoryData(
    'liang_you_diao_wei',
    '分类2',
    require('../../../../../rawfile/dev/media/icon/category/icon7.png'),
  ),
  new CategoryData(
    'xiu_xian_ling_shi',
    '分类3',
    require('../../../../../rawfile/dev/media/icon/category/icon9.png'),
  ),
  new CategoryData(
    'jiu_shui_yin_liao',
    '分类4',
    require('../../../../../rawfile/dev/media/icon/category/icon8.png'),
  ),
  new CategoryData(
    'shu_shi_kuai_shou_cai',
    '分类5',
    require('../../../../../rawfile/dev/media/icon/category/icon10.png'),
  ),
];

export interface IHomeRepository {
  getSearchData(): Promise<SearchData[]>;

  getBannerData(): Promise<string[]>;

  getCategoryData(): Promise<CategoryData[]>;

  getProductList(pageNum: number): Promise<ProductCardItem[]>;
}

export class HomeRepository implements IHomeRepository {
  // 模拟异步获取搜索列表（模拟API请求延迟）
  async getSearchData(): Promise<SearchData[]> {
    return new Promise(resolve => {
      resolve(MOCK_SEARCH_DATA); // 返回本地模拟数据
    });
  }

  // 模拟异步获取Banner列表（模拟API请求延迟）
  async getBannerData(): Promise<string[]> {
    return new Promise(resolve => {
      resolve(MOCK_BANNER_DATA); // 返回本地模拟数据
    });
  }

  // 模拟异步获取Category列表（模拟API请求延迟）
  async getCategoryData(): Promise<CategoryData[]> {
    return new Promise(resolve => {
      resolve(MOCK_CATEGORY_DATA); // 返回本地模拟数据
    });
  }

  // 模拟异步获取首页商品列表（模拟API请求延迟）
  async getProductList(pageNum: number = 0): Promise<ProductCardItem[]> {
    return new Promise(resolve => {
      let resData = JSON.parse(
        JSON.stringify(pageNum === 0 ? MOCK_PRODUCT_LIST : MOCK_PRODUCT_LIST1),
      ) as ProductCardItem[];
      resolve(resData);
    });
  }
}
