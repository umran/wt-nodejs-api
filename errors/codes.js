module.exports = {
  unknownError: {
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.'
  },
  missingActive: {
    short: 'Active is required',
    long: `Body must include "active"`
  },
  missingAmenity: {
    short: 'Amenity is required.',
    long: `Body must include "amenity"`
  },
  missingPassword: {
    short: 'Password is required',
    long: `Body must include "password"`
  },
  missingNewPassword: {
    short: 'A new password is required',
    long: `Body must include "newPassword"`
  },
  missingType: {
    short: 'Type is required.',
    long: `Body must include "type".`
  },
  missingUrl: {
    short: 'An url is required.',
    long: 'Body must include an "url" pointing to an hotel image.'
  },
  missingWallet: {
    short: 'Wallet is required.',
    long: 'Body must include "wallet". Also must be a valid V3 wallet.'
  },
  hotelManager: {
    short: 'Something went wrong with the hotel manager.',
    long: 'Hotel manager can not process the request. Please contact the administrator.'
  }
}
