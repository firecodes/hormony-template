import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {UserWidget} from './utils/UserWidget';
import bridge from '../../utils/bridge';
import {THEME_COLOR} from '../../utils/Constant';
import {Toast} from '../../utils/ToastManager';

function FeedbackPage(props) {
  let [selectIndex, setSelectIndex] = useState(0);
  let [title, setTitle] = useState<string>('');
  let [problem, setProblem] = useState<string>('');
  let [detail, setDetail] = useState<string>('');

  let selectItems = ['我建议', '我想要'];

  function initData() {}

  useEffect(() => {
    initData();
  }, []);

  function renderPage() {
    let defStyle = StyleSheet.create({
      textInput: {
        width: '100%',
        color: '#282828',
        fontSize: 14,
        backgroundColor: 'white',
        borderRadius: 18,
        marginTop: 13,
      },
    });
    return (
      <View style={UserWidget.defStyle.defBack}>
        {UserWidget.renderDetailTitle('意见反馈')}

        <View style={{width: '100%', flexDirection: 'row'}}>
          {selectItems.map((item, index) => {
            return (
              <TouchableOpacity
                key={String(index)}
                style={{
                  height: 36,
                  borderRadius: 18,
                  paddingHorizontal: 23,
                  backgroundColor: index === selectIndex ? THEME_COLOR : '#fff',
                  alignItems: 'center',
                  marginRight: 8,
                  justifyContent: 'center',
                }}
                activeOpacity={1}
                onPress={() => setSelectIndex(index)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: index === selectIndex ? '#fff' : '#000',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            width: '100%',
            paddingHorizontal: 15,
            borderRadius: 6,
            height: 36,
            justifyContent: 'center',
            marginTop: 12,
            backgroundColor: '#F1E5E5',
          }}>
          <Text style={{fontSize: 12}}>
            {'如果你是设计师，你有何好主意呢?'}
          </Text>
        </View>

        <TextInput
          style={[defStyle.textInput, {height: 46, padding: 14}]}
          cursorColor={THEME_COLOR}
          placeholder={'此处添加简短标题'}
          placeholderTextColor={'#00000064'}
          returnKeyType="default"
          scrollEnabled={false}
          onChangeText={text => {
            setTitle(text);
          }}>
          {title}
        </TextInput>

        <View style={[defStyle.textInput, {height: 150, padding: 14}]}>
          <TextInput
            style={{
              color: '#282828',
              fontSize: 14,
              width: '100%',
              height: 110,
              textAlign: 'justify',
            }}
            cursorColor={THEME_COLOR}
            multiline={true}
            scrollEnabled={false}
            placeholder={'详细说说你遇到的问题'}
            placeholderTextColor={'#00000064'}
            maxLength={300}
            onChangeText={text => {
              setProblem(text);
            }}>
            {problem}
          </TextInput>
          <Text
            style={{
              right: 14,
              color: '#00000064',
              bottom: 14,
              position: 'absolute',
              fontSize: 11.5,
            }}>
            {problem.length + '/300'}
          </Text>
        </View>

        <View style={[defStyle.textInput, {height: 150, padding: 14}]}>
          <TextInput
            style={{
              color: '#282828',
              fontSize: 14,
              width: '100%',
              height: 110,
              textAlign: 'justify',
            }}
            maxLength={300}
            cursorColor={THEME_COLOR}
            multiline={true}
            scrollEnabled={false}
            placeholder={'详细说说你想法'}
            placeholderTextColor={'#00000064'}
            onChangeText={text => {
              setDetail(text);
            }}>
            {detail}
          </TextInput>
          <Text
            style={{
              right: 14,
              color: '#00000064',
              bottom: 14,
              position: 'absolute',
              fontSize: 11.5,
            }}>
            {detail.length + '/300'}
          </Text>
        </View>

        <View style={{width: '100%', marginTop: 30, flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flex: 1,
              height: 44,
              alignItems: 'center',
              backgroundColor: '#E5E5E5',
              justifyContent: 'center',
              borderRadius: 22,
            }}
            onPress={() => {
              bridge.back('');
            }}>
            <Text style={{fontSize: 16, color: '#222'}}>{'取消'}</Text>
          </TouchableOpacity>
          <View style={{width: 10}} />
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flex: 1,
              height: 44,
              alignItems: 'center',
              backgroundColor: THEME_COLOR,
              justifyContent: 'center',
              borderRadius: 22,
            }}
            onPress={() => {
              if (title.length <= 0) {
                Toast.show('请添加标题');
                return;
              }
              if (problem.length <= 0) {
                Toast.show('请详细说说你遇到的问题');
                return;
              }
              if (detail.length <= 0) {
                Toast.show('请详细说说你想法');
                return;
              }
              Toast.show('已发布');
              bridge.back('');
            }}>
            <Text style={{fontSize: 16, color: '#fff'}}>{'发布'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return renderPage();
}

export default FeedbackPage;
