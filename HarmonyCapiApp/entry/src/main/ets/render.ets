import { ComponentContent, FrameNode, NodeController, UIContext } from '@kit.ArkUI'
import { TaroNativeModule } from '@taro-oh/library/src/main/ets/npm/@tarojs/runtime'
import { TaroXComponent } from '@taro-oh/library/src/main/ets/npm/@tarojs/components'
import { TaroImage, TaroText, TaroView, TaroIcon, TaroForm, TaroLabel, TaroInput, TaroVideo, TaroButton, TaroPicker, TaroSlider, TaroSwitch, TaroSwiper, TaroWebView, TaroTextArea, TaroRichText, TaroProgress, TaroInnerHtml, TaroScrollView, TaroMovableArea, TaroMovableView, TaroRadio, TaroCanvas, TaroRadioGroup, TaroCheckboxGroup, TaroCheckbox, TaroPageMeta, TaroNavigationBar, TaroScrollList, TaroListView, TaroStickySection, TaroWaterFlowView, TaroWaterFlow, TaroList } from '@taro-oh/library/src/main/ets/npm/@tarojs/components'
import { Current, NodeType } from '@taro-oh/library/src/main/ets/npm/@tarojs/runtime'
import type { TaroAny, TaroElement, TaroOtherElement, TaroViewElement, TaroScrollViewElement, TaroImageElement, TaroButtonElement, TaroTextElement, TaroFormElement, TaroIconElement, TaroLabelElement, TaroPickerElement, TaroInputElement, TaroTextAreaElement, TaroCheckboxGroupElement, TaroCheckboxElement, TaroRadioGroupElement, TaroRadioElement, TaroRichTextElement, TaroVideoElement, TaroProgressElement, TaroMovableAreaElement, TaroMovableViewElement, TaroSwiperElement, TaroSwitchElement, TaroSliderElement, TaroCanvasElement, TaroWebViewElement, TaroInnerHtmlElement, TaroPageMetaElement, TaroNavigationBarElement } from '@taro-oh/library/src/main/ets/npm/@tarojs/runtime'




@Builder
function createChildItem (item: TaroElement, createLazyChildren?: (node: TaroElement, layer?: number) => void) {
  if (item.tagName === 'SLIDER') {
    TaroSlider({ node: item as TaroSliderElement, createLazyChildren })
  } else if (item.tagName === 'SWITCH') {
    TaroSwitch({ node: item as TaroSwitchElement, createLazyChildren })
  } else if (item.tagName === 'INNER-HTML') {
    TaroInnerHtml({ node: item as TaroInnerHtmlElement, createChildItem })
  } else if (item.tagName === 'RICH-TEXT') {
    TaroRichText({ node: item as TaroRichTextElement, createLazyChildren })
  } else if (item.tagName === 'PROGRESS') {
    TaroProgress({ node: item as TaroProgressElement, createLazyChildren })
  } else if (item.tagName === 'VIDEO') {
    TaroVideo({ node: item as TaroVideoElement, createLazyChildren })
  } else if (item.tagName === 'WEB-VIEW') {
    TaroWebView({ node: item as TaroWebViewElement, createLazyChildren })
  } else if (item.tagName === 'PAGE-META') {
    TaroPageMeta({ node: item as TaroPageMetaElement, createLazyChildren })
  } else if (item.tagName === 'NAVIGATION-BAR') {
    TaroNavigationBar({ node: item as TaroNavigationBarElement, createLazyChildren })
  } else {
    TaroXComponent({ pageId: item?._nid })
  }
}

@Builder
function createLazyChildren (node: TaroElement, layer = 0) {
  LazyForEach(node, (item: TaroElement) => {
    if (!item._nodeInfo || item._nodeInfo.layer === layer) {
      createChildItem(item, createLazyChildren)
    }
  }, (item: TaroElement) => `${item._nid}-${item._nativeUpdateTrigger}-${item._nodeInfo?.layer || 0}`)
}

export { createChildItem, createLazyChildren }


@Builder
function createEtsComponent (item: TaroElement) {
  Stack () {
    createChildItem(item, createLazyChildren)
  }
}

export function initEtsBuilder (router = '') {
  TaroNativeModule.registerEtsBuilder((data: TaroElement): ComponentContent<TaroElement> => {
    console.info("registerEtsBuilder app storage has value: " + Current.uiContext?.instanceId_)
    console.info("registerEtsBuilder: " + data._nid)
    return new ComponentContent<TaroElement>(Current.uiContext, wrapBuilder(createEtsComponent), data)
  }, router)
}
