import bridge from '../../../utils/bridge';
import {CartDto} from '../../search/data/mockData/MockData';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import OrderApi from '../../myorder/OrderApi';
import {AddressDTO} from '../../address/model/AddressDTO';
import {DELIVERY_TYPE_EXPRESS} from '../../../utils/Constant';
import {useEffect, useRef, useState} from 'react';
import {OrderSubmitData} from '../model/OrderSubmitData';
import CartDataApi from '../../cart/api/CartDataApi';
import {Api, DefaultStoreAddress} from '../../address/http/Api';
import {DeviceEventEmitter} from 'react-native';
import {WindowInfo} from '../../../utils/WindowInfo';
import {Toast} from '../../../utils/ToastManager';

export function OrderSubmitVM(props) {
  const [isLoading, setIsLoading] = useState(true);
  const {foldStatus} = WindowInfo();
  const [orderSubmitData, setOrderSubmitData] = useState<OrderSubmitData>({
    deliveryType: DELIVERY_TYPE_EXPRESS,
    selAddress: null,
    cartDtos: null,
    remark: '',
    discounts: [],
    totalMinus: 0,
  });
  const orderSubmitDataRef = useRef(orderSubmitData);

  useEffect(() => {
    orderSubmitDataRef.current = orderSubmitData;
  }, [orderSubmitData]);

  function initData(items: CartDto[]) {
    setIsLoading(true);
    setOrderSubmitData({
      deliveryType: DELIVERY_TYPE_EXPRESS,
      selAddress: null,
      cartDtos: null,
      remark: '',
      discounts: [],
      totalMinus: 0,
    });
    Api.getDefaultAddress()
      .then(address => {
        orderSubmitData.selAddress = address;
      })
      .catch(() => {})
      .finally(() => {
        orderSubmitData.cartDtos = [];
        items.map(item => {
          let curCartDto = CartDataApi.getInstance().getCartDataOfCode(
            item.skuCode,
            item.count,
            item.productId,
            item.price,
            item.dashPrice,
          );
          orderSubmitData.cartDtos.push(curCartDto);
        });
        setOrderSubmitData(JSON.parse(JSON.stringify(orderSubmitData)));
        setIsLoading(false);
      });
  }

  function createOrder() {
    if (!orderSubmitDataRef.current) {
      return;
    }

    if (!orderSubmitDataRef.current.selAddress) {
      Toast.show('请选择地址');
      return;
    }

    let address: AddressDTO =
      orderSubmitDataRef.current.deliveryType === DELIVERY_TYPE_EXPRESS
        ? orderSubmitDataRef.current.selAddress
        : DefaultStoreAddress;
    let cartDtos: CartDto[] | null = orderSubmitDataRef.current.cartDtos;
    let remark: string = orderSubmitDataRef.current.remark;
    let receivingMethod: string = orderSubmitDataRef.current.deliveryType;
    let discounts: number = orderSubmitDataRef.current.totalMinus;

    const skuList = cartDtos ?? [];
    let totalOriginalPrice = 0;
    let totalFinalPrice = 0;
    skuList.map(item => {
      totalOriginalPrice += item.count * Number(item.price ?? 0);
      totalFinalPrice += item.count * Number(item.price ?? 0);
    });
    totalFinalPrice -= discounts;
    const orderTime = new Date().getTime();
    const orderNo = 'mock_order_' + orderTime;
    const remainingTime = orderTime + 60 * 60 * 1000 * 24;
    const orderItem: OrderInfo = {
      skuInfo: skuList,
      status: 0,
      orderNo,
      orderTime,
      remainingTime,
      addressInfo: address,
      remark,
      receivingMethod,
      originalPrice: totalOriginalPrice,
      finalPrice: totalFinalPrice,
      discounts: discounts,
    };
    if (orderSubmitDataRef.current.discounts?.length > 0) {
      orderItem.coupons = orderSubmitDataRef.current.discounts.map(
        item => item.couponID,
      );
    }
    if (props?.isFromCartPage && props?.items) {
      CartDataApi.getInstance().deleteCartData(props?.items).then();
    }
    //添加待付款订单数据
    OrderApi.getInstance()
      .createOrUpdate(orderItem)
      .then(() => {});
    //跳转到订单详情页面
    bridge.replaceUrl('OrderInfo', JSON.stringify({param: orderItem}));
  }

  function setDeliveryType(type: string) {
    orderSubmitDataRef.current.deliveryType = type;
    setOrderSubmitData(JSON.parse(JSON.stringify(orderSubmitDataRef.current)));
  }

  function setRemark(remark: string) {
    orderSubmitDataRef.current.remark = remark;
    setOrderSubmitData(JSON.parse(JSON.stringify(orderSubmitDataRef.current)));
  }

  useEffect(() => {
    let onAddressSelect = DeviceEventEmitter.addListener(
      'onAddressSelect',
      param => {
        if (param.address) {
          orderSubmitDataRef.current.selAddress = JSON.parse(param.address);
          setOrderSubmitData(
            JSON.parse(JSON.stringify(orderSubmitDataRef.current)),
          );
        }
      },
    );

    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === 'Submit') {
        if (
          orderSubmitDataRef.current?.selAddress &&
          !bridge.isAddressExist(
            JSON.stringify(orderSubmitDataRef.current.selAddress),
          )
        ) {
          orderSubmitDataRef.current.selAddress = undefined;
          setOrderSubmitData(
            JSON.parse(JSON.stringify(orderSubmitDataRef.current)),
          );
        }
      }
    });
    return () => {
      onAddressSelect.remove();
      onPageShow.remove();
    };
  }, []);

  return {
    orderSubmitData,
    setOrderSubmitData,
    initData,
    createOrder,
    isLoading,
    setDeliveryType,
    setRemark,
    foldStatus,
  };
}
