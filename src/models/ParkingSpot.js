const { uniqueId } = require("lodash");
const Vehicle = require("./Vehicle");

class ParkingSpot {
  #id; #supportedVehicleType; #isOccupied; #vehicle;

  constructor(supportedVehicleType) {
    this.#id = uniqueId('parking-spot-');
    this.#supportedVehicleType = supportedVehicleType;
    this.#isOccupied = false;
    this.#vehicle = null;
  }
  
  // Getters
  getSpotId = () => this.#id;
  getSupportedVehicleType = () => this.#supportedVehicleType;
  getOccupancyStatus = () => this.#isOccupied;
  isOccupied = () => this.#isOccupied === true;
  getParkedVehicle = () => this.#vehicle;

  canAccommodate = vehicleType => this.#supportedVehicleType === vehicleType;

  parkVehicle = vehicle => {
    if (this.#isOccupied) 
      throw new Error('Parking spot already occupied!');
    if (!vehicle instanceof Vehicle) throw new Error('Invalid Vehicle!');
    this.#vehicle = vehicle;
    this.#isOccupied = true;
  }
  unparkVehicle = () => {
    if (!this.#isOccupied)
      throw new Error('Parking spot already empty!');
    this.#vehicle = null;
    this.#isOccupied = false;
  }
}

module.exports = ParkingSpot;