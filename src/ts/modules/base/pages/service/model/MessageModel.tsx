export class MessageModel {
  content: string | object; //文字的话是文本内容 图片的话是图片资源 订单的话就是订单号
  type: number; //0 文本，1 图片，2 订单
  createdTime: number; //时间戳
  isOwner: boolean; //是否是自己发送的消息
}
