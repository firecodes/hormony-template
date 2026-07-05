import {TurboModule, TurboModuleRegistry} from 'react-native';

type StringCallback = (result: string) => void;

interface Spec extends TurboModule {
  replaceUrl(pageName: string, param?: string, cb?: StringCallback): string;

  pushUrl(pageName: string, param?: string, cb?: StringCallback): string;

  back(param?: string, cb?: StringCallback): string;

  getOhASData(
    key: string,
    defaultVal?: number | string | boolean | undefined,
  ): number | string | boolean | undefined;

  shutDownApp(): void;

  getOhPrefData(
    callback: (res: Object | null) => void,
    key: string,
    defaultVal?: null | Object,
    prefName?: string,
  ): void;

  setOhPrefData(
    key: string,
    val: null | Object,
    prefName?: string,
    callback?: () => void,
  ): void;

  delOhPrefData(key: string, prefName?: string, callback?: () => void): void;

  saveImageToAlbum(
    path: string,
    callback?: (res: boolean, saveUri: string) => void,
  ): void;

  requestPayment(orderNo: string, callback?: () => void): void;

  copyText(text: string, callback?: () => void): void;

  /**
   *
   * @param level 字符串类型支持'info'、'debug'、'warn'、'error' 分别对应数字类型0、1、2、3
   * @param tag
   * @param content
   */
  hiLog(level: string | number, tag: string, content: string): void;

  /**
   * 分享
   * @param strData 分享内容，json
   *  content: content,
   *       title: title, // 不传title时 显示链接
   *       description: desc, // 不传则不显示描述内容
   */
  share(strData: string): boolean;

  selectPicture(action: string, callback: (uri: string) => void): void;

  openLink(s: string): void;

  callPhone(s: string): void;

  emitterEmit(key: string, param: string): void;

  setStatusBarWhite(white: boolean): void;

  requestPermission(
    preList: string[],
    callback: (access: boolean) => void,
  ): void;

  getDefaultAddress(callback: (address?: string) => void) : void

  isAddressExist(address: string) : boolean
}

let BridgeTurboModule = TurboModuleRegistry.get<Spec>(
  'BridgeTurboModule',
) as Spec;
export default BridgeTurboModule;
