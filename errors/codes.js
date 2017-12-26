module.exports = {
  unknownError: {
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.'
  },
  missingAmenity: {
    short: 'Amenity is required.',
    long: `Body must include "amenity"`
  },
  missingDescription: {
    short: 'Description is required.',
    long: `Body must include "description".`
  },
  missingName: {
    short: 'Name is required.',
    long: `Body must include "name".`
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
  hotelManager: {
    short: 'Something went wrong with the hotel manager.',
    long: 'Hotel manager can not process the request. Please contact the administrator.'
  }
}
