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
    this.#entryGates = null;
    this.#exitGates = null;
    this.#parkingFloors = null;
  }

  // Getters
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
}

module.exports = ParkingLot;
