import React from 'react';
import {AppRegistry} from 'react-native';
import {useBridgeEvents} from './bridge/useBridgeEvents';
import RNSplashPage from './pages/RNSplashPage';
import MainPage from './pages/main/MainPage';
import SimpleWebPage from './pages/web/SimpleWebPage';
import WebBridgeTestPage from './pages/web/WebBridgeTestPage';
import NativeEventMonitorPage from './pages/event/NativeEventMonitorPage';
import SearchPage from './pages/search/SearchPage';
import DetailPage from './pages/detail/DetailPage';
import CartPage from './pages/cart/CartPage';
import OrderSubmitPage from './pages/submit/OrderSubmitPage';
import OrderInfoPage from './pages/orderinfo/OrderInfoPage';
import CouponsPage from './pages/coupons/CouponsPage';
import CategoryPage from './pages/category/CategoryPage';
import CollectionPage from './pages/collection/CollectionPage';
import FeedbackPage from './pages/profile/FeedbackPage';
import SettingPage from './pages/profile/setting/SettingPage';
import MyPointPage from './pages/profile/MyPointPage';
import MyMessage from './pages/profile/MyMessage';
import MyMessageDetail from './pages/profile/MyMessageDetail';
import ProductCommandPage from './pages/command/ProductCommandPage';
import ProductAllEvalPage from './pages/evaluate/ProductAllEvalPage';
import AccountSafePage from './pages/profile/setting/AccountSafePage';
import AboutPage from './pages/profile/setting/AboutPage';
import DeletePhonePage from './pages/profile/setting/DeletePhonePage';
import PhoneNumPage from './pages/profile/setting/PhoneNumPage';
import PrivacySettingPage from './pages/profile/setting/PrivacySettingPage';
import UpdatePhonePage from './pages/profile/setting/UpdatePhonePage';
import ServicePage from './pages/service/ServicePage';
import MyOrderPage from './pages/myorder/MyOrderPage';
import UserInfoDetailPage from './pages/profile/UserInfoDetailPage';
import MyPointDetailPage from './pages/profile/MyPointPageDetail';
import PostEvaluatePage from './pages/evaluate/toeval/PostEvaluatePage';
import LargeImageView from './pages/largeImage/LargeImageView';
import CategoryListPage from './pages/category/CategoryListPage';
import ViewHistoryPage from './pages/profile/viewHistory/ViewHistoryPage';
import {registerProvider} from './utils/AppProviderUtil';

function register(name, getComponent) {
  AppRegistry.registerComponent(name, () => {
    const Component = getComponent();
    return props => {
      useBridgeEvents();
      return React.createElement(Component, props);
    };
  });
}

//注册provider
registerProvider();

register('Splash', () => RNSplashPage);
register('Main', () => MainPage);
register('Search', () => SearchPage);
register('Web', () => SimpleWebPage);
register('WebBridgeTest', () => WebBridgeTestPage);
register('NativeEventMonitor', () => NativeEventMonitorPage);
register('Detail', () => DetailPage);
register('Cart', () => CartPage);
register('Submit', () => OrderSubmitPage);
register('OrderInfo', () => OrderInfoPage);
register('Coupons', () => CouponsPage);
register('Category', () => CategoryPage);
register('CategoryList', () => CategoryListPage);
register('Collection', () => CollectionPage);
register('ProComd', () => ProductCommandPage);
register('AllEval', () => ProductAllEvalPage);
register('Service', () => ServicePage);
register('MyOrder', () => MyOrderPage);
register('PostEval', () => PostEvaluatePage);
register('LargeImage', () => LargeImageView);

//
register('MyPointPage', () => MyPointPage);
register('MyPointDetailPage', () => MyPointDetailPage);
register('MyMessage', () => MyMessage);
register('MyMessageDetail', () => MyMessageDetail);
register('ViewHistory', () => ViewHistoryPage);

//UserInfo
register('FeedbackPage', () => FeedbackPage);

//Setting
register('AboutPage', () => AboutPage);
register('AccountSafePage', () => AccountSafePage);
register('DeletePhonePage', () => DeletePhonePage);
register('PhoneNumPage', () => PhoneNumPage);
register('PrivacySettingPage', () => PrivacySettingPage);
register('SettingPage', () => SettingPage);
register('UpdatePhonePage', () => UpdatePhonePage);
register('UserInfoDetailPage', () => UserInfoDetailPage);
