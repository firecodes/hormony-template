import {Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import {UserInfo} from '../bean/UserInfoBean';
import bridge from '../../../utils/bridge';
import {LoginManager} from '../../login/LoginManager';
import {THEME_COLOR} from '../../../utils/Constant';

function PhoneNumPage(props) {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  function initData() {
    LoginManager.loginData &&
      setUserInfo(JSON.parse(JSON.stringify(LoginManager.loginData)));
  }

  useEffect(() => {
    initData();
    let onResume = bridge.setOnPageShow('PhoneNumPage', () => {
      initData();
    });
    return () => {
      onResume.remove();
    };
  }, []);

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('手机号')}
        <Text style={{color: '#00000066', fontSize: 14, marginTop: 60}}>
          {'当前绑定的手机号'}
        </Text>
        <Text
          style={{
            fontSize: 32,
            marginTop: 18,
            fontWeight: 'bold',
          }}>
          {UserWidget.getPrivacyPhoneNumber(userInfo?.userPhone)}
        </Text>

        <TouchableOpacity
          style={{
            width: '100%',
            height: 46,
            alignItems: 'center',
            backgroundColor: THEME_COLOR,
            borderRadius: 23,
            marginTop: 66,
            justifyContent: 'center',
          }}
          onPress={() => {
            bridge.pushUrl(
              'UpdatePhonePage',
              JSON.stringify({
                pageTitle: '修改手机号',
              }),
            );
          }}
          activeOpacity={1}>
          <Text style={{fontSize: 16, color: '#fff'}}>{'修改手机号'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return renderPage();
}

export default PhoneNumPage;
