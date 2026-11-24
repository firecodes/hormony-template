import { audio } from "@kit.AudioKit"
import display from "@ohos.display"
import { NodeContent } from "@ohos.arkui.node"
import { TaroNativeModule, initStyleSheetConfig, systemContext, WINDOW_STATE } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import { TaroXComponent } from "@taro-oh/library/src/main/ets/npm/@tarojs/components"
import oh_window from "@ohos.window"
import { navigateBack } from "@taro-oh/library/src/main/ets/npm/@tarojs/taro"
import type Taro from "@taro-oh/library/src/main/ets/npm/@tarojs/taro/types"
import type { PageInstance, TaroAny, TaroElement, TaroObject, TaroNode, TaroViewElement, TFunc } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import type common from "@ohos.app.ability.common"


import router from "@ohos.router"
import { TaroView } from "@taro-oh/library/src/main/ets/npm/@tarojs/components"
import { getSystemInfoSync } from "@taro-oh/library/src/main/ets/npm/@tarojs/taro"
import { eventCenter, bindFn, callFn, convertNumber2VP, Current, document, initHarmonyElement, ObjectAssign, window } from "@taro-oh/library/src/main/ets/npm/@tarojs/runtime"
import { createLazyChildren } from "../../render"
import createComponent, { config } from "./index/index_taro_comp"
import { initEtsBuilder } from "../../render"
import styleJson from "./index_style.json"

const sysInfo: TaroAny = getSystemInfoSync()
@Entry
@Component
struct Index {
  scroller: Scroller = new Scroller()
  page?: PageInstance
  onReady?: TaroAny
  @State node: (TaroElement | null) = null
  @State layerNode: (TaroElement | null) = null
  @State navigationBarHomeBtn: boolean = true
  @State navigationBarLoading: boolean = false
  @State navigationBarBackgroundColor: string = config.navigationBarBackgroundColor
  @State navigationBarTextStyle: string = config.navigationBarTextStyle
  @State navigationBarTitleText: string = config.navigationBarTitleText
  @State pageBackgroundColor: string = config.backgroundColor
  @State pageBackgroundContentColor: string = config.backgroundColorContent
  @StorageLink("__TARO_PAGE_STACK") pageStack: router.RouterState[] = []
  @StorageProp("__TARO_ENTRY_PAGE_PATH") entryPagePath: string = ""
  @State appConfig: Taro.AppConfig = window.__taroAppConfig || {}
  @State tabBarList: Taro.TabBarItem[] = this.appConfig.tabBar?.list || []
  __layoutSize: TaroAny = null
  areaChange: TaroAny = null
  __pageName: TaroAny = null
  @State params: TaroObject = {}
  @State statusBarHeight: number = getSystemInfoSync().statusBarHeight || 0
  @State isHideTitleBar: boolean = config.navigationStyle === 'custom'
  isShown: boolean = true
  nodeContent: Content = new NodeContent()
  @State isReady: boolean = false
  @State pullDownRatio: number = 1

  getNavHeight () {
    return this.isHideTitleBar ? 0 : 48 + this.statusBarHeight
  }

  getPageState () {
    const state = router.getState()
    state.path ||= 'pages/index/index'
    if (state.path.endsWith('/')) {
    state.path += 'index'
    }
    return state
  }

  aboutToAppear () {
    if (!Current.audioSessionManager) {
      const audioManager = audio.getAudioManager()
      Current.audioSessionManager = audioManager.getSessionManager()
    }
    this.activeAudioSession()
    initEtsBuilder('myApp@1.0.0:pages/index/index')
    this.__pageName = 'pages/index/index'
    this.__layoutSize = this.params._layout_
    systemContext.windowWidth = this.params._layout_?.width
    systemContext.windowHeight = this.params._layout_?.height
    TaroNativeModule.initStylesheet('myApp@1.0.0:pages/index/index', styleJson, initStyleSheetConfig({ width: systemContext.windowWidth, height: systemContext.windowHeight}, this.getNavHeight()))
    Current.$r = (path: string): Resource => {
      return $r(path)
    }
    let currentSplit = false
    let pendingAreaChange: TaroAny = undefined
    const resizeFn = (canSplit: boolean, size: TaroAny, sizeChange: boolean) => {
      const _display = display.getDefaultDisplaySync()
      const orientation = _display.orientation
      const idPortrait = orientation == display.Orientation.PORTRAIT || orientation == display.Orientation.PORTRAIT_INVERTED
      const _sysInfo: TaroAny = getSystemInfoSync()
      callFn(this.page?.onResize, this, {
        size: {
          windowWidth: size?.width,
          windowHeight: size?.height,
          screenWidth: _sysInfo.screenWidth,
          screenHeight: _sysInfo.screenHeight,
        },
        deviceOrientation: idPortrait ? "portrait" : "landscape",
        foldDisplayMode: _sysInfo.foldDisplayMode,
        canSplit: canSplit,
        reason: sizeChange ? "size" : "statusBar"
      })
    }
    const avoidAreaChange = (res: TaroAny) => {
      const statusHeight: number = px2vp(res.area.topRect.height)
      this.statusBarHeight = statusHeight
      TaroNativeModule.UpdateEnvRule('myApp@1.0.0:pages/index/index', initStyleSheetConfig({ width: this.__layoutSize.width, height: this.__layoutSize.height}, this.getNavHeight()), this.node?._nid)
      resizeFn(currentSplit, this.__layoutSize, false)
    }
    const windowStage: TaroAny = AppStorage.get(WINDOW_STATE)
    this.areaChange = (res: TaroAny) => {
      if (res.type !== oh_window.AvoidAreaType.TYPE_SYSTEM)  return
      if (!this.isShown) {
        pendingAreaChange = () => { avoidAreaChange(res) }
      } else {
        avoidAreaChange(res)
      }
    }
    windowStage.getMainWindowSync().on('avoidAreaChange', this.areaChange)
    const state: TaroAny = this.getPageState()
    if (this.pageStack.length >= state.index) {
      this.pageStack.length = state.index - 1
    }
    this.pageStack.push(state)
    this.handlePageAppear()
  }

  aboutToDisappear () {
    this.handlePageDetach()
    this.deactivateAudioSession()
    if (this.areaChange) {
      const windowStage: TaroAny = AppStorage.get(WINDOW_STATE)
      windowStage.getMainWindowSync().off('avoidAreaChange', this.areaChange)
    }
  }

  handlePageAppear () {
    const params = this.params
    this.page = createComponent()
    this.onReady = bindFn(this.page?.onReady, this.page)
    callFn(this.page?.onLoad, this, params, (instance: TaroElement) => {
      this.node = instance
      TaroNativeModule.buildTaroNode(this.nodeContent, instance._nid)
      this.isReady = true
    })
    callFn(this.page?.onReady, this, params)
  }

  handleNavigationStyle = (option: TaroObject) => {
    if (option.title) this.navigationBarTitleText = option.title
    if (option.backgroundColor) this.navigationBarBackgroundColor = option.backgroundColor || '#000000'
    if (option.frontColor) this.navigationBarTextStyle = option.frontColor || 'white'
    if (typeof option.home === 'boolean') this.navigationBarHomeBtn = option.home
    if (typeof option.loading === 'boolean') this.navigationBarLoading = option.loading
  }

  handlePageStyle = (option: TaroObject) => {
    if (option.backgroundColor) this.pageBackgroundColor = option.backgroundColor || '#FFFFFF'
    if (option.backgroundColorContext) this.pageBackgroundContentColor = option.backgroundColorContext || '#FFFFFF'
  }

  bindPageEvent () {
    eventCenter?.on('__taroNavigationStyle', this.handleNavigationStyle)
    eventCenter?.on('__taroPageStyle', this.handlePageStyle)
  }

  removePageEvent () {
    eventCenter?.off('__taroNavigationStyle', this.handleNavigationStyle)
    eventCenter?.off('__taroPageStyle', this.handlePageStyle)
  }

  @Builder
  renderTitle () {
    Flex({
      direction: FlexDirection.Row,
      justifyContent: FlexAlign.Start,
      alignItems: ItemAlign.Center,
    }) {
      if (this.pageStack[0].path !== this.entryPagePath && this.navigationBarHomeBtn && this.pageStack.length === 1) {
          Image($r('app.media.taro_home'))
            .height(convertNumber2VP(40 / 7.5, 'vw'))
            .width(convertNumber2VP(40 / 7.5, 'vw'))
            .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })
            .fillColor((this.navigationBarTextStyle || 'black') !== 'black' ? Color.White : Color.Black)
            .objectFit(ImageFit.Contain)
            .onClick(() => {
              router.replaceUrl({
                url: this.tabBarList.find(e => e.pagePath === this.entryPagePath) ? 'taro_tabbar' : this.entryPagePath,
                params: {
                  '$page': this.entryPagePath,
                },
              })
            })
        } else if (this.pageStack.length > 1) {
          Image($r('app.media.taro_arrow_left'))
            .height(convertNumber2VP(40 / 7.5, 'vw'))
            .width(convertNumber2VP(40 / 7.5, 'vw'))
            .margin({ left: convertNumber2VP(40 / 7.5, 'vw'), right: convertNumber2VP(-20 / 7.5, 'vw') })
            .fillColor((this.navigationBarTextStyle || 'black') !== 'black' ? Color.White : Color.Black)
            .objectFit(ImageFit.Contain)
            .onClick(() => {
              router.back()
            })
        }
      Text(this.navigationBarTitleText || 'Taro CAPI 原生通信 Demo')
        .margin({ left: convertNumber2VP(40 / 7.5, 'vw') })
        .fontSize(convertNumber2VP(32 / 7.5, 'vw'))
        .fontColor((this.navigationBarTextStyle || 'black') !== 'black' ? Color.White : Color.Black)
      if (this.navigationBarLoading) {
        LoadingProgress()
          .margin({ left: convertNumber2VP(10 / 7.5, 'vw') })
          .height(convertNumber2VP(40 / 7.5, 'vw'))
          .width(convertNumber2VP(40 / 7.5, 'vw'))
          .color((this.navigationBarTextStyle || 'black') !== 'black' ? Color.White : Color.Black)
      }
    }
    .height('100%')
    .width('100%')
    .backgroundColor(this.navigationBarBackgroundColor || '#fff')
    .padding({
      top: px2vp(sysInfo.safeArea?.top || 0),
    })
    .zIndex(1)
  }

  handlePageDetach = () => {
    if (!this.isReady) return

    this.isReady = false
    callFn(this.page?.onUnload, this)
  }

  activeAudioSession = () => {
    if (Current.audioSessionManager) {
      const manager: audio.AudioSessionManager = Current.audioSessionManager
      if (!manager.isAudioSessionActivated()) {
        let strategy: audio.AudioSessionStrategy = {
          concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_PAUSE_OTHERS
        }
        manager.activateAudioSession(strategy)
      }
    }
  }

  deactivateAudioSession = () => {
    if (Current.audioSessionManager) {
      const manager: audio.AudioSessionManager = Current.audioSessionManager
      if (manager.isAudioSessionActivated()) {
        manager.deactivateAudioSession()
      }
    }
  }

  build () {
    Navigation() {
      Stack() {
        if (this.isReady) {
          TaroXComponent({ pageId: (this.node as TaroAny)?._nid, data: this.nodeContent })
        }
      }
      .align(Alignment.TopStart)
      .width("100%")
      .constraintSize({
        minHeight: "100%",
      })
      .onDetach(this.handlePageDetach)
      .backgroundColor(this.pageBackgroundContentColor || this.pageBackgroundColor || "#FFFFFF")
    }
    .backgroundColor(this.pageBackgroundColor || '#FFFFFF')
    .height('100%')
    .width('100%')
    .title({ builder: this.renderTitle, height: this.getNavHeight() })
    .titleMode(NavigationTitleMode.Mini)
    .hideTitleBar(this.isHideTitleBar)
    .hideBackButton(true)
    .mode(NavigationMode.Stack)
  }
}
