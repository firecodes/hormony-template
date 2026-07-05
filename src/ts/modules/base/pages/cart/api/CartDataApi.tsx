import bridge from '../../../utils/bridge';
import {CartDto, PRODUCT_TABLE} from '../../search/data/mockData/MockData';
import {Toast} from '../../../utils/ToastManager';
import {ProductDetailApis} from '../../detail/data/ProductDetailApis';

export const CART_PREFERENCE_KEY = 'shoppingCart';

export default class CartDataApi {
  private static instance: CartDataApi | null = null;

  private constructor() {}

  public static getInstance() {
    if (CartDataApi.instance === null) {
      CartDataApi.instance = new CartDataApi();
    }
    return CartDataApi.instance;
  }

  public saveCartData(value: CartDto[]) {
    let dataStr = JSON.stringify(value);
    bridge.setOhPrefData(CART_PREFERENCE_KEY, dataStr);
  }

  /**
   * 获取所有购物车数据
   */
  public getAllCartData = (): Promise<CartDto[]> => {
    let pro = new Promise<CartDto[]>((res, rej) => {
      bridge.getOhPrefData(result => {
        if (result) {
          try {
            let choppingCardDataTemp = JSON.parse(
              result.toString(),
            ) as CartDto[];
            res(choppingCardDataTemp);
          } catch (e) {
            rej([]);
          }
        } else {
          res([]);
        }
      }, CART_PREFERENCE_KEY);
    });
    return pro;
  };

  /**
   * 添加购物车数据或者对购物车数据数量进行增加操作
   * @param skuCode
   * @param count 在购物车中对指定数据的数量进行增加操作时 传过来的count永远为1 每次都是加1 详情页中添加购物车操作时为用户编辑的数量 不一定是1
   * @param productId
   * @param price
   * @param dashPrice
   * @param skuDesc
   * @param preSkuCode
   * @param isNeedToast
   */
  public createOrUpdate = async (
    skuCode: string,
    count: number,
    productId: string,
    price: string,
    dashPrice: string,
    skuDesc: string = '',
    preSkuCode: string = '',
    isNeedToast: boolean = true,
  ) => {
    return new Promise<CartDto>((res, rej) => {
      let resData: CartDto;
      this.getAllCartData().then((data: CartDto[]) => {
        let findIndex = -1;
        if (!data) {
          data = [];
        } else {
          data.map((cartCard, index) => {
            if (!resData && cartCard.productId === productId) {
              if (preSkuCode && cartCard.skuCode === preSkuCode) {
                cartCard.count = count;
                cartCard.skuCode = skuCode;
                cartCard.skuDesc = skuDesc;
                resData = cartCard;
                findIndex = index;
              } else if (cartCard.skuCode === skuCode) {
                cartCard.count = Math.min(
                  cartCard.stock,
                  cartCard.count + count,
                );
                resData = cartCard;
                findIndex = index;
              }
            }
          });
        }

        if (!resData) {
          // 添加新数据
          resData = this.getCartDataOfCode(
            skuCode,
            count,
            productId,
            price,
            dashPrice,
          );
          if (resData) {
            data.unshift(resData);
          }
        } else {
          //数量添加成功 更新现有对应数据
          data[findIndex] = resData;
        }
        this.saveCartData(data);
        isNeedToast && Toast.show('成功加入购物车');
        res(resData);
      });
    });
  };

  // 数量减一 数据必定存在 直接减然后保存更新
  public minusCartData = async (skuCode: string, productId: string) => {
    return new Promise<boolean>(async (res, rej) => {
      let data: CartDto[] = await this.getAllCartData();
      for (let cartCard of data) {
        if (cartCard.skuCode === skuCode && cartCard.productId === productId) {
          cartCard.count = cartCard.count - 1;
          break;
        }
      }
      this.saveCartData(data);
      res(true);
    });
  };

  public getCartDataOfCode = (
    skuCode: string,
    count: number,
    productId: string,
    price: string,
    dashPrice: string,
  ) => {
    let cartDto: CartDto | undefined;
    let pro = ProductDetailApis.getProductDetail(productId);
    for (let sku of PRODUCT_TABLE) {
      if (sku.skuCode === skuCode) {
        if (productId.startsWith('product_2')) {
          sku = JSON.parse(
            JSON.stringify(sku)
              .replaceAll('mock_', 'mock2_')
              .replaceAll('女士', '男士'),
          );
        }
        cartDto = {
          productId: productId,
          skuCode: sku.skuCode,
          skuDesc: sku.skuDesc,
          stock: sku.stock,
          banner: sku.banner,
          title: pro.title,
          serviceDesc: sku.serviceDesc,
          price: price,
          dashPrice: dashPrice,
          count: Math.min(sku.stock, count),
          isSelected: false,
        };
        break;
      }
    }
    return cartDto;
  };

  public deleteCartData = async (items: CartDto[]) => {
    return new Promise<boolean>((res, rej) => {
      if (items?.length > 0) {
        this.getAllCartData().then((data: CartDto[]) => {
          data = data.filter(
            (item_, index_) =>
              items.filter(
                item__ =>
                  item__.skuCode === item_.skuCode &&
                  item__.productId === item_.productId,
              ).length === 0,
          );
          this.saveCartData(data);
          res(true);
        });
      }
    });
  };
}
