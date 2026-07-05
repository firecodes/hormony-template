import bridge from '../../utils/bridge';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import {withDelay} from '../../utils/CommonUtils';
import {getLogisticsDesc} from './viewmodel/MyOrderVM';

export const PREFERENCE_KEY_ORDER_LIST = 'orderList';

class OrderApi {
  private static instance: OrderApi | null = null;

  private constructor() {}

  public static getInstance() {
    if (OrderApi.instance === null) {
      OrderApi.instance = new OrderApi();
    }
    return OrderApi.instance;
  }

  private changeOrderStatus = async (item: OrderInfo, status: number) => {
    let orderList = await this.getAll();
    let findIndex = -1;
    orderList.filter((item_, index_) => {
      if (item_.orderNo === item.orderNo) {
        findIndex = index_;
      }
    });
    if (findIndex >= 0 && orderList[findIndex]) {
      if (status === 6) {
        orderList[findIndex].refundPreStatus = orderList[findIndex]?.status;
        orderList[findIndex].refundReason = item.refundReason;
      }
      if (status === 6 || status === 7) {
        orderList[findIndex].refundTime = new Date().getTime();
      }
      orderList[findIndex].status = status;
      orderList[findIndex].logisticsStatus = item.logisticsStatus;
      orderList[findIndex].logisticsCode = item.logisticsCode;
    }
    let dataStr = JSON.stringify(orderList);
    bridge.setOhPrefData(PREFERENCE_KEY_ORDER_LIST, dataStr);
  };

  //已取消
  public toCancel = async (item: OrderInfo) => {
    withDelay(() => this.changeOrderStatus(item, 1)).then();
  };

  //待发货
  public toShipment = async (item: OrderInfo) => {
    let loDesc = getLogisticsDesc(2);
    item.logisticsStatus = [[loDesc[0], loDesc[1], new Date().getTime()]];
    item.logisticsCode = this.getLogisticsCode();
    withDelay(() => this.changeOrderStatus(item, 2)).then();
  };

  //待收货
  public toReceipt = async (item: OrderInfo) => {
    item.logisticsStatus?.unshift([
      '已发货',
      '快递员已取包裹，即将开始运输',
      new Date().getTime(),
    ]);
    withDelay(() => this.changeOrderStatus(item, 3)).then();
  };

  //待评价
  public toEvaluate = async (item: OrderInfo) => {
    let desc = getLogisticsDesc(4);
    item.logisticsStatus?.unshift([desc[0], desc[1], new Date().getTime()]);
    withDelay(() => this.changeOrderStatus(item, 4)).then();
  };

  //已评价（已完成）
  public hasEvaluateOrFinish = async (item: OrderInfo) => {
    withDelay(() => {
      this.changeOrderStatus(item, 5);
    }).then(() => {});
  };

  //退款/售后中
  public toRefund = async (item: OrderInfo) => {
    withDelay(() => this.changeOrderStatus(item, 6)).then();
  };

  //已退款
  public hasRefund = async (item: OrderInfo) => {
    withDelay(() => this.changeOrderStatus(item, 7)).then();
  };

  public delete = async (item: OrderInfo) => {
    withDelay(async () => {
      let orderList = await this.getAll();
      orderList = orderList.filter(
        (item_, index_) => item_.orderNo !== item.orderNo,
      );
      let dataStr = JSON.stringify(orderList);
      bridge.setOhPrefData(PREFERENCE_KEY_ORDER_LIST, dataStr);
    }).then();
  };

  public createOrUpdate = async (item: OrderInfo) => {
    return new Promise((res, rej) => {
      withDelay(async () => {
        let orderList = await this.getAll();
        let findIndex = -1;
        orderList?.map((item_, index_) => {
          if (findIndex === -1 && item_.orderNo === item.orderNo) {
            findIndex = index_;
          }
        });
        if (findIndex === -1) {
          orderList.push(item);
        } else {
          orderList[findIndex] = item;
        }
        let dataStr = JSON.stringify(orderList);
        bridge.setOhPrefData(PREFERENCE_KEY_ORDER_LIST, dataStr);
      })
        .then(() => {
          res(undefined);
        })
        .catch(() => {
          rej();
        });
    });
  };

  public getAll = async (): Promise<OrderInfo[]> => {
    return new Promise<OrderInfo[]>(res => {
      bridge.getOhPrefData((result: any | null) => {
        let dataStr = result;
        let orderList =
          dataStr !== null ? (JSON.parse(dataStr) as OrderInfo[]) : [];
        res(orderList);
      }, PREFERENCE_KEY_ORDER_LIST);
    });
  };

  public getOrderOfNo = async (orderNo: string): Promise<OrderInfo> => {
    let orderList = await this.getAll();
    let res: OrderInfo | null = null;
    orderList.map(item => {
      if (!res && item.orderNo === orderNo) {
        res = item;
      }
    });
    return res;
  };

  public getLogisticsCode() {
    return 'HW012345' + new Date().getTime();
  }

  //运输中描述
  public addStatus1(
    order: OrderInfo,
    logisticsStatus: any,
    mockTimeSpace: number,
  ) {
    //运输中描述
    let des = getLogisticsDesc(3);
    order.logisticsStatus.unshift([
      des[0],
      des[1],
      logisticsStatus[1][2] + mockTimeSpace,
    ]);
  }

  //派送中描述
  public addStatus2(
    order: OrderInfo,
    mockDelyPersonPhone: string,
    curTime: number,
  ) {
    order.deliveryPersonPhone = mockDelyPersonPhone;
    order.logisticsStatus.unshift([
      '运输中',
      `派件交给【华为快递员，联系电话：${order.deliveryPersonPhone}，正在派送途中（如有任何问题可优先联系我！）`,
      curTime,
    ]);
  }

  public checkLogisticSendStatus(
    order: OrderInfo,
    callBack: (orderInfo?: OrderInfo) => void,
  ) {
    // 模拟已发货一段时间以后，状态从已发货变为运输中，时间间隔超过一分钟就变更，即增加物流状态，然后更新订单数据
    let logisticsStatus = order?.logisticsStatus;
    let mockTimeSpace = 60 * 1000;
    let mockDelyPersonPhone = '123***78';
    let isStatus = order.status === 3 || order.refundPreStatus === 3;
    let curTime = new Date().getTime();

    if (!isStatus) {
      callBack?.(undefined);
      return;
    }
    let isChange = false;
    if (
      logisticsStatus?.length === 2 &&
      curTime - logisticsStatus[1][2] > mockTimeSpace * 2
    ) {
      this.addStatus1(order, logisticsStatus, mockTimeSpace);
      this.addStatus2(order, mockDelyPersonPhone, curTime);
      isChange = true;
    } else if (
      logisticsStatus?.length === 2 &&
      curTime - logisticsStatus[1][2] > mockTimeSpace
    ) {
      this.addStatus1(order, logisticsStatus, mockTimeSpace);
      isChange = true;
    } else if (
      logisticsStatus?.length === 3 &&
      curTime - logisticsStatus[2][2] > mockTimeSpace
    ) {
      //派送中描述
      this.addStatus2(order, mockDelyPersonPhone, curTime);
      isChange = true;
    }

    if (isChange) {
      this.createOrUpdate(order).then(() => {
        callBack?.(order);
      });
    } else {
      callBack?.(undefined);
    }
  }
}

export default OrderApi;
