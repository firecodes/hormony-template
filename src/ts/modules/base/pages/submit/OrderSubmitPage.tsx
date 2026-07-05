import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import bridge from '../../utils/bridge';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  DELIVERY_TYPE_EXPRESS,
  EXPRESS_TITLE,
  PICKUP_TITLE,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import RemarkDialog from './RemarkDialog';
import {
  CommonTitle,
  getPictureResource,
  Loading,
} from '../../utils/CommonUtils';
import {OrderSubmitVM} from './viewmodel/OrderSubmitVM';
import {getFullAddress, getTitle} from '../address/model/AddressDTO';
import CouponsSelectDialog from '../coupons/CouponsSelectDialog';
import {CouponItem} from '../coupons/model/CouponModel';
import {CartDto} from '../search/data/mockData/MockData';
import {showModal} from '../../utils/ModalUtils';
import {
  getDefaultSelCoupon_,
  getNewTotalMinus_,
} from '../coupons/viewmodel/CouponsSelectDialogVM';
import {getCouponsMock1, OFFSET_INFO} from '../coupons/mockData/GetCoupons';

const CARD_RADIUS = 12;
const TAB_HEIGHT = 44;
const PRODUCT_IMAGE_SIZE = 80;

function OrderSubmitPage(props) {
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [showCouponsDialog, setShowCouponsDialog] = useState(false);

  const translateXAnim = useRef(new Animated.Value(0)).current;
  const [animatedViewW, setAnimatedViewW] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    orderSubmitData,
    setOrderSubmitData,
    isLoading,
    initData,
    createOrder,
    setRemark,
    foldStatus,
  } = OrderSubmitVM(props);

  useEffect(() => {
    initData(props.items);
  }, [props]);

  useEffect(() => {
    let total = 0;
    orderSubmitData?.cartDtos?.map(item => {
      total += Number(item.price) * (item.count ?? 1);
    });
    if (totalPrice !== total) {
      setTotalPrice(total);

      let defaultCoupon = getDefaultSelCoupon_(total);
      let selCoupons = defaultCoupon ? [defaultCoupon] : [];
      if (orderSubmitData.discounts !== selCoupons) {
        orderSubmitData.discounts = selCoupons;
        orderSubmitData.totalMinus = defaultCoupon
          ? getNewTotalMinus_([defaultCoupon], total)
          : 0;
        setOrderSubmitData(JSON.parse(JSON.stringify(orderSubmitData)));
      }
    }
  }, [orderSubmitData]);

  function animFunc() {
    translateXAnim.setValue(
      orderSubmitData.deliveryType === DELIVERY_TYPE_EXPRESS
        ? animatedViewW
        : 0,
    );
    // 执行入场动画
    Animated.timing(translateXAnim, {
      toValue:
        orderSubmitData.deliveryType === DELIVERY_TYPE_EXPRESS
          ? 0
          : animatedViewW,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {});
  }

  useEffect(() => {
    if (animatedViewW !== 0) {
      animFunc();
    }
  }, [orderSubmitData.deliveryType]);

  const PayBottomBtn = () => (
    <TouchableOpacity
      style={{
        width: 96,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
        borderRadius: 16,
        backgroundColor: THEME_COLOR,
      }}
      onPress={() => {
        if (orderSubmitData.discounts) {
          let coupon = orderSubmitData.discounts[0];
          coupon.status = '3';
          coupon.offsetInfo = OFFSET_INFO;
          getCouponsMock1.forEach(item => {
            if (item.couponID === coupon.couponID) {
              item.status = '3';
              item.offsetInfo = OFFSET_INFO;
            }
          });
        }
        createOrder();
      }}>
      <Text style={{fontSize: 14, color: '#FFF', fontWeight: '500'}}>
        提交订单
      </Text>
    </TouchableOpacity>
  );

  const BottomView = () => (
    <View
      style={[
        styles.payView,
        props.concurrentRoot
          ? {
              height: 56 + BottomReactHeight - 12,
              paddingBottom: BottomReactHeight - 12,
            }
          : {height: 56},
      ]}>
      {!isLoading && (
        <View
          style={{
            height: '100%',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#000000',
                  opacity: 0.4,
                  marginRight: 10,
                  fontWeight: '500',
                }}>
                {'共' + (orderSubmitData.cartDtos?.length ?? 1) + '件'}
              </Text>
              <Text style={{fontSize: 12, color: '#333333'}}>合计:</Text>
              <Text style={{fontSize: 12, color: THEME_COLOR}}>
                ￥
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {totalPrice - (orderSubmitData.totalMinus ?? 0)}
                </Text>
              </Text>
            </View>
          </View>
          {PayBottomBtn()}
        </View>
      )}
    </View>
  );

  const RightArrowIcon = () => (
    <Image
      source={require('../../../../rawfile/dev/media/icon/right_arrow.svg')}
      style={styles.arrowIcon}
    />
  );

  // 地址信息
  const AddressInfoCard = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        bridge.pushUrl('AddressListPage', '');
      }}>
      <View style={[styles.addressCard, {marginRight: -4}]}>
        <Image
          source={require('../../../../rawfile/dev/media/icon/ic_address.svg')}
          style={styles.addressIcon}
        />
        <View style={styles.addressTextContainer}>
          <Text
            style={styles.addressMainText}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {orderSubmitData.selAddress
              ? getFullAddress(orderSubmitData.selAddress)
              : '收货地址'}
          </Text>
          <Text style={styles.addressSubText}>
            {orderSubmitData.selAddress
              ? getTitle(orderSubmitData.selAddress)
              : '请选择'}
          </Text>
        </View>
        <View style={styles.rightArrow}>{RightArrowIcon()}</View>
      </View>
    </TouchableWithoutFeedback>
  );

  // 店铺地址信息
  const StoreAddressInfoCard = () => (
    <View style={[styles.addressCard, {marginRight: -4}]}>
      <Image
        source={require('../../../../rawfile/dev/media/icon/shop.svg')}
        style={styles.addressIcon}
      />
      <View style={styles.addressTextContainer}>
        <Text
          style={styles.addressMainText}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          店铺地址
        </Text>
        <Text style={styles.addressSubText}>
          预留电话 <Text style={{color: THEME_COLOR}}>12345678901</Text>
        </Text>
      </View>
    </View>
  );

  // 商品卡片
  const ProductCard = (item: CartDto, index: number) => (
    <View
      style={[
        styles.productCard,
        {marginBottom: index < orderSubmitData.cartDtos.length - 1 ? 12 : 0},
      ]}
      key={String(index)}>
      <Image
        source={getPictureResource(item?.banner)}
        style={styles.productImage}
      />
      <View style={styles.productInfoContainer}>
        <Text
          style={styles.productName}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {item?.title}
        </Text>
        <Text style={styles.productSpec}>{item?.skuDesc}</Text>
        <Text style={styles.productSpec}>数量：{item?.count ?? 1}</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.productService}>{item?.serviceDesc}</Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text
              style={[
                styles.productPriceCurrent,
                {paddingTop: -1.5, marginRight: 2},
              ]}>
              ¥
            </Text>
            <Text style={[styles.productPriceCurrent, {fontSize: 16}]}>
              {Number(item?.price) * (item?.count ?? 1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // 信息列表
  const InfoList = () => (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>配送服务</Text>
        <Text style={styles.infoValue}>
          {orderSubmitData.deliveryType === DELIVERY_TYPE_EXPRESS
            ? EXPRESS_TITLE
            : PICKUP_TITLE}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>优惠券</Text>
        <TouchableOpacity
          onPress={() => {
            setShowCouponsDialog(true);
          }}>
          <View style={styles.couponRow}>
            <Text style={styles.couponValue}>
              -¥{orderSubmitData.totalMinus ?? 0}
            </Text>
            {RightArrowIcon()}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>订单总金额</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.orderAmount, {marginRight: 2}]}>¥</Text>
          <Text style={styles.orderAmount}>
            {totalPrice - (orderSubmitData.totalMinus ?? 0)}
          </Text>
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowRemarkDialog(true);
        }}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>备注</Text>
          <View style={[styles.noteRow, {flex: 1}]}>
            <Text
              style={[
                styles.infoValue,
                {marginLeft: 50, flex: 1, textAlign: 'right', marginRight: 4},
              ]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {orderSubmitData.remark}
            </Text>
            {RightArrowIcon()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  // 支付方式
  const PayMethodCard = () => (
    <View style={styles.paymentCard}>
      <Image
        source={require('../../../../rawfile/dev/media/icon/ic_huawei_pay.svg')}
        style={styles.paymentIcon}
      />
      <Text style={styles.paymentText}>华为支付</Text>
      <CheckBox
        value={true}
        style={{
          width: 20,
          height: 20,
          marginHorizontal: 4,
        }}
        onCheckColor={THEME_COLOR}
      />
    </View>
  );

  const CenterContent = () => (
    <View
      style={[
        styles.container,
        {paddingHorizontal: foldStatus === 1 ? 24 : 16},
      ]}>
      {isLoading ? (
        Loading()
      ) : (
        <ScrollView
          style={{flex: 1, width: '100%', height: '100%'}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <View style={[styles.containerView, {marginTop: 12}]}>
              {orderSubmitData.deliveryType === DELIVERY_TYPE_EXPRESS
                ? AddressInfoCard()
                : StoreAddressInfoCard()}
            </View>
            <View style={styles.containerView}>
              {orderSubmitData.cartDtos?.map((item, index) => {
                return ProductCard(item, index);
              })}
            </View>
            <View
              style={[
                styles.containerView,
                {paddingHorizontal: 16, paddingVertical: 0},
              ]}>
              {InfoList()}
            </View>
            {PayMethodCard()}
          </View>
        </ScrollView>
      )}
    </View>
  );

  function renderCouponsSelectModal() {
    let view = (
      <CouponsSelectDialog
        totalMoney={totalPrice}
        selCounts={orderSubmitData.discounts}
        onSure={(selCoupons: CouponItem[], totalMinus: number) => {
          orderSubmitData.discounts = selCoupons;
          orderSubmitData.totalMinus = totalMinus;
          setOrderSubmitData(JSON.parse(JSON.stringify(orderSubmitData)));
          setShowCouponsDialog(false);
        }}
        onClose={() => {
          setShowCouponsDialog(false);
        }}
      />
    );
    return showModal(
      view,
      showCouponsDialog,
      () => {
        setShowCouponsDialog(false);
      },
      {
        isFill: true,
        viewHeight: 420,
        expandHeight: 420,
      },
    );
  }

  return (
    <View style={styles.content}>
      {CommonTitle('确定订单')}
      {CenterContent()}
      <View
        style={{width: '100%', height: 1, backgroundColor: BACKGROUND_COLOR}}
      />
      {BottomView()}
      {showRemarkDialog && (
        <RemarkDialog
          userInputNote={orderSubmitData.remark}
          onClose={note => {
            setRemark(note);
            setShowRemarkDialog(false);
          }}
        />
      )}
      {renderCouponsSelectModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: TopReactHeight,
  },
  titleContent: {
    width: '100%',
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: TopReactHeight,
  },
  title: {
    marginLeft: 11,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  payView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  topArrowIcon: {
    width: 12,
    height: 12,
    marginBottom: 1,
    transform: [{rotate: '90deg'}],
  },
  arrowIcon: {
    width: 13,
    height: 13,
    opacity: 0.2,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  containerView: {
    padding: 12,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    borderRadius: TAB_HEIGHT / 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: TAB_HEIGHT / 2,
  },
  tabText: {
    fontSize: 15,
    color: '#666666',
  },
  tabTextActive: {
    color: '#333333',
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginLeft: 4,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressMainText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 18,
    includeFontPadding: true,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressSubText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#aaa',
  },
  productCard: {
    flexDirection: 'row',
  },
  productImage: {
    width: PRODUCT_IMAGE_SIZE,
    height: PRODUCT_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
    includeFontPadding: true,
    fontWeight: '500',
  },
  productSpec: {
    fontSize: 12,
    lineHeight: 18,
    includeFontPadding: true,
    color: '#aaa',
  },
  productService: {
    fontSize: 10,
    marginTop: 4,
    color: '#aaa',
  },
  productPriceCurrent: {
    fontSize: 12,
    color: THEME_COLOR,
    fontWeight: '500',
    marginRight: 4,
  },
  productPriceOriginal: {
    fontSize: 10,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
  },
  infoRowLastChild: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponValue: {
    fontSize: 14,
    color: THEME_COLOR,
    marginRight: 4,
    fontWeight: '500',
  },
  orderAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 12,
    height: 60,
    marginBottom: 100,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: 16,
    height: 16,
  },
  rightArrow: {
    width: 22,
    height: 22,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderSubmitPage;
