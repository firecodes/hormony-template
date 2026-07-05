import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import bridge from '../../../utils/bridge';
import {LoginManager} from '../../login/LoginManager';
import {THEME_COLOR} from '../../../utils/Constant';
import {Toast} from '../../../utils/ToastManager';

function UpdatePhonePage(props) {
  let [title, setTitle] = useState<string>('');
  let [phone, setPhone] = useState<string>('');
  let [checkCode, setCheckCode] = useState<string>('');
  let [leftTime, setLeftTime] = useState(0);
  let getCheckCodeTimeId: any = -1;

  function initData() {
    setTitle(props.pageTitle);
  }

  useEffect(() => {
    initData();
    return () => {
      clearInterval(getCheckCodeTimeId);
    };
  }, []);

  function getCheckCode() {
    clearInterval(getCheckCodeTimeId);
    let tmpTime = 10;
    setLeftTime(tmpTime);
    getCheckCodeTimeId = setInterval(() => {
      tmpTime -= 1;
      setLeftTime(tmpTime);
      if (tmpTime <= 0) {
        setLeftTime(0);
        clearInterval(getCheckCodeTimeId);
      }
    }, 1000);
  }

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle(title)}

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: 16,
            marginTop: 20,
            height: 46,
          }}>
          <Text style={{fontSize: 14, flex: 1}}>{'+86'}</Text>
          <TextInput
            style={{
              fontSize: 14,
              flex: 5,
              marginLeft: 10,
              alignItems: 'center',
            }}
            cursorColor={THEME_COLOR}
            placeholder={'请输入手机号'}
            placeholderTextColor={'#00000066'}
            returnKeyType="search"
            inputMode={'numeric'}
            maxLength={11}
            onChangeText={text => {
              setPhone(text);
            }}>
            {phone}
          </TextInput>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: 16,
            marginTop: 20,
            height: 46,
          }}>
          <TextInput
            style={{
              fontSize: 14,
              flex: 1,
              alignItems: 'center',
            }}
            cursorColor={THEME_COLOR}
            placeholder={'请输入验证码'}
            placeholderTextColor={'#00000066'}
            returnKeyType="search"
            inputMode={'numeric'}
            maxLength={6}
            onChangeText={text => {
              setCheckCode(text);
            }}>
            {checkCode}
          </TextInput>
          <TouchableOpacity
            style={{marginLeft: 20}}
            onPress={() => {
              if (phone.length !== 11) {
                Toast.show('请输入11位手机号');
                return;
              }
              if (leftTime > 0) {
                bridge.hiLog('UpdatePhonePage', 'is getting now');
                return;
              }
              getCheckCode();
            }}>
            <Text
              style={{
                fontSize: 14,
                color: leftTime > 0 ? '#222' : THEME_COLOR,
              }}>
              {leftTime > 0 ? leftTime + 's' : '获取验证码'}
            </Text>
          </TouchableOpacity>
        </View>

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
            if (phone.length < 11 || checkCode.length < 6) {
              Toast.show('请输入手机号和验证码');
              return;
            }
            if (LoginManager.loginData) {
              LoginManager.loginData.userPhone = phone;
            }
            LoginManager.updateLoginData();
            Toast.show('手机号修改成功');
            bridge.back('');
          }}
          activeOpacity={1}>
          <Text style={{fontSize: 16, color: '#fff'}}>{'确认修改'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return renderPage();
}

export default UpdatePhonePage;
