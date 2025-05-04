const Ticket = require('../src/models/Ticket');
const Vehicle = require('../src/models/Vehicle');
const ParkingSpot = require('../src/models/ParkingSpot');
const ParkingFloor = require('../src/models/ParkingFloor');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');

describe('Ticket', () => {
  test('should create a ticket with default values', () => {
    const ticket = new Ticket();
    
    expect(ticket.getPrice()).toBe(null);
    expect(ticket.getParkingSpotLabel()).toBe(null);
    expect(ticket.getEntryTime()).toBe(null);
    expect(ticket.getExitTime()).toBe(null);
    expect(ticket.getVehicleDetails()).toBe(null);
    expect(ticket.getIsPaid()).toBe(false);
    expect(ticket.getParkingSpot()).toBe(null);
    expect(ticket.getParkingFloor()).toBe(null);
  });

  test('should set and get ticket price', () => {
    const ticket = new Ticket();
    ticket.setPrice(120);
    
    expect(ticket.getPrice()).toBe(120);
  });

  test('should set and get vehicle details', () => {
    const ticket = new Ticket();
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    ticket.setVehicleDetails(vehicle);
    
    expect(ticket.getVehicleDetails()).toBe(vehicle);
  });

  test('should set and get paid status', () => {
    const ticket = new Ticket();
    
    ticket.setPaidStatus(true);
    expect(ticket.getIsPaid()).toBe(true);
    
    ticket.setPaidStatus(false);
    expect(ticket.getIsPaid()).toBe(false);
  });

  test('should set and get parking spot and floor', () => {
    const ticket = new Ticket();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const floor = new ParkingFloor({ level: 2 });
    
    ticket.setParkingSpot(spot);
    ticket.setParkingFloor(floor);
    
    expect(ticket.getParkingSpot()).toBe(spot);
    expect(ticket.getParkingFloor()).toBe(floor);
  });

  test('should log entry time and set parking spot label', () => {
    const ticket = new Ticket();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const floor = new ParkingFloor({ level: 2 });
    
    ticket.setParkingSpot(spot);
    ticket.setParkingFloor(floor);
    
    const entryTime = new Date('2023-01-01T10:00:00Z');
    ticket.logEntryTime(entryTime);
    
    expect(ticket.getEntryTime()).toBe(entryTime);
    expect(ticket.getParkingSpotLabel()).not.toBe(null);
  });

  test('should log exit time', () => {
    const ticket = new Ticket();
    const exitTime = new Date('2023-01-01T14:00:00Z');
    
    ticket.logExitTime(exitTime);
    
    expect(ticket.getExitTime()).toBe(exitTime);
  });

  test('should support chaining of operations', () => {
    const ticket = new Ticket();
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const floor = new ParkingFloor({ level: 1 });
    
    ticket
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(floor)
      .logEntryTime()
      .setPrice(100)
      .setPaidStatus();
    
    expect(ticket.getVehicleDetails()).toBe(vehicle);
    expect(ticket.getParkingSpot()).toBe(spot);
    expect(ticket.getParkingFloor()).toBe(floor);
    expect(ticket.getEntryTime()).not.toBe(null);
    expect(ticket.getPrice()).toBe(100);
    expect(ticket.getIsPaid()).toBe(true);
  });
}); 