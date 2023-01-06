"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseProvider {
    get toString() {
        return {
            name: this.name,
            baseUrl: this.baseUrl,
            logo: this.logo,
            classPath: this.classPath,
        };
    }
}
exports.default = BaseProvider;
//# sourceMappingURL=base-provider.js.map