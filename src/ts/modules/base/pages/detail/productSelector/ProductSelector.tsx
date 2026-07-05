import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {ProductInfo, SpecViewModel} from '../data/DetailBean';
import {PictureUtils} from '../../../utils/PictureUtils';
import {ProductSelectorVM} from './viewmodel/ProductSelectorVM';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../../utils/Constant';
import {Toast} from '../../../utils/ToastManager';
import {PRODUCT_TABLE} from '../../search/data/mockData/MockData';

export function ProductSelector(props) {
  const productInfo: ProductInfo = props.productInfo;
  const isMan = props.isMan ?? false;
  const onSureCallback: (
    skuCode: string,
    count: number,
    price: string,
    dashPrice: string,
    skuDesc: string,
  ) => void = props.onSureCallback;
  const dismiss: () => void = props.dismiss;

  const {
    proSelData,
    initData,
    curPrice,
    curDashPrice,
    handleSpecClick,
    handleCountChange,
    enableConfirm,
    getPictureRes,
  } = ProductSelectorVM(props);

  useEffect(() => {
    initData(productInfo.id, isMan);
  }, []);

  function specsInfoContent(item: [string, SpecViewModel[]], index: number) {
    return (
      <View style={styles.optionSection} key={index}>
        <Text style={styles.sectionTitle}>{item[0]}</Text>
        <View style={styles.optionScroll}>
          {item[1].map((item_: SpecViewModel, index_: number) => {
            return (
              <TouchableOpacity
                key={index + '_' + index_}
                activeOpacity={1}
                style={[
                  styles.colorOption,
                  item_.isSelected ? styles.selectedOption : null,
                  item_.isOutOfStock || item_.isTempOutOfStock
                    ? styles.outOfStock
                    : null,
                ]}
                onPress={() => {
                  handleSpecClick(item_, item[0]);
                }}>
                {item_.image && (
                  <Image
                    source={getPictureRes(item_.image)}
                    style={styles.colorSwatch}
                  />
                )}
                <Text
                  style={[
                    styles.colorText,
                    item_.isSelected ? {color: THEME_COLOR} : null,
                  ]}>
                  {String(item_.value) +
                    (item_.isTempOutOfStock || item_.isOutOfStock
                      ? '(缺货)'
                      : '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
      }}>
      <View style={styles.contentView}>
        <View style={styles.titleView}>
          <Text style={{fontSize: 18, color: 'black'}}>{'商品规格选择'}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={styles.closeView}
            onPress={() => {
              dismiss?.();
            }}>
            <Image
              source={PictureUtils.getIcon('ic_close')}
              style={{
                width: 18,
                height: 18,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* 商品图片+价格区域 */}
        <View style={styles.topRow}>
          <Image
            source={getPictureRes(proSelData.selectorBanner)}
            style={styles.productImage}
          />
          <View style={styles.priceInfo}>
            <Text style={styles.discountedPrice}>
              实付 ¥<Text style={{fontSize: 24}}>{curPrice()?.toString()}</Text>
            </Text>
            <Text style={styles.originalPrice}>
              {curDashPrice() !== 0 ? '¥' + curDashPrice() : ''}
            </Text>
            {proSelData.stockInfo?.services?.map((item, index) => (
              <Text
                key={index}
                id={item?.toString()}
                style={styles.deliveryInfo}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        {/* 外观颜色选择 */}
        {/* 尺码选择 */}
        {proSelData?.specViewListMap &&
          Array.from(proSelData.specViewListMap).map(
            (item: [string, SpecViewModel[]], index) =>
              specsInfoContent(item, index),
          )}

        {/* 数量选择 */}
        <View style={[styles.optionSection, styles.numbersView]}>
          <Text style={styles.sectionTitle}>数量</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtnParent}
              onPress={() => handleCountChange(false)}>
              <View style={styles.quantityBtn}>
                <Image
                  source={require('../../../../../rawfile/dev/media/icon/ic_minus.svg')}
                  style={[styles.quantityBtnText]}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.quantityText}>
              {proSelData.selectedCount?.toString() || '1'}
            </Text>
            <TouchableOpacity
              style={styles.quantityBtnParent}
              onPress={() => handleCountChange(true)}>
              <View style={styles.quantityBtn}>
                <Image
                  source={require('../../../../../rawfile/dev/media/icon/ic_plus.svg')}
                  style={[styles.quantityBtnText]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flex: 1}} />
        <TouchableOpacity
          style={[
            styles.sureButton,
            {backgroundColor: enableConfirm() ? THEME_COLOR : '#00000066'},
          ]}
          onPress={() => {
            if (!proSelData.curSku) {
              Toast.show('商品规格未选择');
              return;
            }
            if (enableConfirm()) {
              let skuDesc = '';
              let sku = PRODUCT_TABLE.filter(
                i => i.skuCode === proSelData?.curSku?.skuCode,
              );
              if (sku?.length > 0) {
                skuDesc = sku[0].skuDesc;
              }
              onSureCallback(
                proSelData?.curSku?.skuCode,
                proSelData?.selectedCount,
                proSelData?.price,
                proSelData?.dashPrice,
                skuDesc,
              );
              dismiss?.();
            }
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
            {enableConfirm() ? '确定' : '暂时缺货'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: '100%',
    paddingBottom: BottomReactHeight,
  },
  titleView: {
    flexDirection: 'row',
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeView: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  priceInfo: {
    flex: 1,
  },
  discountedPrice: {
    fontSize: 12,
    color: THEME_COLOR,
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 14,
    marginTop: 4,
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  optionSection: {
    marginTop: 19,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 24,
    includeFontPadding: true,
  },
  optionScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    height: 34,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  colorText: {
    fontSize: 14,
    padding: 8,
  },
  sizeOption: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sizeText: {
    fontSize: 14,
  },
  selectedOption: {
    borderColor: THEME_COLOR,
  },
  outOfStock: {
    opacity: 0.3,
  },
  quantityContainer: {
    width: 68,
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnParent: {
    width: 30,
    height: 30,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: BACKGROUND_COLOR,
  },
  quantityBtnText: {
    width: 12,
    objectFit: 'contain',
  },
  quantityText: {
    minWidth: 20,
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
  },
  sureButton: {
    width: '100%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
  numbersView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
