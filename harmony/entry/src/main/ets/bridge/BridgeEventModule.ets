import { Want } from '@kit.AbilityKit';
import { LoadManager } from '../rn';
import { Logger } from '../utils/Logger';
import { LaunchPayloadHolder } from './LaunchPayloadHolder';
import { RnEventBody, RnEventData, RnEventExtra } from './RnEventBody';

const TAG = 'BridgeEventModule';

export const RN_EVENT_PUSH_MESSAGE = 'rn.push.message';
export const RN_EVENT_ROUTE = 'rn.route.navigate';
export const RN_EVENT_STATE = 'rn.state.update';
export const RN_EVENT_INITIAL = 'rn.initial.launch';

/**
 * 鸿蒙原生 → RN 的反向事件统一出口。
 * 原生生产方只负责构造事件体，不直接持有 RNInstance。
 */
export class BridgeEventModule {
  static build(
    eventName: string,
    type: string,
    source: string,
    extra?: RnEventExtra
  ): RnEventBody {
    return new RnEventBody(eventName, type, source, extra);
  }

  static emitToRn(eventName: string, body: RnEventBody): boolean {
    const instance = LoadManager.getRNInstance(LoadManager.isMetroAvailable);
    if (!instance) {
      Logger.warn(TAG, 'RNInstance not ready, cached event: ' + eventName);
      LaunchPayloadHolder.cache(eventName, body);
      return false;
    }
    try {
      instance.emitDeviceEvent(eventName, body);
      Logger.info(TAG, 'emitDeviceEvent ok: ' + eventName);
      return true;
    } catch (error) {
      Logger.error(TAG, 'emitDeviceEvent failed: ' + String(error));
      LaunchPayloadHolder.cache(eventName, body);
      return false;
    }
  }

  /** RN 页面就绪后补发缓存事件 */
  static flushCachedEvent(): boolean {
    const payload = LaunchPayloadHolder.take();
    if (!payload) {
      return false;
    }
    const instance = LoadManager.getRNInstance(LoadManager.isMetroAvailable);
    if (!instance) {
      LaunchPayloadHolder.cache(payload.eventName, payload);
      return false;
    }
    try {
      instance.emitDeviceEvent(payload.eventName, payload);
      Logger.info(TAG, 'flush cached event ok');
      return true;
    } catch (error) {
      Logger.error(TAG, 'flush cached event failed: ' + String(error));
      return false;
    }
  }

  static pushMessage(title: string, content: string, eventId?: string): RnEventBody {
    const bizData = new RnEventData();
    bizData.from = 'harmony-native';
    const extra = new RnEventExtra();
    extra.title = title;
    extra.content = content;
    extra.bizData = bizData;
    const body = BridgeEventModule.build(RN_EVENT_PUSH_MESSAGE, 'message', 'push', extra);
    if (eventId) {
      body.eventId = eventId;
    }
    return body;
  }

  static navigate(route: string, params: RnEventData, eventId?: string): RnEventBody {
    const extra = new RnEventExtra();
    extra.route = route;
    extra.params = params;
    const body = BridgeEventModule.build(RN_EVENT_ROUTE, 'route', 'card', extra);
    if (eventId) {
      body.eventId = eventId;
    }
    return body;
  }

  static stateUpdate(name: string, value: Object): RnEventBody {
    const bizData = new RnEventData();
    bizData.name = name;
    bizData.value = value;
    const extra = new RnEventExtra();
    extra.title = name;
    extra.bizData = bizData;
    return BridgeEventModule.build(RN_EVENT_STATE, 'state', 'service', extra);
  }

  private static parseQuery(uri: string): RnEventData {
    const result = new RnEventData();
    const query = uri.split('?')[1] || '';
    query.split('&').forEach(pair => {
      if (!pair) {
        return;
      }
      const items = pair.split('=');
      const key = decodeURIComponent(items[0] || '');
      const value = decodeURIComponent(items[1] || '');
      switch (key) {
        case 'rnEvent':
          result.rnEvent = value;
          break;
        case 'rnType':
          result.rnType = value;
          break;
        case 'rnSource':
          result.rnSource = value;
          break;
        case 'rnTitle':
          result.rnTitle = value;
          break;
        case 'rnContent':
          result.rnContent = value;
          break;
        case 'rnRoute':
          result.rnRoute = value;
          break;
        case 'id':
          result.id = value;
          break;
        case 'title':
          result.title = value;
          break;
        case 'webUrl':
          result.webUrl = value;
          break;
        default:
          break;
      }
    });
    return result;
  }

  private static firstNonEmpty(a?: string, b?: string): string {
    if (a) {
      return a;
    }
    if (b) {
      return b;
    }
    return '';
  }

  /**
   * 推送点击 / 深链 / 卡片回调入口。
   * 约定参数：rnEvent、rnType、rnSource、rnTitle、rnContent、rnRoute。
   */
  static emitFromWant(want: Want): boolean {
    let params = new RnEventData();
    if (want.parameters) {
      try {
        params = JSON.parse(JSON.stringify(want.parameters)) as RnEventData;
      } catch (error) {
        params = new RnEventData();
      }
    }
    const query = BridgeEventModule.parseQuery(want.uri || '');
    const eventName = BridgeEventModule.firstNonEmpty(params.rnEvent, query.rnEvent);
    if (!eventName) {
      return false;
    }
    const type = BridgeEventModule.firstNonEmpty(params.rnType, query.rnType);
    const source = BridgeEventModule.firstNonEmpty(params.rnSource, query.rnSource);
    const title = BridgeEventModule.firstNonEmpty(params.rnTitle, query.rnTitle);
    const content = BridgeEventModule.firstNonEmpty(params.rnContent, query.rnContent);
    const route = BridgeEventModule.firstNonEmpty(params.rnRoute, query.rnRoute);
    const extra = new RnEventExtra();
    extra.title = title;
    extra.content = content;
    extra.route = route;
    extra.params = query;
    const body = BridgeEventModule.build(
      eventName,
      type ? type : 'route',
      source ? source : 'push',
      extra
    );
    return BridgeEventModule.emitToRn(eventName, body);
  }
}
