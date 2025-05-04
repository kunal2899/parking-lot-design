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
    this.#parkingSpots = [];
  }

  // Getters
  getId = () => this.#id;
  getFloorLevel = () => this.#level;
  getFloorAvailability = () => {
    if (this.#isAvailable) return { isAvailable: true };
    return { isAvailable: false, reason: this.#unAvailabilityReasons }
  }
  getAllParkingSpots = () => this.#parkingSpots;
  
  // Get all available parking spots (optionally filtered by vehicle type)
  getAllAvailableParkingSpots = (vehicleType = null) => {
    return filter(this.#parkingSpots, parkingSpot => {
      // Check both occupancy AND vehicle type compatibility if specified
      return !parkingSpot.isOccupied() && 
        (vehicleType === null || parkingSpot.canAccommodate(vehicleType));
    });
  };
  
  // Get first available parking spot for a specific vehicle type
  getAvailableParkingSpot = (vehicleType = null) => {
    return first(this.getAllAvailableParkingSpots(vehicleType));
  };

  // Get count of available spots by vehicle type
  getAvailableSpotsCount = (vehicleType = null) => {
    return this.getAllAvailableParkingSpots(vehicleType).length;
  };

  assignParkingSpots = parkingSpots => {
    if (!validateValue(parkingSpots, ParkingSpot)) {
      throw new Error(`Can't assign invalid parking spots data!`)
    }
    this.#parkingSpots = parkingSpots;
  }
}

module.exports = ParkingFloor;