const WALLET_PASSWORD_HEADER = 'X-Wallet-Password';
const WALLET_ID_HEADER = 'X-Wallet-Id';

const DEFAULT_FIELDS = ['id'];
const DESCRIPTION_FIELDS = [
  'name',
  'description',
  'location',
  'contacts',
  'address',
  'roomTypes',
  'timezone',
  'currency',
  'images',
  'amenities',
  'updatedAt',
];

const HOTEL_FIELDS = [
  'manager',
  'id',
];

module.exports = {
  WALLET_PASSWORD_HEADER,
  WALLET_ID_HEADER,
  DEFAULT_FIELDS,
  DESCRIPTION_FIELDS,
  HOTEL_FIELDS,
};
