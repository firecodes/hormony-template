import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {UserWidget} from './utils/UserWidget';
import {UserInfo} from './bean/UserInfoBean';
import bridge from '../../utils/bridge';
import {showModal} from '../../utils/ModalUtils';
import {LoginManager} from '../login/LoginManager';
import {THEME_COLOR} from '../../utils/Constant';
import {Toast} from '../../utils/ToastManager';

function UserInfoDetailPage(props) {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [editDialogShow, setEditDialogShow] = useState(false);
  const [userNameEditTxt, setUserNameEditTxt] = useState('');
  const inputText = useRef('');

  // 创建 ref 关联到 TextInput
  const inputRef = useRef(null);

  const TAG = 'UserInfoDetailPage';

  function initData() {
    setUserInfo(JSON.parse(JSON.stringify(LoginManager.loginData)));
  }

  useEffect(() => {
    initData();
  }, []);

  function renderEditDialog() {
    let view = (
      <View
        style={{
          padding: 24,
          borderRadius: 32,
          height: 211,
          marginHorizontal: 16,
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>{'昵称'}</Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 22,
            marginBottom: 13,
            marginTop: 47,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            ref={inputRef}
            style={{
              color: '#282828',
              fontSize: 14,
              flex: 1,
              height: '100%',
              alignItems: 'center',
            }}
            placeholder={'请输入昵称'}
            numberOfLines={1}
            onChangeText={text => {
              inputText.current = text;
            }}>
            {userNameEditTxt}
          </TextInput>
          <TouchableOpacity
            style={{
              paddingLeft: 12,
            }}
            onPress={() => {
              setUserNameEditTxt('');
              inputText.current = '';
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
                opacity: 0.5,
              }}
              source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: '#ddd',
            marginBottom: 22,
          }}></View>
        <View style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', height: 22}}
            onPress={() => {
              setEditDialogShow(false);
            }}>
            <Text style={{color: '#00000099', fontSize: 16, fontWeight: '500'}}>
              {'取消'}
            </Text>
          </TouchableOpacity>

          <View style={{width: 1, height: 24, backgroundColor: '#bbb'}} />
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center', height: 22}}
            onPress={() => {
              if ('' === inputText.current) {
                Toast.show('输入内容不能为空');
                return;
              }
              if (!!userInfo) {
                userInfo.userName = inputText.current;
                setUserInfo({...userInfo, userName: userInfo.userName});
                LoginManager.loginData = userInfo;
                LoginManager.updateLoginData();
              }
              setEditDialogShow(false);
            }}>
            <Text style={{color: THEME_COLOR, fontSize: 16, fontWeight: '500'}}>
              {'确定'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return showModal(view, editDialogShow, () => {
      setEditDialogShow(false);
    });
  }

  function renderPage() {
    let headImg = require('../../../../rawfile/dev/media/icon/default_avatar.png');
    if (!!userInfo?.userAvatar) {
      headImg = {uri: userInfo?.userAvatar};
    }
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('个人信息')}
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              height: 64,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14, flex: 1, color: '#222'}}>{'头像'}</Text>
            <TouchableOpacity
              onPress={() => {
                bridge.selectPicture('', uri => {
                  bridge.hiLog(TAG, 'selectPicture : ' + uri);
                  if (!!userInfo) {
                    userInfo.userAvatar = uri;
                    setUserInfo({...userInfo, userAvatar: userInfo.userAvatar});
                    if (LoginManager.loginData) {
                      LoginManager.loginData.userAvatar = userInfo.userAvatar;
                    }
                    LoginManager.updateLoginData();
                  }
                });
              }}>
              <Image
                source={headImg}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#eee',
                }}
              />
            </TouchableOpacity>
            {UserWidget.rightArrowIcon()}
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              height: 64,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 14, color: '#222'}}>{'昵称'}</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
              onPress={() => {
                setUserNameEditTxt(userInfo?.userName);
                inputText.current = userInfo?.userName;
                setEditDialogShow(true);
              }}>
              <Text
                style={{fontSize: 14, color: '#222', maxWidth: '70%'}}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {userInfo?.userName}
              </Text>
            </TouchableOpacity>
            {UserWidget.rightArrowIcon()}
          </View>
        </View>
        {renderEditDialog()}
      </View>
    );
  }

  return renderPage();
}

const styles = StyleSheet.create({});

export default UserInfoDetailPage;
