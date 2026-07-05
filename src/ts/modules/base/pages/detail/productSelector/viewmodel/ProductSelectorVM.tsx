import {useState} from 'react';
import {
  ProductSelectionInfo,
  ProductSelector,
  SkuItem,
  SpecOption,
  SpecViewModel,
} from '../../data/DetailBean';
import {ProductDetailApis} from '../../data/ProductDetailApis';
import bridge from '../../../../utils/bridge';
import {deepClone, getPictureResource} from '../../../../utils/CommonUtils';
import {Toast} from '../../../../utils/ToastManager';
import {
  getSkuType,
  PRODUCT_TABLE,
} from '../../../search/data/mockData/MockData';

export function ProductSelectorVM(props) {
  const selSkuCode: string = props.selSkuCode;
  const selCount: number = props.selCount;
  const [proSelData, setProSelData] = useState<ProductSelector>({
    selectedCount: selCount,
  });

  function initData(productId: string, isMan: boolean = false) {
    let proSelDataTemp: ProductSelector =
      deepClone<ProductSelector>(proSelData);
    const item = ProductDetailApis.getProductDetail(productId);
    let stockInfo = item?.selectionInfo
      ? (JSON.parse(
          JSON.stringify(item?.selectionInfo),
        ) as ProductSelectionInfo)
      : null;
    if (isMan) {
      stockInfo = JSON.parse(
        JSON.stringify(stockInfo).replaceAll('mock_', 'mock2_'),
      );
    }
    proSelDataTemp.stockInfo = stockInfo;
    proSelDataTemp = getStockMap(proSelDataTemp);
    proSelDataTemp = getSpecViewListMap(proSelDataTemp);
    proSelDataTemp = getSelectorBanner(proSelDataTemp);
    proSelDataTemp = refreshSpecView(proSelDataTemp);
    proSelDataTemp = getCurSku(proSelDataTemp);

    proSelDataTemp.selectorBanner = stockInfo.defaultBanner;
    proSelDataTemp.price = item.price;
    proSelDataTemp.dashPrice = item.dashPrice;

    setProSelData(proSelDataTemp);
  }

  // 获取规格库存数据
  function getStockMap(proSelDataTemp: ProductSelector): ProductSelector {
    if (!proSelDataTemp.skuMap) {
      proSelDataTemp.skuMap = new Map();
    }
    proSelDataTemp.stockInfo?.skuItems?.forEach(skuItem => {
      const specs: [string, string][] = Object.entries(skuItem.specs);
      const key = specs.map(spec => spec[1]);
      proSelDataTemp.skuMap.set(key, skuItem);
    });
    return proSelDataTemp;
  }

  // 获取规格列表展示数据
  function getSpecViewListMap(proSelDataTemp: ProductSelector) {
    if (!proSelDataTemp.specViewListMap) {
      proSelDataTemp.specViewListMap = new Map();
    }

    let selSkuId = '';
    let selSkuType = '';
    for (let sku of PRODUCT_TABLE) {
      if (sku.skuCode === selSkuCode) {
        selSkuId = sku.specId;
        selSkuType = sku.skuType;
      }
    }

    const helper = (option: SpecOption) => {
      const arr: SpecViewModel[] = [];
      option.values.forEach(item => {
        const view: SpecViewModel = {
          specKey: option.key,
          id: item.id,
          value: item.text,
          isOutOfStock: isSpecOutOfStock(item.id, proSelDataTemp.skuMap),
          isSelected: item.id === selSkuId || item.id === selSkuType,
        };

        view.image = item.image;
        if (view.isSelected) {
          if (!proSelDataTemp.selectedKey) {
            proSelDataTemp.selectedKey = {};
          }
          if (item.id === selSkuId) {
            proSelDataTemp.selectedKey['外观颜色'] = {
              specKey: '外观颜色',
              id: selSkuId,
              value: selSkuId === 'uuid_pink' ? '粉色' : '白色',
              isOutOfStock: view.isOutOfStock,
              isSelected: view.isSelected,
              image: view.image,
              isTempOutOfStock: view.isOutOfStock,
            };
          }
          if (item.id === selSkuType) {
            proSelDataTemp.selectedKey['尺码'] = {
              specKey: '尺码',
              id: selSkuType,
              value: getSkuType(selSkuType),
              isOutOfStock: view.isOutOfStock,
              isSelected: view.isSelected,
            };
          }
        }
        arr.push(view);
      });

      proSelDataTemp.specViewListMap.set(option.key, arr);
    };
    if (proSelDataTemp.stockInfo?.specOptionWithImage) {
      helper(proSelDataTemp.stockInfo.specOptionWithImage);
    }
    if (proSelDataTemp.stockInfo?.specOptions) {
      proSelDataTemp.stockInfo.specOptions.forEach(option => {
        helper(option);
      });
    }
    return proSelDataTemp;
  }

  // 获取商品展示图
  function getSelectorBanner(proSelDataTemp: ProductSelector) {
    if (!proSelDataTemp.selectedKey) {
      proSelDataTemp.selectedKey = {};
    }
    if (proSelDataTemp.stockInfo?.specOptionWithImage) {
      const value =
        proSelDataTemp.selectedKey[
          proSelDataTemp.stockInfo.specOptionWithImage.key
        ];
      if (value) {
        const imageItem =
          proSelDataTemp.stockInfo.specOptionWithImage.values.filter(
            item => item.id === value.id,
          );
        if (imageItem?.length === 1) {
          proSelDataTemp.selectorBanner = imageItem[0].image;
          return proSelDataTemp;
        }
      }
    }
    proSelDataTemp.selectorBanner =
      proSelDataTemp.stockInfo?.defaultBanner ?? '';
    return proSelDataTemp;
  }

  // 该规格的商品是否没货
  function isSpecOutOfStock(key: string, map: Map<string[], SkuItem>) {
    for (let sku of Array.from(map)) {
      const keys = sku[0];
      const skuItem = sku[1];
      if (keys.includes(key) && skuItem.stock) {
        return false;
      }
    }
    return true;
  }

  // 当前选中规格的价格
  function curPrice() {
    if (proSelData.curSku?.price) {
      return proSelData.curSku.price * (proSelData.selectedCount ?? 1);
    }
    if (proSelData.stockInfo?.basicPrice) {
      return proSelData.stockInfo.basicPrice;
    }
    return 0;
  }

  // 当前选中规格的原始价格
  function curDashPrice() {
    if (proSelData.curSku?.dashPrice) {
      return proSelData.curSku.dashPrice * (proSelData.selectedCount ?? 1);
    }
    if (proSelData.stockInfo?.priceRange) {
      return proSelData.stockInfo.priceRange;
    }
    return 0;
  }

  // 点击规格按钮
  function handleSpecClick(item: SpecViewModel, mapKey: string) {
    let proSelDataTemp: ProductSelector =
      deepClone<ProductSelector>(proSelData);

    const resetDataSelFiled = (itemData: SpecViewModel, selected: boolean) => {
      proSelDataTemp.specViewListMap.get(mapKey)?.map((item_, index) => {
        if (itemData.id === item_.id) {
          item_.isSelected = selected;
        } else {
          item_.isSelected = false;
        }
      });
    };

    const old = proSelDataTemp.selectedKey[item.specKey];
    if (old) {
      old.isSelected = false;
      resetDataSelFiled(old, false);
    }
    if (old?.id === item.id) {
      proSelDataTemp.selectedKey[item.specKey] = undefined;
    } else {
      proSelDataTemp.selectedKey[item.specKey] = item;
      item.isSelected = true;
      resetDataSelFiled(item, true);
    }
    proSelDataTemp = refreshSpecView(proSelDataTemp);
    proSelDataTemp = getCurSku(proSelDataTemp);
    proSelDataTemp = getSelectorBanner(proSelDataTemp);
    proSelDataTemp.selectedCount = 1;
    setProSelData(proSelDataTemp);
  }

  // 刷新当前选中规格的库存状态
  function refreshSpecView(proSelDataTemp: ProductSelector) {
    const selectedKeys = Object.keys(proSelDataTemp.selectedKey);
    selectedKeys.forEach(key => {
      const selectedSpec = proSelDataTemp.selectedKey[key];
      const map: Map<string[], SkuItem> = new Map();
      Array.from(proSelDataTemp.skuMap).forEach(sku => {
        const keys = sku[0];
        if (!selectedSpec || keys.includes(selectedSpec.id)) {
          map.set(keys, sku[1]);
        }
      });
      Array.from(proSelDataTemp.specViewListMap).forEach(spec => {
        if (spec[0] !== key) {
          spec[1].forEach(model => {
            model.isTempOutOfStock = isSpecOutOfStock(model.id, map);
          });
        }
      });
    });
    return proSelDataTemp;
  }

  // 获取当前选中的商品
  function getCurSku(proSelDataTemp: ProductSelector) {
    const skuArr = Array.from(proSelDataTemp.skuMap);
    const temp = Object.entries(proSelDataTemp.selectedKey);

    const selectedKeys = temp
      .map(item => item[1]?.id)
      .filter(item => item !== undefined);
    for (let sku of skuArr) {
      if (sku[0].every(ele => selectedKeys.includes(ele))) {
        proSelDataTemp.curSku = sku[1];
        return proSelDataTemp;
      }
    }
    proSelDataTemp.curSku = undefined;
    return proSelDataTemp;
  }

  // 修改商品数量
  function handleCountChange(isAdd: boolean = true) {
    let proSelDataTemp: ProductSelector =
      deepClone<ProductSelector>(proSelData);
    if (!proSelDataTemp.curSku) {
      Toast.show('商品规格未选择');
      return;
    }
    if (proSelDataTemp.curSku.stock <= 0) {
      Toast.show('库存不足');
      return;
    }
    if (isAdd) {
      if (proSelDataTemp.selectedCount >= proSelDataTemp.curSku.stock) {
        Toast.show('数量不能再增加了，超出库存限制！');
        return;
      } else {
        proSelDataTemp.selectedCount++;
      }
    } else {
      if (proSelDataTemp.selectedCount <= 1) {
        Toast.show('宝贝数量不能再减少了~');
        return;
      } else {
        proSelDataTemp.selectedCount--;
      }
    }
    setProSelData(proSelDataTemp);
  }

  // 是否可以提交规格
  function enableConfirm() {
    return (
      !proSelData.curSku || (proSelData.curSku && proSelData.curSku.stock > 0)
    );
  }

  function getPictureRes(imageName) {
    return typeof imageName === 'string'
      ? getPictureResource(imageName)
      : imageName;
  }

  // 暴露状态和方法给组件
  return {
    proSelData,
    initData,
    curPrice,
    curDashPrice,
    handleSpecClick,
    handleCountChange,
    enableConfirm,
    getPictureRes,
  };
}
