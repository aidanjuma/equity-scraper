import { IProviderInfo } from "./types";

abstract class BaseProvider {
  abstract readonly name: string;
  protected abstract readonly baseUrl: string;
  protected abstract readonly logo: string;
  protected abstract readonly classPath: string;

  get toString(): IProviderInfo {
    return {
      name: this.name,
      baseUrl: this.baseUrl,
      logo: this.logo,
      classPath: this.classPath,
    };
  }
}

export default BaseProvider;
