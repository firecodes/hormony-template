import {useState} from 'react';
import {CartDto, ProductCardItem} from '../../search/data/mockData/MockData';
import CartDataApi from '../api/CartDataApi';
import bridge from '../../../utils/bridge';
import {CartPageRepository} from './CartPageRepository';
import {LoginManager} from '../../login/LoginManager';
import {Toast} from '../../../utils/ToastManager';

export function CartPageVM() {
  const repository: CartPageRepository = new CartPageRepository();
  const [productList, setProductList] = useState<ProductCardItem[]>([]);
  const [cartData, setCartData] = useState<CartDto[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selGoods, setSelGoods] = useState<CartDto[]>([]);
  const [isLogin, setIsLogin] = useState(LoginManager.isLogin);
  const [delCartData, setDelCartData] = useState<CartDto | undefined>(
    undefined,
  );
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const getProductList = (pageNum: number = 0) => {
    if (pageNum > 1) {
      //模拟总数只有2页
      return;
    }
    repository.getProductList(pageNum).then(res => {
      setProductList(prev => [...prev, ...res]);
    });
  };

  function getAllCartData() {
    CartDataApi.getInstance()
      .getAllCartData()
      .then(res => {
        setCartData(res);
      });
  }

  function deleteCartData(cartDto: CartDto) {
    CartDataApi.getInstance()
      .deleteCartData([cartDto])
      .then(() => {
        getAllCartData();
      });
  }

  function delAllCartData(delList: CartDto[]) {
    CartDataApi.getInstance()
      .deleteCartData(delList)
      .then(() => {
        getAllCartData();
      });
  }

  function changeData(cartDto: CartDto, preSkuCode: string, skuDesc: string) {
    CartDataApi.getInstance()
      .createOrUpdate(
        cartDto.skuCode,
        cartDto.count,
        cartDto.productId,
        cartDto.price,
        cartDto.dashPrice,
        skuDesc,
        preSkuCode,
        false,
      )
      .then(() => {
        getAllCartData();
      });
  }

  function addCartData(cartDto: CartDto) {
    if (cartDto.count >= cartDto.stock) {
      Toast.show('数量不能再增加了，超出库存限制！');
    } else {
      CartDataApi.getInstance()
        .createOrUpdate(
          cartDto.skuCode,
          1,
          cartDto.productId,
          cartDto.price,
          cartDto.dashPrice,
          '',
          '',
          false,
        )
        .then(() => {
          getAllCartData();
        });
    }
  }

  function minusCartData(cartDto: CartDto) {
    if (cartDto.count <= 1) {
      Toast.show('宝贝数量不能再减少了~');
    } else {
      CartDataApi.getInstance()
        .minusCartData(cartDto.skuCode, cartDto.productId)
        .then(() => {
          getAllCartData();
        });
    }
  }

  // 暴露状态和方法给组件
  return {
    productList,
    setProductList,
    getProductList,
    cartData,
    getAllCartData,
    deleteCartData,
    delAllCartData,
    addCartData,
    minusCartData,
    isEdit,
    setIsEdit,
    selGoods,
    setSelGoods,
    isLogin,
    setIsLogin,
    delCartData,
    setDelCartData,
    isDeleteAll,
    setIsDeleteAll,
    totalPrice,
    setTotalPrice,
    changeData,
  };
}
