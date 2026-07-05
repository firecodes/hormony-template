/**
 * Address Data Transfer Object (DTO)
 *
 * 可作为数据层与 UI (View Model) 层之间的数据交换对象，或持久化、网络通信的通用格式。
 */
export interface AddressDTO {
  id: string;
  name: string; // 姓名
  phone: string; // 手机号
  countryCode?: string; // 国家代码
  country?: string; // 国家
  province?: string; // 省
  city?: string; // 市
  district?: string; // 区
  street?: string; // 街道
  detail?: string; // 地址详述（如楼栋、门牌号等）
  isDefault?: boolean; // 是否为默认地址
  createdAt?: number; // 地址创建时间
  updatedAt?: number; // 地址更新时间
  storeAddress?: string; //店铺地址

  // 可结合业务需求灵活拓展更多属性
  // tag: string;       // 标签（家、公司、学校）
  // latitude: number;  // 纬度
  // longitude: number; // 经度
}

export function getFullAddress(address: AddressDTO) {
  return (
    address.storeAddress ??
    [
      address.countryCode === 'CN' ? '' : address.country,
      address.province === address.city ? '' : address.province,
      address.city,
      address.district,
      address.street,
      address.detail,
    ]
      .filter(Boolean)
      .join(' ')
  );
}

export function getTitle(address: AddressDTO) {
  return [address.name, address.phone].filter(Boolean).join(' ');
}
