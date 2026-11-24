import { eventCenter } from '@tarojs/runtime'

/**
 * JS 与 ArkTS 之间的专用事件通道。
 * 与 Taro 内置的 __taroPluginEtsMethodsTrigger 相互独立，
 * 避免内置分发器对自定义方法输出 "scope not found" 错误日志。
 */
export const NATIVE_BRIDGE_EVENT = '__taroNativeBridgeTrigger'

export interface NativeFailError {
  code: number
  msg: string
}

export interface NativeInvokeOptions<T = any> {
  method: string
  params?: Record<string, any>
  success?: (res: T) => void
  fail?: (err: NativeFailError) => void
}

/**
 * 调用 ArkTS 原生方法，返回 Promise。
 * @param method NativeBridge.ets 中注册的方法名
 * @param params 传给原生方法的参数对象
 */
export function invokeNative<T = any>(method: string, params: Record<string, any> = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const payload: NativeInvokeOptions<T> = {
      method,
      params,
      success: (res: T) => resolve(res),
      fail: (err: NativeFailError) => reject(err)
    }
    eventCenter.trigger(NATIVE_BRIDGE_EVENT, payload)
  })
}

/**
 * 监听 ArkTS 主动推送到 JS 层的事件。
 * @returns 取消监听函数
 */
export function onNativeEvent<T>(eventName: string, cb: (data: T) => void): () => void {
  eventCenter.on(eventName, cb)
  return () => eventCenter.off(eventName, cb)
}

export default {
  invokeNative,
  onNativeEvent
}
