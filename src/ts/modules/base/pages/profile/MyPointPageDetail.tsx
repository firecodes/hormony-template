import {FlatList, Text, View} from 'react-native';
import * as React from 'react';
import {useEffect} from 'react';
import {UserWidget} from './utils/UserWidget';
import {MyPointVM} from './vm/MyPointVM';
import {RecordPointChangeBean} from './bean/RecordPointChangeBean';
import bridge from '../../utils/bridge';
import {CommonTitle} from '../../utils/CommonUtils';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  TopReactHeight,
} from '../../utils/Constant';

function MyPointDetailPage(props) {
  let {getPointRecord} = MyPointVM();
  let [record, setRecord] = React.useState<RecordPointChangeBean[]>();

  function initData() {
    setRecord(getPointRecord());
  }

  useEffect(() => {
    initData();
    bridge.setStatusBarWhite(false);
    return () => {
      bridge.setStatusBarWhite(true);
    };
  }, []);

  function renderRecordItem(item: RecordPointChangeBean, index: number) {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 18,
          backgroundColor: '#fff',
          borderTopRightRadius: index === 0 ? 10 : 0,
          borderTopLeftRadius: index === 0 ? 10 : 0,
          borderBottomRightRadius: index === record?.length - 1 ? 10 : 0,
          borderBottomLeftRadius: index === record?.length - 1 ? 10 : 0,
          justifyContent: 'center',
          alignItems: 'center',
          height: 70,
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 14, color: '#000'}}>{item.action}</Text>
          <Text style={{fontSize: 12, color: '#00000066', marginTop: 5}}>
            {UserWidget.formatDate(new Date(item.time))}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: item.point > 0 ? '#E73317' : '#000',
            fontWeight: '500',
          }}>
          {(item.point > 0 ? '+' : '') + item.point}
        </Text>
      </View>
    );
  }

  function renderEmptyData() {
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 220,
        }}>
        {/*<Image*/}
        {/*  style={{width: 160, height: 160}}*/}
        {/*  source={require('../search/resource/ic_search_empty.svg')}*/}
        {/*/>*/}
        <Text style={{fontSize: 12, color: '#00000064'}}>{'暂无数据'}</Text>
      </View>
    );
  }

  function renderPage() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: TopReactHeight,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: BACKGROUND_COLOR,
          paddingHorizontal: 16,
          paddingBottom: BottomReactHeight,
        }}>
        {CommonTitle('积分明细', 'black', undefined, undefined, false)}
        <FlatList
          style={{flex: 1, width: '100%', height: '100%', marginTop: 12}}
          data={record}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyData()}
          renderItem={({item, index}) => renderRecordItem(item, index)}
        />
      </View>
    );
  }

  return renderPage();
}

export default MyPointDetailPage;
