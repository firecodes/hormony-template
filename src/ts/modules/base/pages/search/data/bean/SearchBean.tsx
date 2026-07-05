export interface HistorySearchItem {
  label: string;
  latestSearch: number; // 时间戳
}

export interface HotSearchItem {
  label: string;
  hotRate: number;
}

export class HistoryModel {
  list: HistorySearchItem[] = [];
}
