const { uniqueId } = require('lodash');

class Vehicle {
  #id; #type; #regNumber;

  constructor({ type, regNumber }) {
    this.#id = uniqueId('vehicle-');
    this.#type = type;
    this.#regNumber = regNumber;
  }

  // Getters
  getType = () => this.#type;
  getVehicleRegNumber = () => this.#regNumber;

  // Setters
  setVehicleType = type => { this.#type = type }
  setRegNumber = regNumber => { this.#regNumber = regNumber }

  toString = () => `Vehicle ID: ${this.#id},\nType: ${this.#type},\nRegistration Number: ${this.#regNumber}`;
}

module.exports = Vehicle;