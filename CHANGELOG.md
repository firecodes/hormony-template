

在[text](src/ts/modules/base/pages/RNSplashPage.tsx) 增加一个测试webview界面链接，按需求文档开发 [text](<md_doc/RN WebView 与 H5 双向通信方案.md>)
验证webview和H5的通信，在鸿蒙手机上验证，功能要验证全面，参考网上开源文档，把交互功能验证全面。
比如
1. 页面加载完成后，可主动向 H5 注入全局桥对象
2. 页面加载完成后，可主动向 H5 注入全局方法
3. 页面加载完成后，可主动向 H5 注入全局变量
4. 页面加载完成后，可主动向 H5 注入全局样式



[text](src/ts/modules/base/utils/time.ts) 增加日期函数，日期格式方法用 formatDate ,替换
function now() {
  return formatDate( Date.now(), 'yyyy-MM-dd HH:mm:ss' )
} 




[text](md_doc/RNOH反向事件桥接-需求与实现方案.md)
按需求文档开发,接收鸿蒙原生能力，比如推送消息、版本强制升级、或鸿蒙某功能消息推送给RN，RN收到消息参数，做页面跳转、界面展示、弹窗提示等，各种UI功能，参考网上开源文档，把交互功能验证全面。
1. 主要实现鸿蒙原生能力，通过桥连接，对RN页面进行操作，比如页面跳转、界面展示、弹窗提示等，各种UI功能，参考网上开源文档，把交互功能验证全面。


rn鸿蒙项目运行，app是白屏，请解决白屏问题


D:\RN\ShoppingRNApp\harmony\entry\src\main\ets\TurboModule\RnBridge.ets

方法获取 
  getDefaultUserAgent(): string {
    try {
      webview.WebviewController.initializeWebEngine();
      const defaultUA = webview.WebviewController.getDefaultUserAgent();
      return defaultUA;
    } catch (error) {
      Logger.error(TAG, 'getDefaultUserAgent failed: ' + String(error));
      return '';
    }
  }
NA值， 不在 initAppUserAgent 方法中设置NA值，按照调用方法获取
  