import {useEffect} from 'react';
import {Alert, DeviceEventEmitter} from 'react-native';
import bridge from '../utils/bridge';
import {
  RN_EVENT_INTERNAL_DISPLAY,
  RnEventBody,
  onInitialLaunch,
  onPushMessage,
  onRouteNavigate,
  onStateUpdate,
} from './RNEventBus';
import {navigate, setNavigationReady} from './NavigationBridge';

const consumedEventIds = new Set<string>();

function dedupe(eventId?: string): boolean {
  if (!eventId) {
    return false;
  }
  if (consumedEventIds.has(eventId)) {
    return true;
  }
  consumedEventIds.add(eventId);
  return false;
}

function consumeEvent(payload: RnEventBody | null): void {
  if (!payload) {
    return;
  }
  if (dedupe(payload.eventId)) {
    return;
  }

  DeviceEventEmitter.emit(RN_EVENT_INTERNAL_DISPLAY, payload);

  switch (payload.type) {
    case 'route':
      navigate(payload.route, payload.params);
      break;

    case 'message': {
      const title = payload.title || '消息通知';
      const content = payload.content || '';
      const goDetail = () => navigate(payload.route || 'Main', payload.params);
      if (payload.bizData?.upgrade === true) {
        Alert.alert(title, content, [
          {text: '立即升级', onPress: goDetail},
          {text: '稍后再说', style: 'cancel'},
        ]);
      } else {
        Alert.alert(title, content, [
          {text: '查看详情', onPress: goDetail},
          {text: '取消', style: 'cancel'},
        ]);
      }
      break;
    }

    case 'state':
      // 状态类事件只进入事件中心和本地监听，不弹窗打断用户。
      break;

    default:
      if (payload.route) {
        navigate(payload.route, payload.params);
      } else if (payload.content) {
        Alert.alert(payload.title || '通知', payload.content);
      }
  }
}

/** 全局订阅原生反向事件；所有 RN 根页面启动时挂载一次。 */
export function useBridgeEvents(): void {
  useEffect(() => {
    const unsubscribers = [
      onPushMessage(consumeEvent),
      onRouteNavigate(consumeEvent),
      onStateUpdate(consumeEvent),
      onInitialLaunch(consumeEvent),
    ];

    setNavigationReady(true);

    try {
      const cached = bridge.getLaunchPayload();
      if (cached) {
        consumeEvent(cached as RnEventBody);
      }
    } catch (e) {
      // 桥接方法不可用时忽略，事件仍可通过 DeviceEventEmitter 到达。
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      setNavigationReady(false);
    };
  }, []);
}
