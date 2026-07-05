import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bridge from '../../utils/bridge';
import {EvaluateVM} from './viewmodel/EvaluateVM';
import {Loading} from '../../utils/CommonUtils';
import EvaluationItem from './EvaluationItem';
import {WindowInfo} from '../../utils/WindowInfo';

function ProductEvalCard(props) {
  const {isLoading, proAllEval, getProAllEval, evalCount} = EvaluateVM({
    productId: props.productId,
  });
  const {foldStatus} = WindowInfo();

  useEffect(() => {
    getProAllEval();
  }, [props.productId]);

  const renderCardTitle = () => (
    <View style={{width: '100%'}}>
      <View style={styles.titleRoot}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[styles.title, {marginLeft: foldStatus === 1 ? 24 : 16}]}>
            商品评价
          </Text>
          <Text style={styles.count}>({evalCount})</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            bridge.pushUrl(
              'AllEval',
              JSON.stringify({productId: props.productId}),
            );
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.rightTitle}>查看全部</Text>
            <Image
              source={require('../../../../rawfile/dev/media/icon/ic_left_arrow.svg')}
              style={[
                styles.rightArrow,
                {marginRight: foldStatus === 1 ? 24 : 16},
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.line, {marginHorizontal: foldStatus === 1 ? 24 : 16}]}
      />
      <View></View>
    </View>
  );

  return (
    <View>
      {renderCardTitle()}
      {isLoading && Loading()}
      {proAllEval?.map((item, index) => {
        return (
          <View key={String(index)}>
            <EvaluationItem
              item={item}
              showBotLine={index !== proAllEval?.length - 1}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRoot: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    marginVertical: 12,
    paddingVertical: 5,
    fontWeight: '500',
  },
  count: {
    fontSize: 12,
    marginVertical: 12,
    paddingVertical: 5,
    marginLeft: 6,
    color: '#00000066',
  },
  rightTitle: {
    fontSize: 12,
    color: '#000000',
    opacity: 0.6,
    marginRight: 6,
  },
  rightArrow: {
    width: 6,
    height: 12,
    opacity: 0.4,
    transform: [{rotate: '180deg'}],
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#E1E1E1',
  },
});

export default ProductEvalCard;
