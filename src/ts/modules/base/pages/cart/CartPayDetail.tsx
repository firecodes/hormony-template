import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {DialogTitle} from '../../utils/CommonUtils';
import {THEME_COLOR} from '../../utils/Constant';

const CartPayDetail = memo(
  ({
    totalDashPrice,
    totalPrice,
    exeClosePayDetail,
    setExeClosePayDetail,
    onClose,
  }: {
    totalDashPrice: number;
    totalPrice: number;
    exeClosePayDetail: boolean;
    setExeClosePayDetail: (exe: boolean) => void;
    onClose?: () => void;
  }) => {
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = useState(false);

    function mClose() {
      animFunc(false);
      onClose &&
        setTimeout(() => {
          onClose?.();
          setExeClosePayDetail(false);
        }, 290);
    }

    useEffect(() => {
      animFunc(true);
    }, []);

    useEffect(() => {
      exeClosePayDetail && mClose();
    }, [exeClosePayDetail]);

    function animFunc(open: boolean = true) {
      translateYAnim.setValue(open ? 0 : -532);
      opacityAnim.setValue(open ? 0 : 1);

      // 执行入场动画
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: open ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: open ? -532 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(true);
      });
    }

    return (
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.animBg,
            {
              opacity: opacityAnim,
            },
          ]}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            mClose();
          }}>
          <View style={styles.contentView}>
            <Animated.View
              style={[
                styles.animView,
                {
                  transform: [
                    {translateY: translateYAnim}, // 绑定上下移动动画
                  ],
                },
              ]}>
              {DialogTitle('金额明细', true, mClose)}
              <View style={styles.itemContent}>
                <Text style={styles.itemTittle}>商品金额</Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      styles.itemRightText,
                      {
                        marginRight: -3,
                      },
                    ]}>
                    ￥
                  </Text>
                  <Text style={styles.itemRightText}>
                    {totalDashPrice ?? totalPrice}
                  </Text>
                </View>
              </View>

              {totalDashPrice - totalPrice > 0 && (
                <View style={styles.itemContent}>
                  <Text style={styles.itemTittle}>活动优惠</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={[
                        styles.itemRightText,
                        {
                          marginRight: -3,
                        },
                      ]}>
                      ￥
                    </Text>
                    <Text style={styles.itemRightText}>
                      {totalDashPrice - totalPrice}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.itemContent}>
                <Text style={styles.totalText}>合计</Text>
                <View style={styles.totalRight}>
                  <Text style={styles.totalRightTextDec}>￥</Text>
                  <Text style={styles.totalRightText}>{totalPrice}</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    bottom: 50,
    position: 'absolute',
  },
  animBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000066',
    position: 'absolute',
  },
  contentView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  animView: {
    width: '100%',
    height: 532,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    marginBottom: -532,
  },
  itemContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
  },
  itemTittle: {
    fontSize: 14,
    color: '#00000066',
  },
  itemRightText: {
    fontSize: 14,
    color: '#000000E5',
    fontWeight: '500',
  },
  totalText: {
    fontSize: 16,
    color: '#000000E5',
  },
  totalRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalRightTextDec: {
    fontSize: 12,
    color: THEME_COLOR,
    marginRight: -3,
    marginBottom: -2,
  },
  totalRightText: {
    fontSize: 16,
    color: THEME_COLOR,
    fontWeight: '500',
  },
});

export default CartPayDetail;
