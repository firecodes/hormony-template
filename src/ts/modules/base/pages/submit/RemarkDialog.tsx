import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
} from '../../utils/Constant';

const RemarkDialog = memo(
  ({
    userInputNote,
    onClose,
  }: {
    userInputNote: string;
    onClose?: (note: string) => void;
  }) => {
    const translateYAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [curNote, setCurNote] = useState(userInputNote);
    const [closed, setClosed] = useState(false);
    const [autoFocus, setAutoFocused] = useState(false);

    function mClose(note: string) {
      setClosed(true);
      animFunc(false);
      onClose &&
        setTimeout(() => {
          onClose?.(note);
        }, 290);
    }

    useEffect(() => {
      animFunc(true);
    }, []);

    function animFunc(open: boolean = true) {
      translateYAnim.setValue(open ? 0 : -290);
      opacityAnim.setValue(open ? 0 : 1);

      // 执行入场动画
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: open ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: open ? -290 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {});
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
            mClose(curNote);
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'flex-end',
            }}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  width: '100%',
                  height: 320,
                  backgroundColor: BACKGROUND_COLOR,
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  paddingHorizontal: 16,
                  marginBottom: -320,
                  transform: [
                    {translateY: translateYAnim}, // 绑定上下移动动画
                  ],
                }}>
                <View
                  style={{
                    width: '100%',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}>
                    <Text
                      style={{
                        height: 56,
                        fontSize: 18,
                        textAlignVertical: 'center',
                      }}>
                      订单备注
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: '#eaeaea',
                      }}
                      onPress={() => {
                        mClose(curNote);
                      }}>
                      <Image
                        source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
                        style={{width: 18, height: 18}}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setAutoFocused(true);
                    }}
                    style={{
                      minHeight: curNote.length >= 100 ? 125 : 127,
                      marginTop: 10,
                      padding: curNote.length >= 100 ? 15 : 16,
                      borderRadius: 12,
                      backgroundColor: '#FFF',
                      borderWidth: curNote.length >= 100 ? 1 : 0,
                      borderColor: THEME_COLOR,
                      alignItems: 'flex-start',
                      alignContent: 'flex-start',
                      justifyContent: 'flex-start',
                    }}>
                    <TextInput
                      style={{
                        fontSize: 14,
                        width: '100%',
                        minHeight: curNote.length >= 100 ? 90 : 91,
                        color: '#333',
                        textAlignVertical: 'top',
                      }}
                      focusable={!closed}
                      multiline={true}
                      maxLength={100}
                      cursorColor={THEME_COLOR}
                      placeholder={'选填，建议先与商家沟通后在填写'}
                      scrollEnabled={false}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                        mClose(curNote);
                      }}
                      placeholderTextColor={'#ccc'}
                      onChangeText={text => {
                        setCurNote(text);
                      }}>
                      {curNote}
                    </TextInput>
                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        fontSize: 10,
                        fontWeight: '400',
                        position: 'absolute',
                        bottom: curNote.length >= 100 ? 7 : 10,
                        right: curNote.length >= 100 ? 15 : 16,
                        color:
                          curNote.length >= 100 ? THEME_COLOR : '#00000066',
                      }}>
                      {curNote.length}/100
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: 46,
                      borderRadius: 23,
                      marginTop: 50,
                      marginBottom: 12 + BottomReactHeight,
                      backgroundColor: THEME_COLOR,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      mClose(curNote);
                    }}>
                    <Text style={{fontSize: 16, color: '#fff'}}>确定</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  },
);

const styles = StyleSheet.create({});

export default RemarkDialog;
