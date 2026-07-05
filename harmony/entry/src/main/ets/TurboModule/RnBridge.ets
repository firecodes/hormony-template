import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import { TurboModule } from '@rnoh/react-native-openharmony';
import { RNRouterParam } from '../model/RNRouterParam';
import { router } from '@kit.ArkUI';
import { LoadManager } from '../rn';
import { BusinessError, emitter, pasteboard } from '@kit.BasicServicesKit';
import { preferences } from '@kit.ArkData';
import { ImageUtils } from '../utils/SaveImage';
import { paymentService } from '@kit.PaymentKit';
import { abilityAccessCtrl, common, Permissions } from '@kit.AbilityKit';
import { Logger } from '../utils/Logger';
import { ShareUtils } from '../utils/ShareUtils';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { PhotoHelper } from '../utils/PhotoHelper';
import { JSON } from '@kit.ArkTS';
import { call } from '@kit.TelephonyKit';
import { StatusBarManager } from '../utils/StatusBarManager';
import { BridgeOpenLinkModel } from '../model/BridgeOpenLinkModel';
import { BridgeShareModel } from '../model/BridgeShareModel';
import { KNOCK_PER } from '../utils/ShareManager';
import { AddressDTO, Api } from 'address_management';

const TAG = 'RnBridge';

const ADDRESS_LIST_PAGE_NAME = 'AddressListPage';
const ADDRESS_LIST_PAGE = 'pages/address/AddressListPage';
const ADDRESS_FORM_SHEET_PAGE_NAME = 'AddressFormSheetPage';
const ADDRESS_FORM_SHEET_PAGE = 'pages/address/AddressFormSheetPage';
const LOGIN_PAGE_NAME = 'Login';
const LOGIN_PAGE = 'pages/login/LoginPage';

export class RnBridge extends TurboModule implements TM.BridgeTurboModule.Spec {
  prePageName: string = ''

  private getOptions(pageName: string, param?: string): router.RouterOptions {
    let routerParam: RNRouterParam = new RNRouterParam();
    routerParam.moduleName = pageName;
    routerParam.params = param;
    let url: string = ''
    if (pageName === ADDRESS_LIST_PAGE_NAME || pageName === ADDRESS_FORM_SHEET_PAGE_NAME) {
      url = (pageName === ADDRESS_LIST_PAGE_NAME) ? ADDRESS_LIST_PAGE : ADDRESS_FORM_SHEET_PAGE;
    } else if (pageName === LOGIN_PAGE_NAME) {
      url = LOGIN_PAGE;
    } else {
      url = 'pages/Index';
    }
    return {
      url: url,
      params: routerParam
    };
  }

  replaceUrl(pageName: string, param?: string, callBack?: (result: string) => void): string {
    Logger.info(TAG, 'replaceUrl : ' + pageName + ' param' + JSON.stringify(param ?? ''));
    LoadManager.uiContext?.getRouter().replaceUrl(this.getOptions(pageName, param),
      (err: BusinessError) => {
        !err && callBack && callBack('replaceUrl : ' + pageName + ' success')
      });
    this.prePageName = pageName;
    return 'replaceUrl : ' + pageName + ' success';
  }

  pushUrl(pageName: string, param?: string, callBack?: (result: string) => void): string {
    Logger.info(TAG, 'pushUrl : ' + pageName + ' param' + JSON.stringify(param ?? ''));
    LoadManager.uiContext?.getRouter().pushUrl(this.getOptions(pageName, param),
      (err: BusinessError) => {
        !err && callBack && callBack('pushUrl : ' + pageName + ' success')
      });
    this.prePageName = pageName
    return 'pushUrl : ' + pageName + ' success';
  }

  back(param?: string, callBack?: (result: string) => void): string {
    Logger.info(TAG, 'back : ' + JSON.stringify(param ?? '') + ' this.prePageName:' + this.prePageName);
    let routerParam: RNRouterParam = new RNRouterParam()
    routerParam.moduleName = this.prePageName
    routerParam.params = param
    router.back({
      url: 'pages/Index',
      params: routerParam
    });
    callBack?.('back 鸿蒙侧回调: ' + JSON.stringify(param ?? ''));
    return 'back success with param: ' + JSON.stringify(param ?? '');
  }

  getOhASData(key: string, defaultVal?: null | Object): null | Object {
    let res = AppStorage.get(key) ?? defaultVal
    return res === undefined ? null : res;
  }

  public static async getRnBridgePref(prefName?: string) {
    return preferences.getPreferences(getContext(), prefName ?? 'pref')
  }

  getOhPrefData(callback: (res: null | Object) => void, key: string, defaultVal?: null | Object,
    prefName?: string) {
    let pref: preferences.Preferences | null
    RnBridge.getRnBridgePref(prefName).then((pref_) => {
      pref = pref_
    }).finally(() => {
      if (pref) {
        callback(pref.getSync(key, defaultVal))
      } else {
        callback(null)
      }
    })
  }

  setOhPrefData(key: string, val: null | Object, prefName?: string, callback?: () => void) {
    RnBridge.getRnBridgePref(prefName).then((pref) => {
      if (pref) {
        if (val === null || val === undefined) {
          pref.deleteSync(key)
        } else {
          pref.putSync(key, val)
        }
        pref.flushSync()
      }
    })
      .finally(() => {
        callback && callback()
      })
  }

  delOhPrefData(key: string, prefName?: string, callback?: () => void) {
    RnBridge.getRnBridgePref(prefName).then((pref) => {
      if (pref) {
        pref.deleteSync(key)
      }
    }).finally(() => {
      callback && callback()
    })
  }

  shutDownApp() {
    getContext().getApplicationContext().killAllProcesses()
    Logger.info(TAG, 'shutdown app success');
  }

  saveImageToAlbum(path: string, callback: (res: boolean, saveUri: string) => void) {
    try {
      ImageUtils.saveImageToAlbum(getContext(), path, callback)
    } catch (e) {
      callback(false, '')
    }
  }

  requestPayment(orderNo: string, callback: () => void) {
    Logger.info(TAG, 'requestPayment : ' + orderNo)
    paymentService
      .requestPayment(getContext() as common.UIAbilityContext, '')
      .then(() => {
      })
      .catch(() => {
      })
      .finally(() => {
        callback();
      });
  }

  copyText(text: string, callback: () => void) {
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.setDataSync(pasteData);
    callback?.();
  }

  hiLog(level: string | number, tag: string, content: string) {
    let levelTag = 0;
    if (typeof level === 'string') {
      if (level === 'info') {
        levelTag = 0;
      } else if (level === 'debug') {
        levelTag = 1;
      } else if (level === 'warn') {
        levelTag = 2;
      } else if (level === 'error') {
        levelTag = 3;
      }
    } else {
      levelTag = level
    }
    if (levelTag === 0) {
      Logger.info(tag, content);
    } else if (levelTag === 1) {
      Logger.debug(tag, content);
    } else if (levelTag === 2) {
      Logger.warn(tag, content);
    } else if (levelTag === 3) {
      Logger.error(tag, content);
    } else {
      Logger.info(tag, content);
    }
  }

  share(strData: string): boolean {
    Logger.info(TAG, 'share : ' + strData)
    let content = ""
    let title = ""
    let desc = ""
    try {
      let data = JSON.parse(strData) as BridgeShareModel
      if (!!data) {
        content = data.content
        title = data.title
        desc = data.desc
      }
      if (!!LoadManager.uiContext) {
        ShareUtils.share(LoadManager.uiContext, content, title, desc)
      }
    } catch (e) {
      Logger.error(TAG, e)
    }
    return true;
  }

  selectPicture(action: string, callback: ((uri: string) => void) | undefined): void {
    Logger.info(TAG, 'selectPicture : ' + action)
    let options: photoAccessHelper.PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions()
    options.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE //可选择的媒体文件类型，若无此参数，则默认为图片和视频类型。
    options.maxSelectNumber = 1 //选择媒体文件数量的最大值,默认1
    options.isPhotoTakingSupported = true //支持拍照。
    options.isEditSupported = true //支持编辑照片。
    options.isOriginalSupported = false //显示选择原图按钮。
    PhotoHelper.select(options).then(uris => {
      if (uris.length <= 0) {
        Logger.error(TAG, 'selectPicture select none');
        return
      }
      callback?.(uris[0])
    })
  }

  openLink(strParam: string): void {
    Logger.info(TAG, 'startAbility : ' + strParam)
    try {
      let param = JSON.parse(strParam) as BridgeOpenLinkModel
      let url = param.url; // 包名需替换
      let context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext
      // 需要拼接不同的应用包名，用以打开不同的应用详情页,例如：bundleName:'com.huawei.hmsapp.books'
      let link: string = url;
      // 以App Linking优先的方式在应用市场打开指定包名的应用详情页
      context.openLink(link, { appLinkingOnly: false })
        .then(() => {
          Logger.info('TAG', 'openlink success.');
        })
        .catch((error: BusinessError) => {
          Logger.error('TAG', `openlink failed. Code: ${error.code}, message is ${error.message}`);
        });
    } catch (e) {
      Logger.error(TAG, JSON.stringify(e))
    }
  }

  callPhone(phone: string): void {
    Logger.info(TAG, 'callPhone : ' + phone)
    // 调用查询能力接口
    let isSupport = call.hasVoiceCapability();
    if (!isSupport) {
      Logger.error(TAG, 'call.hasVoiceCapability not');
      return
    }
    // 如果设备支持呼叫能力，则继续跳转到拨号界面，并显示拨号的号码
    // 从API15开始支持tel格式电话号码，如：'tel:13xxxx'
    if (canIUse('SystemCapability.Applications.Contacts')) {
      call.makeCall(phone, (err: BusinessError) => {
        if (!err) {
          Logger.info(TAG, 'make call success.');
        } else {
          Logger.error(TAG, 'make call fail, err is:' + JSON.stringify(err));
        }
      });
    }
  }

  emitterEmit(key: string, param: string): void {
    let data: emitter.GenericEventData<object> = {
      data: {
        param: param
      }
    }
    emitter.emit(key, data);
  }

  setStatusBarWhite(white: boolean) {
    StatusBarManager.handleStatusBarAction(getContext(),
      JSON.stringify({
        'action': 'backgroundColorByHexString',
        'args': white ? ['#00FFFFFF', '#FFFFFF'] : ['#00FFFFFF', '#000000']
      }));
  }

  requestPermission(preList: Permissions[], callback: (access: boolean) => void): void {
    const atManager = abilityAccessCtrl.createAtManager();
    try {
      atManager.requestPermissionsFromUser(getContext(), preList).then(async (result) => {
        let dismissPer: Permissions[] = [];
        result.authResults.forEach((item, index) => {
          if (item !== 0) {
            dismissPer.push(preList[index]);
          }
        })
        if (dismissPer.length > 0) {
          let perList2 = [...dismissPer];
          dismissPer = [];
          for (let item of perList2) {
            const result2 = await atManager.requestPermissionOnSetting(getContext() as common.UIAbilityContext, [item])
            if (result2[0] !== 0) {
              dismissPer.push(item);
            }
          }
        }
        if (preList.indexOf(KNOCK_PER) && !dismissPer.includes(KNOCK_PER)) {
          let data: emitter.GenericEventData<object> = {
            data: {
              param: true
            }
          }
          emitter.emit('onKnockPer', data)
        }
        callback?.(dismissPer.length === 0)
      }).catch(() => {
        callback?.(false)
      });
    } catch (err) {
      callback?.(false)
    }
  }

  getDefaultAddress(callback: (address: string) => void) {
    let defaultAddress: AddressDTO | undefined = undefined;
    Api.addressListMock?.forEach((item) => {
      if (!defaultAddress && item.isDefault) {
        defaultAddress = item;
      }
    });
    callback(defaultAddress ? JSON.stringify(defaultAddress) : '');
  }

  isAddressExist(address: string): boolean {
    let addressDto: AddressDTO | undefined = undefined;
    if (address) {
      try {
        addressDto = JSON.parse(address) as AddressDTO
      } catch (e) {
      }
    }
    if (addressDto) {
      let exist = Api.addressListMock?.filter((item) => item.id === addressDto?.id)?.length > 0;
      return exist
    }
    return true;
  }
}