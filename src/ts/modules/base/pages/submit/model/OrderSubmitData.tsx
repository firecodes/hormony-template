import {CartDto} from '../../search/data/mockData/MockData';
import {AddressDTO} from '../../address/model/AddressDTO';
import {CouponItem} from '../../coupons/model/CouponModel';

export interface OrderSubmitData {
  deliveryType: string; //配送方式
  selAddress: AddressDTO | null; //地址信息
  cartDtos: CartDto[] | null; //订单信息
  remark: string; //备注
  discounts: CouponItem[]; //已选优惠券
  totalMinus: number; //优惠券减额
}
