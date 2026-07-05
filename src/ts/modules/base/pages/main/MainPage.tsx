import {DeviceEventEmitter, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {CustomTab} from '../../view/CustomTab';
import HomePage from '../home/HomePage';
import CategoryPage from '../category/CategoryPage';
import CartPage from '../cart/CartPage';
import ProfilePage from '../profile/ProfilePage';
import {BottomReactHeight} from '../../utils/Constant';
import {useEffect} from 'react';
import {LoginManager} from '../login/LoginManager';

function MainPage(props) {
  // 定义Tab数据
  const tabData = [
    {
      key: 'main',
      title: '首页',
      activeImage: require('../../../../rawfile/dev/media/icon/ic_tab_active_home.svg'),
      inactiveImage: require('../../../../rawfile/dev/media/icon/ic_tab_inactive_home.svg'),
    },
    {
      key: 'category',
      title: '分类',
      activeImage: require('../../../../rawfile/dev/media/icon/ic_tab_active_category.svg'),
      inactiveImage: require('../../../../rawfile/dev/media/icon/ic_tab_inactive_category.svg'),
    },
    {
      key: 'cart',
      title: '购物车',
      activeImage: require('../../../../rawfile/dev/media/icon/ic_tab_active_cart.svg'),
      inactiveImage: require('../../../../rawfile/dev/media/icon/ic_tab_inactive_cart.svg'),
    },
    {
      key: 'profile',
      title: '我的',
      activeImage: require('../../../../rawfile/dev/media/icon/ic_tab_active_profile.svg'),
      inactiveImage: require('../../../../rawfile/dev/media/icon/ic_tab_inactive_profile.svg'),
    },
  ];

  const getTabPage = () => {
    return [HomePage, CategoryPage, CartPage, ProfilePage];
  };

  useEffect(() => {
    LoginManager.getPrefsLoginStatus();
    let emitter = DeviceEventEmitter.addListener('LoginData', param => {
      let loginData = param?.loginData;
      LoginManager.initLoginStatus(loginData);
    });
    return () => {
      emitter && emitter.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 使用自定义Tab组件 */}
      <CustomTab
        tabs={tabData}
        initialIndex={0}
        activeColor="#E84026"
        inactiveColor="#666666"
        tabBarHeight={75}
        tabInTop={false}
        tabBarStyle={{
          paddingBottom: BottomReactHeight,
        }}
        getTabPage={getTabPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default MainPage;
