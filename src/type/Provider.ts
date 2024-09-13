export enum ProviderTypeEnum {
  // 直接从页面获取地址
  Direct = 1,
  // 需要再次请求获取地址
  Request = 0,
}
export interface IProvider {
  name: string;
  url: string;
  reg?: string;
  type?: ProviderTypeEnum;
  invite_url?: string;
  image?: string;
}

export interface IProviderVO {
  name: string;
  url: string;
  image?: string;
}
