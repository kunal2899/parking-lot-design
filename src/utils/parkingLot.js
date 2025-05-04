const { VEHICLE_TYPE } = require("../constants/vehicle");
const ParkingSpot = require("../models/ParkingSpot");
const ParkingFloor = require("../models/ParkingFloor");

// Create parking spots for each floor
const createParkingSpots = ({
  lmvSpots = 20,
  twSpots = 10,
  hmvSpots = 10,
  evSpots = 10,
} = {}) => {
  const parkingSpots = [];

  // Create LMV spots
  for (let i = 0; i < lmvSpots; i++) {
    parkingSpots.push(
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV })
    );
  }

  // Create TW spots
  for (let i = 0; i < twSpots; i++) {
    parkingSpots.push(
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW })
    );
  }

  // Create HMV spots
  for (let i = 0; i < hmvSpots; i++) {
    parkingSpots.push(
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.HMV })
    );
  }

  // Create EV spots
  for (let i = 0; i < evSpots; i++) {
    parkingSpots.push(
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.EV })
    );
  }

  return parkingSpots;
};

// Create parking floors
const createParkingFloors = (floorsCount = 4) => {
  const parkingFloors = [];
  
  for(let level = 1; level <= floorsCount; level++) {
    const floor = new ParkingFloor({ level });
    const parkingSpots = createParkingSpots();
    floor.assignParkingSpots(parkingSpots);
    parkingFloors.push(floor);
  }

  return parkingFloors;
};

module.exports = {
  createParkingFloors,
}