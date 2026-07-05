import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {DialogTitle} from '../../utils/CommonUtils';
import React, {useEffect, useState} from 'react';
import {WindowInfo} from '../../utils/WindowInfo';
import {BACKGROUND_COLOR, THEME_COLOR} from '../../utils/Constant';

export function FilterDialog(props) {
  const {foldStatus} = WindowInfo();
  // '物流'
  const filterLogistics: string[] = [
    '包邮',
    '48小时内发货',
    '24小时内发货',
    '次日达',
  ];
  // '价格区间'
  const filterPrice: any[] = [
    ['100元以下', [0, 100]],
    ['100-200元', [100, 200]],
    ['200-300元', [200, 300]],
    ['300元以上', [300, Number.MAX_SAFE_INTEGER]],
  ];
  // '尺码'
  const filterSpec: string[] = ['160/80A', '165/84A', '170/88A'];

  const [selFilterLogistics, setSelFilterLogistics] = useState<string[]>();
  const [selFilterPrice, setSelFilterPrice] = useState<any[]>();
  const [selFilterSpec, setSelFilterSpec] = useState<string[]>();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [minFilterPrice, setMinFilterPrice] = useState<number>();
  const [maxFilterPrice, setMaxFilterPrice] = useState<number>();

  useEffect(() => {
    if (minFilterPrice || maxFilterPrice) {
      setSelFilterPrice([['自定义', [minFilterPrice, maxFilterPrice]]]);
    } else if (!minFilterPrice && !maxFilterPrice) {
      setSelFilterPrice(undefined);
    }
  }, [minFilterPrice, maxFilterPrice]);

  // 过滤非数字字符：只保留 0-9
  const getInputText = (text: string): number => {
    const pureNumber = text.replace(/[^0-9]/g, '');
    const trimmedNumber = pureNumber.replace(/^0+(?=\d)/g, '');
    return Number.parseInt(trimmedNumber);
  };

  const renderTitle = (title: string) => {
    return <Text style={styles.title}>{title}</Text>;
  };

  const renderFilterLogistics = () => {
    return (
      <View>
        {renderTitle('物流')}
        <View style={styles.content}>
          {filterLogistics.map((item: string, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContent}
                onPress={() => {
                  if (
                    selFilterLogistics &&
                    selFilterLogistics?.filter(
                      (item_, index_) => item_ === item,
                    ).length > 0
                  ) {
                    setSelFilterLogistics(
                      selFilterLogistics?.filter(
                        (item_, index_) => item_ !== item,
                      ),
                    );
                  } else {
                    if (!selFilterLogistics) {
                      setSelFilterLogistics([item]);
                    } else {
                      selFilterLogistics.push(item);
                      setSelFilterLogistics([...selFilterLogistics]);
                    }
                  }
                }}>
                <Text
                  style={[
                    styles.baseItem,
                    selFilterLogistics?.filter(
                      (item_, index_) => item_ === item,
                    ).length > 0
                      ? styles.itemSel
                      : styles.itemNotSel,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderFilterPrice = () => {
    return (
      <View>
        {renderTitle('价格区间')}
        <View style={styles.content}>
          {filterPrice.map((item: any[], index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.itemContent}
                onPress={() => {
                  setIsFocus(false);
                  if (
                    selFilterPrice &&
                    selFilterPrice?.filter(
                      (item_: any[], index_) => item_[0] === item[0],
                    ).length > 0
                  ) {
                    setSelFilterPrice(
                      selFilterPrice?.filter(
                        (item_: any[], index_) => item_[0] !== item[0],
                      ),
                    );
                  } else {
                    if (!selFilterPrice) {
                      setSelFilterPrice([item]);
                    } else {
                      selFilterPrice.push(item);
                      setSelFilterPrice([...selFilterPrice]);
                    }
                  }
                }}>
                <Text
                  style={[
                    styles.baseItem,
                    selFilterPrice?.filter(
                      (item_: any[], index_) => item_[0] === item[0],
                    ).length > 0
                      ? styles.itemSel
                      : styles.itemNotSel,
                    selFilterPrice?.length === 1 &&
                    selFilterPrice[0][0] === '自定义'
                      ? {color: '#00000066'}
                      : {},
                  ]}>
                  {item[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View
            style={{
              width: foldStatus === 1 ? '50%' : '66%',
              height: 36,
              borderRadius: 8,
              backgroundColor: BACKGROUND_COLOR,
              paddingHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginLeft: foldStatus === 1 ? 10 : 0,
            }}>
            <TextInput
              value={minFilterPrice ? String(minFilterPrice) : ''}
              style={{flex: 1, fontSize: 12}}
              placeholderTextColor={'#00000066'}
              placeholder={'自定义最低价'}
              autoFocus={false}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
                if (minFilterPrice > maxFilterPrice) {
                  setMinFilterPrice(maxFilterPrice);
                }
              }}
              onChangeText={text => {
                setMinFilterPrice(getInputText(text));
              }}
            />
            <View
              style={{
                width: 4,
                height: 1,
                borderRadius: 1,
                backgroundColor: '#00000066',
                marginHorizontal: 10,
              }}
            />
            <TextInput
              value={maxFilterPrice ? String(maxFilterPrice) : ''}
              style={{flex: 1, fontSize: 12, marginLeft: 2}}
              placeholderTextColor={'#00000066'}
              placeholder={'自定义最高价'}
              autoFocus={false}
              onFocus={() => {
                setIsFocus(true);
              }}
              onBlur={() => {
                setIsFocus(false);
                if (maxFilterPrice < minFilterPrice) {
                  setMaxFilterPrice(minFilterPrice);
                }
              }}
              onChangeText={text => {
                setMaxFilterPrice(getInputText(text));
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderFilterSpec = () => {
    return (
      <View>
        {renderTitle('尺码')}
        <View
          style={[
            styles.content,
            {justifyContent: 'flex-start', columnGap: 10},
          ]}>
          {filterSpec.map((item: string, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: 'auto',
                  height: 36,
                }}
                onPress={() => {
                  if (
                    selFilterSpec &&
                    selFilterSpec?.filter((item_, index_) => item_ === item)
                      .length > 0
                  ) {
                    setSelFilterSpec(
                      selFilterSpec?.filter((item_, index_) => item_ !== item),
                    );
                  } else {
                    if (!selFilterSpec) {
                      setSelFilterSpec([item]);
                    } else {
                      selFilterSpec.push(item);
                      setSelFilterSpec([...selFilterSpec]);
                    }
                  }
                }}>
                <Text
                  style={[
                    styles.baseItem,
                    {paddingHorizontal: 10, fontSize: 14, fontWeight: '500'},
                    selFilterSpec?.filter((item_, index_) => item_ === item)
                      .length > 0
                      ? styles.itemSel
                      : styles.itemNotSel,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={() => {}} disabled={true}>
      <View
        style={[
          styles.root,
          foldStatus !== 1 && isFocus ? {marginTop: -50} : {},
        ]}>
        {DialogTitle('全部筛选', true, () => {
          props?.onDismiss?.();
        })}
        {renderFilterLogistics()}
        {renderFilterPrice()}
        {renderFilterSpec()}
        <View style={{flex: 1}} />
        <View style={{width: '100%', flexDirection: 'row'}}>
          <TouchableOpacity
            style={[styles.sureButton, {backgroundColor: '#E8402622'}]}
            onPress={() => {
              setSelFilterPrice(undefined);
              setSelFilterLogistics(undefined);
              setSelFilterSpec(undefined);
              setMinFilterPrice(undefined);
              setMaxFilterPrice(undefined);
            }}>
            <Text style={{fontSize: 16, color: THEME_COLOR}}>清空筛选</Text>
          </TouchableOpacity>
          <View style={{width: 10, height: 12}} />
          <TouchableOpacity
            style={[styles.sureButton, {backgroundColor: THEME_COLOR}]}
            onPress={() => {
              if (selFilterPrice?.length > 1) {
                let selFilterPriceTemp = selFilterPrice.sort(
                  (a: [string, number[]], b: [string, number[]]) =>
                    a[1][0] - b[1][0],
                );
                let selFilterPriceNew: number[][] = [];
                let min = -1;
                selFilterPriceTemp.map((item: [string, number[]], index) => {
                  if (min === -1) {
                    min = item[1][0];
                  }
                  if (selFilterPriceTemp?.length > index + 1) {
                    if (item[1][1] !== selFilterPriceTemp[index + 1][1][0]) {
                      selFilterPriceNew.push([min, item[1][1]]);
                      min = -1;
                    }
                  } else {
                    selFilterPriceNew.push([min, item[1][1]]);
                  }
                });
                props.onSure?.([
                  selFilterLogistics,
                  selFilterPriceNew,
                  selFilterSpec,
                ]);
              } else {
                props.onSure?.([
                  selFilterLogistics,
                  selFilterPrice === undefined || selFilterPrice.length === 0
                    ? null
                    : [selFilterPrice[0][1]],
                  selFilterSpec,
                ]);
              }
            }}>
            <Text style={{fontSize: 16, color: '#fff'}}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#fff',
    padding: 16,
  },
  content: {
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
    rowGap: 10,
    marginTop: 8,
  },
  title: {
    lineHeight: 24,
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  baseItem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
  },
  itemContent: {
    width: '31.5%',
    maxWidth: 104,
    height: 36,
  },
  itemSel: {
    backgroundColor: '#E8402615',
    color: THEME_COLOR,
    fontWeight: '500',
  },
  itemNotSel: {
    backgroundColor: BACKGROUND_COLOR,
    color: '#000000',
  },
  sureButton: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
});
