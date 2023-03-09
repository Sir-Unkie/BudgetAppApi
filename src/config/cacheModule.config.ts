import { CacheModuleOptions } from '@nestjs/common/cache';
import { StoreConfig } from 'cache-manager';

export const cacheModuleConfig: CacheModuleOptions<StoreConfig> = {
	ttl: 0,
	isGlobal: true,
};
