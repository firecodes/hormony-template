import {VersionInfoBean} from '../bean/VersionInfoBean';

export class SettingVM {
  getVersionInfo(): VersionInfoBean {
    let res = new VersionInfoBean();
    res.name = '商城RN';
    res.version = '1.0.0';
    res.size = '50M';
    res.detail = '1.新增 发布添加表情自定义\n2.修复 若干bug';
    return res;
  }

  getCacheSize() {
    return 787.8;
  }
}
