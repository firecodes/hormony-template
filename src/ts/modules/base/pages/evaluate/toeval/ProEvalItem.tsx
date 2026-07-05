import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CartDto} from '../../search/data/mockData/MockData';
import EvalLvView from './EvalLvView';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../../utils/Constant';
import {WindowInfo} from '../../../utils/WindowInfo';
import bridge from '../../../utils/bridge';
import {getPictureResource} from '../../../utils/CommonUtils';
import {ProductEvalItem} from '../model/EvaluateMockData';
import {LoginManager} from '../../login/LoginManager';

function ProEvalItem(props) {
  let cartDto: CartDto = props.item;
  let onProEvalChange: (proEval: ProductEvalItem) => void =
    props.onProEvalChange;
  const [evalContent, setEvalContent] = useState('');
  const [evalLv, setEvalLv] = useState(-1);
  const [evalImgList, setEvalImgList] = useState([]);
  const {foldStatus} = WindowInfo();
  const [columns, setColumns] = useState(foldStatus === 1 ? 6 : 3);
  const [imageParentW, setImageParentW] = useState(0);

  useEffect(() => {
    setColumns(foldStatus === 1 ? 6 : 3);
  }, [foldStatus]);

  useEffect(() => {
    console.log('LoginManager.loginData.userAvatar ' + LoginManager.loginData.userAvatar)
    onProEvalChange({
      productId: cartDto.productId,
      userAvatar: LoginManager.loginData.userAvatar ?? 'mock_spec_stripe',
      userName: LoginManager.getDestName(),
      rating: evalLv,
      content: evalContent,
      mediaList: evalImgList,
      skuCode: cartDto.skuCode,
      skuDesc: cartDto.skuDesc.includes(';')
        ? cartDto.skuDesc.split(';')
        : [cartDto.skuDesc],
      date: new Date().getTime(),
    });
  }, [evalContent, evalImgList, evalLv]);

  return (
    <View
      style={{
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingTop: 12,
        marginBottom: 12,
        overflow: 'visible',
      }}>
      <View style={{width: '100%', flexDirection: 'row', marginBottom: 14}}>
        <Image
          source={getPictureResource(cartDto.banner)}
          style={{width: 44, height: 44, borderRadius: 5, marginRight: 14}}
        />
        <View style={{flex: 1, height: 40, flexDirection: 'column'}}>
          <Text
            style={{
              width: '100%',
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 18,
              includeFontPadding: true,
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {cartDto?.title + cartDto?.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 4,
              lineHeight: 18,
              includeFontPadding: true,
              color: '#aaa',
            }}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {cartDto?.skuDesc}
          </Text>
        </View>
      </View>
      <EvalLvView
        onSetLv={(lv: number) => {
          setEvalLv(lv);
        }}
        title={'商品评价'}
        showEvalText={false}
      />
      <View
        style={{
          height: 120,
          backgroundColor: BACKGROUND_COLOR,
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 12,
          borderRadius: 12,
          borderColor: THEME_COLOR,
          alignItems: 'flex-start',
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <TextInput
          style={{
            fontSize: 14,
            width: '100%',
            height: '100%',
            padding: 0,
          }}
          multiline={true}
          maxLength={100}
          cursorColor={THEME_COLOR}
          placeholder={'请输入商品评价'}
          scrollEnabled={false}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          placeholderTextColor={'#ccc'}
          onChangeText={text => {
            setEvalContent(text);
          }}>
          {evalContent}
        </TextInput>
        <Text
          style={{
            width: '100%',
            textAlign: 'right',
            fontSize: 10,
            fontWeight: '400',
            position: 'absolute',
            bottom: evalContent.length >= 100 ? 7 : 10,
            right: evalContent.length >= 100 ? 15 : 16,
            color: evalContent.length >= 100 ? THEME_COLOR : '#00000066',
          }}>
          {evalContent.length}/100
        </Text>
      </View>
      <FlatList
        data={
          evalImgList?.length >= 6 ? evalImgList : [...evalImgList, undefined]
        } // 数据源
        renderItem={({item, index}) => {
          return item ? (
            <View style={{overflow: 'visible'}} key={String(index)}>
              <Image
                source={{uri: item}}
                style={{
                  width: (imageParentW - (columns - 1) * 10) / columns,
                  height: (imageParentW - (columns - 1) * 10) / columns,
                  aspectRatio: 1,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginLeft: index % columns !== 0 ? 10 : 0,
                  marginBottom: 12,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                }}
                onPress={() => {
                  setEvalImgList([
                    ...evalImgList.filter((i, index_) => index !== index_),
                  ]);
                }}
                activeOpacity={1}>
                <Image
                  source={require('../../../../../rawfile/dev/media/icon/del_img.png')}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              key={String(index)}
              activeOpacity={1}
              onPress={() => {
                bridge.selectPicture('', uri => {
                  setEvalImgList(prevState => [...prevState, uri]);
                });
              }}
              style={{
                width: (imageParentW - (columns - 1) * 10) / columns,
                height: (imageParentW - (columns - 1) * 10) / columns,
                aspectRatio: 1,
                borderRadius: 12,
                overflow: 'hidden',
                marginLeft: index % columns !== 0 ? 10 : 0,
                marginBottom: 12,
                backgroundColor: BACKGROUND_COLOR,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../../../rawfile/dev/media/icon/ic_plus.svg')}
                style={{
                  width: 24,
                  height: 24,
                  opacity: 0.3,
                }}
              />
            </TouchableOpacity>
          );
        }} // 渲染列表项
        numColumns={columns}
        key={columns}
        scrollEnabled={false}
        style={{
          columnGap: 10,
          marginTop: 12,
          width: '100%',
          overflow: 'visible',
        }}
        keyExtractor={(item, index) => item + '_' + index} // 唯一标识
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onLayout={event => {
          event.nativeEvent.layout.width !== imageParentW &&
            setImageParentW(event.nativeEvent.layout.width);
        }}
      />
    </View>
  );
}

export default ProEvalItem;
