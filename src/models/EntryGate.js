const { uniqueId } = require("lodash");
const { validateValue } = require("../utils/common");
const Vehicle = require("./Vehicle");
const Ticket = require("./Ticket");

class EntryGate {
  #id;
  #isOperational;
  
  constructor(isOperational = true) {
    this.#id = uniqueId("entry-gate-");
    this.#isOperational = isOperational;
  }

  // Getters
  getId = () => this.#id;
  getOperationalStatus = () => this.#isOperational;
  isOperational = () => this.#isOperational === true;
  
  // Setters
  setOperational = (status) => {
    this.#isOperational = status;
    return this;
  };

  #generateTicket = (vehicle, parkingFloor, parkingSpot) => {
    return new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingFloor(parkingFloor)
      .setParkingSpot(parkingSpot)
      .logEntryTime();
  };
  
  registerVehicleEntry = (vehicle, avlParkingFloor) => {
    if (!validateValue(vehicle, Vehicle))
      throw new Error("Parking not available for this type of vehicle!");
      
    // Get available spot that can accommodate this specific vehicle type
    const vehicleType = vehicle.getType();
    const avlParkingSpot = avlParkingFloor.getAvailableParkingSpot(vehicleType);
    
    if (!avlParkingSpot) {
      throw new Error(`No available parking spot for vehicle type: ${vehicleType}`);
    }
    
    avlParkingSpot.parkVehicle(vehicle);
    const parkingTicket = this.#generateTicket(vehicle, avlParkingFloor, avlParkingSpot);
    return parkingTicket;
  };
}

module.exports = EntryGate;