import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * The studio needs no Next cache: every screen is force-dynamic, there is no
 * ISR and no image pipeline, and the store carries its own 30-second cache.
 * If caching is ever added, `cacheWithKV` goes here — nothing else changes.
 */
export default defineCloudflareConfig({});
