import {ProductInfo, ProductSelectionInfo} from './DetailBean';

export class ProductDetailApis {
  static getProductDetail(productId: string): ProductInfo {
    if (!productId) {
      productId = '';
    }
    let curProductIndex = ProductDetailApis.getProductIdIndex(productId);
    let res: ProductInfo;
    switch (curProductIndex) {
      case 1:
        res = productId.startsWith('product_100')
          ? require('../../../../../rawfile/dev/database/product/product_10001.json')
              .data
          : require('../../../../../rawfile/dev/database/product/product_20001.json')
              .data;
        break;
      case 2:
        res = productId.startsWith('product_100')
          ? require('../../../../../rawfile/dev/database/product/product_10002.json')
              .data
          : require('../../../../../rawfile/dev/database/product/product_20002.json')
              .data;
        break;
      case 3:
        res = productId.startsWith('product_100')
          ? require('../../../../../rawfile/dev/database/product/product_10003.json')
              .data
          : require('../../../../../rawfile/dev/database/product/product_20003.json')
              .data;
        break;
      default:
        res = productId.startsWith('product_100')
          ? require('../../../../../rawfile/dev/database/product/product_10004.json')
              .data
          : require('../../../../../rawfile/dev/database/product/product_20004.json')
              .data;
        break;
    }
    if (res) {
      res.id = productId;
      let realIndex = Number.parseInt(
        productId.replace(
          productId.startsWith('product_100') ? 'product_100' : 'product_200',
          '',
        ),
      );
      res.title =
        res.title.slice(0, res.title.indexOf('时尚') + 2) +
        realIndex +
        res.title.slice(res.title.indexOf('轻'), res.title.length);
    }
    return res;
  }

  static getProductIdIndex(productId: string) {
    if (productId?.startsWith('product_100')) {
      productId = productId.replace('product_100', '');
    } else if (productId?.startsWith('product_200')) {
      productId = productId.replace('product_200', '');
    }
    switch (Number.parseInt(productId) % 4) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      default:
        return 0;
    }
  }

  static getPictureRes(productId: string) {
    let curProductIndex = ProductDetailApis.getProductIdIndex(productId);
    let res = require('../../../../../rawfile/dev/media/icon/spec/mock_spec_white.jpg');
    if (curProductIndex === 0) {
      res = require('../../../../../rawfile/dev/media/icon/spec/mock_spec_white.jpg');
    } else if (curProductIndex === 1) {
      res = require('../../../../../rawfile/dev/media/icon/spec/mock_spec_pink.jpg');
    } else if (curProductIndex === 2) {
      res = require('../../../../../rawfile/dev/media/icon/spec/mock_spec_green.jpg');
    } else if (curProductIndex === 3) {
      res = require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg');
    }
    return res;
  }

  static getProductStockInfo(id: string) {
    const item = ProductDetailApis.getProductDetail(id);
    return item?.selectionInfo
      ? (JSON.parse(
          JSON.stringify(item?.selectionInfo),
        ) as ProductSelectionInfo)
      : null;
  }
}
