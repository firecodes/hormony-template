import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {PictureUtils} from '../../utils/PictureUtils';
import {ProductInfo} from './data/DetailBean';
import bridge from '../../utils/bridge';
import {BACKGROUND_COLOR, BottomReactHeight} from '../../utils/Constant';
import {GlobalToast, Toast} from '../../utils/ToastManager';

function ShareView(props) {
  const [productInfo, setProductInfo] = useState<ProductInfo>(undefined);
  useEffect(() => {
    setProductInfo(props.productInfo);
  }, []);

  function renderActionItemView(txt: string, require: any, cb: () => void) {
    return (
      <TouchableOpacity
        style={{
          width: 70,
          height: 110,
          marginRight: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          cb?.();
        }}>
        <View
          style={{
            width: 48,
            height: 48,
            backgroundColor: '#fff',
            justifyContent: 'center',
            borderRadius: 24,
            alignItems: 'center',
          }}>
          <Image style={{width: 48, height: 48}} source={require} />
        </View>
        <Text style={{fontSize: 12, color: '#666', marginTop: 8}}>{txt}</Text>
      </TouchableOpacity>
    );
  }

  function renderActionView() {
    return (
      <View
        style={{
          width: '100%',
          height: 250,
          backgroundColor: BACKGROUND_COLOR,
          borderRadius: 30,
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, color: 'black'}}>{'分享'}</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={{
              width: 36,
              height: 36,
              backgroundColor: '#eaeaea',
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              props.dismiss?.();
            }}>
            <Image
              source={PictureUtils.getIcon('ic_close')}
              style={{
                width: 18,
                height: 18,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 1,
            width: '100%',
            alignItems: 'center',
          }}>
          {renderActionItemView(
            '保存海报',
            require('../../../../rawfile/dev/media/icon/sys_poster.png'),
            () => {
              props?.setNeedAutoCapture?.(false);
              props?.setShowPoster?.(true);
            },
          )}
          {renderActionItemView(
            '复制链接',
            require('../../../../rawfile/dev/media/icon/sys_copylink.png'),
            () => {
              bridge.copyText(props?.shareText);
              Toast.show('商品链接复制成功~');
              props.dismiss?.();
            },
          )}
          {renderActionItemView(
            '华为分享',
            require('../../../../rawfile/dev/media/icon/sys_share.png'),
            () => {
              bridge.share(
                JSON.stringify({
                  content:
                    'http://test/' + productInfo.id + '/' + productInfo.title,
                  title: productInfo.title,
                  desc: '￥' + productInfo.price,
                }),
              );
              props.dismiss?.();
            },
          )}
          {renderActionItemView(
            '碰一碰',
            require('../../../../rawfile/dev/media/icon/sys_pyp.png'),
            () => {
              bridge.requestPermission(['ohos.permission.DISTRIBUTED_DATASYNC'], res => {
                if (res) {
                  Toast.show('正在保存分享图片...', 1000, 'center');
                  props?.setNeedAutoCapture?.(true);
                  props?.setShowPoster?.(true);
                } else {
                  Toast.show('权限被拒绝');
                }
              });
            },
          )}
        </View>
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={{
            width: '100%',
            height: 46,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 23,
            marginBottom: 16 + BottomReactHeight,
            backgroundColor: '#fff',
          }}
          onPress={() => {
            props.dismiss?.();
          }}>
          <Text style={{fontSize: 16, color: '#00000099'}}>确定</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderView() {
    return (
      <View style={{width: '100%', height: '100%'}}>{renderActionView()}</View>
    );
  }

  return renderView();
}

export default ShareView;
