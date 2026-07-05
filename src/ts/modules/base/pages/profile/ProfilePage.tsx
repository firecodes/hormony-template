import {
  DeviceEventEmitter,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {LoginManager} from '../login/LoginManager';
import bridge from '../../utils/bridge';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {UserInfo} from './bean/UserInfoBean';
import {UserWidget} from './utils/UserWidget';
import {showModal} from '../../utils/ModalUtils';

/**
 * 我的
 * @param props
 * @constructor
 */
function ProfilePage(props) {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const servicePhone = '0755****7878';
  const [showConnectCustom, setShowConnectCustom] = useState(false);

  const [isExpanded, setIsExpanded] = useState(
    bridge.getOhASData('FoldStatus') === 1,
  );

  function initData() {
    setUserInfo(
      LoginManager.loginData
        ? JSON.parse(JSON.stringify(LoginManager.loginData))
        : undefined,
    );
  }

  useEffect(() => {
    let cur: boolean = bridge.getOhASData('FoldStatus') === 1;
    if (cur !== isExpanded) {
      setIsExpanded(cur);
    }
    initData();
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === 'Main') {
        initData();
      }
    });
    let loginStatus = DeviceEventEmitter.addListener('LoginData', param => {
      let loginData = param?.loginData;
      LoginManager.initLoginStatus(loginData);
      initData();
    });
    return () => {
      onPageShow.remove();
      loginStatus.remove();
    };
  }, []);

  function renderUserInfo() {
    let headImg = require('../../../../rawfile/dev/media/icon/default_avatar.png');
    if (!!userInfo?.userAvatar) {
      headImg = {uri: userInfo?.userAvatar};
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.unitItem,
          {
            marginTop: 12,
            height: 77,
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
          },
        ]}
        onPress={() => {
          if (LoginManager.isLogin) {
            bridge.pushUrl('UserInfoDetailPage');
          } else {
            bridge.pushUrl('Login');
          }
        }}>
        <Image
          source={headImg}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            backgroundColor: '#eee',
          }}
        />
        <View style={{flex: 1, marginLeft: 16}}>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 24,
              includeFontPadding: true,
              maxWidth: '90%',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {userInfo?.userName ?? '未登录'}
          </Text>
          <Text
            style={{
              color: '#00000066',
              fontSize: 13,
              lineHeight: 21,
              includeFontPadding: true,
              maxWidth: '90%',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {userInfo?.userPhone
              ? UserWidget.getPrivacyPhoneNumber(userInfo?.userPhone)
              : '登录后享受更多服务'}
          </Text>
        </View>
        {UserWidget.rightArrowIcon()}
      </TouchableOpacity>
    );
  }

  function renderActionItem(title: string, img: any, url: string) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (LoginManager.isLogin) {
            bridge.pushUrl(url);
          } else {
            bridge.pushUrl('Login');
          }
        }}
        style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={img}
          style={{width: 37, height: 37, borderRadius: 12}}
          resizeMode="contain"
        />
        <Text
          style={{
            color: '#00000099',
            fontSize: 12,
            marginTop: 6,
            lineHeight: 18,
            includeFontPadding: true,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderAction() {
    return (
      <View
        style={[
          styles.unitItem,
          {
            paddingHorizontal: 10,
            marginTop: 12,
            height: 93,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        {renderActionItem(
          '我的订单',
          require('../../../../rawfile/dev/media/icon/my_order.png'),
          'MyOrder',
        )}
        {renderActionItem(
          '我的积分',
          require('../../../../rawfile/dev/media/icon/my_point.png'),
          'MyPointPage',
        )}
        {renderActionItem(
          '优惠券',
          require('../../../../rawfile/dev/media/icon/my_ticket.png'),
          'Coupons',
        )}
        {renderActionItem(
          '我的消息',
          require('../../../../rawfile/dev/media/icon/my_msg.png'),
          'MyMessage',
        )}
      </View>
    );
  }

  const renderDetailAction1 = () => {
    return (
      <View style={[styles.unitItem, {marginTop: 12}]}>
        {UserWidget.renderDetailActionItem('浏览记录', 'ViewHistory')}
        {UserWidget.renderDetailActionItem('我的收藏', 'Collection')}
        {UserWidget.renderDetailActionItem('地址管理', 'AddressListPage')}
      </View>
    );
  };

  const renderDetailAction2 = () => {
    return (
      <View style={[styles.unitItem, {marginTop: 12}]}>
        {UserWidget.renderDetailActionItem('设置', 'SettingPage', undefined, {
          needLogin: false,
        })}
      </View>
    );
  };

  const renderDetailAction3 = () => {
    return (
      <View style={[styles.unitItem, {marginTop: 12}]}>
        {UserWidget.renderDetailActionItem('意见反馈', 'FeedbackPage')}
        {UserWidget.renderDetailActionItem('联系客服', '', () => {
          setShowConnectCustom(true);
        })}
      </View>
    );
  };

  function renderDetailAction() {
    return (
      <View style={{flex: 1}}>
        {renderDetailAction1()}
        {renderDetailAction2()}
        {renderDetailAction3()}
      </View>
    );
  }

  function renderConnectCustom() {
    let view = (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <TouchableOpacity
          style={{flex: 1, width: '100%'}}
          onPress={() => {
            setShowConnectCustom(false);
          }}></TouchableOpacity>
        <View
          style={{
            height: 280 + BottomReactHeight,
            width: '100%',
            alignItems: 'center',
            paddingTop: 17,
            paddingHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 32,
            paddingBottom: BottomReactHeight,
          }}>
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 1, fontSize: 18}}>{'联系客服'}</Text>
            <TouchableOpacity
              style={{
                width: 33,
                height: 33,
                borderRadius: 17,
                padding: 8,
                backgroundColor: BACKGROUND_COLOR,
              }}
              onPress={() => {
                setShowConnectCustom(false);
              }}>
              <Image
                style={{width: '100%', height: '100%'}}
                source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: 39,
              color: '#000',
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            {servicePhone.slice(0, 4) + '****' + servicePhone.slice(8, 12)}
          </Text>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 46,
              alignItems: 'center',
              backgroundColor: THEME_COLOR,
              borderRadius: 23,
              marginTop: 39,
              justifyContent: 'center',
            }}
            onPress={() => {
              let phone =
                servicePhone.slice(0, 4) + '****' + servicePhone.slice(8, 12);
              bridge.callPhone(phone);
            }}
            activeOpacity={1}>
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '500'}}>
              {'一键拨号'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: '100%',
              height: 46,
              alignItems: 'center',
              backgroundColor: BACKGROUND_COLOR,
              borderRadius: 23,
              marginTop: 18,
              justifyContent: 'center',
            }}
            onPress={() => {
              setShowConnectCustom(false);
            }}
            activeOpacity={1}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>{'取消'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return showModal(
      view,
      showConnectCustom,
      () => {
        setShowConnectCustom(false);
      },
      {
        isFill: true,
        viewHeight: 300,
        expandHeight: 300,
        clickInnerClose: false,
      },
    );
  }

  function renderPage() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View style={styles.content}>
          <View
            style={{
              height: 56,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 24, fontWeight: '500'}}>{'我的'}</Text>
          </View>
          <ScrollView
            style={{width: '100%', flex: 1}}
            showsVerticalScrollIndicator={false}>
            {renderUserInfo()}
            {renderAction()}
            {renderDetailAction()}
          </ScrollView>
        </View>
        {renderConnectCustom()}
      </View>
    );
  }

  return renderPage();
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: TopReactHeight,
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 16,
  },
  unitItem: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
});

export default ProfilePage;
