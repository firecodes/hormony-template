import {CouponItem} from '../model/CouponModel';
import {ReductionTypes, ScenarioStatus} from './Types';

/**
 * 获取优惠减免金额
 */
export function getReduceAmount(coupon: CouponItem, orderMoney: number) {
  const precision = 1000;
  if (coupon.amountRule.discountType === ReductionTypes.DISCOUNT_REDUCTION) {
    return (
      ((precision - Number(coupon.amountRule.discountCoefficient) * precision) *
        orderMoney) /
      precision
    );
  }
  return Number(coupon.amountRule.discountAmount);
}

/**
 * 获取减免方式说明
 */
export function getReduceDesc(coupon: CouponItem) {
  switch (coupon.amountRule.discountType) {
    case ReductionTypes.FULL_REDUCTION:
      return '消费金额达到指定标准,即可享受减免';
    case ReductionTypes.DIRECT_REDUCTION:
      return '消费者直接享受相应减免';
    case ReductionTypes.DISCOUNT_REDUCTION:
      return '按指定折扣享受相应减免';
    default:
      return '';
  }
}

/**
 * 获取距离优惠日天数
 */
export function getReduceDays(coupon: CouponItem) {
  const currentDate = new Date();
  const targetDate = new Date(coupon.startTime);
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  if (daysDifference < 7) {
    return `${daysDifference} 天`;
  } else if (daysDifference < 30) {
    const weeks = Math.floor(daysDifference / 7);
    return `${weeks} 周`;
  } else if (daysDifference < 365) {
    const months = Math.floor(daysDifference / 30);
    return `${months} 月`;
  } else {
    const years = Math.floor(daysDifference / 365);
    return `${years} 年`;
  }
}

/**
 * 获取优惠券场景状态
 */
export function getScenarioStatus(coupon: CouponItem, orderMoney: number = 0) {
  if (coupon.offsetInfo) {
    return ScenarioStatus.HAS_USED;
  }
  const start = new Date(
    coupon.startTime.replace('年', '-').replace('月', '-').replace('日', '') +
      ' 0:0:0',
  ).getTime();
  const end = new Date(
    coupon.endTime.replace('年', '-').replace('月', '-').replace('日', '') +
      ' 23:59:59',
  ).getTime();
  if (
    coupon.amountRule.discountType === ReductionTypes.FULL_REDUCTION &&
    orderMoney < Number(coupon.amountRule.fullAmount)
  ) {
    return ScenarioStatus.LESS_FULL;
  }
  const now = new Date().getTime();
  if (end < now) {
    return ScenarioStatus.EXPIRE;
  }
  if (now < start) {
    return ScenarioStatus.FUTURE_USE;
  }
  return ScenarioStatus.NOW_USE;
}
