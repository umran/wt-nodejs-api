module.exports = {
  unknownError: {
    status: 500,
    short: 'Something went wrong.',
    long: 'Something went wrong. Please contact the administrator.',
  },
  missingName: {
    status: 400,
    short: 'Name is required.',
    long: 'Body must include "name".',
  },
  missingDescription: {
    status: 400,
    short: 'Description is required.',
    long: 'Body must include "description".',
  },
  missingLatitude: {
    status: 400,
    short: 'Latitude one is required.',
    long: 'Body must include "latitude".',
  },
  missingLongitude: {
    status: 400,
    short: 'Lonngitude one is required.',
    long: 'Body must include "longitude".',
  },
  missingPassword: {
    status: 401,
    short: 'Password is required',
    long: 'Body must include "password"',
  },
  whiteList: {
    status: 403,
    short: 'IP is not whitelisted.',
    long: 'IP must be in the whitelist. Please contact the administrator.',
  },
};
