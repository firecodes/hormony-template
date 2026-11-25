import { RnEventBody } from './RnEventBody';

/**
 * RN 未就绪期间缓存的原生事件 payload。
 * 冷启动时由 RN 侧通过 BridgeTurboModule.getLaunchPayload() 主动拉取。
 */
export class LaunchPayloadHolder {
  private static payload: RnEventBody | null = null;

  static cache(eventName: string, body: RnEventBody): void {
    body.eventName = eventName;
    LaunchPayloadHolder.payload = body;
  }

  static take(): RnEventBody | null {
    const payload = LaunchPayloadHolder.payload;
    LaunchPayloadHolder.payload = null;
    return payload;
  }

  static peek(): RnEventBody | null {
    return LaunchPayloadHolder.payload;
  }

  static clear(): void {
    LaunchPayloadHolder.payload = null;
  }
}
