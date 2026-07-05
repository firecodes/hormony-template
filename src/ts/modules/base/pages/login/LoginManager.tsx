import bridge from '../../utils/bridge';
import {DeviceEventEmitter} from 'react-native';
import {UserInfo} from '../profile/bean/UserInfoBean';
import {PREFERENCE_KEY_VIEW_HISTORY_LIST} from '../profile/viewHistory/ViewHistoryManager';
import {PREFERENCE_KEY_COLLECTION_LIST} from '../collection/viewmodel/CollectionsPageVM';
import {PREFERENCE_KEY_ORDER_LIST} from '../myorder/OrderApi';
import {CART_PREFERENCE_KEY} from '../cart/api/CartDataApi';
import {PREFERENCE_KEY_SERVICE_MSG} from '../service/viewmodel/ServiceVM';
import {Toast} from '../../utils/ToastManager';

export const LOGIN_DATA = 'LoginData';
export const LOGIN_USER_DATA = 'LoginUserData'; //模拟后台存储所有用户的信息 以LOGIN_USER_DATA为key 用户修改头像昵称手机号 保存到本地 下次模拟登录继续使用修改后数据

export class LoginManager {
  public static isLogin: boolean = false;
  public static loginData?: UserInfo;

  public static initLoginStatus(loginData?: string) {
    if (loginData) {
      LoginManager.isLogin = loginData.length > 0;
      if (LoginManager.isLogin) {
        LoginManager.loginData = JSON.parse(loginData);
      }
    } else {
      LoginManager.isLogin = false;
      LoginManager.loginData = undefined;
    }
  }

  public static getPrefsLoginStatus() {
    bridge.getOhPrefData((res: string | undefined) => {
      LoginManager.isLogin = !!res;
      if (!!res) {
        DeviceEventEmitter.emit(LOGIN_DATA, {loginData: res});
      }
    }, LOGIN_DATA);
  }

  public static logout(callBack?: () => void) {
    LoginManager.isLogin = false;
    LoginManager.loginData = undefined;
    bridge.setOhPrefData(LOGIN_DATA, undefined, undefined, callBack);
    DeviceEventEmitter.emit(LOGIN_DATA, undefined);
  }

  public static updateLoginData() {
    bridge.setOhPrefData(LOGIN_DATA, JSON.stringify(LoginManager.loginData));
    LoginManager.updateUserInfo(
      JSON.parse(JSON.stringify(LoginManager.loginData)),
    );
    DeviceEventEmitter.emit(LOGIN_DATA, {
      loginData: JSON.stringify(LoginManager.loginData),
    });
  }

  private static updateUserInfo(userInfo: UserInfo) {
    bridge.getOhPrefData((res: string | undefined) => {
      if (!res) {
        bridge.setOhPrefData(
          LOGIN_USER_DATA,
          JSON.stringify([LoginManager.loginData]),
        );
        return;
      }
      let preData = JSON.parse(res) as UserInfo[];
      if (preData && preData.length > 0) {
        let findIndex = -1;
        preData.forEach((item, index) => {
          if (
            findIndex === -1 &&
            item.userId === LoginManager.loginData.userId
          ) {
            findIndex = index;
          }
        });
        if (findIndex !== -1) {
          preData[findIndex] = LoginManager.loginData;
        } else {
          preData.push(LoginManager.loginData);
        }
        bridge.setOhPrefData(LOGIN_USER_DATA, JSON.stringify(preData));
      }
    }, LOGIN_USER_DATA);
  }

  public static clearCache(callBack?: () => void) {
    bridge.setOhPrefData(
      PREFERENCE_KEY_VIEW_HISTORY_LIST,
      undefined,
      undefined,
      () => {
        bridge.setOhPrefData(
          PREFERENCE_KEY_COLLECTION_LIST,
          undefined,
          undefined,
          () => {
            bridge.setOhPrefData(
              PREFERENCE_KEY_ORDER_LIST,
              undefined,
              undefined,
              () => {
                bridge.setOhPrefData(
                  CART_PREFERENCE_KEY,
                  undefined,
                  undefined,
                  () => {
                    bridge.setOhPrefData(PREFERENCE_KEY_SERVICE_MSG, undefined);
                    callBack?.();
                  },
                );
              },
            );
          },
        );
      },
    );
  }

  static getDestName() {
    let userName = LoginManager.loginData?.userName ?? '';
    if (userName.length > 1) {
      let length = userName.length / 2;
      let userNameNew = userName.slice(0, length);
      for (let i = 0; i < length; i++) {
        userNameNew += '*';
      }
      return userNameNew;
    }
    return userName;
  }
}
