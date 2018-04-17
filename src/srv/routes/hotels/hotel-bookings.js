
const express = require('express');
const hotelBookingRouter = express.Router();
const { loadAccount } = require('../../../helpers/crypto');
const { validatePassword,
  validateRequired,
  validateReservationId } = require('../../../helpers/validators');
const { handle } = require('../../../errors');
const { HotelManager, BookingData } = require('@windingtree/wt-js-libs');

const config = require('../../../config');

hotelBookingRouter.put('/hotels/:hotelAddress/confirmation',
  validatePassword, validateRequired, async (req, res, next) => {
    const { password, required } = req.body;
    const { hotelAddress } = req.params;
    let ownerAccount = {};
    try {
      let context = {
        indexAddress: config.get('indexAddress'),
        gasMargin: config.get('gasMargin'),
        web3provider: config.get('web3provider'),
      };
      ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
      context.owner = ownerAccount.address;
      const hotelManager = new HotelManager(context);
      config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
      const { logs } = await hotelManager.setRequireConfirmation(hotelAddress, !!required);
      config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
      res.status(200).json({
        txHash: logs[0].transactionHash,
      });
    } catch (err) {
      next(handle('web3', err));
    }
  });

hotelBookingRouter.get('/hotels/:hotelAddress/bookings', async (req, res, next) => {
  const { block } = req.body;
  const { hotelAddress } = req.params;
  try {
    const data = new BookingData({ web3provider: config.get('web3provider') });
    const bookings = await data.getBookings(hotelAddress, block);
    res.status(200).json({ bookings });
  } catch (err) {
    next(handle('web3', err));
  }
});

hotelBookingRouter.get('/hotels/:hotelAddress/requests',
  async (req, res, next) => {
    const { block } = req.body;
    const { hotelAddress } = req.params;
    try {
      const data = new BookingData({ web3provider: config.get('web3provider') });
      const requests = await data.getBookingRequests(hotelAddress, block);
      res.status(200).json({ requests });
    } catch (err) {
      next(handle('web3', err));
    }
  });

hotelBookingRouter.post('/hotels/:hotelAddress/confirmBooking',
  validatePassword, validateReservationId,
  async (req, res, next) => {
    const { password, reservationId } = req.body;
    const { hotelAddress } = req.params;
    let ownerAccount = {};
    try {
      let context = {
        indexAddress: config.get('indexAddress'),
        gasMargin: config.get('gasMargin'),
        web3provider: config.get('web3provider'),
      };
      ownerAccount = config.get('web3provider').web3.eth.accounts.decrypt(loadAccount(config.get('privateKeyDir')), password);
      context.owner = ownerAccount.address;
      const hotelManager = new HotelManager(context);
      config.get('web3provider').web3.eth.accounts.wallet.add(ownerAccount);
      const { logs } = await hotelManager.confirmBooking(hotelAddress, reservationId);
      config.get('web3provider').web3.eth.accounts.wallet.remove(ownerAccount);
      res.status(200).json({
        txHash: logs[0].transactionHash,
      });
    } catch (err) {
      next(handle('web3', err));
    }
  });

module.exports = {
  hotelBookingRouter,
};
