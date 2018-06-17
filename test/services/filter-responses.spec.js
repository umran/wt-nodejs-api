const { expect } = require('chai');
const {
  excludeFields,
  includeFields,
} = require('../../src/services/filter-responses');

const hotel = {
  name: 'The Andrews hotel',
  description: 'Magic place',
  rooms: 42,
};
const fields = ['name', 'description'];

describe('filter-responses.js', () => {
  describe('includeFields', () => {
    it('should include fields', async () => {
      const filteredHotel = await includeFields(hotel, fields);
      expect(filteredHotel).to.have.property('name', hotel.name);
      expect(filteredHotel).to.have.property('description', hotel.description);
      expect(filteredHotel).to.not.have.property('rooms');
    });
    it('should not include undefined fields', async () => {
      const filteredHotel = await includeFields(hotel, ['price']);
      expect(filteredHotel).to.not.have.property('price');
    });
  });
  describe('excludeFields', () => {
    it('should exclude fields', async () => {
      const filteredHotel = await excludeFields(hotel, ['description']);
      expect(filteredHotel).to.not.have.property('description');
    });
    it('should exclude undefined fields', async () => {
      const filteredHotel = await excludeFields(hotel, ['price']);
      expect(filteredHotel).to.not.have.property('price');
    });
  });
});
