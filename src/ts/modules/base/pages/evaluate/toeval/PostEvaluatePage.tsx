import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../../utils/Constant';
import {CommonTitle, Loading, withDelay} from '../../../utils/CommonUtils';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import ProEvalItem from './ProEvalItem';
import EvalLvView from './EvalLvView';
import {PostEvaluateVM} from './viewmodel/PostEvaluateVM';
import {ProductEvalItem} from '../model/EvaluateMockData';

function PostEvaluatePage(props) {
  let orderInfo: OrderInfo = JSON.parse(JSON.stringify(props));
  const {
    evalData,
    saveEvalAndBack,
    setProEvalLv,
    setDeliveryEvalLv,
    setProListEval,
    isLoading,
    foldStatus,
  } = PostEvaluateVM({orderInfo: orderInfo});
  let isPosting = false;

  function renderEvalLvView(title: string, onSetLv: (lv: number) => void) {
    return <EvalLvView onSetLv={onSetLv} title={title} />;
  }

  function renderOrderEvalLv() {
    return (
      <View>
        {renderEvalLvView('商品评价', lv => {
          setProEvalLv(lv);
        })}
        <View
          style={{
            paddingTop: 4,
          }}>
          {renderEvalLvView('物流评价', lv => {
            setDeliveryEvalLv(lv);
          })}
        </View>
      </View>
    );
  }

  function getSubmitEnable(): boolean {
    let isAllEvaled = evalData.proListEval.length === orderInfo.skuInfo.length;
    evalData.proListEval.forEach(item => {
      if (item.rating < 0) {
        isAllEvaled = false;
      }
    });
    return isAllEvaled && !isLoading;
  }

  function renderSubmitBtn() {
    return (
      <TouchableOpacity
        style={{
          width: foldStatus === 1 ? 328 : '100%',
          height: 46,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 23,
          backgroundColor: getSubmitEnable() ? THEME_COLOR : '#ccc',
        }}
        disabled={!getSubmitEnable()}
        onPress={() => {
          if (!isPosting && !isLoading) {
            isPosting = true;
            withDelay(() => {
              getSubmitEnable() && saveEvalAndBack().then();
            }, 500).then();
          }
        }}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '500'}}>
          确定
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: TopReactHeight,
        paddingBottom: BottomReactHeight,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      {CommonTitle('发表评价')}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: foldStatus === 1 ? 24 : 16,
          paddingTop: 22,
          marginBottom: 60,
        }}>
        {renderOrderEvalLv()}
        {orderInfo.skuInfo?.map((item, index) => (
          <ProEvalItem
            key={String(index)}
            item={item}
            onProEvalChange={(proEval: ProductEvalItem) => {
              setProListEval(proEval);
            }}
          />
        ))}
      </ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        {renderSubmitBtn()}
      </View>
      {isLoading && Loading()}
    </View>
  );
}

export default PostEvaluatePage;
