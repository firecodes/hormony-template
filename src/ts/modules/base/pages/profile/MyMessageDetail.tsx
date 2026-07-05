import {FlatList, Image, Text, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {UserWidget} from './utils/UserWidget';
import {getItemTime, MyMessageVM} from './vm/MyMessageVM';
import {MessageContBean} from './bean/MessageContBean';
import bridge from '../../utils/bridge';

function MyMessageDetail(props) {
  let vm = new MyMessageVM();
  let [defItem, setDefItem] = useState<MessageContBean[]>();
  let [type, setType] = useState(0);

  function initData() {
    let tmp = vm.getMessageCont(true);
    let typeDef = props.type;
    let res = [];
    tmp.forEach(item => {
      if (item.type === typeDef) {
        res.push(item);
      }
    });

    if (typeDef === MyMessageVM.TYPE_MESSAGE) {
      bridge.getOhPrefData(preData => {
        if (preData) {
          setDefItem(JSON.parse(String(preData)));
        } else {
          setDefItem(res);
        }
      }, 'sys_message');
    } else {
      setDefItem(res);
    }
    setType(typeDef);
  }

  useEffect(() => {
    initData();
  }, []);

  function renderMsgItem(img: any, item: MessageContBean, index) {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: '#A2A2A2',
            height: 17,
            textAlignVertical: 'center',
          }}>
          {getItemTime(item)}
        </Text>
        <View style={{width: '100%', flexDirection: 'row', marginTop: 10}}>
          <Image
            source={img}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: 13,
              marginRight: 20,
              marginBottom: 30,
              borderRadius: 6,
              color: '#6E6E6E',
              backgroundColor: '#fff',
              padding: 16,
            }}>
            {item.detail}
          </Text>
        </View>
      </View>
    );
  }

  function renderPage() {
    let img = require('../../../../rawfile/dev/media/icon/ic_user_shop.png');
    let title = '';
    if (MyMessageVM.TYPE_SHOP === type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_shop.png');
      title = '官方旗舰店';
    } else if (MyMessageVM.TYPE_MESSAGE === type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_notice.png');
      title = '系统通知';
    } else if (MyMessageVM.TYPE_CUSTOMER === type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_custom.png');
      title = '客服助手';
    } else if (MyMessageVM.TYPE_PUSH === type) {
      img = require('../../../../rawfile/dev/media/icon/ic_user_push.png');
      title = '活动推送';
    }
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle(title)}
        <FlatList
          style={{width: '100%', marginBottom: 10}}
          showsVerticalScrollIndicator={false}
          data={defItem}
          renderItem={({item, index}) => renderMsgItem(img, item, index)}
        />
      </View>
    );
  }

  return renderPage();
}

export default MyMessageDetail;
