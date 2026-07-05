import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';

function EvalLvView({
  title,
  onSetLv,
  showEvalText = true,
}: {
  title: string;
  onSetLv: (lv: number) => void;
  showEvalText?: boolean;
}) {
  const [lv, setLv] = useState(0);
  const tags = ['', '很差', '一般', '不错', '良好', '完美'];

  useEffect(() => {
    lv > 0 && onSetLv(lv);
  }, [lv]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 14, marginRight: 8}}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {[0, 1, 2, 3, 4].map((item, index) => {
            return (
              <TouchableWithoutFeedback
                key={String(index) + item}
                onPress={() => {
                  setLv(index + 1);
                }}>
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    objectFit: 'contain',
                    marginHorizontal: 2,
                    marginTop: -2,
                  }}
                  source={
                    index < lv
                      ? require('../../../../../rawfile/dev/media/icon/eval_light.png')
                      : require('../../../../../rawfile/dev/media/icon/eval_dark.png')
                  }
                />
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
      {showEvalText && (
        <Text style={{fontSize: 14, color: '#999'}}>{tags[lv]}</Text>
      )}
    </View>
  );
}

export default EvalLvView;
