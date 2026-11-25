/**
 * 事件附带数据。ArkTS 不支持索引签名和下标访问，
 * 因此使用显式字段类，按业务约定逐项声明。
 */
export class RnEventData {
  rnEvent?: string;
  rnType?: string;
  rnSource?: string;
  rnTitle?: string;
  rnContent?: string;
  rnRoute?: string;

  id?: string;
  title?: string;
  from?: string;
  webUrl?: string;
  text?: string;
  count?: number;
  index?: number;
  name?: string;
  value?: Object;
  upgrade?: boolean;
}

/** 事件可选扩展字段。 */
export class RnEventExtra {
  title?: string;
  content?: string;
  route?: string;
  params?: RnEventData;
  bizData?: RnEventData;
}

/** 原生 → RN 事件体。 */
export class RnEventBody {
  eventId: string = '';
  eventName: string = '';
  type: string = '';
  source: string = '';
  title: string = '';
  content: string = '';
  route: string = '';
  params: RnEventData | undefined = undefined;
  bizData: RnEventData | undefined = undefined;
  timestamp: number = 0;

  constructor(eventName?: string, type?: string, source?: string, extra?: RnEventExtra) {
    this.eventId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    this.timestamp = Date.now();
    if (eventName) {
      this.eventName = eventName;
    }
    if (type) {
      this.type = type;
    }
    if (source) {
      this.source = source;
    }
    if (extra) {
      if (extra.title !== undefined) {
        this.title = extra.title;
      }
      if (extra.content !== undefined) {
        this.content = extra.content;
      }
      if (extra.route !== undefined) {
        this.route = extra.route;
      }
      if (extra.params !== undefined) {
        this.params = extra.params;
      }
      if (extra.bizData !== undefined) {
        this.bizData = extra.bizData;
      }
    }
  }
}
