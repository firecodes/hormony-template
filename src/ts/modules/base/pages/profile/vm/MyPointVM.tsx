import {getCouponsMock1} from '../../coupons/mockData/GetCoupons';
import {Point2CouponBean} from '../bean/Point2CouponBean';
import bridge from '../../../utils/bridge';
import {ProfileMockData} from '../mockdata/ProfileMockData';
import {RecordPointChangeBean} from '../bean/RecordPointChangeBean';
import {useState} from 'react';
import {formatCommonDate} from '../../../utils/CommonUtils';

const TAG = 'MyPointVM';

export function MyPointVM() {
  const [myPoints, setMyPoints] = useState(0);
  const [currCheckDay, setCurrCheckDay] = useState(0);
  const [hasCheckIn, setHasCheckIn] = useState(true);
  const [point2Coupon, setPoint2Coupon] = useState<Point2CouponBean[]>([]);
  const [showUsePoint, setShowUsePoint] = useState(false);
  const [usePoint2Coupon, setUsePoint2Coupon] = useState<Point2CouponBean>();
  const [usePointIndex, setUsePointIndex] = useState(-1);

  function getMyPointsData() {
    bridge.getOhPrefData(point => {
      try {
        setMyPoints(parseInt(point.toString()));
      } catch (e) {
        setMyPoints(0);
      }
    }, 'my_point');
  }

  function setMyPointsData(point: number) {
    setMyPoints(point);
    bridge.setOhPrefData('my_point', String(point));
  }

  function getWeekPoint() {
    return [
      {
        point: 50,
        index: 1,
      },
      {
        point: 50,
        index: 2,
      },
      {
        point: 50,
        index: 3,
      },
      {
        point: 50,
        index: 4,
      },
      {
        point: 50,
        index: 5,
      },
      {
        point: 50,
        index: 6,
      },
      {
        point: 50,
        index: 7,
      },
    ];
  }

  function setCurrentCheck(currDays: number) {
    setCurrCheckDay(currDays);
    bridge.setOhPrefData('my_point_checkin_days', currDays);
  }

  function getPoint2Coupons() {
    return ProfileMockData.PREPARE_COUPONS_MOCK;
  }

  function doPoint2Coupon(point2CouponBean: Point2CouponBean) {
    let coupon = point2CouponBean.coupon;
    let isExist = false;
    getCouponsMock1.forEach(item => {
      if (item.couponID === coupon.couponID) {
        isExist = true;
      }
    });
    if (isExist) {
      bridge.hiLog(TAG, 'couponID is exits : ' + coupon.couponID);
      return;
    }
    getCouponsMock1.unshift(coupon);
    // 记录
    recordPointChange('积分兑换', -point2CouponBean.point);
  }

  function recordPointChange(action: string, point: number) {
    let pointRecord = new RecordPointChangeBean();
    pointRecord.point = point;
    pointRecord.action = action;
    if (ProfileMockData.recordPoint) {
      ProfileMockData.recordPoint.unshift(pointRecord);
      bridge.setOhPrefData(
        'my_point_record',
        JSON.stringify(ProfileMockData.recordPoint),
      );
    } else {
      bridge.getOhPrefData(record => {
        ProfileMockData.recordPoint =
          record && (record as string).length > 0 && (record as string) !== '[]'
            ? JSON.parse(record as string)
            : [];
      }, 'my_point_record');
    }
  }

  function getPointRecord() {
    return ProfileMockData.recordPoint;
  }

  function initData() {
    getMyPointsData();
    setPoint2Coupon(getPoint2Coupons());
    bridge.getOhPrefData(currDays => {
      setCurrCheckDay(currDays ? (currDays as number) : 0);
    }, 'my_point_checkin_days');
    bridge.getOhPrefData(lastTime => {
      let curTime = formatCommonDate(new Date());
      setHasCheckIn(curTime === lastTime);
    }, 'my_point_last_checkin_time');
    bridge.getOhPrefData(record => {
      ProfileMockData.recordPoint =
        record && (record as string).length > 0 && (record as string) !== '[]'
          ? JSON.parse(record as string)
          : [];
    }, 'my_point_record');
  }

  function onCheckIn() {
    setHasCheckIn(true);
    bridge.setOhPrefData(
      'my_point_last_checkin_time',
      formatCommonDate(new Date()),
    );

    let curCheckDayTemp = currCheckDay + 1;
    setCurrentCheck(curCheckDayTemp);
    let myPointsTemp = myPoints + 50;
    setMyPointsData(myPointsTemp);
    recordPointChange('积分签到', 50);
  }

  function onPointsExchange() {
    let myPointsTemp = myPoints - usePoint2Coupon.point;
    setMyPoints(myPointsTemp);
    setMyPointsData(myPointsTemp);
    let point2CouponTmp = point2Coupon;
    point2CouponTmp.splice(usePointIndex, 1);
    setPoint2Coupon(point2CouponTmp);
    doPoint2Coupon(usePoint2Coupon);
    setShowUsePoint(false);
  }

  return {
    initData,
    onCheckIn,
    myPoints,
    currCheckDay,
    getWeekPoint,
    hasCheckIn,
    setUsePoint2Coupon,
    setUsePointIndex,
    setShowUsePoint,
    point2Coupon,
    usePoint2Coupon,
    showUsePoint,
    setMyPoints,
    onPointsExchange,
    getPointRecord,
  };
}
