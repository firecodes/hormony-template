import {Image, Text, TouchableOpacity, View} from 'react-native';
import {UserWidget} from '../utils/UserWidget';
import bridge from '../../../utils/bridge';

function AboutPage(props) {
  function renderPage() {
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('关于')}
        <Image
          style={{marginTop: 120, width: 81, height: 81}}
          source={require('../../../../../rawfile/dev/media/icon/startIcon.png')}
        />
        <Text
          style={{
            fontSize: 16,
            marginTop: 9,
            lineHeight: 22,
            includeFontPadding: true,
          }}>
          {'商城RN'}
        </Text>
        <Text style={{fontSize: 14, color: '#00000099', marginTop: 3}}>
          {'版本 1.0.0'}
        </Text>
        <View style={{flex: 1}} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              bridge.pushUrl('Web', JSON.stringify({webUrl: 'user_agreement'}));
            }}>
            <Text
              style={{
                fontSize: 12,
                color: '#0A59F7',
                paddingVertical: 5,
                lineHeight: 18,
                includeFontPadding: true,
              }}>
              商城用户协议
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              color: '#888',
              paddingVertical: 5,
              lineHeight: 18,
              includeFontPadding: true,
            }}>
            和
          </Text>
          <TouchableOpacity
            onPress={() => {
              bridge.pushUrl('Web', JSON.stringify({webUrl: 'privacy_policy'}));
            }}>
            <Text
              style={{
                fontSize: 12,
                color: '#0A59F7',
                paddingVertical: 5,
                lineHeight: 18,
                includeFontPadding: true,
              }}>
              关于商城与隐私的声明
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: '#888',
            marginBottom: 5,
            lineHeight: 18,
            includeFontPadding: true,
          }}>
          {'苏ICP备17040376号-195A'}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: '#888',
            marginBottom: 20,
            lineHeight: 18,
            includeFontPadding: true,
          }}>
          {'华为xx 版权所有 @ 2014-2025'}
        </Text>
      </View>
    );
  }

  return renderPage();
}

export default AboutPage;
