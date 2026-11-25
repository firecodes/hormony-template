import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import DeviceInfo from 'react-native-device-info';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { CommonTitle } from '../../utils/CommonUtils';
import bridge from '../../utils/bridge';
import { BottomReactHeight, TopReactHeight } from '../../utils/Constant';
import { formatDate } from '../../utils/time';

const H5_SOURCE = require('../../../../rawfile/dev/web_bridge_test.html');

function now() {
  return formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss');
}

function makeMsgId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function parseQuery(url: string) {
  const result: any = {};
  const query = url.split('?')[1] || '';
  query.split('&').forEach(pair => {
    if (!pair) {
      return;
    }
    const items = pair.split('=');
    const key = decodeURIComponent(items[0] || '');
    const value = decodeURIComponent(items[1] || '');
    result[key] = value;
  });
  return result;
}

function buildUA() {
  const defaultUA = bridge.getDefaultUserAgent();
  const version = 'KaChe/333';
  const suffix = `${version} mall/111 Bridge/1.0`;
  console.log("reportUA ----buildUA", defaultUA);
  return defaultUA.includes(version) ? defaultUA : `${defaultUA} ${suffix}`;
}

function WebBridgeTestPage() {
  const webRef = useRef<any>(null);
  const callbackMap = useRef<any>({});
  const [logs, setLogs] = useState<string[]>([]);
  const customUA = useMemo(() => buildUA(), []);

  const appendLog = useCallback((text: string) => {
    const line = `[${now()}] ${text}`;
    setLogs(prev => [...prev.slice(-80), line]);
  }, []);

  useEffect(() => {
    return () => {
      callbackMap.current = {};
    };
  }, []);

  const inject = useCallback(
    (script: string) => {
      if (!webRef.current) {
        appendLog('injectJavaScript 失败：WebView ref 为空');
        return;
      }
      webRef.current.injectJavaScript(`${script}\ntrue;`);
    },
    [appendLog],
  );

  const reportScript = useCallback((type: string, data: any) => {
    const message = JSON.stringify({
      type,
      data: data || {},
      ts: Date.now(),
    });
    return `(function(){
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(${JSON.stringify(message)});
        }
      } catch (e) {}
    })();`;
  }, []);

  const injectBridgeObject = useCallback(() => {
    appendLog('RN → H5：注入全局桥对象 window.AppBridge');
    inject(`(function(){
      window.AppBridge = window.AppBridge || {};
      window.AppBridge.version = '1.0.0';
      window.AppBridge.platform = 'harmony';
      window.AppBridge.callNative = function (action, params) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'NATIVE_ACTION',
            action: action,
            params: params || {},
            msgId: '${makeMsgId()}'
          }));
        }
      };
      ${reportScript('INJECT_RESULT', { item: 'bridgeObject', success: true })}
    })();`);
  }, [appendLog, inject, reportScript]);

  const injectGlobalMethod = useCallback(() => {
    appendLog('RN → H5：注入全局方法 window.webBridgeGlobalMethod');
    inject(`(function(){
      window.webBridgeGlobalMethod = function (params) {
        return {
          ok: true,
          echo: params || {},
          timestamp: Date.now()
        };
      };
      ${reportScript('INJECT_RESULT', { item: 'globalMethod', success: true })}
    })();`);
  }, [appendLog, inject, reportScript]);

  const injectGlobalVariable = useCallback(() => {
    appendLog('RN → H5：注入全局变量 window.__APP_GLOBAL_VARS__');
    inject(`(function(){
      window.__APP_GLOBAL_VARS__ = Object.assign({}, window.__APP_GLOBAL_VARS__, {
        appName: 'RNMall',
        platform: 'harmony',
        userId: 'test_user_001',
        injectedAt: Date.now()
      });
      ${reportScript('INJECT_RESULT', { item: 'globalVariable', success: true })}
    })();`);
  }, [appendLog, inject, reportScript]);

  const injectGlobalStyle = useCallback(() => {
    appendLog('RN → H5：注入全局样式 #__RN_TEST_STYLE__');
    const css = `
      #rn-style-target {
        background: #0A59F7 !important;
        color: #ffffff !important;
        padding: 12px !important;
        border-radius: 10px !important;
        font-weight: bold !important;
        text-align: center !important;
        box-shadow: 0 2px 8px rgba(10, 89, 247, 0.35) !important;
      }
    `;
    inject(`(function(){
      var css = ${JSON.stringify(css)};
      var style = document.getElementById('__RN_TEST_STYLE__');
      if (!style) {
        style = document.createElement('style');
        style.id = '__RN_TEST_STYLE__';
        document.head.appendChild(style);
      }
      style.textContent = css;
      ${reportScript('INJECT_RESULT', { item: 'globalStyle', success: true })}
    })();`);
  }, [appendLog, inject, reportScript]);

  const callH5 = useCallback(
    (method: string, params: any = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = makeMsgId();
        callbackMap.current[msgId] = { resolve, reject };
        const script = `(function(){
          try {
            var fn = window[${JSON.stringify(method)}];
            if (typeof fn === 'function') {
              var result = fn(${JSON.stringify(params)});
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'H5_CALLBACK',
                msgId: ${JSON.stringify(msgId)},
                success: true,
                data: result
              }));
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'H5_CALLBACK',
                msgId: ${JSON.stringify(msgId)},
                success: false,
                message: '方法不存在: ${method}'
              }));
            }
          } catch (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'H5_CALLBACK',
              msgId: ${JSON.stringify(msgId)},
              success: false,
              message: String(e)
            }));
          }
        })();`;
        inject(script);
      });
    },
    [inject],
  );

  const replyH5 = useCallback(
    (msgId: string, success: boolean, data: any) => {
      appendLog(`RN → H5：回复 msgId=${msgId}`);
      inject(`(function(){
        try {
          if (window.onNativeReply && typeof window.onNativeReply === 'function') {
            window.onNativeReply(${JSON.stringify({ msgId, success, data })});
          }
        } catch (e) {}
      })();`);
    },
    [appendLog, inject],
  );

  const handleNativeAction = useCallback(
    (payload: any) => {
      const { action, params, msgId } = payload;
      appendLog(`H5 → RN：NATIVE_ACTION action=${action}`);
      switch (action) {
        case 'GET_USER_INFO':
          replyH5(msgId, true, {
            name: '张三',
            phone: '138****0000',
            from: 'RN',
          });
          break;
        case 'ECHO':
          replyH5(msgId, true, { echo: params });
          break;
        case 'BACK':
          replyH5(msgId, true, '已收到返回请求');
          setTimeout(() => bridge.back(''), 200);
          break;
        default:
          replyH5(msgId, false, `未识别的 action: ${action}`);
      }
    },
    [appendLog, replyH5],
  );

  const handleMessage = useCallback(
    (event: any) => {
      let payload: any;
      try {
        payload = JSON.parse(event.nativeEvent.data);
      } catch (e) {
        payload = { type: 'RAW', data: event.nativeEvent.data };
      }

      switch (payload.type) {
        case 'H5_CALLBACK': {
          const cb = callbackMap.current[payload.msgId];
          if (cb) {
            appendLog(`H5 → RN：CALLBACK ${payload.success ? '成功' : '失败'}`);
            payload.success
              ? cb.resolve(payload.data)
              : cb.reject(payload.message || 'H5 调用失败');
            delete callbackMap.current[payload.msgId];
          }
          break;
        }
        case 'INJECT_RESULT':
          appendLog(`H5 → RN：注入确认 ${payload.data?.item || ''}`);
          break;
        case 'H5_READY':
          appendLog('H5 → RN：页面已就绪');
          break;
        case 'H5_STATUS':
          appendLog(`H5 → RN：状态回传 ${JSON.stringify(payload.data)}`);
          break;
        case 'NATIVE_ACTION':
          handleNativeAction(payload);
          break;
        case 'RN_POST_MESSAGE_RECEIVED':
          appendLog('H5 → RN：已收到 webRef.postMessage');
          break;
        default:
          appendLog(`H5 → RN：${payload.type} ${JSON.stringify(payload)}`);
      }
    },
    [appendLog, handleNativeAction],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (request: any) => {
      const url = request?.url || '';
      if (url.startsWith('mybridge://')) {
        const query = parseQuery(url);
        appendLog(`H5 → RN：scheme 备用通道 ${url}`);
        if (query.action === 'SCHEME_ECHO') {
          replyH5(query.msgId || '', true, {
            echo: query.text || '',
            via: 'scheme',
          });
        } else {
          replyH5(
            query.msgId || '',
            false,
            `未识别的 scheme action: ${query.action || ''}`,
          );
        }
        return false;
      }
      return true;
    },
    [appendLog, replyH5],
  );

  const injectAll = useCallback(() => {
    injectBridgeObject();
    injectGlobalMethod();
    injectGlobalVariable();
    injectGlobalStyle();
  }, [injectBridgeObject, injectGlobalMethod, injectGlobalVariable, injectGlobalStyle]);

  const onLoadEnd = useCallback(() => {
    appendLog('onLoadEnd：页面加载完成，开始自动注入');
    injectAll();
    setTimeout(() => {
      callH5('initPage', { theme: 'dark', version: '1.0.0' })
        .then((res: any) => appendLog(`H5 initPage 返回：${JSON.stringify(res)}`))
        .catch((err: any) => appendLog(`H5 initPage 失败：${String(err)}`));
    }, 150);
    setTimeout(() => {
      inject(`(function(){
        if (window.__reportToRN) {
          window.__reportToRN('H5_STATUS_REQUEST', {from: 'RN onLoadEnd'});
        }
      })();`);
    }, 300);
  }, [appendLog, inject, injectAll, callH5]);

  const requestH5Status = useCallback(() => {
    appendLog('RN → H5：请求 H5 回传注入状态');
    inject(`(function(){
      if (window.__reportToRN) {
        window.__reportToRN('H5_STATUS_REQUEST', {from: 'RN button'});
      }
    })();`);
  }, [appendLog, inject]);

  const sendPostMessage = useCallback(() => {
    if (!webRef.current) {
      appendLog('webRef.postMessage 失败：WebView ref 为空');
      return;
    }
    const message = JSON.stringify({
      type: 'RN_POST_MESSAGE',
      data: 'hello from RN postMessage',
    });
    webRef.current.postMessage(message);
    appendLog(`RN → H5：postMessage ${message}`);
  }, [appendLog]);

  const callInitPage = useCallback(() => {
    callH5('initPage', { theme: 'light', version: 'test' })
      .then((res: any) => appendLog(`H5 initPage 返回：${JSON.stringify(res)}`))
      .catch((err: any) => appendLog(`H5 initPage 失败：${String(err)}`));
  }, [appendLog, callH5]);

  const button = (label: string, onPress: () => void) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.content}>
      {CommonTitle('WebView 双向通信测试', 'black', null, () => bridge.back(''))}
      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>RN → H5 注入与调用</Text>
        <View style={styles.buttonRow}>
          {button('自动注入全部', injectAll)}
          {button('注入桥对象', injectBridgeObject)}
        </View>
        <View style={styles.buttonRow}>
          {button('注入全局方法', injectGlobalMethod)}
          {button('注入全局变量', injectGlobalVariable)}
        </View>
        <View style={styles.buttonRow}>
          {button('注入全局样式', injectGlobalStyle)}
          {button('调用 initPage', callInitPage)}
        </View>

        <Text style={styles.sectionTitle}>RN ↔ H5 消息通道</Text>
        <View style={styles.buttonRow}>
          {button('postMessage 给 H5', sendPostMessage)}
          {button('请求 H5 状态', requestH5Status)}
        </View>
        <View style={styles.buttonRow}>
          {button('清空日志', () => setLogs([]))}
        </View>

        <Text style={styles.sectionTitle}>H5 测试页</Text>
        <WebView
          ref={webRef}
          style={styles.webview}
          source={H5_SOURCE}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onLoadEnd={onLoadEnd}
          onMessage={handleMessage}
          userAgent={customUA}
        />

        <Text style={styles.sectionTitle}>通信日志</Text>
        <View style={styles.logBox}>
          {logs.length === 0 ? (
            <Text style={styles.logText}>等待通信事件...</Text>
          ) : (
            logs.map((line, index) => (
              <Text key={`${index}_${line}`} style={styles.logText}>
                {line}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    paddingTop: TopReactHeight,
    paddingBottom: BottomReactHeight,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    minHeight: 36,
    marginHorizontal: 3,
    marginVertical: 4,
    borderRadius: 6,
    backgroundColor: '#0A59F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  webview: {
    height: 460,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  logBox: {
    minHeight: 160,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 24,
  },
  logText: {
    fontSize: 11,
    color: '#333',
    lineHeight: 17,
  },
});

export default WebBridgeTestPage;
