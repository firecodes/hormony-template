import bridge from '../utils/bridge';

const ROUTE_WHITELIST = [
  'Splash',
  'Main',
  'Detail',
  'Cart',
  'Search',
  'OrderInfo',
  'Setting',
  'Web',
  'WebBridgeTest',
  'NativeEventMonitor',
];

let navigationReady = false;
let pendingRoute: {route: string; params?: Record<string, any>} | null = null;

export function setNavigationReady(ready: boolean): void {
  navigationReady = ready;
  if (ready && pendingRoute) {
    navigateTo(pendingRoute.route, pendingRoute.params);
    pendingRoute = null;
  }
}

function navigateTo(route: string, params?: Record<string, any>): boolean {
  const target = ROUTE_WHITELIST.includes(route) ? route : 'Main';
  bridge.pushUrl(target, JSON.stringify(params || {}));
  return target === route;
}

export function navigate(route?: string, params?: Record<string, any>): boolean {
  if (!route) {
    return false;
  }
  if (!navigationReady) {
    pendingRoute = {route, params};
    return false;
  }
  return navigateTo(route, params);
}
