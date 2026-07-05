import {Text, View} from 'react-native';
import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {THEME_COLOR} from '../../utils/Constant';

const SelectAllBtn: React.FC<{
  selectAll: boolean;
  selCount?: number;
  onSelectChange: (select: boolean) => void;
}> = ({selectAll, selCount, onSelectChange}) => {
  return (
    <View
      style={{
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <CheckBox
        disabled={false}
        value={selectAll}
        style={{width: 20, height: 20, marginRight: 6}}
        onCheckColor={THEME_COLOR}
        onChange={event => {
          let curSelAll = event.nativeEvent.value;
          if (selectAll !== curSelAll) {
            onSelectChange(curSelAll);
          }
        }}
      />
      <Text style={{fontSize: 12, color: '#000000', opacity: 0.4}}>全选</Text>
      {selCount >= 0 && (
        <Text
          style={{fontSize: 12, color: '#000000', opacity: 0.4, marginLeft: 4}}>
          ({selCount})
        </Text>
      )}
    </View>
  );
};

export default React.memo(SelectAllBtn);
