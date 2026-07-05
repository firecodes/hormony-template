import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {UserWidget} from './utils/UserWidget';
import {getItemTime, MyMessageVM, WeekDays} from './vm/MyMessageVM';
import bridge from '../../utils/bridge';
import {MessageContBean} from './bean/MessageContBean';
import {Loading} from '../../utils/CommonUtils';

function MyMessage(props) {
  let vm = new MyMessageVM();
  let [defItem, setDefItem] = useState<MessageContBean[]>();
  let [isLoading, setIsLoading] = useState(true);

  const initData = useCallback(() => {
    let tmp = vm.getMessageCont();
    bridge.getOhPrefData(prefsData => {
      if (prefsData) {
        let preData = JSON.parse(String(prefsData)) as MessageContBean[];
        let newSysMsg = preData?.[preData.length - 1];
        if (preData.length > 0) {
          if (
            tmp?.[1] &&
            newSysMsg &&
            ((tmp[1] as MessageContBean).time !==
              (newSysMsg as MessageContBean).time ||
              (tmp[1] as MessageContBean).desc !==
                (newSysMsg as MessageContBean).desc)
          ) {
            setIsLoading(false);
            setDefItem([tmp[0], preData[preData.length - 1], tmp[2], tmp[3]]);
          } else {
            setIsLoading(false);
            setDefItem(tmp);
          }
        } else {
          setIsLoading(false);
          setDefItem(tmp);
        }
      } else {
        setIsLoading(false);
        setDefItem(tmp);
      }
    }, 'sys_message');
  }, [defItem]);

  useEffect(() => {
    let onResume = bridge.setOnPageShow('MyMessage', () => {
      initData();
    });
    return () => {
      onResume.remove();
    };
  }, []);

  function renderMsgItem(item: MessageContBean, index) {
    let img = require('../../../../rawfile/dev/media/icon/ic_user_shop.png');
    let title = '官方旗舰店';
    if (MyMessageVM.TYPE_MESSAGE === item.type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_notice.png');
      title = '系统通知';
    } else if (MyMessageVM.TYPE_CUSTOMER === item.type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_custom.png');
      title = '客服助手';
    } else if (MyMessageVM.TYPE_PUSH === item.type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_push.png');
      title = '活动推送';
    }

    let strTime = getItemTime(item);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flexDirection: 'row',
          width: '100%',
          borderRadius: 12,
          backgroundColor: '#fff',
          marginBottom: 12,
          height: 72,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
        onPress={() => {
          bridge.pushUrl(
            'MyMessageDetail',
            JSON.stringify({
              type: item.type,
            }),
          );
        }}>
        <Image
          source={img}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        />
        <View style={{flex: 1, marginHorizontal: 12}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: '#222',
                flex: 1,
                height: 22,
                textAlignVertical: 'center',
              }}>
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#00000066',
                height: 18,
                textAlignVertical: 'center',
              }}>
              {strTime}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 2,
              fontSize: 12,
              color: '#00000066',
              height: 18,
              textAlignVertical: 'center',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {item.desc}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('我的消息')}
        <FlatList
          style={{width: '100%', marginBottom: 10}}
          data={defItem}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => renderMsgItem(item, index)}
        />
        {isLoading && Loading()}
      </View>
    );
  }

  return renderPage();
}

export default MyMessage;
