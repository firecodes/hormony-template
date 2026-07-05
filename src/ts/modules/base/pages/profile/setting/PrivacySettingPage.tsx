import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserWidget} from '../utils/UserWidget';
import RnFabricView from '../../../../../widget/RnFabricView';
import {PrivacyVM} from '../vm/PrivacyVM';
import {THEME_COLOR} from '../../../utils/Constant';

function PrivacySettingPage(props) {
  let vm = new PrivacyVM();
  let [title, setTitle] = useState<string>('');
  let selectItems = [
    {
      name: '个性化推荐',
      tag: 'sel_personal',
    },
    {
      name: '短信通知',
      tag: 'sel_msg',
    },
    {
      name: '系统通知',
      tag: 'sel_sys_push',
    },
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
        {selectItems.map((item, index) => (
          <View
            key={String(index)}
            style={{
              width: '100%',
              marginBottom: 10,
              backgroundColor: '#fff',
              borderRadius: 10,
              height: 60,
              alignItems: 'center',
              flexDirection: 'row',
              paddingStart: 10,
              paddingRight: 20,
            }}>
            <Text style={{fontSize: 16, color: '#222', flex: 1}}>
              {item.name}
            </Text>
            <RnFabricView
              style={{
                width: 40,
                height: 24,
              }}
              src={JSON.stringify({
                nativeViewName: 'RNToggle',
                tag: item.tag,
                selectedColor: THEME_COLOR,
                switchPointColor: '#FFF',
                isOn: vm.getIsSelect(item.tag),
              })}
              onReceiveData={recvData => {
                let isOn = false;
                try {
                  isOn = JSON.parse(recvData.nativeEvent.rnValue)?.isOn;
                } catch (e) {}
                vm.setSelect(item.tag, isOn);
              }}
            />
          </View>
        ))}
      </View>
    );
  }

  return renderPage();
}

export default PrivacySettingPage;
