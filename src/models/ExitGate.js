const Ticket = require("./Ticket");
const { VEHICLE_TYPE } = require("../constants/vehicle");
const { validateValue } = require("../utils/common");
const { uniqueId } = require("lodash");

class ExitGate {
  #id; #isOperational;

  constructor(isOperational = true) {
    this.#id = uniqueId('exit-gate-');
    this.#isOperational = isOperational;
  }

  getOperationalStatus = () => this.#isOperational;
  isOperational = () => this.#isOperational === true;

  #validateTicket = (ticket) => {
    if (!ticket ||!ticket instanceof Ticket) throw new Error("Invalid ticket!");
    if (ticket.getIsPaid()) throw new Error("Ticket already paid!");
    if (!!ticket.getExitTime()) throw new Error("Ticket already exited!");
    return true;
  }

  #calculateParkingFee = (vehicle, parkingDuration) => {
    const vehicleType = vehicle.getType();
    switch (vehicleType) {
      case VEHICLE_TYPE.TW:
        if (parkingDuration <= 4) return 40;
        return 40 + (parkingDuration - 4) * 20;
      case VEHICLE_TYPE.EV:
        if (parkingDuration <= 4) return 100;
        return 100 + (parkingDuration - 4) * 50;
      case VEHICLE_TYPE.HMV:
        if (parkingDuration <= 4) return 120;
        return 120 + (parkingDuration - 4) * 70;
      case VEHICLE_TYPE.LMV:
      default:
        if (parkingDuration <= 4) return 80;
        return 80 + (parkingDuration - 4) * 30;
    }
  }

  #collectParkingFee = (ticket) => {
    if (!ticket ||!validateValue(ticket, Ticket)) throw new Error("Invalid ticket!");
    const entryTime = ticket.getEntryTime();
    const exitTime = new Date();
    const parkingDuration = Math.round((exitTime - entryTime) / 1000 / 60 / 60); // in hours
    const parkingFee = this.#calculateParkingFee(ticket.getVehicleDetails(), parkingDuration);
    return ticket
      .logExitTime(exitTime)
      .setPrice(parkingFee)
      .setPaidStatus(true);
  }

  registerVehicleExit = (ticket) => {
    this.#validateTicket(ticket);
    const updatedTicket = this.#collectParkingFee(ticket);
    return updatedTicket;
  }

}

module.exports = ExitGate;