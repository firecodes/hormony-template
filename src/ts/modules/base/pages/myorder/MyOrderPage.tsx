import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {BACKGROUND_COLOR, TopReactHeight} from '../../utils/Constant';
import {
  commonListFooter,
  CommonTitle,
  Loading,
  RenderCommonDialog,
  withDelay,
} from '../../utils/CommonUtils';
import HorizontalTabBar from '../../utils/HorizontalTabBar';
import {
  getDialogContent,
  isNeedDialog,
  MyOrderVM,
  ORDER_CHANGE_ADDRESS,
  ORDER_REQ_REFUND,
} from './viewmodel/MyOrderVM';
import {OrderItem} from './OrderItem';
import {OrderInfo} from '../orderinfo/model/OrderInfo';
import AddressChangeDialog from '../address/AddressChangeDialog';
import {showModal} from '../../utils/ModalUtils';
import OrderApi from './OrderApi';
import {OrderRefundDialog} from './OrderRefundDialog';

function MyOrderPage(props) {
  const {
    searchText,
    setSearchText,
    selTabIndex,
    setSelTabIndex,
    orderList,
    getOrderList,
    loadingMore,
    isLoading,
    pageNum,
    showDialog,
    setShowDialog,
    handleOrderClick,
    showAddressChange,
    setShowAddressChange,
    exeCloseAddressChange,
    setExeCloseAddressChange,
  } = MyOrderVM(props);

  const tabs = ['全部', '待付款', '待发货', '待收货', '待评价', '退款/售后'];

  function renderFooter() {
    return (
      <View style={{width: '100%'}}>
        {commonListFooter(loadingMore, orderList)}
      </View>
    );
  }

  function renderEmptyData() {
    return (
      <View style={{width: '100%', flex: 1}}>
        {!isLoading && !loadingMore && (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 170,
              paddingRight: 10,
            }}>
            <Image
              style={{width: 120, height: 120, marginBottom: 10}}
              source={require('../../../../rawfile/dev/media/icon/cartEmpty.png')}
            />
            <Text style={{fontSize: 14, color: '#282828'}}>{'暂无数据'}</Text>
          </View>
        )}
      </View>
    );
  }

  function renderDialog() {
    return RenderCommonDialog(
      showDialog !== undefined && isNeedDialog(showDialog.tag),
      () => {
        setShowDialog(undefined);
      },
      getDialogContent(showDialog?.tag),
      '取消',
      '确定',
      () => {
        setShowDialog(undefined);
      },
      () => {
        handleOrderClick();
      },
    );
  }

  function onOrderItemClickBtn(tag: number, orderInfo_: OrderInfo) {
    setShowDialog({tag: tag, orderInfo: orderInfo_});
    if (
      !isNeedDialog(tag) &&
      tag !== ORDER_CHANGE_ADDRESS &&
      tag !== ORDER_REQ_REFUND
    ) {
      handleOrderClick({tag: tag, orderInfo: orderInfo_});
    } else if (tag === ORDER_CHANGE_ADDRESS) {
      setShowAddressChange(true);
    }
  }

  function renderRefundModal() {
    let view = (
      <OrderRefundDialog
        onSureCallback={(skuCode: string, count: number) => {
          handleOrderClick(showDialog);
        }}
        onDismiss={() => {
          setShowDialog(undefined);
        }}
        orderInfo={showDialog?.orderInfo}
      />
    );
    return showModal(
      view,
      showDialog?.tag === ORDER_REQ_REFUND,
      () => {
        setShowDialog(undefined);
      },
      {
        isFill: true,
        viewHeight: 516,
        expandHeight: 516,
        clickInnerClose: true,
      },
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        paddingTop: TopReactHeight,
        backgroundColor: BACKGROUND_COLOR,
      }}>
      {CommonTitle('我的订单')}
      <View style={styles.searchView}>
        <View style={styles.searchInput}>
          <Image
            source={require('../../../../rawfile/dev/media/icon/ic_search.svg')}
            resizeMode={'contain'}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchText}
            autoFocus={false}
            onChangeText={text => {
              searchText !== text && setSearchText(text);
            }}
            style={styles.searchText}
            placeholder={'搜索订单'}
          />
          <TouchableOpacity
            style={{padding: 13, marginRight: 3}}
            onPress={() => {
              setSearchText('');
              Keyboard.dismiss();
            }}>
            {searchText?.length > 0 && (
              <Image
                source={require('../../../../rawfile/dev/media/icon/ic_close.svg')}
                style={{width: 14, height: 14}}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <HorizontalTabBar
        disable={isLoading}
        tabs={tabs}
        defaultActiveIndex={0}
        onChange={index => {
          withDelay(() => {
            setSelTabIndex(index);
          }).then();
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: BACKGROUND_COLOR,
          width: '100%',
          height: '100%',
        }}>
        <FlatList
          style={{
            width: '100%',
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
          data={orderList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.orderNo} // 唯一标识
          renderItem={({item, index}) =>
            OrderItem(item, index, onOrderItemClickBtn)
          }
          onEndReached={() => {
            if (!loadingMore && orderList?.length > 3) {
              getOrderList(pageNum);
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter()}
          ListEmptyComponent={renderEmptyData()}
        />
        {isLoading && Loading()}
        {renderDialog()}
      </View>
      {renderRefundModal()}
      {showAddressChange && (
        <AddressChangeDialog
          addressInfo={showDialog?.orderInfo?.addressInfo}
          exeClosePayDetail={exeCloseAddressChange}
          setExeClosePayDetail={setExeCloseAddressChange}
          onClose={() => {
            setShowAddressChange(false);
            setShowDialog(undefined);
          }}
          onSubmit={address => {
            if (showDialog?.orderInfo) {
              showDialog.orderInfo.addressInfo = address;
              setShowAddressChange(false);
              OrderApi.getInstance()
                .createOrUpdate(showDialog.orderInfo)
                .then(() => {
                  handleOrderClick({
                    tag: ORDER_CHANGE_ADDRESS,
                    orderInfo: showDialog.orderInfo,
                  });
                });
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchView: {
    height: 40,
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchInput: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000005',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginLeft: 12,
    marginRight: 6,
    opacity: 0.5,
  },
  searchText: {
    flex: 1,
    fontSize: 13,
    textAlignVertical: 'center',
    color: '#555555',
  },
});

export default MyOrderPage;
