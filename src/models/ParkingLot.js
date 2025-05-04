const { uniqueId, filter, first } = require("lodash");
const ParkingFloor = require("./ParkingFloor");
const EntryGate = require("./EntryGate");
const ExitGate = require("./ExitGate");
const { validateValue } = require("../utils/common");

class ParkingLot {
  #id;
  #isOpen;
  #entryGates;
  #exitGates;
  #parkingFloors;

  constructor(isOpen = true) {
    this.#id = uniqueId("parking-lot-");
    this.#isOpen = isOpen;
    this.#entryGates = [];
    this.#exitGates = [];
    this.#parkingFloors = [];
  }

  // Getters
  getId = () => this.#id;
  getOpeningStatus = () => this.#isOpen;
  getEntryGates = () => this.#entryGates;
  getExitGates = () => this.#exitGates;
  getAllParkingFloors = () => this.#parkingFloors;
  getAllAvailableParkingFloors = () =>
    filter(
      this.#parkingFloors,
      (parkingFloor) => parkingFloor.getFloorAvailability().isAvailable
    );
  getAvailableParkingFloor = () => first(this.getAllAvailableParkingFloors());
  getAllAvailableEntryGates = () =>
    filter(this.#entryGates, (entryGate) => entryGate.isOperational());
  getAllAvailableExitGates = () =>
    filter(this.#exitGates, (exitGate) => exitGate.isOperational());
  getAvailableEntryGate = () => first(this.getAllAvailableEntryGates());
  getAvailableExitGate = () => first(this.getAllAvailableExitGates());

  assignParkingFloors = (parkingFloors) => {
    if (!validateValue(parkingFloors, ParkingFloor)) {
      throw new Error(`Can't assign invalid parking floors data!`);
    }
    this.#parkingFloors = parkingFloors;
  };
  
  assignEntryGates = (entryGates) => {
    if (!validateValue(entryGates, EntryGate))
      throw new Error(`Can't assign invalid entry point!`);
    this.#entryGates = entryGates;
  };
  
  assignExitGates = (exitGates) => {
    if (!validateValue(exitGates, ExitGate))
      throw new Error(`Can't assign invalid exit points!`);
    this.#exitGates = exitGates;
  };
  
  // Example methods for concurrent operations demo (simple Promise wrappers)
  parkVehicle(vehicle) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.#isOpen) {
          throw new Error('Parking lot is closed!');
        }
        
        const availableFloor = this.getAvailableParkingFloor();
        if (!availableFloor) {
          throw new Error('No parking floor available!');
        }
        
        const avlEntryGate = this.getAvailableEntryGate();
        if (!avlEntryGate) {
          throw new Error('No entry gate available!');
        }
        
        const ticket = avlEntryGate.registerVehicleEntry(vehicle, availableFloor);
        resolve(ticket);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  exitVehicle(ticket) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.#isOpen) {
          throw new Error('Parking lot is closed!');
        }
        
        const avlExitGate = this.getAvailableExitGate();
        if (!avlExitGate) {
          throw new Error('No exit gate available!');
        }
        
        const updatedTicket = avlExitGate.registerVehicleExit(ticket);
        resolve(updatedTicket);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ParkingLot;
