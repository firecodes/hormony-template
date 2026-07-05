import {AddressDTO} from '../model/AddressDTO';
import {generateRandomUUID, withDelay} from '../../../utils/CommonUtils';
import bridge from '../../../utils/bridge';

export const DefaultAddress: AddressDTO = {
  id: generateRandomUUID(),
  name: '张三',
  phone: '12345678901',
  countryCode: 'CN',
  country: '中国',
  province: '江苏省',
  city: '南京市',
  district: '雨花台区',
  street: '铁心桥街道',
  detail: '软件大道101号',
  isDefault: true,
  createdAt: new Date().getTime(),
  updatedAt: new Date().getTime(),
};

export const DefaultStoreAddress: AddressDTO = {
  id: generateRandomUUID(),
  name: '张三',
  phone: '12345678901',
  storeAddress: '店铺地址',
};

export class Api {
  private static addressListMock: AddressDTO[] = [DefaultAddress];

  public static async listAddresses(): Promise<AddressDTO[]> {
    return withDelay(() => {
      const list: AddressDTO[] = JSON.parse(
        JSON.stringify(Api.addressListMock),
      );
      list.sort((a, b) => {
        if (a.isDefault && !b.isDefault) {
          return -1;
        }
        if (!a.isDefault && b.isDefault) {
          return 1;
        }
        return b.updatedAt - a.updatedAt;
      });
      return list;
    });
  }

  public static async createAddress(address: AddressDTO): Promise<void> {
    return withDelay(() => {
      const time: number = new Date().getTime();
      address.createdAt = time;
      address.updatedAt = time;
      address.id = generateRandomUUID();
      if (address.isDefault) {
        Api.addressListMock.forEach(item => (item.isDefault = false));
      }
      Api.addressListMock.push(address);
    });
  }

  public static async updateAddress(address: AddressDTO): Promise<void> {
    return withDelay(() => {
      address.updatedAt = new Date().getTime();
      const index = Api.addressListMock.findIndex(
        item => item.id === address.id,
      );
      if (index === -1) {
        throw new Error();
      }
      if (address.isDefault) {
        Api.addressListMock.forEach(item => (item.isDefault = false));
      }
      Api.addressListMock[index] = address;
    });
  }

  public static async deleteAddress(id: string): Promise<void> {
    return withDelay(() => {
      const index = Api.addressListMock.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error();
      }
      Api.addressListMock.splice(index, 1);
    });
  }

  public static async parseAddressByText(text: string) {
    // 改为用bridge
  }

  private static findJsonValueByKey(jsonStr: string, key: string): string {
    const regex: RegExp = new RegExp(
      `"${key}"\\s*:\\s*\\{\\s*"value"\\s*:\\s*"(.*?)"`,
      'i',
    );
    const match: RegExpMatchArray | null = jsonStr.match(regex);
    return match ? match[1] : '';
  }

  public static async getDefaultAddress(): Promise<AddressDTO> {
    return new Promise((res, rej) => {
      bridge.getDefaultAddress((add?: string) => {
        if (add) {
          let addDto = JSON.parse(add) as AddressDTO;
          res(addDto);
        } else {
          rej();
        }
      });
    });
  }
}
