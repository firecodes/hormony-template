import {DeviceEventEmitter} from 'react-native';

export const RN_EVENT_PUSH_MESSAGE = 'rn.push.message';
export const RN_EVENT_ROUTE = 'rn.route.navigate';
export const RN_EVENT_STATE = 'rn.state.update';
export const RN_EVENT_INITIAL = 'rn.initial.launch';
export const RN_EVENT_INTERNAL_DISPLAY = 'rn.internal.display';

export interface RnEventBody {
  eventId?: string;
  eventName?: string;
  type?: string;
  source?: string;
  title?: string;
  content?: string;
  route?: string;
  params?: Record<string, any>;
  bizData?: Record<string, any>;
  timestamp?: number;
}

type Listener<T> = (payload: T) => void;

function subscribe<T>(eventName: string, listener: Listener<T>): () => void {
  const subscription = DeviceEventEmitter.addListener(eventName, listener);
  return () => subscription.remove();
}

export const onPushMessage = (cb: Listener<RnEventBody>) =>
  subscribe(RN_EVENT_PUSH_MESSAGE, cb);

export const onRouteNavigate = (cb: Listener<RnEventBody>) =>
  subscribe(RN_EVENT_ROUTE, cb);

export const onStateUpdate = (cb: Listener<RnEventBody>) =>
  subscribe(RN_EVENT_STATE, cb);

export const onInitialLaunch = (cb: Listener<RnEventBody>) =>
  subscribe(RN_EVENT_INITIAL, cb);
