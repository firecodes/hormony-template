import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import bridge from '../utils/bridge';
import * as React from 'react';
import {BACKGROUND_COLOR, BottomReactHeight} from '../utils/Constant';

function RNSplashPage(props) {
  // 处理链接点击（如跳转到隐私声明页面）
  const handleLinkPress = linkName => {
    bridge.pushUrl('Web', JSON.stringify({webUrl: 'privacy_policy'}));
  };

  // 处理“同意”按钮点击
  const handleAgreePress = () => {
    bridge.setOhPrefData('access_agreement', 1);
    bridge.replaceUrl('Main', JSON.stringify({index: 1, title: 'HomePage'}));
  };

  // 处理“取消”按钮点击
  const handleCancelPress = () => {
    bridge.shutDownApp();
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require('../../../rawfile/dev/media/icon/startIcon.png')}
          resizeMode={'contain'}
          style={styles.logoImage}
        />
        <Text style={styles.appNameTitle}>商城RN</Text>
      </View>
      <View style={styles.tips}>
        <Image
          source={require('../../../rawfile/dev/media/icon/ic_pre_exam.png')}
          resizeMode={'contain'}
          style={styles.tipsImage}
        />
        <View style={styles.tipsLine} />
      </View>
      <Text style={styles.accessContent}>
        本应用经您同意，调用
        <Text style={styles.boldText}>XX</Text>、
        <Text style={styles.boldText}>XX</Text>
        权限，获取
        <Text style={styles.boldText}>XX</Text>
        信息，为您提供
        <Text style={styles.boldText}>XX</Text>
        服务。我们会在您使用具体功能业务时，才会触发上述行为收集使用相关的个人信息。详情请参阅
        <TouchableOpacity
          style={{height: 10}}
          onPress={() => handleLinkPress('XX业务与隐私声明')}>
          <Text style={styles.linkText}>XX业务与隐私声明</Text>
        </TouchableOpacity>
        、
        <TouchableOpacity
          style={{height: 10}}
          onPress={() => handleLinkPress('权限使用说明')}>
          <Text style={styles.linkText}>权限使用说明</Text>
        </TouchableOpacity>
      </Text>
      <Text style={styles.accessContent2}>
        请您仔细阅读上述声明，点击“同意”，即表示您知悉并同意我们向您提供本应用服务。
      </Text>
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.bottomButtonView}
          onPress={handleCancelPress}>
          <Text style={[styles.bottomButton, styles.cancelButton]}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomButtonView}
          onPress={handleAgreePress}>
          <Text style={[styles.bottomButton, styles.sureButton]}>同意</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginTop: 150,
  },
  appNameTitle: {
    fontSize: 25,
    fontWeight: '500',
    marginTop: 30,
  },
  appDes: {
    fontSize: 15,
    marginTop: 10,
    color: '#999',
  },
  accessContent: {
    fontSize: 10,
    color: '#999',
    lineHeight: 14,
    margin: 15,
  },
  accessContent2: {
    fontSize: 10,
    color: '#999',
    lineHeight: 14,
    marginHorizontal: 12,
  },
  tips: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsImage: {
    width: 25,
    height: 25,
  },
  tipsLine: {
    width: 3,
    height: 9,
    backgroundColor: '#0A59F7',
    position: 'absolute',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#888888',
  },
  linkText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#0A59F7',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: BottomReactHeight,
  },
  bottomButtonView: {
    width: '45%',
    height: 40,
  },
  bottomButton: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cancelButton: {
    backgroundColor: BACKGROUND_COLOR,
    color: '#0A59F7',
  },
  sureButton: {
    backgroundColor: '#0A59F7',
    color: '#ffffff',
  },
});

export default RNSplashPage;
