const ParkingLot = require('./models/ParkingLot');
const EntryGate = require('./models/EntryGate');
const ExitGate = require('./models/ExitGate');
const Vehicle = require('./models/Vehicle');

const { VEHICLE_TYPE } = require('./constants/vehicle');
const { createParkingFloors } = require('./utils/parkingLot');

try {
  // Initialize parking lot
  const parkingLot = new ParkingLot();
  // Assign parking floors
  const parkingFloors = createParkingFloors();
  parkingLot.assignParkingFloors(parkingFloors);
  // Assign entry and exit gates
  const entryGate = new EntryGate();
  const exitGate = new ExitGate();
  parkingLot.assignEntryGates([entryGate]);
  parkingLot.assignExitGates([exitGate]);

  // Example usage:
  const vehicle = new Vehicle({
    type: VEHICLE_TYPE.LMV,
    regNumber: 'KA01AB1234'
  });

  if (!parkingLot.getOpeningStatus()) throw new Error('Parking lot is closed!');

  // Get available floor
  const availableFloor = parkingLot.getAvailableParkingFloor();
  
  // Register vehicle entry
  const avlEntryGate = parkingLot.getAvailableEntryGate();
  if (!avlEntryGate) throw new Error('No entry gate available!');

  const ticket = avlEntryGate.registerVehicleEntry(vehicle, availableFloor);
  
  console.log('Parking ticket generated -');
  ticket.printTicket();

  // Later when vehicle exits
  const avlExitGate = parkingLot.getAvailableExitGate();
  if (!avlExitGate) throw new Error('No exit gate available!');

  const updatedTicket = avlExitGate.registerVehicleExit(ticket);
  
  console.log('Final ticket after payment -');
  updatedTicket.printTicket();
} catch(error) {
  console.error('Error in main:', error.message);
}
