export interface ShippingZone {
  id: number;
  providerId: number;
  zoneName: string;
  baseRate: number;
  weightFactor: number;
  distanceFactor: number;
  deliveryDays: number;
  isActive: boolean;
}

export interface ShippingCalculation {
  productId: number;
  quantity: number;
  weight: number;
  fromAddress: Address;
  toAddress: Address;
  shippingZone: ShippingZone;
  baseShippingCost: number;
  weightCost: number;
  distanceCost: number;
  totalShippingCost: number;
  deliveryDays: number;
  estimatedDeliveryDate: Date;
}

export interface DeliveryOption {
  id: string;
  name: string;
  cost: number;
  days: number;
  description: string;
}

export enum DeliveryType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  SAME_DAY = 'same_day',
  WEEKEND = 'weekend'
}

export interface ShippingConfig {
  zones: ShippingZone[];
  weightFactors: WeightFactor[];
  deliveryTypes: DeliveryTypeConfig[];
}

export interface WeightFactor {
  minWeight: number;
  maxWeight: number;
  additionalCost: number;
}

export interface DeliveryTypeConfig {
  type: DeliveryType;
  name: string;
  costMultiplier: number;
  timeReduction: number;
  surcharge: number;
  availableAreas: number[];
}
