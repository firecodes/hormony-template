export interface ProductEvalItem {
  productId: string;
  userAvatar: any;
  userName: string;
  skuCode: string;
  skuDesc: string[];
  rating: number;
  date: number; //时间戳
  content: string;
  mediaList: string[];
}

export const EVAL_MOCK_LIST: ProductEvalItem[] = [
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '金*',
    skuCode: 'sku_100012',
    skuDesc: ['170/88A', '绿色'],
    rating: 5,
    date: 1704220800000, // 2023-11-01 00:00:00
    content:
      '这款针织打底衫质量非常棒，纯羊毛材质，穿着舒适，保暖性很好。适合商务场合，搭配西装外套也很合适。',
    mediaList: [
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
      'mock_spec_pink',
    ],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '李*',
    skuCode: 'sku_100005',
    skuDesc: ['165/84A', '白色'],
    rating: 4,
    date: 1703616000000, // 2023-10-25 00:00:00
    content:
      '颜色很百搭，颜色看起来很高级。版型修身，穿上显得很精神。不过稍微有点紧身，建议选大一码。',
    mediaList: [],
  },
  {
    productId: 'product_10001',
    userAvatar: require('../../../../../rawfile/dev/media/icon/spec/mock_spec_stripe.jpg'),
    userName: '小**',
    skuCode: 'sku_100004',
    skuDesc: ['160/80A', '白色'],
    rating: 5,
    date: 1704393600000, // 2023-11-02 00:00:00
    content:
      '深蓝色非常显气质，适合秋冬季节。羊毛材质柔软，洗涤后不易起球，质量上乘。',
    mediaList: [],
  },
];

export function getProEvalPrefKey(productId: string): string {
  return 'Eval_' + productId;
}
