const ParkingLot = require('../src/models/ParkingLot');
const ParkingFloor = require('../src/models/ParkingFloor');
const ParkingSpot = require('../src/models/ParkingSpot');
const EntryGate = require('../src/models/EntryGate');
const ExitGate = require('../src/models/ExitGate');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');
const { UNAVAILABILITY_REASON } = require('../src/constants/parkingFloor');

describe('ParkingLot', () => {
  test('should create a parking lot with operational status', () => {
    const parkingLot = new ParkingLot();
    
    expect(parkingLot.getOpeningStatus()).toBe(true);
  });

  test('should create a closed parking lot', () => {
    const parkingLot = new ParkingLot(false);
    
    expect(parkingLot.getOpeningStatus()).toBe(false);
  });

  test('should assign parking floors correctly', () => {
    const parkingLot = new ParkingLot();
    const floors = [
      new ParkingFloor({ level: 1 }),
      new ParkingFloor({ level: 2 })
    ];
    
    parkingLot.assignParkingFloors(floors);
    
    expect(parkingLot.getAllParkingFloors()).toBe(floors);
  });

  test('should assign entry gates correctly', () => {
    const parkingLot = new ParkingLot();
    const entryGates = [
      new EntryGate(),
      new EntryGate(false)
    ];
    
    parkingLot.assignEntryGates(entryGates);
    
    expect(parkingLot.getEntryGates()).toBe(entryGates);
  });

  test('should assign exit gates correctly', () => {
    const parkingLot = new ParkingLot();
    const exitGates = [
      new ExitGate(),
      new ExitGate(false)
    ];
    
    parkingLot.assignExitGates(exitGates);
    
    expect(parkingLot.getExitGates()).toBe(exitGates);
  });

  test('should get all available parking floors', () => {
    const parkingLot = new ParkingLot();
    const floors = [
      new ParkingFloor({ level: 1 }),
      new ParkingFloor({ level: 2, isAvailable: false, unAvailabilityReasons: UNAVAILABILITY_REASON.UNDER_MAINTENANCE }),
      new ParkingFloor({ level: 3 })
    ];
    
    parkingLot.assignParkingFloors(floors);
    
    const availableFloors = parkingLot.getAllAvailableParkingFloors();
    expect(availableFloors.length).toBe(2);
    expect(availableFloors[0]).toBe(floors[0]);
    expect(availableFloors[1]).toBe(floors[2]);
  });

  test('should get first available parking floor', () => {
    const parkingLot = new ParkingLot();
    const floors = [
      new ParkingFloor({ level: 1, isAvailable: false, unAvailabilityReasons: UNAVAILABILITY_REASON.FULL }),
      new ParkingFloor({ level: 2 }),
      new ParkingFloor({ level: 3 })
    ];
    
    parkingLot.assignParkingFloors(floors);
    
    const availableFloor = parkingLot.getAvailableParkingFloor();
    expect(availableFloor).toBe(floors[1]);
  });

  test('should get all available entry gates', () => {
    const parkingLot = new ParkingLot();
    const entryGates = [
      new EntryGate(),
      new EntryGate(false),
      new EntryGate()
    ];
    
    parkingLot.assignEntryGates(entryGates);
    
    const availableGates = parkingLot.getAllAvailableEntryGates();
    expect(availableGates.length).toBe(2);
    expect(availableGates[0]).toBe(entryGates[0]);
    expect(availableGates[1]).toBe(entryGates[2]);
  });

  test('should get all available exit gates', () => {
    const parkingLot = new ParkingLot();
    const exitGates = [
      new ExitGate(false),
      new ExitGate(),
      new ExitGate()
    ];
    
    parkingLot.assignExitGates(exitGates);
    
    const availableGates = parkingLot.getAllAvailableExitGates();
    expect(availableGates.length).toBe(2);
    expect(availableGates[0]).toBe(exitGates[1]);
    expect(availableGates[1]).toBe(exitGates[2]);
  });

  test('should get first available entry gate', () => {
    const parkingLot = new ParkingLot();
    const entryGates = [
      new EntryGate(false),
      new EntryGate(),
      new EntryGate()
    ];
    
    parkingLot.assignEntryGates(entryGates);
    
    const availableGate = parkingLot.getAvailableEntryGate();
    expect(availableGate).toBe(entryGates[1]);
  });

  test('should get first available exit gate', () => {
    const parkingLot = new ParkingLot();
    const exitGates = [
      new ExitGate(false),
      new ExitGate(false),
      new ExitGate()
    ];
    
    parkingLot.assignExitGates(exitGates);
    
    const availableGate = parkingLot.getAvailableExitGate();
    expect(availableGate).toBe(exitGates[2]);
  });

  test('should throw error when assigning invalid parking floors', () => {
    const parkingLot = new ParkingLot();
    const invalidFloors = [{ level: 1 }, { level: 2 }];
    
    expect(() => {
      parkingLot.assignParkingFloors(invalidFloors);
    }).toThrow(`Can't assign invalid parking floors data!`);
  });

  test('should throw error when assigning invalid entry gates', () => {
    const parkingLot = new ParkingLot();
    const invalidGates = [{ id: 'gate-1' }, { id: 'gate-2' }];
    
    expect(() => {
      parkingLot.assignEntryGates(invalidGates);
    }).toThrow(`Can't assign invalid entry point!`);
  });

  test('should throw error when assigning invalid exit gates', () => {
    const parkingLot = new ParkingLot();
    const invalidGates = [{ id: 'gate-1' }, { id: 'gate-2' }];
    
    expect(() => {
      parkingLot.assignExitGates(invalidGates);
    }).toThrow(`Can't assign invalid exit points!`);
  });
}); 