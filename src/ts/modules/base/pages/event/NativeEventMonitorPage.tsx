import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonTitle} from '../../utils/CommonUtils';
import bridge from '../../utils/bridge';
import {BottomReactHeight, TopReactHeight} from '../../utils/Constant';
import {formatDate} from '../../utils/time';
import {
  RN_EVENT_INTERNAL_DISPLAY,
  RN_EVENT_PUSH_MESSAGE,
  RnEventBody,
} from '../../bridge/RNEventBus';

function NativeEventMonitorPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const append = useCallback((payload: RnEventBody) => {
    const time = formatDate(Date.now(), 'HH:mm:ss');
    const line = `[${time}] ${payload.eventName || payload.type || 'event'} ${JSON.stringify(payload)}`;
    setLogs(prev => [...prev.slice(-80), line]);
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      RN_EVENT_INTERNAL_DISPLAY,
      append,
    );
    return () => subscription.remove();
  }, [append]);

  const openNativeSender = useCallback(() => {
    bridge.pushUrl('NativeEventSender', JSON.stringify({from: 'RN'}));
  }, []);

  const simulatePush = useCallback(() => {
    DeviceEventEmitter.emit(RN_EVENT_PUSH_MESSAGE, {
      eventId: `local_${Date.now()}`,
      eventName: RN_EVENT_PUSH_MESSAGE,
      type: 'message',
      source: 'rn-local',
      title: '本地模拟推送',
      content: '这是 RN 本地模拟事件，用于快速检查弹窗链路。',
      route: 'Main',
      timestamp: Date.now(),
    });
  }, []);

  return (
    <View style={styles.content}>
      {CommonTitle('原生事件桥接测试', 'black', null, () => bridge.back(''))}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={openNativeSender}>
          <Text style={styles.buttonText}>打开原生事件发送器</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={simulatePush}>
          <Text style={styles.buttonText}>本地模拟推送</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLogs([])}>
          <Text style={styles.buttonText}>清空日志</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tip}>
        点击“打开原生事件发送器”进入 ArkTS 页面，发送事件后会自动返回 RN，并在此页展示事件日志。
      </Text>

      <ScrollView style={styles.logBox}>
        {logs.length === 0 ? (
          <Text style={styles.logText}>等待原生事件...</Text>
        ) : (
          logs.map((line, index) => (
            <Text key={`${index}_${line}`} style={styles.logText}>
              {line}
            </Text>
          ))
        )}
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
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    minHeight: 38,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#0A59F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
  tip: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginTop: 12,
  },
  logBox: {
    flex: 1,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  logText: {
    fontSize: 11,
    color: '#333',
    lineHeight: 17,
  },
});

export default NativeEventMonitorPage;
