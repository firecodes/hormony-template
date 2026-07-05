import {useEffect, useRef, useState} from 'react';
import {OrderInfo} from '../model/OrderInfo';
import {formatTime, withDelay} from '../../../utils/CommonUtils';
import OrderApi from '../../myorder/OrderApi';
import bridge from '../../../utils/bridge';
import {DeviceEventEmitter} from 'react-native';
import {
  handleOrderClick_,
  ORDER_DELETE,
} from '../../myorder/viewmodel/MyOrderVM';

const CurrentPageName = 'OrderInfo';

export function OrderInfoVM(props) {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState<{
    tag: number;
    orderInfo: OrderInfo;
  }>(undefined); // 0不显示弹框 1:删除订单 2：取消订单 3：确认收货
  const [showAddressChange, setShowAddressChange] = useState(false);
  const [exeCloseAddressChange, setExeCloseAddressChange] = useState(false);
  const [countdown, setCountdown] = useState<string | undefined>('');
  let timerId: any = -1;
  const [needBack, setNeedBack] = useState<boolean>();
  const orderInfoRef = useRef(orderInfo);
  const isInitRef = useRef(false);
  const [showLogisticsDialog, setShowLogisticsDialog] = useState<boolean>(false);

  useEffect(() => {
    orderInfoRef.current = orderInfo;
  }, [orderInfo]);

  function initData() {
    setIsLoading(true);
    refresh();
  }

  function refresh() {
    let orderInfoTemp = JSON.parse(JSON.stringify(props.param));
    setOrderInfo(orderInfoTemp);
    withDelay(() => {
      setIsLoading(false);
      isInitRef.current = true;
    }, 500).then();
  }

  useEffect(() => {
    const getOrderInfoNew = () => {
      withDelay(async () => {
        let orderInfoTemp = await OrderApi.getInstance().getOrderOfNo(
          orderInfoRef.current?.orderNo,
        );
        if (orderInfoTemp && orderInfoRef.current) {
          orderInfoTemp.addressInfo = orderInfoRef.current.addressInfo;
        }
        setOrderInfo(orderInfoTemp);
      }).then();
    };
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (
        param?.pageName === CurrentPageName &&
        orderInfoRef.current &&
        isInitRef.current
      ) {
        getOrderInfoNew();
      }
    });
    let monOrderStatusChange = DeviceEventEmitter.addListener(
      'OrderStatusChange',
      async param => {
        getOrderInfoNew();
      },
    );
    initData();
    return () => {
      onPageShow.remove();
      monOrderStatusChange.remove();
    };
  }, []);

  function handleOrderClick(param?: {tag: number; orderInfo: OrderInfo}) {
    setIsLoading(true);
    let par = param ?? showDialog;
    handleOrderClick_(par, () => {
      setIsLoading(false);
      setShowDialog(undefined);
      if (par.tag === ORDER_DELETE) {
        setNeedBack(true);
      } else {
        OrderApi.getInstance()
          .getOrderOfNo(orderInfo.orderNo)
          .then(orderInfoTemp => {
            setOrderInfo(orderInfoTemp);
          });
      }
    });
  }

  useEffect(() => {
    if (needBack) {
      setTimeout(() => {
        bridge.back('');
      }, 500);
    }
  }, [needBack]);

  useEffect(() => {
    if (orderInfo) {
      timerId !== -1 && clearInterval(timerId);
      const now = new Date().getTime();
      if (orderInfo?.remainingTime <= now) {
        setCountdown(undefined);
        return;
      }
      let gap = Math.floor((orderInfo?.remainingTime - now) / 1000);
      setCountdown(formatTime(gap));
      timerId = setInterval(() => {
        gap--;
        if (gap < 0) {
          clearInterval(timerId);
          setCountdown(undefined);
        }
        setCountdown(formatTime(gap));
      }, 1000);
    }
    return () => {
      timerId !== -1 && clearInterval(timerId);
    };
  }, [orderInfo]);

  return {
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
  };
}
