import {DeviceEventEmitter, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import {SettingVM} from '../vm/SettingVM';
import {showModal} from '../../../utils/ModalUtils';
import {VersionInfoBean} from '../bean/VersionInfoBean';
import bridge from '../../../utils/bridge';
import {LoginManager} from '../../login/LoginManager';
import {THEME_COLOR} from '../../../utils/Constant';
import {Toast} from '../../../utils/ToastManager';

function SettingPage(props) {
  let vm = new SettingVM();
  let [versionInfo, setVersionInfo] = useState(new VersionInfoBean());
  const [showVersion, setShowVersion] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [showClearCache, setShowClearCache] = useState(false);
  const [isLogin, setIsLogin] = useState(LoginManager.isLogin);

  function initData() {
    setVersionInfo(vm.getVersionInfo());
    setCacheSize(vm.getCacheSize());
  }

  useEffect(() => {
    initData();

    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === 'SettingPage') {
        setIsLogin(LoginManager.isLogin);
      }
    });
    return () => {
      onPageShow.remove();
    };
  }, []);

  function renderVersion() {
    let view = (
      <View
        style={{
          marginHorizontal: 16,
          paddingBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 32,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            width: '100%',
            fontSize: 20,
            marginTop: 24,
            lineHeight: 28,
            includeFontPadding: true,
          }}>
          {'发现新版本'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#222',
            marginTop: 12,
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'应用 ' + versionInfo.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#222',
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'版本 ' + versionInfo.version}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#222',
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'大小 ' + versionInfo.size}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: '#222',
            marginTop: 16,
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'详情'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#222',
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {versionInfo.detail}
        </Text>

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flex: 1,
              alignItems: 'center',
              height: 40,
            }}
            onPress={() => setShowVersion(false)}>
            <Text style={{fontSize: 16, color: '#999999'}}>以后再说</Text>
          </TouchableOpacity>

          <View style={{ backgroundColor: '#888',height: 16, width: 0.5}} />

          <TouchableOpacity
            style={{
              paddingVertical: 10,
              flex: 1,
              height: 40,
              alignItems: 'center',
            }}
            onPress={() => {
              bridge.openLink({
                entities: ['entity.system.browsable'],
                action: 'ohos.want.action.search',
                url: 'store://appgallery.huawei.com/app/detail?id=com.huawei.rnmall', //todo 替换自己包名
              });
              setShowVersion(false);
            }}>
            <Text style={{fontSize: 16, color: THEME_COLOR}}>立即更新</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return showModal(
      view,
      showVersion,
      () => {
        setShowVersion(false);
      },
      {
        isFill: false,
        viewHeight: 300,
        expandHeight: 300,
        clickInnerClose: false,
      },
    );
  }

  function renderClearCache() {
    let view = (
      <View
        style={{
          marginHorizontal: 16,
          paddingBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 32,
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            textAlign: 'center',
            width: '100%',
            fontSize: 20,
            marginTop: 24,
            lineHeight: 28,
            includeFontPadding: true,
          }}>
          {'清除缓存'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginTop: 12,
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'此操作会永久删除您在“商城RN”云端的所有个人信息。\n' +
            '是否清理缓存，共 ' +
            cacheSize +
            'M'}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              height: 40,
              alignItems: 'center',
            }}
            onPress={() => {
              setShowClearCache(false);
            }}>
            <Text style={{color: '#888', fontSize: 16}}>{'取消'}</Text>
          </TouchableOpacity>

          <View style={{height: 16, backgroundColor: '#888', width: 0.5}} />

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 10,
              height: 40,
              alignItems: 'center',
            }}
            onPress={() => {
              LoginManager.clearCache();
              Toast.show('清除缓存完成');
              setCacheSize(0.1);
              setShowClearCache(false);
            }}>
            <Text style={{color: THEME_COLOR, fontSize: 16}}>{'清除'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return showModal(
      view,
      showClearCache,
      () => {
        setShowClearCache(false);
      },
      {
        isFill: false,
        viewHeight: 300,
        expandHeight: 300,
        clickInnerClose: false,
      },
    );
  }

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('设置')}
        <View
          style={{
            width: '100%',
            borderRadius: 12,
            backgroundColor: '#fff',
          }}>
          {UserWidget.renderDetailActionItem('账号安全', 'AccountSafePage')}
          {UserWidget.renderDetailActionItem(
            '隐私设置',
            'PrivacySettingPage',
            undefined,
            {needLogin: false},
          )}
          {UserWidget.renderDetailActionItem(
            '清除缓存',
            '',
            () => {
              setShowClearCache(true);
            },
            {needLogin: false},
          )}
          {UserWidget.renderDetailActionItem(
            '检测版本',
            '',
            () => {
              setShowVersion(true);
            },
            {needLogin: false},
          )}
          {UserWidget.renderDetailActionItem('关于', 'AboutPage', undefined, {
            needLogin: false,
          })}
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 12,
            backgroundColor: '#fff',
            marginTop: 12,
          }}>
          {UserWidget.renderDetailActionItem(
            '隐私政策',
            undefined,
            () => {
              bridge.pushUrl('Web', JSON.stringify({webUrl: 'privacy_policy'}));
            },
            {needLogin: false},
          )}
          {UserWidget.renderDetailActionItem(
            '用户协议',
            undefined,
            () => {
              bridge.pushUrl('Web', JSON.stringify({webUrl: 'user_agreement'}));
            },
            {needLogin: false},
          )}
        </View>

        {isLogin && (
          <TouchableOpacity
            style={{
              width: '100%',
              height: 46,
              alignItems: 'center',
              backgroundColor: THEME_COLOR,
              borderRadius: 23,
              marginTop: 60,
              justifyContent: 'center',
            }}
            onPress={() => {
              LoginManager.logout();
              Toast.show('已退出');
              setTimeout(() => {
                bridge.back('');
              }, 300);
            }}
            activeOpacity={1}>
            <Text style={{fontSize: 16, color: '#fff'}}>{'退出登录'}</Text>
          </TouchableOpacity>
        )}
        {renderVersion()}
        {renderClearCache()}
      </View>
    );
  }

  return renderPage();
}

export default SettingPage;
