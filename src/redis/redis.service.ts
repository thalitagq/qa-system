import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttlSeconds = 60) {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length) {
      await this.client.del(keys);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
