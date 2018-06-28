[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# WT NodeJS API
API written in nodejs to fetch information from  the Winding Tree platform.

## Requirements
- Nodejs 10.3.0

### Getting stared
In order to install and run test we must:
```
git clone git@github.com:windingtree/wt-nodejs-api.git
nvm install
npm install
npm test
```

### Running dev mode
With all the dependencies installed, you can start the dev server.
First step is start Ganache.
```bash
npm run dev-net
```

Ganache starts with 2 default accounts, one of them is an hotel manager with address `0x0ba3cd50b07ee204a47246b6b2f274fd41805c47`.
The id for this account is `9a4ce26b-80d7-4c71-8d5b-5518b75f7b55` and is stored
encrypted in `keys/9a4ce26b-80d7-4c71-8d5b-5518b75f7b55.enc`

Now we can run our dev server.
```bash
npm run dev
```
When `ETH_NETWORK=local` we run internally a script to deploy WT Index.

#### Using local swagger

To use Swagger pointing to localhost, you must update `docs/swagger.json`

```javascript
{
  "schemes": ["http"],
  "host": "localhost:3000"
}

```

## Examples
### Fetch hotels

Calling `GET /hotels` will retrieve an array of hotels. By default fields are `id`, `name`, and `location`.
If an error is produced for an hotel, the response will look as
```javascript
items: [
    ...
    { 
      id: '0x585c0771Fe960f99aBdba8dc77e5d31Be2Ada74d',
      error: 'Unsupported data storage type: ipfs' 
    },
    ...
]
```

You can use a query to specify the fields to include. Hotel Id is include by default in every request. Ex.  
`GET /hotels?fields=name`.

```javascript
items: [
    ...
    { 
      id: '0x585c0771Fe960f99aBdba8dc77e5d31Be2Ada74d',
      name: 'WT Hotel',
    },
    ...
]
```

### Fetch hotel

Request to `/hotels/:address` can fetch off-chain data in a single request. By default fields are `id`, `location`, 
`name`, `description`, `contacts`, `address`, `currency`, `images`, `amenities`, `updatedAt`.


```javascript
{ 
  id: '0x417C3DDae54aB2f5BCd8d5A1750487a1f765a94a',
  location: { latitude: 35.89421911, longitude: 139.94637467 },
  name: 'Winding Tree Hotel',
  description: 'string',
  contacts: 
   { 
    general: 
      { 
        email: 'joseph.urban@example.com',
        phone: 44123456789,
        url: 'string',
        ethereum: 'string',
        additionalContacts: [Array] 
      } 
    },
  address: 
   { 
     line1: 'string',
     line2: 'string',
     postalCode: 'string',
     city: {},
     state: 'string',
     country: 'string' 
   },
  currency: 'string',
  images: [ 'string' ],
  amenities: [ 'WiFi' ],
  updatedAt: '2018-06-19T13:19:58.190Z'
 }

```
