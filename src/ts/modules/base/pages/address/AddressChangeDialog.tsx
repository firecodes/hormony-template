// 修改地址弹框
import React, {memo, useEffect, useRef, useState} from 'react';
import {AddressDTO, getFullAddress} from './model/AddressDTO';
import {
  Animated,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {CommonTitle} from '../../utils/CommonUtils';
import {addressInfoCard} from '../orderinfo/OrderInfoPage';
import {BottomReactHeight, DELIVERY_TYPE_EXPRESS} from '../../utils/Constant';
import bridge from '../../utils/bridge';

const AddressChangeDialog = memo(
  ({
    addressInfo,
    exeClosePayDetail,
    setExeClosePayDetail,
    onClose,
    onSubmit,
  }: {
    addressInfo: AddressDTO;
    exeClosePayDetail: boolean;
    setExeClosePayDetail: (exe: boolean) => void;
    onClose?: () => void;
    onSubmit?: (addressInfo: AddressDTO) => void;
  }) => {
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [newAddress, setNewAddress] = useState<AddressDTO>();

    function closeModel() {
      exeAnim(false);
      onClose &&
        setTimeout(() => {
          onClose?.();
          setExeClosePayDetail(false);
        }, 290);
    }

    useEffect(() => {
      exeAnim(true);
      let onAddressSelect = DeviceEventEmitter.addListener(
        'onAddressSelect',
        param => {
          if (param.address) {
            setNewAddress(JSON.parse(param.address));
          }
        },
      );
      return () => {
        onAddressSelect.remove();
      };
    }, []);

    useEffect(() => {
      exeClosePayDetail && closeModel();
    }, [exeClosePayDetail]);

    function exeAnim(open: boolean = true) {
      translateYAnim.setValue(open ? 0 : -450);
      opacityAnim.setValue(open ? 0 : 1);

      // 执行入场动画
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: open ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: open ? -450 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {});
    }

    function contentView() {
      return (
        <View style={styles.contentView}>
          <View>
            {CommonTitle('修改地址', 'black', null, () => {
              closeModel();
            })}
          </View>

          <View style={{flex: 1, paddingHorizontal: 16, paddingTop: 16}}>
            <Text style={{color: '#000000E6', fontSize: 18, marginBottom: 12}}>
              原地址
            </Text>
            {addressInfo &&
              addressInfoCard(DELIVERY_TYPE_EXPRESS, addressInfo, true)}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 25,
                marginBottom: 12,
              }}>
              <Text
                style={{color: '#000000E6', fontSize: 18, marginBottom: 12}}>
                新地址
              </Text>
              <TouchableOpacity
                style={styles.selButton}
                onPress={() => {
                  bridge.pushUrl('AddressListPage', '');
                }}>
                <Text style={{color: '#E84026', fontSize: 12}}>选择地址</Text>
              </TouchableOpacity>
            </View>
            {newAddress &&
              addressInfoCard(DELIVERY_TYPE_EXPRESS, newAddress, true)}
            <View style={{flex: 1}}></View>
            <TouchableOpacity
              style={[
                styles.sureButton,
                {backgroundColor: newAddress ? '#E84026' : '#E8402633'},
              ]}
              onPress={() => {
                onSubmit?.(newAddress);
              }}>
              <Text style={{color: '#fff', fontSize: 16}}>提交修改</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}>
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#00000066',
            position: 'absolute',
            opacity: opacityAnim,
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            closeModel();
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}>
            <Animated.View
              style={{
                width: '100%',
                height: 500,
                backgroundColor: '#fff',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                marginBottom: -500,
                paddingTop: 16,
                transform: [
                  {translateY: translateYAnim}, // 绑定上下移动动画
                ],
              }}>
              {contentView()}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  contentView: {
    width: '100%',
    height: '100%',
    paddingBottom: BottomReactHeight,
  },
  selButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: '#E84026',
  },
  sureButton: {
    width: '100%',
    height: 40,
    marginBottom: BottomReactHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default AddressChangeDialog;
