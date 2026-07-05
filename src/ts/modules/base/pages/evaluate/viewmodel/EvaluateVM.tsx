import {useState} from 'react';
import bridge from '../../../utils/bridge';
import {
  EVAL_MOCK_LIST,
  getProEvalPrefKey,
  ProductEvalItem,
} from '../model/EvaluateMockData';
import {withDelay} from '../../../utils/CommonUtils';
import {EVAL_PRE_NAME} from '../toeval/viewmodel/PostEvaluateVM';

export const PAGE_SIZE = 10;

export function EvaluateVM(props) {
  const productId = props.productId;
  const [isLoading, setIsLoading] = useState(false);
  const [evalCount, setEvalCount] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [proAllEval, setProAllEval] = useState<ProductEvalItem[]>();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const getProAllEval = (
    full: boolean = false,
    pageNum_: number = pageNum,
    pageSize: number = PAGE_SIZE,
    isRefresh: boolean = false,
  ) => {
    if (pageNum_ < 0 || !Number.isInteger(pageNum_)) {
      pageNum_ = 0;
    }
    if (pageSize < 0 || !Number.isInteger(pageSize)) {
      pageSize = PAGE_SIZE;
    }
    if (pageNum_ === 0) {
      !isRefresh && setIsLoading(true);
    } else {
      setLoadingMore(true);
    }
    let resList: ProductEvalItem[] = [];
    bridge.getOhPrefData(
      res => {
        withDelay(() => {
          if (res) {
            let prefsEvalList = JSON.parse(res) as ProductEvalItem[];
            if (prefsEvalList && prefsEvalList.length > 0) {
              resList = prefsEvalList;
            }
          }
          if (!resList) {
            resList = [];
          }
          resList = [...resList, ...EVAL_MOCK_LIST];
          resList.length !== evalCount && setEvalCount(resList.length);
          resList = resList.sort((a, b) => b.date - a.date);
          if (!full && resList.length > 2) {
            resList = resList.slice(0, 2);
          } else {
            const startIndex = pageNum_ * pageSize;
            const endIndex = startIndex + pageSize;
            resList = resList.slice(startIndex, endIndex);
          }
          setProAllEval(
            proAllEval && full ? [...proAllEval, ...resList] : [...resList],
          );
          setPageNum(pageNum + 1);
          setTimeout(() => {
            setIsLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
          }, 300);
        }).then();
      },
      getProEvalPrefKey(productId),
      undefined,
      EVAL_PRE_NAME,
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPageNum(0);
    getProAllEval(true, 0, PAGE_SIZE, true);
  };

  return {
    isLoading,
    proAllEval,
    evalCount,
    pageNum,
    onRefresh,
    refreshing,
    getProAllEval,
    loadingMore,
  };
}
