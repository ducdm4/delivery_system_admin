export const PER_PAGE_ITEM = 10;
export const imageType = ['image/png', 'image/jpg', 'image/jpeg'];

export const employeeRoleList = [
  { id: 2, name: 'Station Operator' },
  { id: 3, name: 'Collector' },
  { id: 4, name: 'Shipper' },
];

export const routeTypeList = [
  { id: 0, name: 'Pickup' },
  { id: 1, name: 'Delivery' },
];

export enum ROLE_LIST {
  ADMIN = 1,
  OPERATOR = 2,
  COLLECTOR = 3,
  SHIPPER = 4,
  CUSTOMER = 5,
}

export const STATION_TYPE = [
  { id: 0, name: 'Ward station' },
  { id: 1, name: 'District station' },
  { id: 2, name: 'City station' },
];

export enum ORDER_STATUS {
  ORDER_CREATED,
  WAITING_COLLECTOR_CONFIRM,
  WAITING_CUSTOMER_BRING_TO_STATION,
  COLLECTOR_ON_THE_WAY_TO_STATION,
  ORDER_READY_TO_SHIP,
  ORDER_ON_THE_WAY_TO_RECEIVER,
  ORDER_HAS_BEEN_SHIPPED,
  WAITING_COLLECTOR_TO_TRANSIT,
}

export const parcelWeightList = [
  {
    id: 0,
    name: '< 1kg',
  },
  {
    id: 1,
    name: '1kg < 2kg',
  },
  {
    id: 2,
    name: '2kg < 3kg',
  },
  {
    id: 3,
    name: '3kg < 4kg',
  },
  {
    id: 4,
    name: '4kg < 5kg',
  },
  {
    id: 5,
    name: '5kg < 6kg',
  },
  {
    id: 6,
    name: '6kg < 7kg',
  },
  {
    id: 7,
    name: '7kg < 8kg',
  },
  {
    id: 8,
    name: '8kg < 9kg',
  },
  {
    id: 9,
    name: '9kg < 10kg',
  },
];
