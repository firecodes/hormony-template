import {useState} from 'react';
import {OrderInfo} from '../../../orderinfo/model/OrderInfo';
import bridge from '../../../../utils/bridge';
import OrderApi from '../../../myorder/OrderApi';
import {withDelay} from '../../../../utils/CommonUtils';
import {DeviceEventEmitter} from 'react-native';
import {getProEvalPrefKey, ProductEvalItem} from '../../model/EvaluateMockData';
import {WindowInfo} from '../../../../utils/WindowInfo';

export interface EvalData {
  orderNo: string;
  proEvalLv: number;
  deliveryEvalLv: number;
  proListEval: ProductEvalItem[];
}

export const EVAL_PRE_NAME = 'ProductEval';

export function PostEvaluateVM(props) {
  const orderInfo: OrderInfo = props.orderInfo;
  const {foldStatus} = WindowInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [evalData, setEvalData] = useState<EvalData>({
    orderNo: orderInfo.orderNo,
    proEvalLv: 0,
    deliveryEvalLv: 0,
    proListEval: [],
  });

  function setProEvalLv(proEvalLv: number) {
    setEvalData(prev => ({...prev, proEvalLv}));
  }

  function setDeliveryEvalLv(deliveryEvalLv: number) {
    setEvalData(prev => ({...prev, deliveryEvalLv}));
  }

  async function saveEval(pro: ProductEvalItem) {
    return new Promise<void>((res, rej) => {
      bridge.getOhPrefData(
        result => {
          let curAllProEval = result
            ? (JSON.parse(result.toString()) as ProductEvalItem[])
            : [];
          if (!pro.content) {
            if (pro.rating > 3) {
              pro.content = '该用户觉得商品非常好，给出好评!';
            } else if (pro.rating > 1) {
              pro.content = '该用户觉得商品一般，给出中评!';
            } else {
              pro.content = '该用户觉得商品很差，给出差评!';
            }
          }
          curAllProEval.push(pro);
          bridge.setOhPrefData(
            getProEvalPrefKey(pro.productId),
            JSON.stringify(curAllProEval),
            EVAL_PRE_NAME,
            () => {
              res();
            },
          );
        },
        getProEvalPrefKey(pro.productId),
        undefined,
        EVAL_PRE_NAME,
      );
    });
  }

  async function saveEvalAndBack() {
    setIsLoading(true);

    const promiseList = evalData.proListEval.map(item => saveEval(item));
    await Promise.all(promiseList);
    OrderApi.getInstance()
      .hasEvaluateOrFinish(orderInfo)
      .then(() => {
        withDelay(() => {
          DeviceEventEmitter.emit('OrderStatusChange', {
            orderNo: orderInfo.orderNo,
          });
          bridge.back('');
        }, 2000).then();
      });
  }

  function setProListEval(proListEval: ProductEvalItem) {
    let evalNew = JSON.parse(JSON.stringify(evalData));
    let findIndex = -1;
    evalNew.proListEval?.forEach((item, index) => {
      if (
        item.productId === proListEval.productId &&
        item.skuCode === proListEval.skuCode
      ) {
        evalNew.proListEval[index] = proListEval;
        findIndex = index;
      }
    });
    if (findIndex === -1) {
      evalNew.proListEval.push(proListEval);
    }
    setEvalData({...evalNew});
  }

  return {
    evalData,
    isLoading,
    setProEvalLv,
    setDeliveryEvalLv,
    setProListEval,
    saveEvalAndBack,
    foldStatus,
  };
}
