export interface ProductInfo {
  id: string;
  banners: string[];
  price: string;
  dashPrice: string;
  sales: string;
  title: string;
  tags: string[];
  logistics: ProductServiceItem[];
  service: ProductServiceItem[];
  pictures: string[];
  selectionInfo: ProductSelectionInfo;
  label: string[];
  isOffTheShelf?: boolean;
}

export interface CollectProductInfo extends ProductInfo {
  collectTime: number;
}

export interface ProductServiceItem {
  icon: string;
  content: string;
}

export interface ProductSelectionInfo {
  defaultBanner: string;
  basicPrice: string;
  priceRange: string;
  priceRemark: string;
  totalPriceRemark: string;
  services: string[];
  skuItems: SkuItem[];
  specOptions: SpecOption[];
  specOptionWithImage: SpecOption | null;
}

export interface SkuItem {
  skuCode: string; // 库存保持单元编码 (唯一)
  specs: Record<string, string>; // 规格组合 (key to uuid)
  stock: number;
  price: number;
  dashPrice: number;
}

export interface SpecValue {
  id: string;
  text: string;
  image?: string;
}

export interface SpecOption {
  key: string;
  values: SpecValue[];
}

export interface SpecViewModel {
  specKey: string;
  id: string;
  value: string;
  image?: any;
  isOutOfStock: boolean;
  isSelected: boolean;
  isTempOutOfStock?: boolean;
}

export interface ProductSelector {
  stockInfo?: ProductSelectionInfo;
  skuMap?: Map<string[], SkuItem>;
  selectedCount?: number;
  specViewListMap?: Map<string, SpecViewModel[]>;
  selectedKey?: Record<string, SpecViewModel | undefined>;
  curSku?: SkuItem;
  selectorBanner?: any;
  price?: string;
  dashPrice?: string;
}

export function getProductInfoTag(tags: string[]): string {
  let tag = '';
  tags?.forEach(item => {
    tag += item + ',';
  });
  if (tag.endsWith(',')) {
    tag = tag.substring(0, tag.length - 1);
  }
  return tag;
}
