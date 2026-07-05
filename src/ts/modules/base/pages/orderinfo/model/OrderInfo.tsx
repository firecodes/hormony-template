import {CartDto} from '../../search/data/mockData/MockData';
import {AddressDTO} from '../../address/model/AddressDTO';

export interface OrderInfo {
  skuInfo: CartDto[];
  status: number; // 0: 待付款, 1: 已取消, 2: 待发货, 3: 待收货, 4: 待评价（交易成功）, 5:已评价（已完成）, 6: 退款中, 7:退款成功, 8:退款失败
  orderNo: string;
  orderTime: number;
  remainingTime: number;
  addressInfo: AddressDTO;
  remark: string;
  receivingMethod: string;
  originalPrice: number;
  finalPrice: number;
  discounts: number;
  refundPreStatus?: number; //申请退款之前的状态 可能是代发货也可能是待收货 记录以后方便取消退款时回退到指定状态
  refundReason?: string;
  refundTime?: number;
  coupons?: string[]; //如果选择了优惠券，记录优惠券id数组
  logisticsCode?: string; //快递编号
  logisticsStatus?: [string, string, number][]; //快递信息中的不同状态，对应已支付（待发货）、已发货（待收货）、运输中（模拟已发货1分钟以后自动变更）、待评价（确认收货以后）
  deliveryPersonPhone?: string; //配送员电话
}
