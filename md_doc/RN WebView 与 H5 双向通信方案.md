# RN WebView 与 H5 双向通信方案

# 一、通信总览

|方向|场景|RN 侧 API|H5 侧 API|
|---|---|---|---|
|RN → H5|调用 H5 全局方法、传参数|injectJavaScript|window\.xxx / eval|
|H5 → RN|H5 上报消息、触发原生|onMessage / onNavigationStateChange|window\.ReactNativeWebView\.postMessage|
|回调|H5 执行完回传结果给 RN|监听 onMessage|再次 postMessage|

# 二、完整封装代码

## 1\. RN 端 WebBridgePage\.jsx

```jsx
import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {WebView} from 'react-native-webview';

const BRIDGE_NAME = 'AppBridge';

function WebBridgePage(props) {
  const webRef = useRef(null);
  const [msgList, setMsgList] = useState([]);

  // 记录待回调：msgId -> resolve
  const callbackMap = useRef({});

  useEffect(() => {
    // 页面加载完成后，可主动向 H5 注入全局桥对象
    return () => {
      callbackMap.current = {};
    };
  }, []);

  /** RN 调用 H5 全局方法，支持 Promise 回调 */
  function callH5(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

      callbackMap.current[msgId] = {resolve, reject};

      // 注入脚本：执行 H5 上挂的全局方法
      const script = `
        (function () {
          try {
            const fn = window['${method}'];
            if (typeof fn === 'function') {
              const result = fn(${JSON.stringify(params)});
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'H5_CALLBACK',
                msgId: '${msgId}',
                success: true,
                data: result
              }));
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'H5_CALLBACK',
                msgId: '${msgId}',
                success: false,
                message: '方法不存在: ${method}'
              }));
            }
          } catch (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'H5_CALLBACK',
              msgId: '${msgId}',
              success: false,
              message: String(e)
            }));
          }
        })();
        true;
      `;

      webRef.current?.injectJavaScript(script);
    });
  }

  /** 接收 H5 发来的消息 */
  function handleMessage(event) {
    let payload;
    try {
      payload = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      // H5 也可能直接发字符串
      payload = {type: 'RAW', data: event.nativeEvent.data};
    }

    switch (payload.type) {
      // H5 执行完，回调 RN
      case 'H5_CALLBACK': {
        const cb = callbackMap.current[payload.msgId];
        if (cb) {
          payload.success ? cb.resolve(payload.data) : cb.reject(payload.message);
          delete callbackMap.current[payload.msgId];
        }
        break;
      }
      // H5 主动调用原生能力
      case 'NATIVE_ACTION': {
        handleNativeAction(payload);
        break;
      }
      default:
        setMsgList((prev) => [...prev, payload]);
    }
  }

  /** H5 请求原生动作：返回上一页、取手机号、支付等 */
  function handleNativeAction(payload) {
    const {action, params, msgId} = payload;

    switch (action) {
      case 'BACK':
        // bridge.back('');
        replyH5(msgId, true, '已返回');
        break;
      case 'GET_USER_INFO':
        replyH5(msgId, true, {name: '张三', phone: '138****0000'});
        break;
      default:
        replyH5(msgId, false, '未识别的 action: ' + action);
    }
  }

  /** RN 回复 H5 的调用结果 */
  function replyH5(msgId, success, data) {
    const script = `
      (function () {
        try {
          if (window['onNativeReply'] && typeof window['onNativeReply'] === 'function') {
            window['onNativeReply'](${JSON.stringify({msgId, success, data})});
          }
        } catch (e) {}
      })();
      true;
    `;
    webRef.current?.injectJavaScript(script);
  }

  // 演示：页面加载后调用 H5 的全局方法
  function onWebLoadEnd() {
    callH5('initPage', {theme: 'dark', version: '1.0.0'})
      .then((res) => console.log('H5 初始化返回:', res))
      .catch((err) => console.log('调用失败:', err));
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{uri: 'https://your-domain.com/h5/index.html'}}
        onMessage={handleMessage}
        onLoadEnd={onWebLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // 兼容旧版本：拦截 url scheme 作为备用通信通道
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          if (url.startsWith('mybridge://')) {
            // 解析 url 上的参数
            return false;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default WebBridgePage;
```

## 2\. H5 端代码（index\.html）

```html
<script>
  // RN 可直接通过 window.initPage 调用
  window.initPage = function (params) {
    console.log('收到 RN 参数:', params);
    // 同步返回值会被 RN 拿到；异步场景用 postMessage 回传
    return {code: 0, msg: '初始化完成'};
  };

  // 原生回复回调（replyH5 触发）
  window.onNativeReply = function (res) {
    console.log('原生返回:', res);
  };

  /** H5 主动调用原生 */
  function callNative(action, params) {
    const msgId = Date.now() + '_' + Math.random().toString(36).slice(2);

    // 等待原生回复
    window.__nativeCallbackMap = window.__nativeCallbackMap || {};
    return new Promise((resolve) => {
      window.__nativeCallbackMap[msgId] = resolve;

      // 兼容：判断是否在 RN WebView 环境
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({type: 'NATIVE_ACTION', action, params, msgId})
        );
      } else {
        // 浏览器环境 mock
        resolve({code: -1, msg: '非 WebView 环境'});
      }
    });
  }

  // 把 onNativeReply 与回调表关联
  const originReply = window.onNativeReply;
  window.onNativeReply = function (res) {
    const cb = window.__nativeCallbackMap?.[res.msgId];
    if (cb) {
      cb(res);
      delete window.__nativeCallbackMap[res.msgId];
    }
    originReply && originReply(res);
  };
</script>

<!-- H5 业务调用示例 -->
<button onclick="onClickGetUser()">获取用户信息</button>
<script>
  async function onClickGetUser() {
    const res = await callNative('GET_USER_INFO', {from: 'h5'});
    console.log(res);
  }
</script>
```

# 三、关键 API 说明

## 1\. RN → H5

```js
// 1. 直接执行表达式
webRef.current.injectJavaScript(`window.initPage(${JSON.stringify(params)}); true;`);

// 2. 调用全局函数并取返回值（上面封装方式）
callH5('方法名', {key: 'value'}).then(res => {});
```

注意：injectJavaScript 末尾必须以 true; 结束，否则部分平台会告警。

## 2\. H5 → RN

```js
// 只能传字符串；对象需 JSON.stringify
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: '事件名',
  data: {}
}));
```

RN 侧通过 event\.nativeEvent\.data 接收，再 JSON\.parse。

## 3\. 回调闭环

1. RN 调用 H5 时生成 msgId，存入 callbackMap；

2. H5 执行完 postMessage 带回 msgId；

3. RN 按 msgId 找到对应 resolve，完成 Promise。

# 四、鸿蒙 / 生产环境注意事项

1. **域名白名单：**H5 地址需在 WebView 配置的业务域名内，postMessage 才正常通信。

2. **JS 开关：**必须开启 javaScriptEnabled=\{true\}。

3. **异步回调时机：**H5 方法是异步请求时，先 return 占位，拿到结果后再 postMessage 回 RN。

4. **scheme 备用通道：**旧版容器若 postMessage 受限，可用 location\.href = 'mybridge://action?params=xxx'，RN 在 onNavigationStateChange 中拦截。

5. **方法名冲突：**全局方法建议挂在统一对象上，如 window\.AppBridge\.init，避免覆盖原生注入对象。

> （注：部分内容由豆包工作 AI 生成）
