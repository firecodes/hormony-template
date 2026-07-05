import {AppRegistry} from 'react-native';
import RNSplashPage from './pages/RNSplashPage';
import MainPage from './pages/main/MainPage';
import SimpleWebPage from './pages/web/SimpleWebPage';
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

//注册provider
registerProvider();

AppRegistry.registerComponent('Splash', () => RNSplashPage);
AppRegistry.registerComponent('Main', () => MainPage);
AppRegistry.registerComponent('Search', () => SearchPage);
AppRegistry.registerComponent('Web', () => SimpleWebPage);
AppRegistry.registerComponent('Detail', () => DetailPage);
AppRegistry.registerComponent('Cart', () => CartPage);
AppRegistry.registerComponent('Submit', () => OrderSubmitPage);
AppRegistry.registerComponent('OrderInfo', () => OrderInfoPage);
AppRegistry.registerComponent('Coupons', () => CouponsPage);
AppRegistry.registerComponent('Category', () => CategoryPage);
AppRegistry.registerComponent('CategoryList', () => CategoryListPage);
AppRegistry.registerComponent('Collection', () => CollectionPage);
AppRegistry.registerComponent('ProComd', () => ProductCommandPage);
AppRegistry.registerComponent('AllEval', () => ProductAllEvalPage);
AppRegistry.registerComponent('Service', () => ServicePage);
AppRegistry.registerComponent('MyOrder', () => MyOrderPage);
AppRegistry.registerComponent('PostEval', () => PostEvaluatePage);
AppRegistry.registerComponent('LargeImage', () => LargeImageView);

//
AppRegistry.registerComponent('MyPointPage', () => MyPointPage);
AppRegistry.registerComponent('MyPointDetailPage', () => MyPointDetailPage);
AppRegistry.registerComponent('MyMessage', () => MyMessage);
AppRegistry.registerComponent('MyMessageDetail', () => MyMessageDetail);
AppRegistry.registerComponent('ViewHistory', () => ViewHistoryPage);

//UserInfo
AppRegistry.registerComponent('FeedbackPage', () => FeedbackPage);

//Setting
AppRegistry.registerComponent('AboutPage', () => AboutPage);
AppRegistry.registerComponent('AccountSafePage', () => AccountSafePage);
AppRegistry.registerComponent('DeletePhonePage', () => DeletePhonePage);
AppRegistry.registerComponent('PhoneNumPage', () => PhoneNumPage);
AppRegistry.registerComponent('PrivacySettingPage', () => PrivacySettingPage);
AppRegistry.registerComponent('SettingPage', () => SettingPage);
AppRegistry.registerComponent('UpdatePhonePage', () => UpdatePhonePage);
AppRegistry.registerComponent('UserInfoDetailPage', () => UserInfoDetailPage);
