import {
  Animated,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {CommonTitle} from '../../utils/CommonUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../utils/Constant';
import {ServiceVM} from './viewmodel/ServiceVM';
import RightMessageView from './view/RightMessageView';
import LeftMessageView from './view/LeftMessageView';
import {MessageModel} from './model/MessageModel';
import TimeTipsView from './view/TimeTipsView';
import bridge from '../../utils/bridge';
import {useRef} from 'react';
import {showModal} from '../../utils/ModalUtils';
import {OrderSelectDialog} from './OrderSelectDialog';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import OrderApi from '../myorder/OrderApi';

function ServicePage(props) {
  const {
    isLoading,
    showMore,
    showMoreExtra,
    messageList,
    sendImageMessage,
    editText,
    setEditText,
    sendTextMessage,
    showOrderInfo,
    setShowOrderInfo,
    sendOrderMessage,
  } = ServiceVM(props);
  const waterfallRef = useRef<FlatList<MessageModel>>(null);

  function renderOrderSelectDialog() {
    let view = (
      <OrderSelectDialog
        onSureCallback={(orderInfo: OrderInfo) => {
          sendOrderMessage(orderInfo);
        }}
        dismiss={() => {
          setShowOrderInfo(false);
        }}
      />
    );
    return showModal(
      view,
      showOrderInfo,
      () => {
        setShowOrderInfo(false);
      },
      {
        isFill: true,
        viewHeight: 599,
        expandHeight: 599,
      },
    );
  }

  function renderItemView(
    item: MessageModel,
    index: number,
    needShowTime: boolean,
  ) {
    return (
      <View style={{marginTop: index === 0 ? 16 : 0}}>
        {needShowTime && <TimeTipsView item={item} />}
        {item.isOwner ? (
          <RightMessageView
            item={item}
            onImageClick={onImageClick}
            onOrderClick={onOrderClick}
          />
        ) : (
          <LeftMessageView
            item={item}
            onImageClick={onImageClick}
            onOrderClick={onOrderClick}
          />
        )}
      </View>
    );
  }

  function ExpandMoreView() {
    return (
      <View
        style={{
          width: '100%',
          height: 98,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            width: '50%',
            height: 74,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            bridge.selectPicture('', uri => {
              showMoreExtra(false);
              sendImageMessage(uri);
            });
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/select_image.png')}
            style={{width: 20, height: 20, marginBottom: 10}}
          />
          <Text style={{fontSize: 12}}>图片</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '50%',
            height: 74,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setShowOrderInfo(true);
            showMoreExtra(false);
          }}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/select_order.png')}
            style={{width: 20, height: 20, marginBottom: 10}}
          />
          <Text style={{fontSize: 12}}>订单</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function ServiceInputView() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          minHeight: 56,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            height: 40,
            paddingHorizontal: 16,
            backgroundColor: BACKGROUND_COLOR,
            borderRadius: 20,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextInput
            style={{
              width: '100%',
              textAlignVertical: 'center',
              includeFontPadding: false,
              marginBottom: 2,
              fontSize: 14,
            }}
            cursorColor={THEME_COLOR}
            onSubmitEditing={() => {
              sendTextMessage(editText);
            }}
            onChangeText={text => {
              setEditText(text);
            }}>
            {editText}
          </TextInput>
        </View>
        {editText.length === 0 ? (
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: BACKGROUND_COLOR,
              marginLeft: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              showMoreExtra(!showMore);
            }}>
            <Image
              source={require('../../../../rawfile/dev/media/icon/ic_plus.svg')}
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: THEME_COLOR,
              marginLeft: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              sendTextMessage(editText);
            }}>
            <Text style={{color: '#FFF', fontSize: 12}}>发送</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function onImageClick(uri: string) {
    bridge.pushUrl('LargeImage', JSON.stringify({uri: uri}));
  }

  async function onOrderClick(orderInfo: OrderInfo) {
    let newOrder = await OrderApi.getInstance().getOrderOfNo(orderInfo.orderNo);
    if (newOrder) {
      bridge.pushUrl('OrderInfo', JSON.stringify({param: newOrder}));
    }
  }

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    waterfallRef.current?.scrollToIndex({
      index: Math.min(info.highestMeasuredFrameIndex, info.index),
      animated: false,
    });
    setTimeout(() => {
      waterfallRef.current?.scrollToIndex({index: info.index, animated: true});
    }, 200);
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingTop: TopReactHeight,
          backgroundColor: BACKGROUND_COLOR,
        }}>
        {CommonTitle('客服')}
        <FlatList
          ref={waterfallRef}
          style={{flex: 1}}
          data={messageList}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          keyExtractor={(item, index) => item.createdTime + String(index)} // 唯一标识
          renderItem={({item, index}) => {
            let needShowTime =
              index === 0 ||
              item.createdTime - messageList[index - 1].createdTime > 50000;
            return renderItemView(item, index, needShowTime);
          }}
          onLayout={e => {
            setTimeout(() => {
              if (!waterfallRef.current || messageList.length === 0) {
                return;
              }
              waterfallRef.current.scrollToIndex({
                index: messageList.length - 1,
              });
            }, 100);
          }}
          onContentSizeChange={() => {
            setTimeout(() => {
              if (!waterfallRef.current || messageList.length === 0) {
                return;
              }
              waterfallRef.current.scrollToIndex({
                index: messageList.length - 1,
              });
            }, 100);
          }}
        />
        <View
          style={{
            width: '100%',
            backgroundColor: '#FFF',
            paddingBottom: BottomReactHeight,
          }}>
          {ServiceInputView()}
          {showMore && ExpandMoreView()}
        </View>
        {renderOrderSelectDialog()}
      </View>
    </View>
  );
}

export default ServicePage;
