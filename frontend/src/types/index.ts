export interface UserInfo {
  id: number;
  username: string;
  phone: string;
  status: string;
  createdAt?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  originPlace: string;
  price: number;
  stock: number;
  sales: number;
  coverImage: string;
  featured: boolean;
  seasonal: boolean;
  description?: string;
  nutritionInfo?: string;
}

export interface ProductPage {
  records: ProductItem[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  coverImage: string;
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
}

export interface AddressItem {
  id: number;
  receiver: string;
  phone: string;
  province: string;
  city: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface OrderSummary {
  id: number;
  orderNo: string;
  totalAmount: number;
  payAmount: number;
  orderStatus: string;
  payStatus: string;
  createdAt: string;
  itemCount: number;
}

export interface FavoriteItem {
  favoriteId: number;
  productId: number;
  name: string;
  coverImage: string;
  price: number;
  status: string;
  createdAt: string;
}
