import {Point2CouponBean} from '../bean/Point2CouponBean';
import {CouponModel} from '../../coupons/model/CouponModel';
import {CommonRules} from '../../coupons/mockData/GetCoupons';
import {RecordPointChangeBean} from '../bean/RecordPointChangeBean';

export class ProfileMockData {
  static PREPARE_COUPONS_MOCK: Point2CouponBean[] = [
    {
      coupon: new CouponModel(
        '100001',
        '积分兑换1',
        '0',
        '2025年1月1日',
        '2028年1月1日',
        '2',
        CommonRules.RULE1_LOW,
        '-1',
        '0',
        '',
        '',
        '',
        '',
        '2',
        [],
        [{key: 0, value: '积分兑换券'}],
        '',
        '',
      ),
      point: 50,
    },
    {
      // 生效-待使用-活动期间-立减
      coupon: new CouponModel(
        '100002',
        '积分兑换2',
        '0',
        '2025年1月1日',
        '2035年1月1日',
        '2',
        CommonRules.RULE2,
        '-1',
        '0',
        '',
        '',
        '',
        '',
        '2',
        [],
        [{key: 0, value: '新用户注册'}],
        '',
        '',
      ),
      point: 60,
    },
    {
      // 生效-待使用-活动期间-折扣
      coupon: new CouponModel(
        '100003',
        '积分兑换3',
        '0',
        '2025年1月1日',
        '2035年1月1日',
        '2',
        CommonRules.RULE3,
        '-1',
        '0',
        '',
        '',
        '',
        '',
        '2',
        [],
        [{key: 0, value: '新用户注册'}],
        '',
        '',
      ),
      point: 70,
    },
  ];
  static recordPoint: RecordPointChangeBean[] = [];
}
