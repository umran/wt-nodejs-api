module.exports = {
  unknownError: {
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.'
  },
  missingPassword: {
    short: 'Password is required',
    long: `Body must include "password"`
  },
  missingNewPassword: {
    short: 'A new password is required',
    long: `Body must include "newPassword"`
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
