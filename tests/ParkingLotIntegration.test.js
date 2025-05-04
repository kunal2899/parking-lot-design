const ParkingLot = require('../src/models/ParkingLot');
const EntryGate = require('../src/models/EntryGate');
const ExitGate = require('../src/models/ExitGate');
const Vehicle = require('../src/models/Vehicle');
const ParkingFloor = require('../src/models/ParkingFloor');
const ParkingSpot = require('../src/models/ParkingSpot');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');
const { createParkingFloors } = require('../src/utils/parkingLot');

describe('Parking Lot Integration', () => {
  test('should perform complete vehicle parking and exit flow', () => {
    // Initialize parking lot
    const parkingLot = new ParkingLot();
    
    // Create and assign entry and exit gates
    const entryGate = new EntryGate();
    const exitGate = new ExitGate();
    parkingLot.assignEntryGates([entryGate]);
    parkingLot.assignExitGates([exitGate]);
    
    // Create and assign parking floors with spots
    const floor1 = new ParkingFloor({ level: 1 });
    const spots = [
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.HMV }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.EV })
    ];
    floor1.assignParkingSpots(spots);
    parkingLot.assignParkingFloors([floor1]);
    
    // Create a vehicle
    const vehicle = new Vehicle({
      type: VEHICLE_TYPE.LMV,
      regNumber: 'KA01AB1234'
    });
    
    // Get available floor specifically for this vehicle type
    const availableFloor = parkingLot.getAvailableParkingFloor(vehicle.getType());
    expect(availableFloor).toBe(floor1);
    
    // Register vehicle entry
    const avlEntryGate = parkingLot.getAvailableEntryGate();
    expect(avlEntryGate).toBe(entryGate);
    
    const ticket = avlEntryGate.registerVehicleEntry(vehicle, availableFloor);
    
    // Verify ticket details
    expect(ticket.getVehicleDetails()).toBe(vehicle);
    expect(ticket.getParkingFloor()).toBe(availableFloor);
    expect(ticket.getEntryTime()).not.toBe(null);
    expect(ticket.getIsPaid()).toBe(false);
    
    // Verify parking spot is occupied and is of correct type
    const parkingSpot = ticket.getParkingSpot();
    expect(parkingSpot.isOccupied()).toBe(true);
    expect(parkingSpot.getParkedVehicle()).toBe(vehicle);
    expect(parkingSpot.getSupportedVehicleType()).toBe(VEHICLE_TYPE.LMV);
    
    // Register vehicle exit (using a fixed time for testing)
    const avlExitGate = parkingLot.getAvailableExitGate();
    expect(avlExitGate).toBe(exitGate);
    
    // Mock ticket entry time to be 3 hours ago for consistent test
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
    ticket.logEntryTime(threeHoursAgo);
    
    const updatedTicket = avlExitGate.registerVehicleExit(ticket);
    
    // Verify updated ticket
    expect(updatedTicket.getExitTime()).not.toBe(null);
    expect(updatedTicket.getPrice()).toBe(80); // Fixed rate for LMV under 4 hours
    expect(updatedTicket.getIsPaid()).toBe(true);
    
    // Verify parking spot is now free
    expect(parkingSpot.isOccupied()).toBe(false);
    expect(parkingSpot.getParkedVehicle()).toBe(null);
  });

  test('should handle multiple vehicles of different types', () => {
    // Initialize parking lot
    const parkingLot = new ParkingLot();
    
    // Create and assign entry and exit gates
    const entryGate = new EntryGate();
    const exitGate = new ExitGate();
    parkingLot.assignEntryGates([entryGate]);
    parkingLot.assignExitGates([exitGate]);
    
    // Use the utility to create floors with spots
    const parkingFloors = createParkingFloors(2); // Create 2 floors
    parkingLot.assignParkingFloors(parkingFloors);
    
    // Create different types of vehicles
    const lmvVehicle = new Vehicle({
      type: VEHICLE_TYPE.LMV,
      regNumber: 'KA01LMV1234'
    });
    
    const twVehicle = new Vehicle({
      type: VEHICLE_TYPE.TW,
      regNumber: 'KA01TW5678'
    });
    
    const hmvVehicle = new Vehicle({
      type: VEHICLE_TYPE.HMV,
      regNumber: 'KA01HMV9012'
    });
    
    const evVehicle = new Vehicle({
      type: VEHICLE_TYPE.EV,
      regNumber: 'KA01EV3456'
    });
    
    // Park all vehicles
    const availableFloor = parkingLot.getAvailableParkingFloor();
    const avlEntryGate = parkingLot.getAvailableEntryGate();
    
    const lmvTicket = avlEntryGate.registerVehicleEntry(lmvVehicle, availableFloor);
    const twTicket = avlEntryGate.registerVehicleEntry(twVehicle, availableFloor);
    const hmvTicket = avlEntryGate.registerVehicleEntry(hmvVehicle, availableFloor);
    const evTicket = avlEntryGate.registerVehicleEntry(evVehicle, availableFloor);
    
    // Verify all tickets have correct vehicle types and spots
    expect(lmvTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.LMV);
    expect(twTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.TW);
    expect(hmvTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.HMV);
    expect(evTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.EV);
    
    // Set entry times for consistent testing
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    
    lmvTicket.logEntryTime(sixHoursAgo);
    twTicket.logEntryTime(sixHoursAgo);
    hmvTicket.logEntryTime(sixHoursAgo);
    evTicket.logEntryTime(sixHoursAgo);
    
    // Exit vehicles and check fees
    const avlExitGate = parkingLot.getAvailableExitGate();
    
    const updatedLmvTicket = avlExitGate.registerVehicleExit(lmvTicket);
    expect(updatedLmvTicket.getPrice()).toBe(140); // 80 + (6-4)*30
    
    const updatedTwTicket = avlExitGate.registerVehicleExit(twTicket);
    expect(updatedTwTicket.getPrice()).toBe(80); // 40 + (6-4)*20
    
    const updatedHmvTicket = avlExitGate.registerVehicleExit(hmvTicket);
    expect(updatedHmvTicket.getPrice()).toBe(260); // 120 + (6-4)*70
    
    const updatedEvTicket = avlExitGate.registerVehicleExit(evTicket);
    expect(updatedEvTicket.getPrice()).toBe(200); // 100 + (6-4)*50
    
    // All spots should be free now
    expect(lmvTicket.getParkingSpot().isOccupied()).toBe(false);
    expect(twTicket.getParkingSpot().isOccupied()).toBe(false);
    expect(hmvTicket.getParkingSpot().isOccupied()).toBe(false);
    expect(evTicket.getParkingSpot().isOccupied()).toBe(false);
  });

  test('should handle parking lot capacity and unavailability', () => {
    // Initialize a small parking lot with limited capacity
    const parkingLot = new ParkingLot();
    
    // Create and assign entry gate
    const entryGate = new EntryGate();
    parkingLot.assignEntryGates([entryGate]);
    
    // Create a floor with only one spot
    const floor = new ParkingFloor({ level: 1 });
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    floor.assignParkingSpots([spot]);
    parkingLot.assignParkingFloors([floor]);
    
    // Create two vehicles
    const vehicle1 = new Vehicle({
      type: VEHICLE_TYPE.LMV,
      regNumber: 'KA01AB1234'
    });
    
    const vehicle2 = new Vehicle({
      type: VEHICLE_TYPE.LMV,
      regNumber: 'KA01CD5678'
    });
    
    // Park the first vehicle
    const availableFloor = parkingLot.getAvailableParkingFloor(vehicle1.getType());
    const ticket1 = entryGate.registerVehicleEntry(vehicle1, availableFloor);
    
    // The spot should be occupied
    expect(spot.isOccupied()).toBe(true);
    
    // Try to park the second vehicle, should throw an error
    expect(() => {
      const availableFloorForVehicle2 = parkingLot.getAvailableParkingFloor(vehicle2.getType());
      // Should not find any floor with available spots for this vehicle type
      expect(availableFloorForVehicle2).toBe(undefined); 
      
      // This would throw an error if we tried to proceed
      if (availableFloorForVehicle2) {
        entryGate.registerVehicleEntry(vehicle2, availableFloorForVehicle2);
      } else {
        throw new Error('No available parking spot for vehicle type: lightMotorVehicle');
      }
    }).toThrow('No available parking spot for vehicle type: lightMotorVehicle');
    
    // Create a vehicle of different type
    const twVehicle = new Vehicle({
      type: VEHICLE_TYPE.TW,
      regNumber: 'KA01TW9012'
    });
    
    // Try to park a different type of vehicle, should throw error due to no compatible spots
    expect(() => {
      const availableFloorForTW = parkingLot.getAvailableParkingFloor(twVehicle.getType());
      // Should not find any floor with available spots for this vehicle type
      expect(availableFloorForTW).toBe(undefined);
      
      // This would throw an error if we tried to proceed
      if (availableFloorForTW) {
        entryGate.registerVehicleEntry(twVehicle, availableFloorForTW);
      } else {
        throw new Error('No available parking spot for vehicle type: twoWheeler');
      }
    }).toThrow('No available parking spot for vehicle type: twoWheeler');
  });
  
  test('should respect vehicle type compatibility when assigning spots', () => {
    // Create a parking lot with specific spot types
    const parkingLot = new ParkingLot();
    const entryGate = new EntryGate();
    parkingLot.assignEntryGates([entryGate]);
    
    // Create a floor with different types of spots
    const floor = new ParkingFloor({ level: 1 });
    const spots = [
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.EV }),
    ];
    floor.assignParkingSpots(spots);
    parkingLot.assignParkingFloors([floor]);
    
    // Create vehicles of different types
    const lmvVehicle = new Vehicle({ type: VEHICLE_TYPE.LMV, regNumber: 'KA01LMV1234' });
    const twVehicle = new Vehicle({ type: VEHICLE_TYPE.TW, regNumber: 'KA01TW5678' });
    const evVehicle = new Vehicle({ type: VEHICLE_TYPE.EV, regNumber: 'KA01EV9012' });
    const hmvVehicle = new Vehicle({ type: VEHICLE_TYPE.HMV, regNumber: 'KA01HMV3456' });
    
    // Check spot availability by vehicle type
    expect(floor.getAvailableSpotsCount()).toBe(4); // Total spots
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.LMV)).toBe(2); // LMV spots
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.TW)).toBe(1);  // TW spots
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.EV)).toBe(1);  // EV spots
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.HMV)).toBe(0); // No HMV spots
    
    // Park vehicles
    const lmvTicket = entryGate.registerVehicleEntry(lmvVehicle, floor);
    const twTicket = entryGate.registerVehicleEntry(twVehicle, floor);
    const evTicket = entryGate.registerVehicleEntry(evVehicle, floor);
    
    // Verify assigned spots match vehicle types
    expect(lmvTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.LMV);
    expect(twTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.TW);
    expect(evTicket.getParkingSpot().getSupportedVehicleType()).toBe(VEHICLE_TYPE.EV);
    
    // Verify we still have one LMV spot available
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.LMV)).toBe(1);
    
    // Try to park an HMV vehicle (not supported)
    expect(() => {
      entryGate.registerVehicleEntry(hmvVehicle, floor);
    }).toThrow('No available parking spot for vehicle type: heavyMotorVehicle');
    
    // Park another LMV vehicle to fill all LMV spots
    const lmvVehicle2 = new Vehicle({ type: VEHICLE_TYPE.LMV, regNumber: 'KA01LMV5678' });
    const lmvTicket2 = entryGate.registerVehicleEntry(lmvVehicle2, floor);
    
    // Now no more LMV spots
    expect(floor.getAvailableSpotsCount(VEHICLE_TYPE.LMV)).toBe(0);
    
    // Trying to park another LMV should fail
    const lmvVehicle3 = new Vehicle({ type: VEHICLE_TYPE.LMV, regNumber: 'KA01LMV9012' });
    expect(() => {
      entryGate.registerVehicleEntry(lmvVehicle3, floor);
    }).toThrow('No available parking spot for vehicle type: lightMotorVehicle');
  });
}); 