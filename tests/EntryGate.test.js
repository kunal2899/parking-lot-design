const EntryGate = require('../src/models/EntryGate');
const Vehicle = require('../src/models/Vehicle');
const ParkingFloor = require('../src/models/ParkingFloor');
const ParkingSpot = require('../src/models/ParkingSpot');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');

describe('EntryGate', () => {
  test('should create an entry gate with operational status', () => {
    const entryGate = new EntryGate();
    
    expect(entryGate.getOperationalStatus()).toBe(true);
    expect(entryGate.isOperational()).toBe(true);
  });

  test('should create a non-operational entry gate', () => {
    const entryGate = new EntryGate(false);
    
    expect(entryGate.getOperationalStatus()).toBe(false);
    expect(entryGate.isOperational()).toBe(false);
  });

  test('should register vehicle entry and generate ticket', () => {
    const entryGate = new EntryGate();
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    const floor = new ParkingFloor({ level: 1 });
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    floor.assignParkingSpots([spot]);
    
    const ticket = entryGate.registerVehicleEntry(vehicle, floor);
    
    expect(ticket).not.toBe(null);
    expect(ticket.getVehicleDetails()).toBe(vehicle);
    expect(ticket.getParkingFloor()).toBe(floor);
    expect(ticket.getParkingSpot()).toBe(spot);
    expect(ticket.getEntryTime()).not.toBe(null);
    expect(spot.isOccupied()).toBe(true);
    expect(spot.getParkedVehicle()).toBe(vehicle);
  });

  test('should throw error when no parking spot is available', () => {
    const entryGate = new EntryGate();
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    const floor = new ParkingFloor({ level: 1 });
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    // Occupy the spot first
    spot.parkVehicle(vehicle);
    floor.assignParkingSpots([spot]);
    
    expect(() => {
      entryGate.registerVehicleEntry(vehicle, floor);
    }).toThrow('No available parking spot for vehicle type: lightMotorVehicle');
  });

  test('should throw error for invalid vehicle', () => {
    const entryGate = new EntryGate();
    const floor = new ParkingFloor({ level: 1 });
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    floor.assignParkingSpots([spot]);
    
    expect(() => {
      entryGate.registerVehicleEntry({ type: 'invalid' }, floor);
    }).toThrow('Parking not available for this type of vehicle!');
  });
}); 