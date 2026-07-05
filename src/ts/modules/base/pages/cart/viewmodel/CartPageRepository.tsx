import {
  MOCK_PRODUCT_LIST,
  MOCK_PRODUCT_LIST1,
  ProductCardItem,
} from '../../search/data/mockData/MockData';

export class CartPageRepository {
  getProductList(pageNum: number): Promise<ProductCardItem[]> {
    return this.getList(pageNum);
  }

  async getList(pageNum: number = 0): Promise<ProductCardItem[]> {
    return new Promise(resolve => {
      let resData = JSON.parse(
        JSON.stringify(pageNum === 0 ? MOCK_PRODUCT_LIST : MOCK_PRODUCT_LIST1),
      ) as ProductCardItem[];
      resolve(resData);
    });
  }
}
