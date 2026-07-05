import {StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import {formatChatTime} from '../../../utils/CommonUtils';

function TimeTipsView(props) {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>{formatChatTime(props.item.createdTime)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: 17,
    marginBottom: 16,
    marginTop: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    includeFontPadding: true,
    color: '#999393',
  },
});

export default TimeTipsView;
