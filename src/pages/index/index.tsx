import { View, Button, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { invokeNative, onNativeEvent } from '../../native/bridge'

interface HelloResult {
  code: number
  data: string
}

interface PushEventData {
  message: string
  time: number
}

export default function Index() {
  const [result, setResult] = useState<string>('')
  const [pushResult, setPushResult] = useState<string>('')

  useEffect(() => {
    const off = onNativeEvent<PushEventData>('nativeCustomEvent', (data) => {
      setPushResult(`原生推送：${data.message}（${data.time}）`)
    })
    return off
  }, [])

  async function handleCallNativeHello() {
    try {
      const res = await invokeNative<HelloResult>('nativeHello', {
        msg: '来自 Taro 页面调用原生'
      })
      setResult(`成功：${JSON.stringify(res)}`)
    } catch (e) {
      setResult(`失败：${JSON.stringify(e)}`)
    }
  }

  async function handleCallNativeToast() {
    try {
      await invokeNative('nativeShowToast', { text: '鸿蒙原生 Toast 弹窗' })
      setResult('原生 Toast 调用成功，日志关键字：NativeToast')
    } catch (e) {
      setResult(`失败：${JSON.stringify(e)}`)
    }
  }

  async function handleCallNativePush() {
    try {
      await invokeNative('nativePushEvent', {})
      setResult('已请求原生主动推送事件')
    } catch (e) {
      setResult(`失败：${JSON.stringify(e)}`)
    }
  }

  return (
    <View style={{ padding: '30rpx' }}>
      <Button onClick={handleCallNativeHello}>调用原生 hello</Button>
      <Button onClick={handleCallNativeToast} style={{ marginTop: '20rpx' }}>调用原生 Toast</Button>
      <Button onClick={handleCallNativePush} style={{ marginTop: '20rpx' }}>请求原生主动推送</Button>
      <Button onClick={handleCallNativePush} style={{ marginTop: '20rpx' }}>请求原生主动推送</Button>
      <Button onClick={handleCallNativePush} style={{ marginTop: '20rpx' }}>请求原生主动推送</Button>
      <Text style={{ marginTop: '30rpx', display: 'block' }}>{result}</Text>
      <Text style={{ marginTop: '20rpx', display: 'block' }}>{pushResult}</Text>
    </View>
  )
}
