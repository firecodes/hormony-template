import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import bridge from '../../../utils/bridge';
import {UserInfo} from '../bean/UserInfoBean';
import {LoginManager} from '../../login/LoginManager';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../../utils/Constant';
import {Toast} from '../../../utils/ToastManager';
import {PREFERENCE_KEY_ORDER_LIST} from '../../myorder/OrderApi';
import {PREFERENCE_KEY_COLLECTION_LIST} from '../../collection/viewmodel/CollectionsPageVM';
import {PREFERENCE_KEY_VIEW_HISTORY_LIST} from '../viewHistory/ViewHistoryManager';
import {CART_PREFERENCE_KEY} from '../../cart/api/CartDataApi';
import {PREFERENCE_KEY_SERVICE_MSG} from '../../service/viewmodel/ServiceVM';
import {withDelay} from '../../../utils/CommonUtils';

function DeletePhonePage(props) {
  let [title, setTitle] = useState<string>('');
  let [select, setSelect] = useState(-1);
  let selectItems = [
    '交易维权不满意',
    '支付遇到问题',
    '安全//隐私问题',
    '多余的账号',
    '其他问题',
  ];

  function initData() {
    setTitle(props.pageTitle);
  }

  useEffect(() => {
    initData();
  }, []);

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle(title)}

        <Text
          style={{
            width: '100%',
            marginTop: 0,
            marginBottom: 10,
            fontSize: 14,
            color: '#666',
          }}>
          {'注销原因'}
        </Text>

        <View
          style={{backgroundColor: '#Fff', borderRadius: 10, width: '100%'}}>
          {selectItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: '100%',
                height: 58,
                alignItems: 'center',
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: 'row',
              }}
              activeOpacity={1}
              onPress={() => {
                setSelect(index);
              }}>
              <Text style={{flex: 1, color: '#222', fontSize: 14}}>{item}</Text>
              <Image
                source={
                  index === select
                    ? require('../../../../../rawfile/dev/media/icon/rb_sel.png')
                    : require('../../../../../rawfile/dev/media/icon/rb_sel_not.png')
                }
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{flex: 1}} />
        <TouchableOpacity
          disabled={select === -1}
          style={{
            width: '100%',
            height: 46,
            alignItems: 'center',
            backgroundColor: select === -1 ? '#ccc' : THEME_COLOR,
            borderRadius: 23,
            marginTop: 60,
            justifyContent: 'center',
          }}
          onPress={() => {
            LoginManager.logout(() => {
              LoginManager.clearCache(() => {
                Toast.show('注销完成');
                setTimeout(() => {
                  for (let i of [0, 1, 2]) {
                    bridge.back('', undefined, false);
                  }
                }, 1000);
              });
            });
          }}
          activeOpacity={1}>
          <Text style={{fontSize: 16, color: '#fff'}}>{'注销'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return renderPage();
}

export default DeletePhonePage;
