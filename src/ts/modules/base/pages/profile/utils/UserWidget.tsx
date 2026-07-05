import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {CommonTitle} from '../../../utils/CommonUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  TopReactHeight,
} from '../../../utils/Constant';
import bridge from '../../../utils/bridge';
import {LoginManager} from '../../login/LoginManager';

export class UserWidget {
  static renderDetailActionItem(
    text: string,
    page: string,
    cb?: () => void,
    param?: any,
  ) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: '100%',
          paddingLeft: 16,
          paddingRight: 18,
          flexDirection: 'row',
          height: 58,
          alignItems: 'center',
        }}
        onPress={() => {
          if (!!cb) {
            cb?.();
            return;
          }
          if (!!page && (LoginManager.isLogin || param?.needLogin === false)) {
            let pageParam = param;
            if (!pageParam) {
              pageParam = {pageTitle: text};
            }
            pageParam.fromProfile = true;
            bridge.pushUrl(page, JSON.stringify(pageParam));
          } else if (!LoginManager.isLogin) {
            bridge.pushUrl('Login');
          }
        }}>
        <Text style={{flex: 1, fontSize: 14, color: '#000', fontWeight: '500'}}>
          {text}
        </Text>
        {UserWidget.rightArrowIcon()}
      </TouchableOpacity>
    );
  }

  static rightArrowIcon(isWhite: boolean = false) {
    if (isWhite) {
      return (
        <Image
          source={require('../../../../../rawfile/dev/media/icon/right_arrow_white.svg')}
          style={{width: 13, height: 13, marginLeft: 10}}
        />
      );
    }
    return (
      <Image
        source={require('../../../../../rawfile/dev/media/icon/right_arrow.svg')}
        style={{width: 13, height: 13, marginLeft: 10, opacity: 0.2}}
      />
    );
  }

  static renderDetailTitle(title: string) {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
          marginBottom: 12,
        }}>
        {CommonTitle(title, 'black', undefined, undefined, false)}
      </View>
    );
  }

  static defStyle = StyleSheet.create({
    defBack: {
      flex: 1,
      paddingTop: TopReactHeight,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: BACKGROUND_COLOR,
      paddingHorizontal: 16,
      paddingBottom: BottomReactHeight,
    },
  });

  static getPrivacyPhoneNumber = (phoneNum: string) => {
    let res = phoneNum;
    if (!!res && res.length >= 11) {
      res = phoneNum.substring(0, 3) + '****' + phoneNum.substring(7);
    }
    return res;
  };

  static formatDateTime(timestamp: Date, format = 'YYYY-MM-DD hh:mm:ss') {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return '无效时间';

    const pad = num => String(num).padStart(2, '0');
    const replacements = {
      YYYY: date.getFullYear(),
      MM: pad(date.getMonth() + 1),
      DD: pad(date.getDate()),
      hh: pad(date.getHours()),
      mm: pad(date.getMinutes()),
      ss: pad(date.getSeconds()),
    };

    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, match => replacements[match]);
  }

  static formatDate(timestamp: Date, format = 'YYYY年MM月DD日') {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return '无效时间';

    const pad = num => String(num).padStart(2, '0');
    const replacements = {
      YYYY: date.getFullYear(),
      MM: pad(date.getMonth() + 1),
      DD: pad(date.getDate()),
    };

    return format.replace(/YYYY|MM|DD/g, match => replacements[match]);
  }
}
