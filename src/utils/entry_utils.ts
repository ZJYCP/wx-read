import { IProvider, IProviderVO, ProviderTypeEnum } from "@/type/Provider";
import data from "@/config/provider.json";

export class EntryUrl {
  private providers: IProvider[] = [];

  //   获取请求网址
  public static COMMON_URL_REG = /url:\s*"(http[^"]+)"/;

  private constructor(provider?: IProvider | IProvider[]) {
    if (provider) {
      this.providers = Array.isArray(provider) ? provider : [provider];
    } else {
      this.providers = EntryUrl.fetch_providers();
    }
  }

  private static fetch_providers() {
    return data.providers as IProvider[];
  }

  // 获取可乐阅读地址
  public static get_kl_entry_url() {}

  public static get_all_entry_url(data?: IProvider[]) {
    const res = new EntryUrl(data).all_entry_url();
    return res;
  }

  /**
   * 获取所有服务商的地址信息
   * @returns
   */
  private async all_entry_url() {
    const url_list: IProviderVO[] = [];
    const request_list: Promise<IProviderVO>[] = [];

    this.providers.forEach((provider) => {
      request_list.push(
        new Promise((resolve, reject) => {
          this.get_en_url(provider)
            .then((url) => {
              const provider_info = {
                name: provider.name,
                image: provider.image,
                url: url,
              };
              resolve(provider_info);
            })
            .catch((e) => {
              reject(e);
            });
        })
      );
    });
    const results = await Promise.allSettled(request_list);
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        url_list.push(result.value);
      }
    });
    return url_list;
  }

  /**
   * 获取一个服务商的地址
   * @param data
   */
  protected async get_en_url(data: IProvider) {
    const page_url = data.url;
    const reg_str = data.reg;
    const page_compile = reg_str
      ? new RegExp(reg_str)
      : new RegExp(EntryUrl.COMMON_URL_REG);
    const page_result = await this._fetch_page(page_url, page_compile);
    if (!page_result) {
      return "";
    }
    const provider_type = data.type;
    if (provider_type === ProviderTypeEnum.Request) {
      const url = page_result[1];
      const res_json = await this._fetch_json(url);
      if (res_json.code === 0) {
        const luodi_url = res_json.data.luodi;
        // 处理url的aff, 替换邀请链接的域名
        if (data.invite_url) {
          const true_url = new URL(luodi_url);
          const my_url = new URL(data.invite_url);
          my_url.host = true_url.host;

          return my_url.toString();
        } else {
          return luodi_url;
        }
      }
    } else {
      return Array.isArray(page_result) ? page_result[1] : page_result;
    }
  }

  private async _fetch_page(url: string, page_compile: RegExp | null) {
    const homepage = await fetch(url);
    const response = await homepage.text();
    if (page_compile) {
      return response.match(page_compile);
    } else {
      return response;
    }
  }

  private async _fetch_json(url: string) {
    const response = await fetch(url);
    return response.json();
  }
}
