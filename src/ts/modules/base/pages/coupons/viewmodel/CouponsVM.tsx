import {useEffect, useState} from 'react';
import {withDelay} from '../../../utils/CommonUtils';
import {getCouponsMock1} from '../mockData/GetCoupons';
import {CouponItem, CouponModel} from '../model/CouponModel';
import {ScenarioStatus} from '../mockData/Types';
import {getScenarioStatus} from '../mockData/Service';

function CouponsVM() {
  const [selectTab, setSelectTab] = useState(0);
  const [dataList, setDataList] = useState<CouponModel[]>();
  const [dataLists, setDataLists] = useState<CouponItem[][]>();

  useEffect(() => {
    if (dataLists?.length > 0) {
      setDataList(dataLists[selectTab]);
    }
  }, [selectTab, dataLists]);

  function getAllDataList() {
    withDelay(() => {
      let list = getCouponsMock1;
      const data: CouponItem[][] = [[], [], [], []];
      list.forEach(item => {
        const status = getScenarioStatus(item, 0);
        if (status === ScenarioStatus.EXPIRE) {
          data[3].push(item);
        } else if (status === ScenarioStatus.HAS_USED) {
          data[2].push(item);
        } else {
          data[1].push(item);
        }
      });
      data[0] = [...data[1], ...data[2], ...data[3]];

      setDataLists(data);
      setDataList(data[0]);
    }).then();
  }

  useEffect(() => {
    getAllDataList();
  }, []);

  return {
    selectTab,
    setSelectTab,
    dataList,
  };
}

export default CouponsVM;
