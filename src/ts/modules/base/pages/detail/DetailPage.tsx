import {
  DeviceEventEmitter,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import bridge from '../../utils/bridge';
import {getProductInfoTag, ProductServiceItem} from './data/DetailBean';
import ShareView from './ShareView';
import {showModal} from '../../utils/ModalUtils';
import {DetailPageVM} from './viewmodel/DetailPageVM';
import {ProductSelector} from './productSelector/ProductSelector';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {CommonTitle} from '../../utils/CommonUtils';
import RnFabricView from '../../../../widget/RnFabricView';
import {WindowInfo} from '../../utils/WindowInfo';
import ProductEvalCard from '../evaluate/ProductEvalCard';
import {LoginManager} from '../login/LoginManager';
import {captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';
import RNFabricView from '../../../../widget/RnFabricView';
import {ProductDetailApis} from './data/ProductDetailApis';
import {Toast} from '../../utils/ToastManager';

const SCREEN_WIDTH = Dimensions.get('window').width;

function DetailPage(props) {
  const {
    numberOfCartData,
    getProductDetail,
    getPictureRes,
    addCartData,
    getAllCartData,
    productInfo,
    isCollect,
    collectPro,
  } = DetailPageVM(props);
  const {foldStatus} = WindowInfo();
  const [showShare, setShowShare] = useState(false);
  const [showSelector, setShowSelector] = useState(0);
  const [needAutoCapture, setNeedAutoCapture] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const view = React.useRef<View>(null);
  const [shareText, setShareText] = useState('');

  useEffect(() => {
    getProductDetail(props.productId ?? props.id, props.isOffTheShelf);
  }, []);

  useEffect(() => {
    if (productInfo) {
      let tmpShareText =
        'http://test/' + productInfo.id + '/' + productInfo.title;
      setShareText(tmpShareText);
    }
  }, [productInfo]);

  function renderTitle() {
    return CommonTitle('', 'black', () => (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{padding: 5, marginRight: 10}}
          onPress={() => {
            setShowShare(true);
          }}>
          <Image
            style={{width: 23, height: 23}}
            source={require('../../../../rawfile/dev/media/icon/ic_share.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => {
            collectPro(!isCollect);
          }}>
          <Image
            style={{width: 23, height: 23}}
            source={
              isCollect
                ? require('../../../../rawfile/dev/media/icon/collected.png')
                : require('../../../../rawfile/dev/media/icon/collect.png')
            }
          />
        </TouchableOpacity>
      </View>
    ));
  }

  function renderPrice() {
    return (
      <View
        style={[
          {paddingHorizontal: foldStatus === 1 ? 24 : 16},
          styles.priceRoot,
        ]}>
        <Text style={styles.priceLeft}>{'￥'}</Text>
        <Text style={styles.price}>{productInfo?.price}</Text>
        {productInfo?.dashPrice?.length > 0 && (
          <Text
            style={[
              styles.decPrice,
              {
                fontSize: 10,
                marginLeft: 4,
              },
            ]}>
            {'￥'}
          </Text>
        )}
        <Text
          style={[
            styles.decPrice,
            {
              fontSize: 12,
              marginLeft: -3,
            },
          ]}>
          {productInfo?.dashPrice}
        </Text>

        <View style={{flex: 1}} />
        <Text
          style={{
            color: '#999',
            marginBottom: 3,
            fontSize: 12,
          }}>
          {'已售' +
            (productInfo?.sales && Number.parseInt(productInfo?.sales) > 9999
              ? '99999+'
              : productInfo?.sales)}
        </Text>
      </View>
    );
  }

  function renderDescription(
    title: string,
    lists: ProductServiceItem[],
    replace: boolean,
  ) {
    return (
      <View
        style={[
          styles.desRoot,
          {paddingHorizontal: foldStatus === 1 ? 24 : 16},
        ]}>
        <Text style={styles.desTitle}>{title}</Text>
        <View style={styles.desContent}>
          {lists?.map((item, index) => {
            return (
              <Text key={String(item.content) + index} style={styles.desItem}>
                {(replace ? item.content.replace('｜', '，') : item.content) +
                  (index !== lists?.length - 1 ? '，' : '')}
              </Text>
            );
          })}
        </View>
      </View>
    );
  }

  function renderLogistics() {
    return productInfo?.logistics ? (
      renderDescription('配送', productInfo?.logistics, true)
    ) : (
      <View />
    );
  }

  function renderServices() {
    return productInfo?.service ? (
      renderDescription('服务', productInfo?.service, false)
    ) : (
      <View />
    );
  }

  function renderEvaluate() {
    return (
      <View style={{width: '100%'}}>
        <ProductEvalCard // 作为组件渲染
          productId={productInfo?.id}
        />
        <View
          style={{backgroundColor: BACKGROUND_COLOR, width: '100%', height: 12}}
        />
      </View>
    );
  }

  function renderDetail() {
    return (
      <View style={styles.topRoot}>
        <View>
          {productInfo?.pictures && (
            <RnFabricView
              style={{
                width: '100%',
                aspectRatio: foldStatus === 1 ? 2 : 16 / 9,
                height: 'auto',
              }}
              src={JSON.stringify({
                nativeViewName: 'SwiperPicture',
                pics: [...productInfo?.pictures, 'mock_homepage_banner1'],
                aspectRatio: foldStatus === 1 ? 2 : 16 / 9,
                autoPlay: true,
              })}
              onReceiveData={recvData => {}}
            />
          )}
        </View>
        <View style={{marginBottom: 12}}>
          {renderPrice()}
          <Text
            style={[
              styles.title,
              {paddingHorizontal: foldStatus === 1 ? 24 : 16},
            ]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {productInfo?.title}
          </Text>
          <View
            style={[
              styles.tagsRoot,
              {paddingHorizontal: foldStatus === 1 ? 24 : 16},
            ]}>
            {productInfo?.tags && (
              <Text style={styles.tagsText}>
                {getProductInfoTag(productInfo?.tags)}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
              }}>
              {productInfo?.label?.map((label, index) => (
                <View
                  key={String(index)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: THEME_COLOR, fontSize: 10}}>
                    {label}
                  </Text>
                  {index !== productInfo?.label?.length - 1 && (
                    <View style={styles.verLine} />
                  )}
                </View>
              ))}
            </View>
          </View>
          <View style={{marginBottom: 12}} />
          {renderLogistics()}
          {renderServices()}
        </View>
        <View style={styles.horLine} />
      </View>
    );
  }

  function renderImageList() {
    const [imgAspectRatios, setImgAspectRatios] = useState<
      Record<number, number>
    >({});

    return (
      <View style={{width: SCREEN_WIDTH}}>
        <Text
          style={[
            styles.imageListTitle,
            {marginLeft: foldStatus === 1 ? 24 : 16},
          ]}>
          商品详情
        </Text>
        {productInfo?.pictures?.map((item: string, index: number) => (
          <Image
            key={`${item}-${index}`}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH / (imgAspectRatios[index] || 1),
              objectFit: 'cover',
            }}
            source={getPictureRes(item)}
            resizeMethod="resize"
            onLoad={e => {
              const {width, height} = e.nativeEvent.source;
              setImgAspectRatios(prev => ({
                ...prev,
                [index]: width / height,
              }));
            }}
          />
        ))}
      </View>
    );
  }

  function renderBottom() {
    return (
      <View
        style={[
          styles.bottomRoot,
          {paddingHorizontal: foldStatus === 1 ? 18 : 10},
        ]}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            if (!LoginManager.isLogin) {
              bridge.pushUrl('Login');
              return;
            }
            bridge.pushUrl('Cart');
          }}>
          <Image
            style={{width: 20, height: 20, marginBottom: 4}}
            source={require('../../../../rawfile/dev/media/icon/ic_black_cart.svg')}
          />
          <Text
            style={{
              fontSize: 10,
              color: '#0000009f',
            }}>
            {'购物车'}
          </Text>

          {LoginManager.isLogin && numberOfCartData > 0 && (
            <View style={styles.cartDot} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => {
            if (!LoginManager.isLogin) {
              bridge.pushUrl('Login');
              return;
            }
            bridge.pushUrl('Service', JSON.stringify({productInfo}));
          }}>
          <Image
            style={{width: 20, height: 20, marginBottom: 4}}
            source={require('../../../../rawfile/dev/media/icon/cus_service.png')}
          />
          <Text style={{fontSize: 10, color: '#0000009f'}}>客服</Text>
        </TouchableOpacity>

        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={() => {
            setShowSelector(1);
          }}
          disabled={productInfo?.isOffTheShelf}
          activeOpacity={0.618}
          style={[
            styles.addToCartButton,
            productInfo?.isOffTheShelf ? {borderRadius: 16} : {},
          ]}>
          <Text
            style={{
              color: productInfo?.isOffTheShelf ? '#00000066' : THEME_COLOR,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {'加入购物车'}
          </Text>
        </TouchableOpacity>
        {!productInfo?.isOffTheShelf && (
          <TouchableOpacity
            activeOpacity={0.618}
            onPress={() => {
              setShowSelector(2);
            }}
            style={styles.buyNowButton}>
            <Text style={{color: '#ffffff', fontSize: 14, fontWeight: '500'}}>
              {'立即购买'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderShowShareModal() {
    let view = (
      <ShareView
        dismiss={() => {
          setShowShare(false);
        }}
        productInfo={productInfo}
        shareText={shareText}
        setNeedAutoCapture={(needAutoCapture: boolean) => {
          setNeedAutoCapture(needAutoCapture);
          setShowShare(false);
        }}
        setShowPoster={(showPoster: boolean) => {
          setShowPoster(showPoster);
          setShowShare(false);
        }}
      />
    );
    return showModal(
      view,
      showShare,
      () => {
        setShowShare(false);
      },
      {isFill: true, viewHeight: 233, expandHeight: 233, clickInnerClose: true},
    );
  }

  useEffect(() => {
    let onPageShow = DeviceEventEmitter.addListener('onPageShow', param => {
      if (param?.pageName === 'Detail') {
        getAllCartData();
      }
    });

    return () => {
      onPageShow.remove();
    };
  }, []);

  function renderSelectorModal() {
    let view = (
      <ProductSelector
        onSureCallback={(skuCode: string, count: number) => {
          if (!LoginManager.isLogin) {
            bridge.pushUrl('Login');
          } else {
            if (showSelector === 1) {
              addCartData(
                skuCode,
                count,
                productInfo.id,
                productInfo.price,
                productInfo.dashPrice,
              );
            } else if (showSelector === 2) {
              bridge.pushUrl(
                'Submit',
                JSON.stringify({
                  items: [
                    {
                      skuCode: skuCode,
                      count: count,
                      productId: productInfo.id,
                      price: productInfo.price,
                      dashPrice: productInfo.dashPrice,
                    },
                  ],
                }),
              );
            }
          }
        }}
        dismiss={() => {
          setShowSelector(0);
        }}
        productInfo={productInfo}
      />
    );
    return showModal(
      view,
      showSelector !== 0,
      () => {
        setShowSelector(0);
      },
      {
        isFill: true,
        viewHeight: 599,
        expandHeight: 599,
        clickInnerClose: true,
      },
    );
  }

  function captureAndSave(
    callBack?: (saveUri: string) => void,
    saveToAlbum: boolean = true,
  ) {
    captureRef(view).then(res => {
      if (saveToAlbum) {
        setTimeout(() => {
          setShowPoster(false);
        }, 500);
        bridge.saveImageToAlbum(res, (saveRes, saveUri) => {
          if (saveRes) {
            callBack && callBack(saveUri);
          }
        });
      } else {
        setTimeout(() => {
          setShowPoster(false);
          callBack && callBack(res);
        }, 500);
      }
    });
  }

  function onCaptureSaved(saveUri: string) {
    bridge.emitterEmit(
      'knockShare',
      JSON.stringify({
        fileUri: saveUri,
        title: productInfo.title,
      }),
    );
    setNeedAutoCapture(false);
    setShowPoster(false);
  }

  function renderPoster() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          backgroundColor: '#00000088',
        }}
        onPress={() => {
          setShowPoster(false);
        }}>
        <View
          style={{
            width: 280,
            height: 410,
          }}>
          <ViewShot
            ref={view}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: '100%',
              height: '100%',
              borderRadius: 10,
              backgroundColor: '#fff',
            }}>
            <Image
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 1,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
              source={ProductDetailApis.getPictureRes(
                productInfo.selectionInfo.defaultBanner,
              )}
            />
            <View
              style={{
                width: '100%',
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                backgroundColor: '#eee',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{fontSize: 14, color: '#222'}}
                onLayout={() => {
                  if (needAutoCapture) {
                    setTimeout(() => {
                      captureAndSave(saveUri => {
                        onCaptureSaved(saveUri);
                      }, false);
                    }, 500);
                  }
                }}>
                {productInfo.title}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 80,
                flexDirection: 'row',
                marginTop: 5,
                alignItems: 'center',
              }}>
              {!!shareText && (
                <RNFabricView
                  style={{
                    width: 60,
                    height: 60,
                    marginRight: 10,
                    backgroundColor: THEME_COLOR,
                  }}
                  src={JSON.stringify({
                    value:
                      'http://test/' + productInfo.id + '/' + productInfo.title,
                    color: '#000',
                    backgroundColor: '#fff',
                    nativeViewName: 'RNQrCode',
                    contentOpacity: 1,
                  })}
                  onReceiveData={recvData => {}}
                />
              )}
              <Text
                style={{fontSize: 14, flex: 1, color: '#888', marginLeft: 6}}>
                {'扫描二维码查看商品'}
              </Text>
            </View>
          </ViewShot>
          {!needAutoCapture && (
            <TouchableOpacity
              style={{
                borderRadius: 20,
                height: 36,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                position: 'absolute',
                right: 20,
                bottom: 6,
                justifyContent: 'center',
                backgroundColor: THEME_COLOR,
              }}
              onPress={() => {
                captureAndSave(() => {
                  Toast.show('海报保存成功，快去分享吧~');
                });
              }}>
              <Image
                style={{width: 18, height: 18, marginRight: 10}}
                source={require('../../../../rawfile/dev/media/icon/ic_download.svg')}
              />
              <Text style={{fontSize: 14, color: '#fff', marginLeft: -6}}>
                {'下载'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{width: '100%', height: '100%'}}>
      <View style={styles.content}>
        {renderTitle()}
        <ScrollView
          style={{width: '100%', flex: 1}}
          showsVerticalScrollIndicator={false}>
          {renderDetail()}
          {renderEvaluate()}
          {renderImageList()}
        </ScrollView>
        {productInfo?.isOffTheShelf && (
          <View
            style={{
              width: '100%',
              height: 38,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -38,
            }}>
            <RnFabricView
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              src={JSON.stringify({
                nativeViewName: 'RNBlurView',
                bgColor: '#B3000000',
              })}
              onReceiveData={recvData => {}}
            />
            <Text style={{color: '#fff', fontSize: 14}}>
              商品已经下架啦～要不要瞧瞧别的～
            </Text>
          </View>
        )}
        <View style={styles.shadowLine} />
        {!!productInfo && renderBottom()}
        {renderShowShareModal()}
        {renderSelectorModal()}
      </View>
      {showPoster && renderPoster()}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: TopReactHeight,
    paddingBottom: BottomReactHeight / 2,
    backgroundColor: '#FFFFFF',
  },
  decPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationColor: '#999',
    marginBottom: 3,
    textDecorationStyle: 'solid',
  },
  priceRoot: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    alignItems: 'flex-end',
  },
  priceLeft: {
    color: THEME_COLOR,
    fontSize: 12,
    marginBottom: 3,
  },
  price: {
    color: THEME_COLOR,
    fontSize: 22,
    marginLeft: -3,
    fontWeight: '500',
  },
  desRoot: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  desTitle: {
    fontSize: 12,
    color: '#999',
    marginRight: 3,
  },
  desContent: {
    height: 26,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  desItem: {
    fontSize: 12,
    color: '#777',
    marginLeft: 3,
  },
  topRoot: {
    width: '100%',
    alignItems: 'flex-start',
    paddingBottom: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  tagsRoot: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tagsText: {
    width: 'auto',
    fontSize: 10,
    color: THEME_COLOR,
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: THEME_COLOR,
    lineHeight: 12,
    paddingHorizontal: 1,
    textAlignVertical: 'center',
    marginRight: 6,
  },
  verLine: {
    marginHorizontal: 4,
    width: 1,
    height: 9,
    backgroundColor: THEME_COLOR,
  },
  horLine: {
    backgroundColor: BACKGROUND_COLOR,
    width: '100%',
    height: 12,
  },
  imageListTitle: {
    fontSize: 14,
    marginVertical: 12,
    paddingVertical: 5,
    marginLeft: 16,
    fontWeight: '500',
  },
  bottomRoot: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: THEME_COLOR,
    position: 'absolute',
    right: 12,
    top: 9,
  },
  serviceButton: {
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    width: 96,
    height: 32,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000000d',
  },
  buyNowButton: {
    width: 96,
    height: 32,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#eee',
    backgroundColor: THEME_COLOR,
    marginRight: 6,
  },
  shadowLine: {
    width: '100%',
    height: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
});

export default DetailPage;
