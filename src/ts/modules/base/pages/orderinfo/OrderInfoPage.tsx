import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  CommonTitle,
  formatFullDate,
  getPictureResource,
  Loading,
  RenderCommonDialog,
  withDelay,
} from '../../utils/CommonUtils';
import React from 'react';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  DELIVERY_TYPE_EXPRESS,
  EXPRESS_TITLE,
  PICKUP_TITLE,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import bridge from '../../utils/bridge';
import {OrderInfoVM} from './viewmodel/OrderInfoVM';
import {CartDto} from '../search/data/mockData/MockData';
import {AddressDTO, getFullAddress} from '../address/model/AddressDTO';
import AddressChangeDialog from '../address/AddressChangeDialog';
import {
  getDialogContent,
  getLogisticsDesc,
  getStatusString,
  isNeedDialog,
  ORDER_CHANGE_ADDRESS,
  ORDER_CONTACT_SERVICE,
  ORDER_REQ_REFUND,
} from '../myorder/viewmodel/MyOrderVM';
import {getBtnWithStatus} from '../myorder/OrderViewsUtil';
import {OrderInfo} from './model/OrderInfo';
import {Toast} from '../../utils/ToastManager';
import {showModal} from '../../utils/ModalUtils';
import OrderApi from '../myorder/OrderApi';
import {OrderRefundDialog} from '../myorder/OrderRefundDialog';
import {LogisticsDialog} from './LogisticsDialog';

const CARD_RADIUS = 16;
const PRODUCT_IMAGE_SIZE = 60;

export function addressInfoCard(
  receivingMethod: string,
  addressInfo?: AddressDTO,
  hideChange: boolean = false,
  showAddressChange?: (exe: boolean) => void,
  status?: number,
  refundPreStatus?: number,
  setShowLogisticsDialog?: (show: boolean) => void,
) {
  hideChange =
    hideChange ||
    receivingMethod !== DELIVERY_TYPE_EXPRESS ||
    !(status === 0 || status === 2 || status === 3);

  let logisticsDesc = getLogisticsDesc(
    [6, 7, 8].includes(status) ? refundPreStatus : status,
  );
  return (
    <View style={styles.addressCard}>
      {logisticsDesc.length > 1 && (
        <View
          style={{
            width: '100%',
            height: 46,
            alignItems: 'flex-start',
            marginTop: -12,
          }}>
          <TouchableOpacity
            style={{
              height: 34,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
            disabled={status === 2 || refundPreStatus === 2}
            onPress={() => {
              setShowLogisticsDialog(true);
            }}>
            <Image
              source={require('../../../../rawfile/dev/media/icon/dely.png')}
              style={{width: 22, height: 22, marginRight: 4}}
            />
            <Text style={{fontSize: 13, color: THEME_COLOR, marginRight: 8}}>
              {logisticsDesc[0]}
            </Text>
            <Text
              style={{fontSize: 13, maxWidth: '70%'}}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {logisticsDesc[1]}
            </Text>
            <View style={{flex: 1}} />
            {status !== 2 && refundPreStatus !== 2 && (
              <Image
                source={require('../../../../rawfile/dev/media/icon/right_arrow.svg')}
                style={{width: 10, height: 10, marginLeft: 10, opacity: 0.2}}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: '#ccc',
              marginBottom: 11,
            }}
          />
        </View>
      )}
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        activeOpacity={0.9}
        disabled={addressInfo !== undefined}
        onPress={() => {}}>
        <Image
          source={
            receivingMethod === DELIVERY_TYPE_EXPRESS
              ? require('../../../../rawfile/dev/media/icon/ic_address.svg')
              : require('../../../../rawfile/dev/media/icon/shop.svg')
          }
          style={styles.addressIcon}
        />
        <View style={styles.addressTextContainer}>
          <Text
            style={[
              styles.addressMainText,
              hideChange ? {paddingRight: 15} : {},
            ]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {addressInfo ? getFullAddress(addressInfo) : '收货地址'}
          </Text>
          <Text style={styles.addressSubText}>
            {addressInfo
              ? addressInfo.name + ' ' + addressInfo.phone
              : '请选择'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function OrderInfoPage(props) {
  const {
    orderInfo,
    setOrderInfo,
    isLoading,
    setIsLoading,
    showDialog,
    setShowDialog,
    handleOrderClick,
    showAddressChange,
    setShowAddressChange,
    exeCloseAddressChange,
    setExeCloseAddressChange,
    countdown,
    showLogisticsDialog,
    setShowLogisticsDialog,
  } = OrderInfoVM(props);

  function renderTitle() {
    return CommonTitle('订单详情');
  }

  const BottomView = () => (
    <View style={styles.payView}>
      <View
        style={{
          height: '100%',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        {(orderInfo?.status !== 0 || (orderInfo?.status === 0 && countdown)) &&
          getBtnWithStatus(orderInfo, onItemClickBtn, false)}
      </View>
    </View>
  );

  function hideFun() {
    setShowDialog(undefined);
  }

  function rightBtnFun() {
    let par = JSON.parse(JSON.stringify(showDialog));
    setShowDialog(undefined);
    handleOrderClick(par);
  }

  function renderDialog() {
    let content = getDialogContent(showDialog?.tag);
    let cancelText = '取消';
    let sureText = '确定';

    return RenderCommonDialog(
      showDialog !== undefined && isNeedDialog(showDialog?.tag),
      hideFun,
      content,
      cancelText,
      sureText,
      hideFun,
      rightBtnFun,
    );
  }

  function onItemClickBtn(tag: number, orderInfo_: OrderInfo) {
    if (!orderInfo?.addressInfo) {
      Toast.show('请选择地址');
      return;
    }

    let data = {tag: tag, orderInfo: orderInfo_};
    setShowDialog(data);
    if (
      !isNeedDialog(tag) &&
      tag !== ORDER_REQ_REFUND &&
      tag !== ORDER_CHANGE_ADDRESS
    ) {
      handleOrderClick(data);
    } else {
      ORDER_CHANGE_ADDRESS === tag && setShowAddressChange(true);
    }
  }

  function onSureCallback(skuCode: string, count: number) {
    handleOrderClick(showDialog);
  }

  function renderRefundModal() {
    let show = showDialog?.tag === ORDER_REQ_REFUND;
    let view = (
      <OrderRefundDialog
        onDismiss={() => {
          setShowDialog(undefined);
        }}
        onSureCallback={onSureCallback}
        orderInfo={showDialog?.orderInfo}
      />
    );
    return showModal(view, show, hideFun, {
      expandHeight: 516,
      isFill: true,
      clickInnerClose: true,
      viewHeight: 516,
    });
  }

  function renderLogisticsDialog() {
    let height = orderInfo?.logisticsStatus?.length === 5 ? 490 : 290;
    height = orderInfo?.logisticsStatus?.length === 4 ? 425 : height;
    let view = (
      <LogisticsDialog
        onDismiss={() => {
          setShowLogisticsDialog(false);
        }}
        orderInfo={orderInfo}
      />
    );
    return showModal(
      view,
      showLogisticsDialog,
      () => {
        setShowLogisticsDialog(false);
      },
      {
        clickInnerClose: true,
        expandHeight: height,
        isFill: true,
        viewHeight: height,
      },
    );
  }

  // 商品卡片
  const ProductCard = (itemList: CartDto[]) => (
    <View style={styles.productCard}>
      {itemList?.map((item: CartDto, index: number) => {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{marginBottom: 12}}
            key={item.skuCode + index}
            onPress={() => {
              bridge.pushUrl(
                'Detail',
                JSON.stringify({productId: item.productId}),
              );
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={getPictureResource(item.banner)}
                style={styles.productImage}
              />
              <View style={styles.productInfoContainer}>
                <Text
                  style={styles.productName}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  {item.title}
                </Text>
                <Text style={styles.productSpec}>{item.skuDesc}</Text>
              </View>
              <View style={styles.productPriceContainer}>
                <Text style={styles.productPriceCurrent}>¥{item.price}</Text>
                <Text style={styles.productSpec}>x{item.count}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#eee',
          marginBottom: 16,
          marginTop: 4,
        }}></View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.9}
        onPress={() => {
          if (orderInfo.status !== 6) {
            bridge.pushUrl('Service');
          } else {
            handleOrderClick({
              tag: ORDER_CONTACT_SERVICE,
              orderInfo: orderInfo,
            });
          }
        }}>
        <Image
          source={require('../../../../rawfile/dev/media/icon/tel.svg')}
          style={{width: 16, height: 16, marginRight: 8}}
        />
        <Text style={{fontSize: 14, color: '#000000E5'}}>联系客服</Text>
      </TouchableOpacity>
    </View>
  );

  // 信息列表
  const InfoList = () => (
    <View style={[styles.productCard, {paddingVertical: 0}]}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>商品金额</Text>
        <Text style={styles.infoLabel}>
          ¥{orderInfo?.originalPrice ?? orderInfo?.finalPrice}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>优惠</Text>
        <Text style={[styles.couponValue, {color: THEME_COLOR}]}>
          - ¥{orderInfo?.discounts ?? 0}
        </Text>
      </View>
      <View style={[styles.infoRow, {marginBottom: 0}]}>
        <Text style={styles.infoLabel}>实付金额</Text>
        <Text style={styles.orderAmount}>¥{orderInfo?.finalPrice}</Text>
      </View>
    </View>
  );

  // 订单信息
  const OrderInfoList = () => (
    <View style={[styles.productCard, {paddingVertical: 0}]}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>订单号码</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.orderAmount}>{orderInfo?.orderNo}</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              bridge.copyText(orderInfo?.orderNo, () => {
                Toast.show('复制成功!');
              });
            }}>
            <Text style={styles.copyText}>复制</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>下单时间</Text>
        <Text style={styles.orderAmount}>
          {formatFullDate(new Date(orderInfo?.orderTime))}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>配送方式</Text>
        <Text style={styles.orderAmount}>
          {String(
            orderInfo?.receivingMethod === DELIVERY_TYPE_EXPRESS
              ? EXPRESS_TITLE
              : PICKUP_TITLE,
          )}
        </Text>
      </View>
      {orderInfo?.remark?.length > 0 && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>用户备注</Text>
          <Text
            style={[styles.orderAmount, {marginLeft: 16, maxWidth: '70%'}]}
            ellipsizeMode={'tail'}>
            {orderInfo?.remark}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: TopReactHeight,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      {renderTitle()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orderInfo && (
          <View
            style={{
              backgroundColor: BACKGROUND_COLOR,
              flex: 1,
              width: '100%',
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 12,
              }}>
              <Text style={{fontSize: 24, fontWeight: '500', marginBottom: 12}}>
                {getStatusString(orderInfo?.status)}
                {orderInfo?.status === 7 && (
                  <Text style={{fontSize: 16}}> ￥</Text>
                )}
                {orderInfo?.status === 7 && (
                  <Text>{orderInfo?.finalPrice} </Text>
                )}
              </Text>
              {(orderInfo?.status === 6 ||
                orderInfo?.status === 7 ||
                orderInfo?.status === 8) && (
                <Text
                  style={{
                    fontSize: 14,
                    color: '#999',
                    marginBottom: 12,
                  }}>
                  退款原因:{orderInfo.refundReason}
                </Text>
              )}
              {orderInfo?.status === 0 && countdown && (
                <Text
                  style={{color: '#00000099', fontSize: 12, marginBottom: 12}}>
                  订单将在
                  <Text style={{color: THEME_COLOR}}>
                    {' ' + countdown + ' '}
                  </Text>
                  在后取消，请尽快支付
                </Text>
              )}
            </View>
            {/*地址*/}
            {orderInfo &&
              addressInfoCard(
                orderInfo?.receivingMethod,
                orderInfo?.addressInfo,
                false,
                () => {
                  if (orderInfo?.addressInfo) {
                    setShowAddressChange(true);
                  }
                },
                orderInfo?.status,
                orderInfo?.refundPreStatus,
                show => {
                  setIsLoading(true);
                  OrderApi.getInstance().checkLogisticSendStatus(
                    orderInfo,
                    newOrder => {
                      setIsLoading(false);
                      if (!newOrder) {
                        setShowLogisticsDialog(show);
                      } else {
                        setOrderInfo(newOrder);
                        withDelay(() => {
                          setShowLogisticsDialog(show);
                        }).then();
                      }
                    },
                  );
                },
              )}
            {/*商品卡片*/}
            {ProductCard(orderInfo?.skuInfo)}

            {/*金额信息*/}
            {InfoList()}

            {/*订单信息*/}
            {OrderInfoList()}
          </View>
        )}
      </ScrollView>
      {isLoading && <Loading />}
      {BottomView()}
      {renderDialog()}
      {renderRefundModal()}
      {renderLogisticsDialog()}
      {showAddressChange && (
        <AddressChangeDialog
          addressInfo={orderInfo?.addressInfo}
          exeClosePayDetail={exeCloseAddressChange}
          setExeClosePayDetail={setExeCloseAddressChange}
          onClose={() => {
            setShowAddressChange(false);
            setShowDialog(undefined);
          }}
          onSubmit={address => {
            if (orderInfo) {
              orderInfo.addressInfo = address;
            }
            setOrderInfo(orderInfo);
            setShowAddressChange(false);
            OrderApi.getInstance()
              .createOrUpdate(orderInfo)
              .then(() => {
                handleOrderClick({
                  tag: ORDER_CHANGE_ADDRESS,
                  orderInfo: orderInfo,
                });
              });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  payView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 56 + BottomReactHeight - 12,
    paddingBottom: BottomReactHeight - 12,
  },
  addressCard: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
  },
  addressIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  addressTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  addressMainText: {
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 18,
    includeFontPadding: true,
    fontWeight: '500',
  },
  addressSubText: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 18,
    includeFontPadding: true,
  },
  addressChangeText: {
    width: 64,
    height: 28,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 14,
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#666',
  },
  productCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  productImage: {
    width: PRODUCT_IMAGE_SIZE,
    height: PRODUCT_IMAGE_SIZE,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
    fontWeight: '500',
    includeFontPadding: true,
  },
  productSpec: {
    fontSize: 12,
    color: '#000',
    opacity: 0.4,
    includeFontPadding: true,
  },
  productQuantity: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  productService: {
    flex: 1,
    textAlignVertical: 'bottom',
    fontSize: 10,
    color: '#999999',
  },
  productPriceContainer: {
    alignItems: 'flex-end',
    paddingLeft: 11,
  },
  productPriceCurrent: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
    includeFontPadding: true,
    color: '#000000E6',
    marginBottom: 9,
  },
  infoLabel: {
    fontSize: 12,
    color: '#00000099',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponValue: {
    fontSize: 14,
    color: THEME_COLOR,
  },
  orderAmount: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 6,
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
  },
  paymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  orderInfoTitle: {
    fontSize: 16,
    color: '#000000E6',
    marginBottom: 24.5,
    fontWeight: '600',
  },
  copyText: {
    width: 44,
    height: 20,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    borderRadius: 10,
    fontSize: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: THEME_COLOR,
    marginLeft: 8,
  },
});

export default OrderInfoPage;
