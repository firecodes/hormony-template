// /**
//  * 将秒数转换为"分:秒"格式的字符串（MM:SS）
//  * @param seconds 需要转换的总秒数
//  * @param padMinutes 是否在分钟数小于10时补充开头的0，默认为false
//  * @returns 返回格式为"MM:SS"或"M:SS"的时间字符串
//  * @example
//  * secondsToMMSS(65) // 返回 "1:05"
//  * secondsToMMSS(65, true) // 返回 "01:05"
//  */
// export const secondsToMMSS = (seconds: number, padMinutes: boolean = false) => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   const minutesStr = padMinutes ? minutes.toString().padStart(2, "0") : minutes.toString();
//   return `${minutesStr}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

/**
 * 将秒数转换为指定格式的时间字符串
 * @param seconds 需要转换的总秒数
 * @param format 时间格式，支持 "HHMMSS" | "HMMSS" | "MMSS" | "MSS"，默认为 "MSS"
 * @returns 根据格式返回对应的时间字符串
 * @example
 * secondsToTime(3665) // 返回 "1:05" (默认 MSS 格式)
 * secondsToTime(3665, "HHMMSS") // 返回 "01:01:05"
 * secondsToTime(3665, "HMMSS") // 返回 "1:01:05"
 * secondsToTime(3665, "MMSS") // 返回 "61:05"
 * secondsToTime(3665, "MSS") // 返回 "61:05"
 */
export const secondsToTime = (seconds: number, format: "HHMMSS" | "HMMSS" | "MMSS" | "MSS" = "MSS") => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 格式化秒数（始终补零）
  const secondsStr = remainingSeconds.toString().padStart(2, "0");

  switch (format) {
    case "HHMMSS": {
      // 时分秒都补零
      const hoursStr = hours.toString().padStart(2, "0");
      const minutesStr = minutes.toString().padStart(2, "0");
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
    case "HMMSS": {
      // 只有分补零
      const minutesStr = minutes.toString().padStart(2, "0");
      return `${hours}:${minutesStr}:${secondsStr}`;
    }
    case "MMSS": {
      // 总分钟数需补零
      const totalMinutes = hours * 60 + minutes;
      const minutesStr = totalMinutes.toString().padStart(2, "0");
      return `${minutesStr}:${secondsStr}`;
    }
    case "MSS":
    default: {
      // 总分钟数不补零
      const totalMinutes = hours * 60 + minutes;
      return `${totalMinutes}:${secondsStr}`;
    }
  }
};

/**
 * 获取指定时间的开始时间
 * @param date 日期对象或时间戳或日期字符串
 * @param unit 时间单位：'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
 * @returns Date 返回对应单位的开始时间
 * @example
 * // 获取某天的开始时间 (00:00:00.000)
 * startOf(new Date(), 'day')
 * // 获取某月的开始时间 (1号 00:00:00.000)
 * startOf(new Date(), 'month')
 * // 获取某年的开始时间 (1月1号 00:00:00.000)
 * startOf(new Date(), 'year')
 */
export function startOf(
  date: Date | number | string,
  unit: "year" | "month" | "day" | "hour" | "minute" | "second"
): Date {
  // 确保输入的是 Date 对象
  const d = new Date(date);

  switch (unit) {
    case "year":
      d.setMonth(0);
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;

    case "month":
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      break;

    case "day":
      d.setHours(0, 0, 0, 0);
      break;

    case "hour":
      d.setMinutes(0, 0, 0);
      break;

    case "minute":
      d.setSeconds(0, 0);
      break;

    case "second":
      d.setMilliseconds(0);
      break;

    default:
      throw new Error("Invalid unit");
  }

  return d;
}

/**
 * 获取指定时间的开始时间戳（毫秒）
 * @param date 日期对象或时间戳或日期字符串
 * @param unit 时间单位：'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
 * @returns number 返回对应单位的开始时间戳（毫秒）
 */
export function startOfTimestamp(
  date: Date | number | string,
  unit: "year" | "month" | "day" | "hour" | "minute" | "second"
): number {
  return startOf(date, unit).getTime();
}

/**
 * 获取指定时间的开始时间戳（秒）
 * @param date 日期对象或时间戳或日期字符串
 * @param unit 时间单位：'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
 * @returns number 返回对应单位的开始时间戳（秒）
 */
export function startOfUnixTimestamp(
  date: Date | number | string,
  unit: "year" | "month" | "day" | "hour" | "minute" | "second"
): number {
  return Math.floor(startOfTimestamp(date, unit) / 1000);
}

/**
 * 兼容iOS的日期格式化函数
 * @param date 日期字符串、Date对象或毫秒时间戳
 * @param format 输出格式，默认为 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date | number, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // 处理iOS兼容性问题，将空格替换为T
    const normalizedDate = date.replace(' ', 'T');
    dateObj = new Date(normalizedDate);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date:', date);
    return '';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 解析日期字符串，兼容iOS
 * @param dateString 日期字符串
 * @returns Date对象
 */
export function parseDate(dateString: string): Date {
  // 处理常见的日期格式
  if (dateString.includes(' ')) {
    // 将 "2025-07-24 17:50:00" 转换为 "2025-07-24T17:50:00"
    dateString = dateString.replace(' ', 'T');
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  
  return date;
}

/**
 * 检查日期字符串是否有效
 * @param dateString 日期字符串
 * @returns boolean
 */
export function isValidDate(dateString: string): boolean {
  try {
    parseDate(dateString);
    return true;
  } catch {
    return false;
  }
}
