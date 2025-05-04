const ParkingLot = require('./models/ParkingLot');
const EntryGate = require('./models/EntryGate');
const ExitGate = require('./models/ExitGate');
const Vehicle = require('./models/Vehicle');

const { VEHICLE_TYPE } = require('./constants/vehicle');
const { createParkingFloors } = require('./utils/parkingLot');

// Simulate concurrent operations with promises
const runConcurrentOperationsExample = async () => {
  try {
    console.log('Starting parking lot simulation with concurrency handling...\n');
    
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

    console.log('Parking lot initialized with:', 
      parkingFloors.length, 'floors',
      'and multiple spots for different vehicle types'
    );
    
    // Create vehicles
    const vehicle1 = new Vehicle({
      type: VEHICLE_TYPE.LMV,
      regNumber: 'KA01AB1234'
    });
    
    const vehicle2 = new Vehicle({
      type: VEHICLE_TYPE.TW,
      regNumber: 'KA01CD5678'
    });
    
    const vehicle3 = new Vehicle({
      type: VEHICLE_TYPE.HMV,
      regNumber: 'KA01EF9012'
    });
    
    console.log('\nSimulating concurrent vehicle entries...');
    
    // Simulate concurrent entry operations
    const entryPromises = [
      parkingLot.parkVehicle(vehicle1).then(ticket => {
        console.log(`Vehicle ${vehicle1.getVehicleRegNumber()} parked successfully`);
        return ticket;
      }),
      parkingLot.parkVehicle(vehicle2).then(ticket => {
        console.log(`Vehicle ${vehicle2.getVehicleRegNumber()} parked successfully`);
        return ticket;
      }),
      parkingLot.parkVehicle(vehicle3).then(ticket => {
        console.log(`Vehicle ${vehicle3.getVehicleRegNumber()} parked successfully`);
        return ticket;
      })
    ];
    
    // Wait for all entries to complete
    const tickets = await Promise.all(entryPromises);
    
    tickets.forEach(ticket => {
      // Mock entry time to be 3 hours ago
      const threeHoursAgo = new Date();
      threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
      ticket.logEntryTime(threeHoursAgo);
    });
    
    console.log('\nAll vehicles parked successfully!');
    console.log('Parking tickets generated -');
    
    // Print all tickets
    tickets.forEach(ticket => ticket.printTicket());
    
    // Simulate some time passing (parking duration)
    console.log('\nFast-forwarding time for parked vehicles...');
    
    console.log('\nSimulating concurrent vehicle exits...');
    
    // Simulate concurrent exit operations
    const exitPromises = tickets.map(ticket => 
      parkingLot.exitVehicle(ticket).then(updatedTicket => {
        console.log(`Vehicle from spot ${updatedTicket.getParkingSpotLabel()} exited successfully`);
        return updatedTicket;
      })
    );
    
    // Wait for all exits to complete
    const updatedTickets = await Promise.all(exitPromises);
    
    console.log('\nAll vehicles exited successfully!');
    console.log('Final tickets after payment -');
    
    // Print all updated tickets
    updatedTickets.forEach(ticket => ticket.printTicket());
    
    console.log('Parking simulation completed successfully!');
    
  } catch(error) {
    console.error('Error in simulation:', error.message);
  }
};

// For backward compatibility with synchronous operation
const runSynchronousExample = () => {
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
};

// Run the async/concurrent example
runConcurrentOperationsExample();

// Run the synchronous example
// runSynchronousExample();
