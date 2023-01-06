import { IProviderInfo } from "./types";
declare abstract class BaseProvider {
    abstract readonly name: string;
    protected abstract readonly baseUrl: string;
    protected abstract readonly logo: string;
    protected abstract readonly classPath: string;
    get toString(): IProviderInfo;
}
export default BaseProvider;
