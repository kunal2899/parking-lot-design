const { uniqueId } = require("lodash");

class Ticket {
   #id; #price; #parkingSpotLabel; #vehicle; #entryTime; #exitTime; #isPaid;

  constructor() {
    this.#id = uniqueId('ticket-');
    this.#price = null;
    this.#parkingSpotLabel = null;
    this.#vehicle = null;
    this.#entryTime = null;
    this.#exitTime = null;
    this.#isPaid = false;
    return this;
  }

  // Getters
  getPrice = () => this.#price;
  getParkingSpotLabel = () => this.#parkingSpotLabel;
  getEntryTime = () => this.#entryTime;
  getExitTime = () => this.#exitTime;
  getVehicleDetails = () => this.#vehicle;
  getIsPaid = () => this.#isPaid;
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

  setParkingSpotLabel = (floorLevel, spotId) => {
    const floorLabel = String.fromCharCode(64 + floorLevel);
    const spotNumber = Number(String(spotId).split('parking-spot-')[1]);
    this.#parkingSpotLabel = `${floorLabel}${spotNumber}`;
    return this;
  };

  logEntryTime = (time = new Date()) => {
    this.#entryTime = time;
    return this;
  };

  logExitTime = (time = new Date()) => {
    this.#exitTime = time;
    return this;
  };
}

module.exports = Ticket;