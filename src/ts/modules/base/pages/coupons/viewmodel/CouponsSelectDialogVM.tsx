import {useEffect, useState} from 'react';
import {getCouponsMock1} from '../mockData/GetCoupons';
import {CouponItem, CouponModel} from '../model/CouponModel';
import {ScenarioStatus} from '../mockData/Types';
import {getReduceAmount, getScenarioStatus} from '../mockData/Service';

export function getAllDataLists_(totalMoney: number) {
  let list = getCouponsMock1;
  let newList1: CouponModel[] = [];
  let newList2: CouponModel[] = [];
  list.forEach(a => {
    const _status1: ScenarioStatus = getScenarioStatus(a, totalMoney);
    const canNotUse1 =
      _status1 === ScenarioStatus.HAS_USED ||
      _status1 === ScenarioStatus.EXPIRE ||
      _status1 === ScenarioStatus.LESS_FULL;
    if (!canNotUse1) {
      newList1.push(a);
    } else if (_status1 === ScenarioStatus.LESS_FULL) {
      newList2.push(a);
    }
  });
  return [...newList1, ...newList2];
}

export function getDefaultSelCoupon_(totalMoney: number) {
  let list = getAllDataLists_(totalMoney);
  return list?.length > 0 ? list[0] : undefined;
}

export function getNewTotalMinus_(
  selectedCoupons: CouponItem[],
  totalMoney: number,
) {
  let totalMinusTemp = 0;
  if (selectedCoupons?.length > 0) {
    selectedCoupons?.forEach(item => {
      totalMinusTemp += getReduceAmount(item, totalMoney);
    });
    totalMinusTemp = Number(totalMinusTemp.toFixed(1));
  }
  return totalMinusTemp;
}

function CouponsSelectDialogVM(props) {
  const totalMoney: number = props.totalMoney || 0;
  const [dataList, setDataList] = useState<CouponItem[]>();
  const [totalMinus, setTotalMinus] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState<CouponItem[]>(
    props.selCounts ?? [],
  );

  useEffect(() => {
    getNewTotalMinus();
  }, [selectedCoupons]);

  function getNewTotalMinus() {
    setTotalMinus(
      selectedCoupons && selectedCoupons.length > 0
        ? getNewTotalMinus_(selectedCoupons, totalMoney)
        : 0,
    );
  }

  function getAllDataList() {
    setDataList(getAllDataLists_(totalMoney));
  }

  useEffect(() => {
    getAllDataList();
  }, []);

  return {
    dataList,
    totalMinus,
    selectedCoupons,
    setSelectedCoupons,
  };
}

export default CouponsSelectDialogVM;
