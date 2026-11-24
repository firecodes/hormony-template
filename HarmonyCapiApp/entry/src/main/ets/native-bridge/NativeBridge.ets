import { eventCenter } from '@taro-oh/library/src/main/ets/npm/@tarojs/runtime'

const BRIDGE_EVENT = '__taroNativeBridgeTrigger'

export interface NativeFailError {
  code: number
  msg: string
}

interface HelloResult {
  code: number
  data: string
}

interface CommonResult {
  code: number
}

interface PushEventResult {
  message: string
  time: number
}

export interface IEtsMethodsOptions {
  method: string
  params?: Record<string, Object>
  success?: (res: Object) => void
  fail?: (err: NativeFailError) => void
}

/**
 * JS <-> ArkTS 双向通信桥。
 * - JS 调用：Taro 侧 invokeNative() 触发 BRIDGE_EVENT，本类按 method 分发。
 * - 原生推送：调用 emitToTaro()，Taro 侧用 onNativeEvent() 监听。
 */
export class NativeBridge {
  static init(): void {
    eventCenter.on(BRIDGE_EVENT, (opts: IEtsMethodsOptions) => {
      NativeBridge.dispatch(opts)
    })
  }

  private static dispatch(opts: IEtsMethodsOptions): void {
    if (!opts || !opts.method) {
      return
    }
    const method: string = opts.method
    const params: Record<string, Object> | undefined = opts.params
    const success: ((res: Object) => void) | undefined = opts.success
    const fail: ((err: NativeFailError) => void) | undefined = opts.fail

    try {
      switch (method) {
        case 'nativeHello': {
          let msg: string = ''
          if (params !== undefined && params['msg'] !== undefined) {
            msg = params['msg'] as string
          }
          const result: HelloResult = { code: 0, data: `ArkTS 收到消息：${msg}` }
          if (success) {
            success(result)
          }
          break
        }
        case 'nativeShowToast': {
          let text: string = ''
          if (params !== undefined && params['text'] !== undefined) {
            text = params['text'] as string
          }
          console.info('[NativeToast]', text)
          const result: CommonResult = { code: 0 }
          if (success) {
            success(result)
          }
          break
        }
        case 'nativePushEvent': {
          const data: PushEventResult = {
            message: '来自 ArkTS 的主动推送',
            time: Date.now()
          }
          NativeBridge.emitToTaro('nativeCustomEvent', data)
          const result: CommonResult = { code: 0 }
          if (success) {
            success(result)
          }
          break
        }
        default:
          if (fail) {
            const error: NativeFailError = { code: -1, msg: `原生方法【${method}】未注册` }
            fail(error)
          }
      }
    } catch (err) {
      if (fail) {
        const error: NativeFailError = { code: -99, msg: `原生执行异常: ${err}` }
        fail(error)
      }
    }
  }

  /** 原生主动推送事件到 Taro JS 层 */
  static emitToTaro(eventName: string, data: Object): void {
    eventCenter.trigger(eventName, data)
  }
}

NativeBridge.init()
