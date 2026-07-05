import {MessageContBean} from '../bean/MessageContBean';
import {formatCommonDate, unFormatDate} from '../../../utils/CommonUtils';

export const WeekDays = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

/**
 * 以今天为基准，生成往前 n 天的日期和星期（含今天）
 * @param days - 往前偏移的天数（默认 10 天，即生成今天+前9天，共10天）
 * @param dateFormat - 日期输出格式（默认 'YYYY/MM/DD'，可选 'YYYY-MM-DD'/'YYYY.MM.DD'）
 * @param lang - 星期语言（默认中文 'zh'，可选英文 'en'）
 * @returns 数组：[{ date: 日期字符串, weekday: 星期 }]
 */
function generatePastDatesWithWeekday(
  days: number = 4,
  dateFormat: 'YYYY/MM/DD' | 'YYYY-MM-DD' | 'YYYY.MM.DD' = 'YYYY/MM/DD',
  lang: 'zh' | 'en' = 'zh',
): Array<MessageContBean> {
  // 星期映射表（getDay() 返回 0=周日，1=周一...6=周六）
  const weekdayMaps = {
    zh: WeekDays,
    en: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  };

  // 日期分隔符（根据输出格式切换）
  const separatorMap = {
    'YYYY/MM/DD': '/',
    'YYYY-MM-DD': '-',
    'YYYY.MM.DD': '.',
  };
  const separator = separatorMap[dateFormat];

  const result: Array<any> = [];

  // 循环生成往前 days 天的日期（i=0 是今天，i=1 是昨天，以此类推）
  for (let i = 0; i < days; i += 1) {
    // 1. 获取当前日期，并向前偏移 i 天（毫秒数计算：1天 = 24*60*60*1000 ms）
    const today = new Date();
    const targetDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);

    // 2. 解析年、月、日（注意：月份从 0 开始，需 +1；日需补 0 到两位数）
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // 补 0 为 01-12
    const day = String(targetDate.getDate()).padStart(2, '0'); // 补 0 为 01-31

    // 3. 格式化日期字符串（按指定格式拼接）
    const formattedDate = `${year}${separator}${month}${separator}${day}`;

    // 4. 获取对应星期
    const weekdayIndex = targetDate.getDay();
    const weekday = weekdayMaps[lang][weekdayIndex];

    // 5. 存入结果数组
    result.push({
      date: formattedDate,
      diff: i,
      weekday,
      time:
        String((i + 1) % 24).padStart(2, '0') +
        ':' +
        String((i + 15) % 60).padStart(2, '0'),
    });
  }

  return result;
}

export function getItemTime(item: MessageContBean) {
  let strTime = '';
  let itemDays = unFormatDate(item.date + ' ' + item.time).getDay();
  let curDays = new Date().getDay();
  if (item.date === formatCommonDate(new Date(), 1)) {
    strTime = item.time;
  } else if (itemDays === curDays - 1) {
    strTime = '昨天 ' + item.time;
  } else if (itemDays > curDays - 7) {
    strTime = `${WeekDays[itemDays]} ${item.time}`;
  } else {
    strTime = item.date;
  }
  return strTime;
}

export class MyMessageVM {
  static TYPE_SHOP = 1;
  static TYPE_MESSAGE = 2;
  /**
   * 客服
   */
  static TYPE_CUSTOMER = 3;

  static TYPE_PUSH = 4;

  /**
   * 获取消息目录
   */
  getMessageCont(isDetail: boolean = false): any {
    const defaultResult = generatePastDatesWithWeekday();
    let res: MessageContBean[] = [];
    defaultResult.forEach((item, index) => {
      item.type = (index % 4) + 1;
      let desc = '';
      switch (item?.type) {
        case MyMessageVM.TYPE_SHOP:
          desc = '物流已签收，若有问题请联系客服';
          break;
        case MyMessageVM.TYPE_MESSAGE:
          desc = '您有100积分即将过期~';
          break;
        case MyMessageVM.TYPE_CUSTOMER:
          desc = !isDetail
            ? '客服给你发送了一条消息'
            : '恭喜您获得一张活动抵用券，可免费参与一次活动，有效期至2025年11月05日，快去参与活动吧！这是一段系统提示描述。';
          break;
        case MyMessageVM.TYPE_PUSH:
          desc = '写评论，最高可等1000积分';
          break;
        default:
          desc = '';
          break;
      }
      let msgCont = new MessageContBean();
      msgCont.date = item.date;
      msgCont.weekday = item.weekday;
      msgCont.diff = item.diff;
      msgCont.desc = desc;
      msgCont.type = item.type;
      msgCont.time = item.time;
      msgCont.detail = msgCont.desc;
      res.push(msgCont);
    });
    return res;
  }
}
