import { PromptAction, router } from '@kit.ArkUI';
import {
  BridgeEventModule,
  RN_EVENT_INITIAL,
  RN_EVENT_PUSH_MESSAGE,
} from '../../bridge/BridgeEventModule';
import { RnEventData, RnEventExtra } from '../../bridge/RnEventBody';
import { LaunchPayloadHolder } from '../../bridge/LaunchPayloadHolder';

@Entry
@Component
struct NativeEventSenderPage {
  promptAction: PromptAction = this.getUIContext().getPromptAction();

  private backToRn(delay: number = 300): void {
    setTimeout(() => {
      router.back();
    }, delay);
  }

  private toast(message: string): void {
    this.promptAction.showToast({ message: message, duration: 1200 });
  }

  private sendPush(): void {
    const body = BridgeEventModule.pushMessage('推送消息', '收到一条来自鸿蒙原生的推送消息');
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送推送消息事件');
    this.backToRn();
  }

  private sendUpgrade(): void {
    const params = new RnEventData();
    params.webUrl = 'user_agreement';
    const bizData = new RnEventData();
    bizData.upgrade = true;
    const extra = new RnEventExtra();
    extra.title = '发现新版本';
    extra.content = '当前版本过低，请升级到 2.0.0 后继续使用。';
    extra.route = 'Web';
    extra.params = params;
    extra.bizData = bizData;
    const body = BridgeEventModule.build(RN_EVENT_PUSH_MESSAGE, 'message', 'push', extra);
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送强制升级事件');
    this.backToRn();
  }

  private sendRoute(): void {
    const params = new RnEventData();
    params.id = '10086';
    params.title = '来自原生卡片';
    params.from = 'push';
    const body = BridgeEventModule.navigate('Detail', params);
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送路由跳转事件');
    this.backToRn();
  }

  private sendState(): void {
    const value = new RnEventData();
    value.count = 8;
    const body = BridgeEventModule.stateUpdate('cartBadge', value);
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送状态更新事件');
    this.backToRn();
  }

  private sendDuplicate(): void {
    const body = BridgeEventModule.pushMessage(
      '重复事件测试',
      '相同 eventId 只应消费一次',
      'duplicate_test_001'
    );
    BridgeEventModule.emitToRn(body.eventName, body);
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送两次相同事件');
    this.backToRn();
  }

  private sendInvalidRoute(): void {
    const params = new RnEventData();
    params.id = '404';
    const body = BridgeEventModule.navigate('NotExistPage', params);
    BridgeEventModule.emitToRn(body.eventName, body);
    this.toast('已发送未注册路由事件');
    this.backToRn();
  }

  private sendHighFrequency(): void {
    for (let i = 0; i < 20; i++) {
      const value = new RnEventData();
      value.index = i;
      const body = BridgeEventModule.stateUpdate('高频事件', value);
      BridgeEventModule.emitToRn(body.eventName, body);
    }
    this.toast('已连续发送 20 条状态事件');
    this.backToRn(600);
  }

  private sendInitial(): void {
    const params = new RnEventData();
    params.id = '90001';
    params.from = 'cold-start-simulate';
    const extra = new RnEventExtra();
    extra.route = 'Detail';
    extra.params = params;
    const body = BridgeEventModule.build(RN_EVENT_INITIAL, 'route', 'card', extra);
    LaunchPayloadHolder.cache(RN_EVENT_INITIAL, body);
    BridgeEventModule.flushCachedEvent();
    this.toast('已发送冷启动补发事件');
    this.backToRn();
  }

  build() {
    Column() {
      Text('鸿蒙原生事件发送器')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 16 })

      Button('推送消息弹窗')
        .onClick(() => this.sendPush())
      Button('版本强制升级')
        .onClick(() => this.sendUpgrade())
      Button('跳转商品详情')
        .onClick(() => this.sendRoute())
      Button('状态更新/红点')
        .onClick(() => this.sendState())
      Button('重复事件去重')
        .onClick(() => this.sendDuplicate())
      Button('未注册路由回退')
        .onClick(() => this.sendInvalidRoute())
      Button('高频事件 20 条')
        .onClick(() => this.sendHighFrequency())
      Button('冷启动事件补发')
        .onClick(() => this.sendInitial())
      Button('直接返回 RN')
        .onClick(() => router.back())
    }
    .width('100%')
    .height('100%')
    .padding(20)
    .justifyContent(FlexAlign.Center)
  }
}
