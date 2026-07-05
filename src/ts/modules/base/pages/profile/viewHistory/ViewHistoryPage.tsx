import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {
  CommonTitle,
  formatCommonDate2,
  getPictureResource,
} from '../../../utils/CommonUtils';
import {useEffect, useState} from 'react';
import {ViewHistoryManager} from './ViewHistoryManager';
import {
  BACKGROUND_COLOR,
  BottomReactHeight,
  THEME_COLOR,
  TopReactHeight,
} from '../../../utils/Constant';
import bridge from '../../../utils/bridge';
import {ViewHistoryModel} from './model/ViewHistoryModel';
import SelectAllBtn from '../../cart/SelectAllBtn';
import CheckBox from '@react-native-community/checkbox';

function ViewHistoryPage(props) {
  const [history, setHistory] = useState<ViewHistoryModel[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selHistory, setSelHistory] = useState<ViewHistoryModel[]>([]);

  useEffect(() => {
    ViewHistoryManager.getInstance()
      .getViewHistory()
      .then(res => {
        setHistory(res);
      });
  }, []);

  const ManageButton = () => (
    <View>
      {history.length > 0 && (
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => {
            setIsEdit(!isEdit);
          }}>
          <Text style={{fontSize: 14, color: '#666'}}>
            {isEdit ? '退出管理' : '管理'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const BottomView = () => (
    <View>
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: BACKGROUND_COLOR,
        }}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#fff',
          height: 60 + BottomReactHeight,
          paddingBottom: BottomReactHeight,
        }}>
        <SelectAllBtn
          selectAll={
            selHistory.length !== 0 && selHistory.length === history.length
          }
          onSelectChange={curSelAll => {
            let productListTemp = history.filter(() => true);
            setSelHistory(curSelAll ? productListTemp : []);
          }}
        />
        <View
          style={{
            height: '100%',
            width: '70%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Text style={{fontSize: 12, color: '#959496', marginRight: 2}}>
            {'已选' + (selHistory?.length ?? 0) + '件'}
          </Text>
          <TouchableOpacity
            style={{
              width: 76,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
              borderRadius: 16,
              backgroundColor: THEME_COLOR,
            }}
            onPress={() => {
              let productListTemp = history.filter(
                item => !selHistory.includes(item),
              );
              setHistory(productListTemp);
              ViewHistoryManager.getInstance().updateHistory(productListTemp);
              setSelHistory([]);
              if (!productListTemp || productListTemp?.length === 0) {
                setIsEdit(false);
              }
            }}>
            <Text style={{fontSize: 14, color: '#fff', fontWeight: '500'}}>
              删除
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  function renderImage(item: ViewHistoryModel) {
    let source = getPictureResource(item.banners[0]);
    return (
      <Image
        source={source}
        style={{
          borderRadius: 12,
          width: 60,
          height: 60,
          objectFit: 'cover',
          marginRight: 12,
        }}
      />
    );
  }

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: ViewHistoryModel;
    index: number;
  }) => {
    let showTime =
      index === 0 ||
      formatCommonDate2(new Date(item.viewTime)) !==
        formatCommonDate2(new Date(history[index - 1].viewTime));
    return (
      <View style={{width: '100%'}}>
        <View>
          {showTime && item.viewTime && (
            <Text
              style={{
                marginLeft: 16,
                fontSize: 14,
                lineHeight: 20,
                includeFontPadding: true,
                marginBottom: 12,
                marginTop: 4,
              }}>
              {formatCommonDate2(new Date(item.viewTime))}
            </Text>
          )}
          <TouchableOpacity
            style={{
              marginBottom: 12,
              padding: 12,
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: '#fff',
              borderRadius: 12,
              marginHorizontal: 16,
              flex: 1,
            }}
            disabled={isEdit}
            onPress={() => {
              bridge.pushUrl('Detail', JSON.stringify(item));
            }}>
            {isEdit && (
              <CheckBox
                disabled={false}
                value={selHistory?.includes(item)}
                style={{width: 20, height: 20, marginRight: 12}}
                onCheckColor={THEME_COLOR}
                onChange={event => {
                  let curSelAll = event.nativeEvent.value;
                  if (curSelAll) {
                    setSelHistory(pre => [item, ...pre]);
                  } else {
                    setSelHistory(pre => pre.filter(it => it !== item));
                  }
                }}
              />
            )}
            {renderImage(item)}
            <View>
              <Text
                style={{
                  width: '65%',
                  fontSize: 14,
                  marginBottom: 8,
                  fontWeight: '500',
                  lineHeight: 18,
                  includeFontPadding: true,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    color: THEME_COLOR,
                    fontWeight: '500',
                    fontSize: 12,
                    paddingBottom: 1,
                  }}>
                  {'￥'}
                </Text>
                <Text
                  style={{
                    color: THEME_COLOR,
                    fontWeight: '500',
                    fontSize: 18,
                    marginLeft: -3,
                  }}>
                  {item.price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <Text style={{fontSize: 12, color: '#00000064'}}>{'暂无数据'}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: BACKGROUND_COLOR,
      }}>
      <View
        style={{
          width: '100%',
          flex: 1,
          paddingTop: TopReactHeight,
          paddingBottom: BottomReactHeight,
        }}>
        {CommonTitle('浏览记录', 'black', ManageButton)}
        <FlatList
          data={history} // 数据源
          renderItem={renderHistoryItem} // 渲染列表项
          keyExtractor={(item, index) => item + '_' + index} // 唯一标识
          style={{
            width: '100%',
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyData()}
        />
      </View>
      {isEdit && BottomView()}
    </View>
  );
}

export default ViewHistoryPage;
