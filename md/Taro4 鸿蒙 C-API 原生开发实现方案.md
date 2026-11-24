# Taro4 鸿蒙 C\-API 原生开发实现方案

**方案标识：**Taro4\-Harmony\-CAPI\-NativeBridge

**适用范围：**Taro 4\.x \+ @tarojs/plugin\-platform\-harmony\-cpp，纯 C\-API 渲染，无 WebView。

**方案目标：**封装 Promise 化的 JS ↔ ArkTS 双向通信、原生方法注册、示例调用、目录结构、全部源码、启动命令与排查清单；可直接交给 AI 工具按文档生成工程。

# 1\. 项目整体结构约定

方案由两个独立工程组成：Taro 前端工程与 DevEco 鸿蒙壳工程。Taro 编译产物自动输出到鸿蒙壳工程。

```text
myApp/          # Taro 前端工程
├── config/
│   └── index.ts                 # Taro 配置
├── src/
│   ├── native/
│   │   └── bridge.ts            # 核心：原生桥接工具类（Promise 封装）
│   ├── pages/
│   │   └── index/
│   │       └── index.tsx        # 测试页面，调用原生能力
│   ├── app.tsx
│   └── app.config.ts
├── package.json
└── tsconfig.json

./HarmonyCapiApp/               # DevEco 鸿蒙壳工程（单独工程，Stage Empty Ability）
└── entry/src/main/ets/
    ├── entryability/
    │   └── EntryAbility.ets
    └── native-bridge/
        └── NativeBridge.ets     # 核心：ArkTS 原生方法注册、事件监听
```

两个工程相互独立，不要合并为一个目录；编译时 Taro 把 ETS/C\+\+ 产物输出到 HarmonyCapiApp。

# 2\. 环境与版本约束

- Node \>= 18

- Taro CLI \>= 4\.1\.0

- 鸿蒙 SDK：API 12 及以上（推荐 Next）

- DevEco Studio 配套基线，hvigor 可正常编译

- 插件：@tarojs/plugin\-platform\-harmony\-cpp

- 编译类型：harmony\_cpp，**禁止与 harmony\-hybrid / ets 插件混用**

# 3\. 安装依赖与 package\.json

## 3\.1 安装命令

```bash
npm i -D @tarojs/plugin-platform-harmony-cpp
```

## 3\.2 package\.json 脚本与依赖

```json
{
  "name": "taro-harmony-capi-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:harmony": "taro build --type harmony_cpp --watch",
    "build:harmony": "taro build --type harmony_cpp",
    "build:native-comp": "taro build native-components --type harmony_cpp"
  },
  "dependencies": {
    "@tarojs/runtime": "^4.1.0",
    "@tarojs/taro": "^4.1.0"
  },
  "devDependencies": {
    "@tarojs/cli": "^4.1.0",
    "@tarojs/plugin-platform-harmony-cpp": "^4.1.0",
    "@tarojs/webpack-runner": "^4.1.0"
  }
}
```

# 4\. Taro 配置文件 config/index\.ts

```typescript
import path from 'path'
import { defineConfig } from '@tarojs/cli'

export default defineConfig({
  projectName: 'taro-harmony-capi-demo',
  compiler: {
    type: 'vite'
  },
  plugins: [
    '@tarojs/plugin-platform-harmony-cpp'
  ],
  harmony: {
    compiler: 'vite',
    // 替换为你本机鸿蒙壳工程绝对路径
    projectPath: path.resolve(__dirname, './HarmonyCapiApp'),
    hapName: 'entry'
  },
  // 条件编译全局变量
  env: {
    TARO_PLATFORM: process.env.TARO_ENV
  }
})
```

projectPath 必须指向 DevEco 空壳工程根目录；路径中不要出现中文与空格。

# 5\. Taro 侧核心桥接工具 src/native/bridge\.ts

基于 eventCenter 事件通道，将原生调用封装为 Promise，支持成功、失败回调，并提供原生主动推送事件的监听方法。

```typescript
import { eventCenter } from '@tarojs/runtime'

type NativeCallback<T = any> = {
  success?: (res: T) => void
  fail?: (err: { code: number; msg: string }) => void
}

export type NativeInvokeOptions<T = any> = NativeCallback<T> & {
  method: string
  params?: Record<string, any>
}

/**
 * C-API 调用 ArkTS 原生方法
 * @param method 原生注册方法名
 * @param params 参数对象
 */
export function invokeNative<T = any>(method: string, params: Record<string, any> = {}) {
  return new Promise<T>((resolve, reject) => {
    const payload: NativeInvokeOptions<T> = {
      method,
      params,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    }
    eventCenter.trigger('__taroPluginEtsMethodsTrigger', payload)
  })
}

/**
 * 原生主动推送消息给 JS（监听来自 ArkTS 的事件）
 */
export function onNativeEvent<T>(eventName: string, cb: (data: T) => void) {
  eventCenter.on(eventName, cb)
  return () => eventCenter.off(eventName, cb)
}

export default {
  invokeNative,
  onNativeEvent
}
```

# 6\. Taro 页面调用示例 src/pages/index/index\.tsx

```tsx
import { View, Button, Text } from '@tarojs/components'
import { useState } from 'react'
import { invokeNative } from '../../native/bridge'

export default function Index() {
  const [result, setResult] = useState<string>('')

  async function handleCallNativeHello() {
    try {
      const res = await invokeNative<{ code: number; data: string }>('nativeHello', {
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
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={{ padding: '30rpx' }}>
      <Button onClick={handleCallNativeHello}>调用原生 hello</Button>
      <Button onClick={handleCallNativeToast} style={{ marginTop: '20rpx' }}>调用原生 Toast</Button>
      <Text style={{ marginTop: '30rpx', display: 'block' }}>{result}</Text>
    </View>
  )
}
```

# 7\. app\.config\.ts

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarTitleText: 'Taro CAPI 原生通信 Demo',
    navigationBarBackgroundColor: '#fff'
  }
})
```

# 8\. 鸿蒙壳工程：NativeBridge\.ets

文件路径：entry/src/main/ets/native\-bridge/NativeBridge\.ets。负责监听 Taro 触发的事件、按方法名分发到对应原生实现，并支持原生主动向 Taro 层推送事件。

```typescript
import { eventCenter } from '@tarojs/runtime'

export interface IEtsMethodsOptions {
  method: string
  params?: Record<string, Object>
  success?: (res: Object) => void
  fail?: (err: { code: number, msg: string }) => void
}

export class NativeBridge {
  static init() {
    eventCenter.on('__taroPluginEtsMethodsTrigger', (opts: IEtsMethodsOptions) => {
      this.dispatch(opts)
    })
  }

  private static dispatch(opts: IEtsMethodsOptions) {
    const { method, params, success, fail } = opts
    try {
      switch (method) {
        case 'nativeHello':
          success?.({ code: 0, data: `ArkTS 收到消息：${params?.msg}` })
          break
        case 'nativeShowToast':
          // 这里可替换为鸿蒙系统 @kit.ArkUI Toast 能力
          console.info('[NativeToast]', params?.text)
          success?.({ code: 0 })
          break
        default:
          fail?.({ code: -1, msg: `原生方法【${method}】未注册` })
      }
    } catch (err) {
      fail?.({ code: -99, msg: `原生执行异常: ${err}` })
    }
  }

  /**
   * 原生主动发送事件到 Taro JS 层
   * @param eventName 事件名
   * @param data 数据
   */
  static emitToTaro(eventName: string, data: Object) {
    eventCenter.trigger(eventName, data)
  }
}
```

# 9\. EntryAbility\.ets

文件路径：entry/src/main/ets/entryability/EntryAbility\.ets。在窗口创建时初始化 Taro 运行时、注册原生桥接监听，并加载首页面。

```typescript
import { UIAbility } from '@kit.AbilityKit'
import { WindowStage } from '@kit.WindowKit'
import { context, Current } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import { TaroWindowUtil } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import { NativeBridge } from '../native-bridge/NativeBridge'

export default class EntryAbility extends UIAbility {
  onWindowStageCreate(stage: WindowStage): void {
    context.resolver(this.context)
    TaroWindowUtil.setWindowStage(stage)
    // 初始化原生桥接监听
    NativeBridge.init()

    stage.loadContent('home_page', (err) => {
      if (err) {
        console.error('loadContent error', err)
        return
      }
      const win = stage.getMainWindowSync()
      Current.uiContext = win.getUIContext()
      win.setWindowLayoutFullScreen(true)
    })
  }
}
```

# 10\. module\.json5 权限片段

```json5
{
  "module": {
    "name": "entry",
    "type": "har",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": ["phone"],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET",
        "reason": "$string:internet_reason",
        "usedScene": {
          "abilities": ["EntryAbility"],
          "when": "inuse"
        }
      }
    ]
  }
}
```

# 11\. 构建与调试流程

1. 创建 Taro 项目，复制上述全部 Taro 侧文件。

2. 修改 config/index\.ts 中 projectPath，指向本机鸿蒙壳工程路径。

3. DevEco Studio 创建 Stage Empty Ability ArkTS 工程（HarmonyCapiApp）。

4. 在鸿蒙壳工程新建 native\-bridge/NativeBridge\.ets，并替换 EntryAbility\.ets。

5. 执行编译命令：npm run dev:harmony。

6. Taro 自动输出产物到鸿蒙壳工程。

7. DevEco 同步依赖、hvigor 构建，运行模拟器或真机。

8. 日志查看：hilog，过滤关键词 Taro、NativeToast。

```bash
# 开发监听模式
npm run dev:harmony

# 生产构建
npm run build:harmony

# 单独编译原生组件
npm run build:native-comp
```

# 12\. 扩展开发指引

## 12\.1 新增原生能力

- NativeBridge\.ets 的 switch 中增加 case，调用对应鸿蒙 Kit（定位、扫码、支付、蓝牙等）。

- Taro 页面直接通过 invokeNative\('xxx', \{\}\) 调用即可。

## 12\.2 原生主动推送 JS

- 鸿蒙侧调用 NativeBridge\.emitToTaro\('customEvent', \{\}\)。

- Taro 侧使用 onNativeEvent 监听对应事件。

## 12\.3 自定义原生组件

- 页面配置使用 componentName \+ entryOption:false。

- 执行 npm run build:native\-comp 导出组件。

## 12\.4 条件编译

```typescript
if (process.env.TARO_ENV === 'harmony_cpp') {
  // 鸿蒙 C-API 原生平台独有逻辑
}
```

# 13\. 已知限制与坑清单

|类别|说明|
|---|---|
|预览器|Previewer 预览器不支持 C\-API 渲染，只能使用模拟器或真机调试。|
|插件混用|不能混用 hybrid / ets 插件，三条路线产物与通信体系不同。|
|前端依赖|依赖 BOM / DOM 的前端库无法在 C\-API 鸿蒙端使用；纯 JS 计算库风险较低。|
|路径|工程路径不要包含中文、空格。|
|版本对齐|Taro 版本、插件版本、鸿蒙 SDK、hvigor 基线必须对齐，版本错配会直接编译失败。|
|通信方式|通信为异步事件模型，不支持同步返回；复杂场景建议封装 Promise。|

# 14\. 官方文档入口

- C\-API 官方文档：[https://docs\.taro\.zone/docs/harmony/c\-api](https://docs.taro.zone/docs/harmony/c-api)

- 发布博客：[https://docs\.taro\.zone/blog/2025/05/16/taro\-harmony\-c\-api](https://docs.taro.zone/blog/2025/05/16/taro-harmony-c-api)

- 插件 npm 页：[https://www\.npmjs\.com/package/@tarojs/plugin\-platform\-harmony\-cpp](https://www.npmjs.com/package/@tarojs/plugin-platform-harmony-cpp)

**交付说明：**本文档为自包含执行方案，可全量复制保存为本地 Markdown，直接发送给 AI 工具并指令“按照这份文档生成全部文件并搭建项目”。后续如需补充鸿蒙支付桥接、拍照相册、路由跳转等能力，按第 12\.1 节在桥接层扩展即可。

> （注：部分内容由豆包工作 AI 生成）
