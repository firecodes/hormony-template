import {GlobalData} from '../../../utils/GlobalData';

export class PrivacyVM {
  getIsSelect(key: string): boolean {
    let res = GlobalData.mapData[key];
    return !!res;
  }

  setSelect(key: string, select: boolean): void {
    GlobalData.mapData[key] = select;
  }
}
