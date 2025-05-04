const { uniqueId, filter, first } = require("lodash");
const { validateValue } = require("../utils/common");
const ParkingSpot = require("./ParkingSpot");

class ParkingFloor {
  #id; #level; #isAvailable; #unAvailabilityReasons; #parkingSpots;

  constructor({ level, isAvailable = true, unAvailabilityReasons = null }) {
    this.#id = uniqueId('parking-floor-');
    this.#level = level;
    this.#isAvailable = isAvailable;
    this.#unAvailabilityReasons = unAvailabilityReasons;
    this.#parkingSpots = null;
  }

  // Getters
  getFloorLevel = () => this.#level;
  getFloorAvailability = () => {
    if (this.#isAvailable) return { isAvailable: true };
    return { isAvailable: false, reason: this.#unAvailabilityReasons }
  }
  getAllParkingSpots = () => this.#parkingSpots;
  getAllAvailableParkingSpots = () => filter(this.#parkingSpots, parkingSpot => !parkingSpot.isOccupied());
  getAvailableParkingSpot = () => first(this.getAllAvailableParkingSpots());

  assignParkingSpots = parkingSpots => {
    if (!validateValue(parkingSpots, ParkingSpot)) {
      throw new Error(`Can't assign invalid parking spots data!`)
    }
    this.#parkingSpots = parkingSpots;
  }
}

module.exports = ParkingFloor;