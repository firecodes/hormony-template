import {Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import bridge from '../../../utils/bridge';
import {UserInfo} from '../bean/UserInfoBean';
import {LoginManager} from '../../login/LoginManager';

function AccountSafePage(props) {
  let [title, setTitle] = useState<string>('');
  const [userInfo, setUserInfo] = useState<UserInfo>();

  function initData() {
    setTitle(props.pageTitle);
    LoginManager.loginData &&
      setUserInfo(JSON.parse(JSON.stringify(LoginManager.loginData)));
  }

  useEffect(() => {
    initData();
    let onResume = bridge.setOnPageShow('AccountSafePage', () => {
      initData();
    });
    return () => {
      onResume.remove();
    };
  }, []);

  function renderPhoneNum() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: '100%',
          paddingLeft: 12,
          paddingRight: 20,
          flexDirection: 'row',
          height: 60,
          backgroundColor: '#fff',
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => {
          bridge.pushUrl('PhoneNumPage');
        }}>
        <Text style={{flex: 1, fontSize: 14, color: '#000'}}>{'手机号'}</Text>
        <Text style={{fontSize: 14, color: '#aaa'}}>
          {UserWidget.getPrivacyPhoneNumber(userInfo?.userPhone)}
        </Text>
        {UserWidget.rightArrowIcon()}
      </TouchableOpacity>
    );
  }

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle(title)}
        {renderPhoneNum()}
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            backgroundColor: '#fff',
            marginTop: 15,
          }}>
          {UserWidget.renderDetailActionItem('注销账号', 'DeletePhonePage')}
        </View>
      </View>
    );
  }

  return renderPage();
}

export default AccountSafePage;
