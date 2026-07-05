import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {UserWidget} from './utils/UserWidget';
import bridge from '../../utils/bridge';
import {MyPointVM} from './vm/MyPointVM';
import {ReductionTypes} from '../coupons/mockData/Types';
import {Point2CouponBean} from './bean/Point2CouponBean';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../utils/Constant';
import {RenderCommonDialog} from '../../utils/CommonUtils';
import {WindowInfo} from '../../utils/WindowInfo';
import {CouponRule} from '../coupons/model/CouponModel';

export function getTag(amountRule: CouponRule) {
  if (amountRule.discountType === ReductionTypes.FULL_REDUCTION) {
    return '满' + Number(amountRule.fullAmount) + '可用';
  } else if (amountRule.discountType === ReductionTypes.DISCOUNT_REDUCTION) {
    return '新品折扣券';
  } else {
    return '无门槛';
  }
}

function MyPointPage(props) {
  let {
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
    onPointsExchange,
  } = MyPointVM();
  const {foldStatus} = WindowInfo();

  useEffect(() => {
    initData();
    bridge.setStatusBarWhite(true);
    return () => {
      bridge.setStatusBarWhite(false);
    };
  }, []);

  /**
   * 标题
   */
  function renderTitle() {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            marginRight: 8,
          }}
          onPress={() => {
            bridge.back('');
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/back_bg_white.png')}
            style={{width: 40, height: 40}}
          />
          <Image
            source={require('../../../../rawfile/dev/media/icon/ic_left_arrow_white.svg')}
            style={{width: 24, height: 24, position: 'absolute'}}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 20, color: '#fff'}}>{'我的积分'}</Text>
      </View>
    );
  }

  function renderLeftPoint() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 6,
          marginBottom: 16,
        }}
        onPress={() => {
          bridge.pushUrl('MyPointDetailPage');
        }}>
        <View
          style={{
            height: '100%',
            flex: 1,
            alignItems: 'center',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <Image
              style={{
                width: 18,
                height: 18,
                objectFit: 'contain',
              }}
              source={require('../../../../rawfile/dev/media/icon/ic_point.png')}
            />
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                marginLeft: 6,
              }}>
              {'积分余额'}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
                marginLeft: 8,
                lineHeight: 38,
              }}>
              {String(myPoints)}
            </Text>
          </View>
          <Text
            style={{
              width: '100%',
              fontSize: 12,
              color: '#fff',
            }}>
            {'今日积分已领取，每100积分可抵扣快递费5元'}
          </Text>
        </View>
        {UserWidget.rightArrowIcon(true)}
      </TouchableOpacity>
    );
  }

  function renderCheckIn() {
    return (
      <View
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 12,
          backgroundColor: '#fff',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Text
            style={{fontSize: 16, flex: 1, lineHeight: 24, fontWeight: '500'}}>
            {'积分签到'}
          </Text>
          <Text style={{fontSize: 12, color: '#00000099'}}>{'已打卡'}</Text>
          <Text style={{fontSize: 12, color: THEME_COLOR}}>
            {String(currCheckDay)}
          </Text>
          <Text style={{fontSize: 12, color: '#00000099'}}>{'/7天'}</Text>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: foldStatus === 1 ? 12 : 0,
          }}>
          {getWeekPoint().map((weekItem: any, index: number) => {
            return (
              <View
                key={String(index)}
                style={{
                  flex: 1,
                  marginStart: 0 === index ? 0 : 7,
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 36,
                    height: 46,
                    opacity: index < currCheckDay ? 0.3 : 1,
                  }}
                  source={require('../../../../rawfile/dev/media/icon/ic_redpack.png')}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: index < currCheckDay ? '#00000066' : '#00000099',
                    height: 19,
                    textAlignVertical: 'center',
                    marginTop: 2,
                  }}>
                  {'第' + weekItem.index + '天'}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={{
            width: foldStatus === 1 ? 296 : '100%',
            height: 40,
            alignItems: 'center',
            backgroundColor: hasCheckIn ? '#CCC' : THEME_COLOR,
            borderRadius: 20,
            marginTop: 12,
            justifyContent: 'center',
          }}
          disabled={hasCheckIn}
          onPress={() => {
            onCheckIn();
          }}
          activeOpacity={0.7}>
          <Text style={{fontSize: 14, color: '#fff', fontWeight: '500'}}>
            {'签到'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderListItem(point2CouponBean: Point2CouponBean, index: number) {
    let coupon = point2CouponBean.coupon;
    return (
      <View
        style={{
          borderRadius: 15,
          backgroundColor: '#fff',
          flexDirection: 'row',
          width: '100%',
          height: 100,
          marginBottom: 15,
          alignItems: 'center',
          overflow: 'hidden',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            height: 100,
          }}>
          <View
            style={{
              flexDirection: 'column',
              width: 101,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {coupon?.amountRule.discountType ===
            ReductionTypes.DISCOUNT_REDUCTION ? (
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: THEME_COLOR,
                }}>
                {(Number(coupon?.amountRule.discountCoefficient) * 10).toFixed(
                  1,
                )}
                <Text
                  style={{
                    fontWeight: '300',
                    fontSize: 13,
                  }}>
                  折
                </Text>
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 13,
                  color: THEME_COLOR,
                  marginLeft: -10,
                }}>
                ￥
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 22,
                  }}>
                  {coupon.amountRule.discountAmount}
                </Text>
              </Text>
            )}
            <Text
              style={{
                fontSize: 12,
                color: THEME_COLOR,
                marginTop: 2,
              }}>
              {getTag(coupon.amountRule)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, fontWeight: '500'}}>
              {coupon.couponName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: THEME_COLOR,
                marginTop: 7,
              }}>
              全品类可用
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: THEME_COLOR,
                marginTop: 7,
              }}>
              {coupon.endTime + ' 23:59' + ' 到期'}
            </Text>
          </View>
        </View>

        <View style={{marginRight: 18, alignItems: 'center'}}>
          <Text style={{fontSize: 14, color: '#000'}}>
            <Text style={{fontWeight: '500'}}>
              {String(point2CouponBean.point)}
            </Text>
            <Text style={{fontSize: 10, color: '#666'}}>{'积分'}</Text>
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              height: 24,
              backgroundColor:
                myPoints < point2CouponBean.point ? '#CCC' : THEME_COLOR,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              marginTop: 6,
            }}
            activeOpacity={0.7}
            disabled={myPoints < point2CouponBean.point}
            onPress={() => {
              setUsePoint2Coupon(point2CouponBean);
              setUsePointIndex(index);
              setShowUsePoint(true);
            }}>
            <Text style={{fontSize: 12, color: '#fff'}}>{'兑换'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderPoint2Coupon() {
    return (
      <FlatList
        style={{width: '100%', flex: 1, paddingBottom: 16}}
        data={point2Coupon}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.coupon.couponID} // 唯一标识
        renderItem={({item, index}) => renderListItem(item, index)}
      />
    );
  }

  function renderUsePoint() {
    let note =
      usePoint2Coupon?.coupon?.amountRule.discountType ===
      ReductionTypes.DISCOUNT_REDUCTION
        ? (
            Number(usePoint2Coupon?.coupon?.amountRule.discountCoefficient) * 10
          ).toFixed(1) + '折'
        : '￥' + usePoint2Coupon?.coupon?.amountRule.discountAmount;
    let content =
      '是否花' + usePoint2Coupon?.point + '积分兑换' + note + '优惠券?';
    return RenderCommonDialog(
      showUsePoint,
      () => {
        setShowUsePoint(false);
      },
      content,
      '取消',
      '确定',
      () => {
        setShowUsePoint(false);
      },
      () => {
        onPointsExchange();
      },
    );
  }

  function renderPage() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: BACKGROUND_COLOR,
        }}>
        <Image
          style={{
            width: '100%',
            height: 367,
            position: 'absolute',
            objectFit: 'fill',
          }}
          source={require('../../../../rawfile/dev/media/icon/bg.png')}
        />
        <View
          style={[
            UserWidget.defStyle.defBack,
            {backgroundColor: 'transparent'},
          ]}>
          {renderTitle()}
          <View
            style={{width: foldStatus === 1 ? '75%' : '100%', height: '100%'}}>
            {renderLeftPoint()}
            {renderCheckIn()}
            <Text
              style={{
                fontSize: 16,
                width: '100%',
                height: 24,
                textAlignVertical: 'center',
                marginTop: 16,
                marginBottom: 8,
                fontWeight: '500',
              }}>
              {'积分兑换'}
            </Text>
            {renderPoint2Coupon()}
          </View>
          {renderUsePoint()}
        </View>
      </View>
    );
  }

  return renderPage();
}

export default MyPointPage;
