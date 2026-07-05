import {HistorySearchItem, HotSearchItem} from '../bean/SearchBean';

export const HISTORY_SEARCH_MOCK: HistorySearchItem[] = [
  {
    label: '商务',
    latestSearch: 1751887063146,
  },
  {
    label: '衬衫',
    latestSearch: 1751887063145,
  },
  {
    label: '打底',
    latestSearch: 1751887063144,
  },
  {
    label: '夏季开衫',
    latestSearch: 1751887063143,
  },
];

export const HOT_SEARCH_MOCK: HotSearchItem[] = [
  {
    label: '商务系列',
    hotRate: 9999,
  },
  {
    label: '纯羊毛内搭',
    hotRate: 9998,
  },
  {
    label: '暑期流行单品',
    hotRate: 9997,
  },
  {
    label: '旅行出片装扮',
    hotRate: 9996,
  },
  {
    label: '华为首款鸿蒙电脑',
    hotRate: 9995,
  },
  {
    label: '元气满满MAX化妆品',
    hotRate: 9994,
  },
  {
    label: '时尚单品',
    hotRate: 9993,
  },
  {
    label: '针织打底',
    hotRate: 9992,
  },
  {
    label: '空调1.5匹',
    hotRate: 9991,
  },
  {
    label: '夏季遮肉衣物',
    hotRate: 9990,
  },
];

export const MOCK_PRODUCT_LIST: ProductCardItem[] = [
  {
    productId: 'product_10001',
    price: 149.25,
    dashPrice: 199,
    sales: 5,
    title: '女士时尚1轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_pink',
    promotion: ['任选1件7.5折'],
    label: [
      {
        preset: 0,
        data: '上新折扣',
      },
      {
        preset: 1,
        data: '爆款',
      },
    ],
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10002',
    price: 200,
    title: '女士时尚2轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_white',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 15,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
    ],
  },
  {
    productId: 'product_10003',
    price: 200,
    title: '女士时尚3轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_stripe',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 125,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10004',
    price: 300,
    title: '女士时尚4轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_green',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 335,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10005',
    price: 149.25,
    dashPrice: 199,
    title: '女士时尚5轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_pink',
    promotion: ['任选1件7.5折'],
    label: [
      {
        preset: 0,
        data: '上新折扣',
      },
      {
        preset: 1,
        data: '爆款',
      },
    ],
    sales: 5,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10006',
    price: 200,
    title: '女士时尚6轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_white',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 15,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10007',
    price: 200,
    title: '女士时尚7轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_stripe',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 125,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10008',
    price: 300,
    title: '女士时尚8轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_green',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 335,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10009',
    price: 149.25,
    dashPrice: 199,
    sales: 5,
    title: '女士时尚9轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_pink',
    promotion: ['任选1件7.5折'],
    label: [
      {
        preset: 0,
        data: '上新折扣',
      },
      {
        preset: 1,
        data: '爆款',
      },
    ],
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_100010',
    price: 200,
    title: '女士时尚10轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_white',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 15,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_100011',
    price: 200,
    title: '女士时尚11轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_stripe',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 125,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_100012',
    price: 300,
    title: '女士时尚12轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_green',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 335,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_100013',
    price: 149.25,
    dashPrice: 199,
    title: '女士时尚13轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_pink',
    promotion: ['任选1件7.5折'],
    label: [
      {
        preset: 0,
        data: '上新折扣',
      },
      {
        preset: 1,
        data: '爆款',
      },
    ],
    sales: 5,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10014',
    price: 200,
    title: '女士时尚14轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_white',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 15,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
      {
        icon: '',
        content: '包邮｜江苏无锡发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10015',
    price: 200,
    title: '女士时尚15轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_stripe',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 125,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '48小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
  {
    productId: 'product_10016',
    price: 300,
    title: '女士时尚16轻商务系列针织打底纯羊毛内搭',
    banner: 'mock_spec_green',
    promotion: [],
    label: [
      {
        preset: 0,
        data: '爆款',
      },
    ],
    sales: 335,
    logistics: [
      {
        icon: 'app://dev/media/icon/ic_truck.svg',
        content: '24小时内发货',
      },
    ],
    specList: [
      {
        id: 'uuid_160_80A',
        text: '160/80A',
      },
      {
        id: 'uuid_165_84A',
        text: '165/84A',
      },
      {
        id: 'uuid_170_88A',
        text: '170/88A',
      },
    ],
  },
];

export const MOCK_PRODUCT_LIST1: ProductCardItem[] = (
  JSON.parse(JSON.stringify(MOCK_PRODUCT_LIST)) as ProductCardItem[]
).filter((item, index) => {
  item.productId = 'product_100' + (17 + index);
  item.title = item.title.replace(String(index + 1), String(17 + index));
  return true;
});

export const PRODUCT_TABLE: ProductData[] = [
  {
    skuCode: 'sku_100001',
    productId: 'product_10001',
    skuDesc: '粉色;160/80A',
    specId: 'uuid_pink',
    skuType: 'uuid_160_80A',
    stock: 10,
    banner: 'mock_spec_pink',
    title: '女士时尚轻商务系列针织打底纯羊毛内搭',
    serviceDesc: '运费险｜7天无理由',
    price: 0,
    dashPrice: 0,
    count: 1,
  },
  {
    skuCode: 'sku_100002',
    productId: 'product_10001',
    skuDesc: '粉色;165/84A',
    specId: 'uuid_pink',
    skuType: 'uuid_165_84A',
    stock: 10,
    banner: 'mock_spec_pink',
    title: '女士时尚轻商务系列针织打底纯羊毛内搭',
    serviceDesc: '运费险｜7天无理由',
    price: 0,
    count: 1,
  },
  {
    skuCode: 'sku_100003',
    productId: 'product_10001',
    skuDesc: '粉色;170/88A',
    specId: 'uuid_pink',
    skuType: 'uuid_170_88A',
    stock: 10,
    banner: 'mock_spec_pink',
    title: '女士时尚轻商务系列针织打底纯羊毛内搭',
    serviceDesc: '运费险｜7天无理由',
    price: 0,
    count: 1,
  },
  {
    skuCode: 'sku_100004',
    productId: 'product_10001',
    skuDesc: '白色;160/80A',
    specId: 'uuid_white',
    skuType: 'uuid_160_80A',
    stock: 10,
    banner: 'mock_spec_white',
    title: '女士时尚轻商务系列针织打底纯羊毛内搭',
    serviceDesc: '运费险｜7天无理由',
    price: 0,
    count: 1,
  },
];

export function getSkuType(skuType: string) {
  if (skuType === 'uuid_160_80A') {
    return '160/80A';
  } else if (skuType === 'uuid_165_84A') {
    return '165/84A';
  } else if (skuType === 'uuid_170_88A') {
    return '170/88A';
  } else {
    return '160/80A';
  }
}

export interface ProductCardItem {
  productId: string;
  price: number;
  dashPrice?: number;
  title: string;
  banner: string;
  promotion: string[];
  label: LabelItem[];
  sales?: number;
  logistics?: LogisticsItem[];
  specList?: SpecItem[];
}

export interface CartDto {
  productId: string;
  skuCode: string;
  skuDesc: string;
  stock: number;
  count: number;
  banner: string;
  title: string;
  serviceDesc: string;
  price: string;
  dashPrice?: string;
  isSelected: boolean;
}

export interface LabelItem {
  preset: LabelPresetType;
  data: string;
}

export interface LogisticsItem {
  icon: string;
  content: string;
}

export interface SpecItem {
  id: string;
  text: string;
}

export enum LabelPresetType {
  PRIMARY,
  SECONDARY,
}

export interface ProductData {
  skuCode: string; // 主键
  productId: string;
  skuDesc: string;
  stock: number;
  banner: string;
  title: string;
  serviceDesc: string;
  price: number;
  dashPrice?: number;
  count?: number;
  specId?: string; //外观颜色 uuid_pink 等
  skuType?: string; //型号 uuid_160_80A 等
}
