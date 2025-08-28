export interface Address {
  id: number;
  street: string;
  ward: Ward;
  district: District;
  province: Province;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Province {
  id: number;
  code: string;
  name: string;
  type: 'Tỉnh' | 'Thành phố';
}

export interface District {
  id: number;
  provinceId: number;
  code: string;
  name: string;
  type: 'Quận' | 'Huyện';
}

export interface Ward {
  id: number;
  districtId: number;
  code: string;
  name: string;
  type: 'Phường' | 'Xã';
}

export interface ServiceArea {
  id: number;
  providerId: number;
  provinceId: number;
  districtId?: number;
  wardId?: number;
  shippingZoneId: number;
  deliveryFee: number;
  deliveryDays: number;
  isActive: boolean;
}

export interface AddressFormData {
  street: string;
  wardId: number;
  districtId: number;
  provinceId: number;
  postalCode: string;
}
