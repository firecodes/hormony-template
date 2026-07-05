import {Text, View} from 'react-native';
import * as React from 'react';
import {THEME_COLOR} from '../../../utils/Constant';

function RightText(props) {
  return (
    <View
      style={{
        maxWidth: '80%',
        minHeight: 43,
        paddingLeft: 14,
        paddingRight: 16,
        paddingVertical: 11,
        backgroundColor: THEME_COLOR,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'flex-end',
        marginBottom: 16,
        marginRight: 16,
        alignSelf: 'flex-end',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: 14,
          lineHeight: 21,
          includeFontPadding: true,
        }}>
        {props.data.content}
      </Text>
    </View>
  );
}

export default RightText;
