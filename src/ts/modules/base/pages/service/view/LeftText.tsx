import {Text, View} from 'react-native';
import * as React from 'react';
import {THEME_COLOR} from '../../../utils/Constant';

function LeftText(props) {
  return (
    <View
      style={{
        maxWidth: '80%',
        minHeight: 43,
        paddingLeft: 14,
        paddingRight: 16,
        paddingVertical: 11,
        backgroundColor: '#FFF',
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginBottom: 16,
        marginLeft: 16,
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 14,
          lineHeight: 21,
          includeFontPadding: true,
        }}>
        {props.data.content}
      </Text>
    </View>
  );
}

export default LeftText;
