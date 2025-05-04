const { uniqueId } = require("lodash");

class Ticket {
   #id; #price; #parkingSpotLabel; #vehicle; #entryTime; #exitTime; #isPaid; #parkingSpot; #parkingFloor;

  constructor() {
    this.#id = uniqueId('ticket-');
    this.#price = null;
    this.#parkingSpotLabel = null;
    this.#vehicle = null;
    this.#entryTime = null;
    this.#exitTime = null;
    this.#isPaid = false;
    this.#parkingSpot = null;
    this.#parkingFloor = null;
    return this;
  }

  // Getters
  getId = () => this.#id;
  getPrice = () => this.#price;
  getParkingSpotLabel = () => this.#parkingSpotLabel;
  getEntryTime = () => this.#entryTime;
  getExitTime = () => this.#exitTime;
  getVehicleDetails = () => this.#vehicle;
  getIsPaid = () => this.#isPaid;
  getParkingSpot = () => this.#parkingSpot;
  getParkingFloor = () => this.#parkingFloor;
  
  // Setters
  setPrice = (price) => {
    this.#price = price;
    return this;
  };

  setVehicleDetails = vehicle => {
    this.#vehicle = vehicle;
    return this;
  }

  setPaidStatus = (isPaid = true) => {
    this.#isPaid = isPaid;
    return this;
  }

  setParkingSpot = (parkingSpot) => {
    this.#parkingSpot = parkingSpot;
    return this;
  }

  setParkingFloor = (parkingFloor) => {
    this.#parkingFloor = parkingFloor;
    return this;
  }

  #setParkingSpotLabel = () => {
    const floorLevel = this.#parkingFloor.getFloorLevel();
    const spotId = this.#parkingSpot.getSpotId();
    const floorLabel = String.fromCharCode(64 + floorLevel);
    const spotNumber = Number(String(spotId).split('parking-spot-')[1]);
    this.#parkingSpotLabel = `${floorLabel}${spotNumber}`;
    return this;
  };

  logEntryTime = (time = new Date()) => {
    this.#entryTime = time;
    this.#setParkingSpotLabel();
    return this;
  };

  logExitTime = (time = new Date()) => {
    this.#exitTime = time;
    return this;
  };

  printTicket = () => {
    console.log('--------------------------------');
    console.log(`* Ticket ID: ${this.#id}`);
    console.log(`* Parking Spot: ${this.#parkingSpotLabel}`);
    console.log(`* Parking Floor: ${this.#parkingFloor.getFloorLevel()}`);
    console.log(`* Vehicle Details:\n${this.#vehicle.toString()}`);
    console.log(`* Entry Time: ${this.#entryTime}`);
    if (this.#exitTime) console.log(`* Exit Time: ${this.#exitTime}`);
    if (this.#price) console.log(`* Price: ${this.#price}`);
    console.log('--------------------------------\n');
  }
}

module.exports = Ticket;