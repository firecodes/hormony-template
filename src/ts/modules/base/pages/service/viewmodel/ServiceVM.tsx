import {useEffect, useState} from 'react';
import {MessageModel} from '../model/MessageModel';
import {WindowInfo} from '../../../utils/WindowInfo';
import {Keyboard} from 'react-native';
import {OrderInfo} from '../../orderinfo/model/OrderInfo';
import bridge from '../../../utils/bridge';

const MOCK_MESSAGE_LIST: MessageModel[] = [
  {
    type: 0,
    isOwner: false,
    content: '您好，有什么问题可以咨询我哦～',
    createdTime: new Date('2024-12-19 16:30').getTime(),
  },
  {
    type: 0,
    isOwner: true,
    content: '卖家不发货，我要催发货',
    createdTime: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    type: 2,
    isOwner: true,
    content:
      '{"skuInfo":[{"skuCode":"sku_100001","skuDesc":"粉色;160/80A","banner":"mock_spec_pink","productId":"product_10001","isSelected":false,"stock":10,"dashPrice":"200","title":"女士时尚1轻商务系列针织打底纯羊毛内搭","serviceDesc":"运费险｜7天无理由","price":"150","count":1}],"status":0,"addressInfo":{"countryCode":"CN","updatedAt":1768878676246,"name":"张三","province":"江苏","district":"雨花台区","phone":"123****6789","country":"中国","createdAt":1768878676246,"city":"南京市","id":"3083144e-75b0-429b-bb3b-120b01a4f7bb","street":"**街道","detail":"**大道***号","isDefault":true},"receivingMethod":"exp press","orderNo":"mock_order_1768878987592","orderTime":1768878987592,"discounts":15,"remainingTime":1768965387592,"remark":"","originalPrice":150,"finalPrice":135}',
    createdTime: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    type: 1,
    isOwner: true,
    content: 'mock_homepage_banner4',
    createdTime: new Date().getTime() - 23 * 60 * 60 * 1000,
  },
  {
    type: 2,
    isOwner: false,
    content:
      '{"skuInfo":[{"skuCode":"sku_100001","skuDesc":"粉色;160/80A","banner":"mock_spec_pink","productId":"product_10001","isSelected":false,"stock":10,"dashPrice":"200","title":"女士时尚1轻商务系列针织打底纯羊毛内搭","serviceDesc":"运费险｜7天无理由","price":"150","count":1}],"status":0,"addressInfo":{"countryCode":"CN","updatedAt":1768878676246,"name":"张三","province":"江苏","district":"雨花台区","phone":"123****6789","country":"中国","createdAt":1768878676246,"city":"南京市","id":"3083144e-75b0-429b-bb3b-120b01a4f7bb","street":"**街道","detail":"**大道***号","isDefault":true},"receivingMethod":"exp press","orderNo":"mock_order_1768878987592","orderTime":1768878987592,"discounts":15,"remainingTime":1768965387592,"remark":"","originalPrice":150,"finalPrice":135}',
    createdTime: new Date().getTime(),
  },
  {
    type: 1,
    isOwner: false,
    content: 'mock_homepage_banner4',
    createdTime: new Date().getTime(),
  },
  {
    type: 0,
    isOwner: false,
    content: '您好，请问收到货了吗?',
    createdTime: new Date().getTime() + 10 * 60 * 1000,
  },
  {
    type: 0,
    isOwner: true,
    content: '没有呀，不是还没发货',
    createdTime: new Date().getTime() + 20 * 60 * 1000,
  },
];

export const PREFERENCE_KEY_SERVICE_MSG = 'service_message_list';

export function ServiceVM(props) {
  const [editText, setEditText] = useState('');
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageList, setMessageList] = useState<MessageModel[]>([]);

  useEffect(() => {
    getAllMessageList();
  }, []);

  useEffect(() => {
    !isLoading && saveMessageList();
  }, [messageList, isLoading]);

  function showMoreExtra(show: boolean) {
    setShowMore(show);
    Keyboard.dismiss();
  }

  function getAllMessageList() {
    bridge.getOhPrefData(res => {
      if (res) {
        try {
          let msgList = JSON.parse(res.toString()) as MessageModel[];
          setMessageList(msgList);
        } catch (e) {
          setMessageList(MOCK_MESSAGE_LIST);
        }
      } else {
        setMessageList(MOCK_MESSAGE_LIST);
      }
      setIsLoading(false);
    }, PREFERENCE_KEY_SERVICE_MSG);
  }

  function saveMessageList() {
    bridge.setOhPrefData(
      PREFERENCE_KEY_SERVICE_MSG,
      JSON.stringify(messageList),
    );
  }

  function sendImageMessage(uri: string) {
    setMessageList(prevState => [
      ...prevState,
      {
        type: 1,
        isOwner: true,
        content: uri,
        createdTime: new Date().getTime(),
      },
    ]);
    setTimeout(() => {
      setMessageList(prevState => [
        ...prevState,
        {
          type: 0,
          isOwner: false,
          content: '您好，有什么问题要咨询呢？',
          createdTime: new Date().getTime(),
        },
      ]);
    }, 1000);
  }

  function sendTextMessage(text: string) {
    if (text.length > 0) {
      setMessageList(prevState => [
        ...prevState,
        {
          type: 0,
          isOwner: true,
          content: text,
          createdTime: new Date().getTime(),
        },
      ]);

      setTimeout(() => {
        setMessageList(prevState => [
          ...prevState,
          {
            type: 0,
            isOwner: false,
            content: '请您发送遇到问题的订单，我可以更快为您解答哦',
            createdTime: new Date().getTime(),
          },
        ]);
      }, 1000);
    }
    setEditText('');
    setShowMore(false);
  }

  function sendOrderMessage(orderInfo: OrderInfo) {
    setMessageList(prevState => [
      ...prevState,
      {
        type: 2,
        isOwner: true,
        content: JSON.stringify(orderInfo),
        createdTime: new Date().getTime(),
      },
    ]);
    setTimeout(() => {
      setMessageList(prevState => [
        ...prevState,
        {
          type: 0,
          isOwner: false,
          content: '订单数据收到了，这边马上为您处理，请您耐心等待...',
          createdTime: new Date().getTime(),
        },
      ]);
    }, 1000);
  }

  return {
    isLoading,
    showMore,
    showMoreExtra,
    messageList,
    sendImageMessage,
    editText,
    setEditText,
    sendTextMessage,
    showOrderInfo,
    setShowOrderInfo,
    sendOrderMessage,
  };
}
