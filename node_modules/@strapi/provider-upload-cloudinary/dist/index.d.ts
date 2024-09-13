/// <reference types="node" />
/// <reference types="node" />
import type { ReadStream } from 'node:fs';
import { ConfigOptions } from 'cloudinary';
interface File {
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
    hash: string;
    ext?: string;
    mime: string;
    size: number;
    sizeInBytes: number;
    url: string;
    previewUrl?: string;
    path?: string;
    provider?: string;
    provider_metadata?: Record<string, unknown>;
    stream?: ReadStream;
    buffer?: Buffer;
}
declare const _default: {
    init(options: ConfigOptions): {
        uploadStream(file: File, customConfig?: {}): Promise<void>;
        upload(file: File, customConfig?: {}): Promise<void>;
        delete(file: File, customConfig?: {}): Promise<void>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map