"use strict";
const cloudinary = require("cloudinary");
const intoStream = require("into-stream");
const utils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const intoStream__default = /* @__PURE__ */ _interopDefault(intoStream);
const utils__namespace = /* @__PURE__ */ _interopNamespace(utils);
const index = {
  init(options) {
    cloudinary.v2.config(options);
    const upload = (file, customConfig = {}) => {
      return new Promise((resolve, reject) => {
        const config = {
          resource_type: "auto",
          public_id: file.hash
        };
        if (file.ext) {
          config.filename = `${file.hash}${file.ext}`;
        }
        if (file.path) {
          config.folder = file.path;
        }
        const uploadMethod = file.size && file.size < 1e3 * 99 ? cloudinary.v2.uploader.upload_stream : cloudinary.v2.uploader.upload_chunked_stream;
        const uploadStream = uploadMethod({ ...config, ...customConfig }, (err, image) => {
          if (err) {
            if (err.message.includes("File size too large")) {
              reject(new utils__namespace.errors.PayloadTooLargeError());
            } else {
              reject(new Error(`Error uploading to cloudinary: ${err.message}`));
            }
            return;
          }
          if (!image) {
            return;
          }
          if (image.resource_type === "video") {
            file.previewUrl = cloudinary.v2.url(`${image.public_id}.gif`, {
              video_sampling: 6,
              delay: 200,
              width: 250,
              crop: "scale",
              resource_type: "video"
            });
          }
          file.url = image.secure_url;
          file.provider_metadata = {
            public_id: image.public_id,
            resource_type: image.resource_type
          };
          resolve();
        });
        if (file.stream) {
          file.stream.pipe(uploadStream);
        } else if (file.buffer) {
          intoStream__default.default(file.buffer).pipe(uploadStream);
        } else {
          throw new Error("Missing file stream or buffer");
        }
      });
    };
    return {
      uploadStream(file, customConfig = {}) {
        return upload(file, customConfig);
      },
      upload(file, customConfig = {}) {
        return upload(file, customConfig);
      },
      async delete(file, customConfig = {}) {
        try {
          const { resource_type: resourceType, public_id: publicId } = file.provider_metadata ?? {};
          const deleteConfig = {
            resource_type: resourceType || "image",
            invalidate: true,
            ...customConfig
          };
          const response = await cloudinary.v2.uploader.destroy(`${publicId}`, deleteConfig);
          if (response.result !== "ok" && response.result !== "not found") {
            throw new Error(response.result);
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error deleting on cloudinary: ${error.message}`);
          }
          throw error;
        }
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
