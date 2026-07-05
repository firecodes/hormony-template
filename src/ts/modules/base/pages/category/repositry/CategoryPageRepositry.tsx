export class Collections {
  title: string;
  icon: string;
  tag: number;

  constructor(title: string, icon: string, tag: number) {
    this.title = title;
    this.icon = icon;
    this.tag = tag;
  }
}

const MOCK_COLLECTION_DATA: Collections[] = [
  new Collections('男士经典休闲短袖', 'mock2_spec_white', 0),
  new Collections('女士经典休闲短袖', 'mock_spec_white', 1),
  new Collections('男士经典舒适短袖', 'mock2_spec_pink', 0),
  new Collections('女士经典舒适短袖', 'mock_spec_pink', 1),
  new Collections('男士经典休闲衬衫', 'mock2_spec_green', 0),
  new Collections('女士经典休闲衬衫', 'mock_spec_green', 1),
  new Collections('男士经典商务衬衫', 'mock2_spec_stripe', 0),
  new Collections('女士经典商务衬衫', 'mock_spec_stripe', 1),
];

const MOCK_COLLECTION_DATA0: Collections[] = [
  new Collections('男士经典休闲短袖', 'mock2_spec_white', 0),
  new Collections('男士经典舒适短袖', 'mock2_spec_pink', 0),
  new Collections('男士经典休闲衬衫', 'mock2_spec_green', 0),
  new Collections('男士经典商务衬衫', 'mock2_spec_stripe', 0),
  new Collections('男士经典舒适短袖', 'mock2_spec_white', 0),
  new Collections('男士经典休闲短袖', 'mock2_spec_green', 0),
  new Collections('男士经典休闲衬衫', 'mock2_spec_stripe', 0),
  new Collections('男士经典商务衬衫', 'mock2_spec_pink', 0),
];

const MOCK_COLLECTION_DATA1: Collections[] = [
  new Collections('女士经典休闲短袖', 'mock_spec_green', 1),
  new Collections('女士经典舒适短袖', 'mock_spec_white', 1),
  new Collections('女士经典休闲衬衫', 'mock_spec_pink', 1),
  new Collections('女士经典商务衬衫', 'mock_spec_stripe', 1),
  new Collections('女士经典休闲短袖', 'mock_spec_white', 1),
  new Collections('女士经典休闲衬衫', 'mock_spec_pink', 1),
  new Collections('女士经典舒适短袖', 'mock_spec_stripe', 1),
  new Collections('女士经典商务衬衫', 'mock_spec_green', 1),
];

export interface ICategoryCollectionRepository {
  getCollectionList(pageNum: number, tag?: number): Promise<Collections[]>;
}

export class CategoryCollectionRepository
  implements ICategoryCollectionRepository
{
  async getCollectionList(
    pageNum: number,
    tag: number = -1,
  ): Promise<Collections[]> {
    return new Promise(resolve => {
      if (tag === -1) {
        resolve(MOCK_COLLECTION_DATA);
      } else if (tag === 0) {
        resolve(MOCK_COLLECTION_DATA0);
      } else if (tag === 1) {
        resolve(MOCK_COLLECTION_DATA1);
      } else {
        resolve([]);
      }
    });
  }
}
