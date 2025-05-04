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

  getOperationalStatus = () => this.#isOperational;
  isOperational = () => this.#isOperational === true;

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
    const avlParkingSpot = avlParkingFloor.getAvailableParkingSpot();
    if (!avlParkingSpot) throw new Error("Parking spot not available!");
    avlParkingSpot.parkVehicle(vehicle);
    const parkingTicket = this.#generateTicket(vehicle, avlParkingFloor, avlParkingSpot);
    return parkingTicket;
  };
}

module.exports = EntryGate;