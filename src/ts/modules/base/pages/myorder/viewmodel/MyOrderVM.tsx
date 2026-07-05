import {useEffect, useRef, useState} from 'react';
import {
  formatCommonDate,
  getDateTimes,
  withDelay,
} from '../../../utils/CommonUtils';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import OrderApi from '../OrderApi';
import bridge from '../../../utils/bridge';
import {OrderButtonData} from '../model/OrderButtonData';
import {DeviceEventEmitter} from 'react-native';
import {Toast} from '../../../utils/ToastManager';
import {MessageContBean} from '../../profile/bean/MessageContBean';
import {MyMessageVM, WeekDays} from '../../profile/vm/MyMessageVM';
import {getCouponsMock1} from '../../coupons/mockData/GetCoupons';

export const ORDER_CANCEL = 1; //取消订单
export const ORDER_DELETE = 2; //删除订单
export const ORDER_SURE_GET = 3; //确认收货
export const ORDER_RE_GET = 4; //再来一单
export const ORDER_EVAL = 5; //评价
export const ORDER_REQ_REFUND = 6; //申请退款
export const ORDER_REQ_CANCEL_REFUND = 7; //取消退款
export const ORDER_CHANGE_ADDRESS = 8; //修改地址
export const ORDER_URGE_SEND = 9; //催发货
export const ORDER_CONTACT_SERVICE = 10; //联系客服
export const ORDER_PAY = 11; //立即支付

export const Cancel: OrderButtonData = {
  text: '取消订单',
  tag: ORDER_CANCEL,
};
export const Pay: OrderButtonData = {
  text: '立即支付',
  tag: ORDER_PAY,
};
export const Delete: OrderButtonData = {
  text: '删除订单',
  tag: ORDER_DELETE,
};
export const ReGet: OrderButtonData = {
  text: '再来一单',
  tag: ORDER_RE_GET,
};
export const Refund: OrderButtonData = {
  text: '申请退款',
  tag: ORDER_REQ_REFUND,
};
export const CancelRefund: OrderButtonData = {
  text: '取消退款',
  tag: ORDER_REQ_CANCEL_REFUND,
};
export const ChangeAddress: OrderButtonData = {
  text: '修改地址',
  tag: ORDER_CHANGE_ADDRESS,
};
export const UrgeSend: OrderButtonData = {
  text: '催发货',
  tag: ORDER_URGE_SEND,
};
export const SureGet: OrderButtonData = {
  text: '确认收货',
  tag: ORDER_SURE_GET,
};
export const Eval: OrderButtonData = {
  text: '评价',
  tag: ORDER_EVAL,
};
export const ContactService: OrderButtonData = {
  text: '联系客服',
  tag: ORDER_CONTACT_SERVICE,
};

export function getBtnsWithStatus(status: number): OrderButtonData[] {
  switch (status) {
    case 0:
      return [Cancel, Pay];
    case 1:
      return [Delete, ReGet];
    case 2:
      return [Refund, UrgeSend];
    case 3:
      return [Refund, SureGet];
    case 4:
      return [ReGet, Eval];
    case 5:
      return [ReGet];
    case 6:
      return [ContactService, CancelRefund];
    case 7:
      return [Delete];
    case 8:
      return [ContactService, Refund];
    default:
      return [];
  }
}

export function isNeedDialog(status: number) {
  return (
    status === ORDER_CANCEL ||
    status === ORDER_DELETE ||
    status === ORDER_SURE_GET
  );
}

export function getDialogContent(tag: number) {
  if (tag === ORDER_CANCEL) {
    return '取消后无法恢复，是否确认取消订单？';
  } else if (tag === ORDER_DELETE) {
    return '是否确认删除订单，删除后不可恢复';
  } else if (tag === ORDER_SURE_GET) {
    return '为了保证您的售后权益，请收到商品确认无误后再确认收货';
  }
}

export function MyOrderVM(props) {
  const CurrentPageName = 'MyOrder';
  const [orderList, setOrderList] = useState<OrderInfo[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState<{
    tag: number;
    orderInfo: OrderInfo;
  }>(undefined); // 0不显示弹框 1:删除订单 2：取消订单 3：确认收货
  const [pageNum, setPageNum] = useState(0);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [selTabIndex, setSelTabIndex] = useState(0);
  const [totalDataNum, setTotalDataNum] = useState(-1);
  const [showAddressChange, setShowAddressChange] = useState(false);
  const [exeCloseAddressChange, setExeCloseAddressChange] = useState(false);
  const orderListRef = useRef(orderList);
  const pageNumRef = useRef(pageNum);
  const totalDataNumRef = useRef(totalDataNum);
  const selTabIndexRef = useRef(selTabIndex);
  const isInitRef = useRef(false);
  let searchTimeId: any = -1;

  useEffect(() => {
    if (searchText?.length > 0) {
      if (searchTimeId !== -1) {
        clearTimeout(searchTimeId);
      }
      searchTimeId = setTimeout(() => {
        refreshList();
      }, 500);
    } else {
      refreshList();
    }
  }, [searchText]);

  useEffect(() => {
    totalDataNumRef.current = totalDataNum;
  }, [totalDataNum]);

  useEffect(() => {
    pageNumRef.current = pageNum;
  }, [pageNum]);

  useEffect(() => {
    orderListRef.current = orderList;
  }, [orderList]);

  useEffect(() => {
    let onAddressChange = DeviceEventEmitter.addListener(
      'onAddressChange',
      async param => {
        if (showDialog?.orderInfo && param.newAddress) {
          showDialog.orderInfo.addressInfo = JSON.parse(param.newAddress);
          await OrderApi.getInstance().createOrUpdate(showDialog.orderInfo);
          refreshList();
        }
      },
    );
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === CurrentPageName) {
        refreshList(false, true);
      }
    });

    let onOrderStatusChange = DeviceEventEmitter.addListener(
      'OrderStatusChange',
      async param => {
        let newOrder = await OrderApi.getInstance().getOrderOfNo(param.orderNo);
        let needStatus = [];
        if (selTabIndexRef.current === 1) {
          needStatus = [0];
        } else if (selTabIndexRef.current === 2) {
          needStatus = [2];
        } else if (selTabIndexRef.current === 3) {
          needStatus = [3];
        } else if (selTabIndexRef.current === 4) {
          needStatus = [4];
        } else if (selTabIndexRef.current === 5) {
          needStatus = [6, 7, 8];
        }
        if (needStatus.length > 0) {
          let changeIndex = -1;
          let filterList = orderListRef.current?.filter((item, index) => {
            if (item.orderNo !== param.orderNo) {
              return needStatus.includes(item.status);
            } else {
              changeIndex = index;
              return newOrder ? needStatus.includes(newOrder.status) : false;
            }
          });
          if (
            newOrder &&
            filterList[changeIndex] &&
            filterList[changeIndex].orderNo === newOrder.orderNo
          ) {
            filterList[changeIndex] = newOrder;
          }
          setOrderList([...filterList]);
        } else {
          if (newOrder) {
            let index = -1;
            orderListRef.current.map((item, index_) => {
              if (index === -1 && item.orderNo === param.orderNo) {
                index = index_;
              }
            });
            orderListRef.current[index] = newOrder;
            let newOrderList = [...orderListRef.current];
            setOrderList([...newOrderList]);
          } else {
            setOrderList([
              ...orderListRef.current.filter(
                item => item.orderNo !== param.orderNo,
              ),
            ]);
          }
        }
      },
    );
    getOrderList(0);
    return () => {
      onAddressChange.remove();
      onOrderStatusChange.remove();
      onPageShow.remove();
    };
  }, []);

  const filterSearch = (orderList_: OrderInfo[]) => {
    orderList_ = orderList_.filter(item => {
      let match = false;
      item.skuInfo?.map(item => {
        if (
          item.title?.includes(searchText) ||
          item.skuDesc?.includes(searchText)
        ) {
          match = true;
        }
      });
      return match;
    });
    return orderList_;
  };

  const getOrderList = (
    pageNumPar: number = 0,
    needLoading: boolean = true,
    justCheck: boolean = false,
  ) => {
    let totalDataNum_ = totalDataNumRef.current;
    if (
      !justCheck &&
      totalDataNum_ !== -1 &&
      (pageNumPar * 4 > totalDataNum_ ||
        totalDataNum_ <= orderListRef.current.length)
    ) {
      return; //已加载完所有数据
    }
    if (needLoading && pageNumPar === 0) {
      setIsLoading(true);
    } else if (needLoading && pageNumPar !== 0) {
      setLoadingMore(true);
    }
    withDelay(async () => {
      let orderList_ = await OrderApi.getInstance().getAll();
      //排序
      orderList_ = orderList_.sort((a, b) => b.orderTime - a.orderTime);
      //按已选tab进行筛选
      let status = getSelStatus(selTabIndexRef.current);
      if (selTabIndexRef.current !== -1 && selTabIndexRef.current !== 0) {
        orderList_ = orderList_.filter(item => status.includes(item.status));
      }
      //检查时是否有搜索 有的话按搜索筛选
      if (searchText?.length > 0) {
        orderList_ = filterSearch(orderList_);
      }

      //先判断是否是分页
      let startIndex = pageNumPar * 4;
      let endPageNum = pageNumPar + 1;
      let endIndex =
        totalDataNum_ > 0 && endPageNum * 4 > totalDataNum_
          ? totalDataNum_
          : endPageNum * 4;

      //剩下的才是此时数据的全量内容 记录总数
      if (justCheck) {
        let newOrderList = orderList_.filter(
          items =>
            orderListRef.current?.filter(
              items_ => items.orderNo === items_.orderNo,
            )?.length === 0,
        );
        orderListRef.current = [...newOrderList, ...orderListRef.current];
        setTotalDataNum(orderListRef.current.length);
        //设置之前对数据进行排序 默认的列表排序为创建订单事件排序 不用更改 只有退款售后需要根据申请退款和已退款状态事件来排序 大的在上
        setOrderList(orderListRef.current);
      } else {
        setTotalDataNum(orderList_.length);
        //按照分页截取
        orderList_ = orderList_.slice(startIndex, endIndex);
        orderListRef.current = needLoading
          ? [...orderListRef.current, ...orderList_]
          : [...orderList_];
        setOrderList(orderListRef.current);
      }
      setPageNum(pageNumRef.current + 1);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMore(false);
        isInitRef.current = true;
      }, 100);
    }).then();
  };

  function refreshList(
    needLoading: boolean = true,
    justCheck: boolean = false,
  ) {
    if (!isLoading && isInitRef.current) {
      resetData();
      if (needLoading) {
        setOrderList([]);
        orderListRef.current = [];
      }
      getOrderList(0, needLoading, justCheck);
    }
  }

  function resetData() {
    setTotalDataNum(-1);
    totalDataNumRef.current = -1;
    setPageNum(0);
    pageNumRef.current = 0;
  }

  useEffect(() => {
    selTabIndexRef.current = selTabIndex;
    resetData();
    if (selTabIndex !== -1) {
      refreshList();
    }
  }, [selTabIndex]);

  function handleOrderClick(param?: {tag: number; orderInfo: OrderInfo}) {
    setIsLoading(true);
    let par = param ?? showDialog;
    handleOrderClick_(par, () => {
      setIsLoading(false);
      setShowDialog(undefined);
    });
  }

  // 暴露状态和方法给组件
  return {
    orderList,
    getOrderList,
    loadingMore,
    isLoading,
    pageNum,
    searchText,
    setSearchText,
    selTabIndex,
    setSelTabIndex,
    showDialog,
    setShowDialog,
    handleOrderClick,
    showAddressChange,
    setShowAddressChange,
    exeCloseAddressChange,
    setExeCloseAddressChange,
  };
}

export function resetOrderSelCoupons(orderInfo: OrderInfo) {
  if (orderInfo.coupons && orderInfo.coupons?.length > 0) {
    orderInfo.coupons.forEach(item => {
      getCouponsMock1.forEach(item_ => {
        if (item === item_.couponID) {
          item_.status = '2';
          item_.offsetInfo = undefined;
        }
      });
    });
  }
}

function onSend(orderInfo: OrderInfo) {
  bridge.getOhPrefData(preData => {
    let newMsg = new MessageContBean();
    newMsg.date = formatCommonDate(new Date(), 1);
    newMsg.weekday = WeekDays[new Date().getDay()];
    newMsg.diff = new Date().getDay();
    newMsg.desc = '您的订单已发货！';
    newMsg.type = MyMessageVM.TYPE_MESSAGE;
    newMsg.time = String(getDateTimes(new Date()));
    newMsg.detail = '您的订单已发货！';
    if (preData) {
      let preDatas = JSON.parse(String(preData)) as MessageContBean[];
      preDatas.push(newMsg);
      bridge.setOhPrefData('sys_message', JSON.stringify(preDatas));
    } else {
      bridge.setOhPrefData(
        'sys_message',
        JSON.stringify([
          ...(new MyMessageVM().getMessageCont() as MessageContBean[]).filter(
            item => item.type === MyMessageVM.TYPE_MESSAGE,
          ),
          newMsg,
        ]),
      );
    }
  }, 'sys_message');
}

function onConcatService(orderInfo: OrderInfo) {
  resetOrderSelCoupons(orderInfo);
  bridge.getOhPrefData(prefData => {
    let newMsg = new MessageContBean();
    newMsg.time = String(getDateTimes(new Date()));
    newMsg.weekday = WeekDays[new Date().getDay()];
    newMsg.date = formatCommonDate(new Date(), 1);
    newMsg.desc = '您的订单已退款！';
    newMsg.diff = new Date().getDay();
    newMsg.detail = '您的订单已退款！';
    newMsg.type = MyMessageVM.TYPE_MESSAGE;
    if (prefData) {
      let preDatas = JSON.parse(String(prefData)) as MessageContBean[];
      preDatas.push(newMsg);
      bridge.setOhPrefData('sys_message', JSON.stringify(preDatas));
    } else {
      bridge.setOhPrefData(
        'sys_message',
        JSON.stringify([
          ...(new MyMessageVM().getMessageCont() as MessageContBean[]).filter(
            item => item.type === MyMessageVM.TYPE_MESSAGE,
          ),
          newMsg,
        ]),
      );
    }
    bridge.pushUrl('Service');
  }, 'sys_message');
}

export function handleOrderClick_(
  par?: {tag: number; orderInfo: OrderInfo},
  onCallBack?: () => void,
) {
  if (!par) {
    return;
  }
  withDelay(async () => {
    switch (par.tag) {
      case ORDER_CANCEL:
        await OrderApi.getInstance().toCancel(par.orderInfo);
        resetOrderSelCoupons(par.orderInfo);
        break;
      case ORDER_DELETE:
        await OrderApi.getInstance().delete(par.orderInfo);
        break;
      case ORDER_SURE_GET:
        await OrderApi.getInstance().toEvaluate(par.orderInfo);
        break;
      case ORDER_RE_GET:
      {
        let itemList = [];
        par.orderInfo.skuInfo.map(item => {
          itemList.push({
            skuCode: item.skuCode,
            count: item.count,
            productId: item.productId,
            price: item.price,
            dashPrice: item.dashPrice,
          });
        });
        bridge.pushUrl('Submit', JSON.stringify({items: itemList}));
      }
        break;
      case ORDER_EVAL:
        bridge.pushUrl('PostEval', JSON.stringify(par.orderInfo));
        break;
      case ORDER_REQ_REFUND:
        await OrderApi.getInstance().toRefund(par.orderInfo);
        break;
      case ORDER_REQ_CANCEL_REFUND:
        if (par.orderInfo.refundPreStatus === 2) {
          await OrderApi.getInstance().toShipment(par.orderInfo);
        } else if (par.orderInfo.refundPreStatus === 3) {
          await OrderApi.getInstance().toReceipt(par.orderInfo);
        }
        break;
      case ORDER_CHANGE_ADDRESS:
        await OrderApi.getInstance().createOrUpdate(par.orderInfo);
        break;
      case ORDER_URGE_SEND:
        await OrderApi.getInstance().toReceipt(par.orderInfo);
        onSend(par.orderInfo);
        Toast.show('已提交催发货申请，请耐心等待～');
        break;
      case ORDER_CONTACT_SERVICE:
        //此处应有弹框
        await OrderApi.getInstance().hasRefund(par.orderInfo);
        onConcatService(par.orderInfo);
        break;
      case ORDER_PAY:
        bridge.requestPayment(par.orderInfo.orderNo, () => {});
        //假设支付成功
        await OrderApi.getInstance().toShipment(par.orderInfo);
        break;
      default:
        break;
    }
  }).then(() => {
    setTimeout(() => {
      DeviceEventEmitter.emit('OrderStatusChange', {
        orderNo: par?.orderInfo.orderNo,
      });
      onCallBack && onCallBack?.();
    }, 1000);
  });
}

export const getSelStatus = (selTabIndex): number[] => {
  switch (selTabIndex) {
    case 0:
      return [-1];
    case 1:
      return [0];
    case 2:
      return [2];
    case 3:
      return [3];
    case 4:
      return [4];
    case 5:
      return [6, 7, 8];
    default:
      return [-1];
  }
};

export const getStatusString = (status: number): string => {
  switch (status) {
    case 0:
      return '待付款';
    case 1:
      return '已取消';
    case 2:
      return '待发货';
    case 3:
      return '待收货';
    case 4:
      return '交易成功';
    case 5:
      return '交易成功';
    case 6:
      return '退款中';
    case 7:
      return '退款成功';
    default:
      return '';
  }
};

/**
 * 从3开始要弹框 且状态为6，7，8时实际要根据其对应的退款前的状态来显示提示信息，也就是refundPreStatus
 * @param status status不是6，7，8时直接用orderInfo.status 否则使用orderInfo.refundPreStatus
 */
export const getLogisticsDesc = (status: number): string[] => {
  switch (status) {
    case 2:
      return ['待确认', '您提交了订单，请等待商家确认'];
    case 3:
      return ['运输中', '您的包裹正在快马加鞭运输中'];
    case 4:
    case 5:
      return ['已签收', '您的商品已签收，如有疑问请电话联系快递员。'];
    default:
      return [];
  }
};
