import { getImageCdnForUrl } from "./detect.ts";
import { transform as contentful } from "./transformers/contentful.ts";
import { transform as imgix } from "./transformers/imgix.ts";
import { transform as shopify } from "./transformers/shopify.ts";
import { transform as wordpress } from "./transformers/wordpress.ts";
import { ImageCdn, SupportedImageCdn, UrlTransformer } from "./types.ts";

export const transformers: Record<
  SupportedImageCdn,
  UrlTransformer
> = {
  imgix,
  contentful,
  shopify,
  wordpress,
};

export const cdnIsSupported = (
  cdn: ImageCdn | false,
): cdn is SupportedImageCdn => cdn && cdn in transformers;

/**
 * Returns a transformer function if the given URL is from a known image CDN
 */
export const getTransformerForUrl = (
  url: string | URL,
): UrlTransformer | undefined => {
  const cdn = getImageCdnForUrl(url);
  if (!cdnIsSupported(cdn)) {
    return undefined;
  }
  return transformers[cdn];
};

/**
 * Transforms an image URL to a new URL with the given options.
 * If the URL is not from a known image CDN it returns undefined.
 */
export const transformUrl: UrlTransformer = (options) => {
  const transformer = getTransformerForUrl(options.url);
  return transformer?.(options);
};