const ExitGate = require('../src/models/ExitGate');
const Ticket = require('../src/models/Ticket');
const Vehicle = require('../src/models/Vehicle');
const ParkingSpot = require('../src/models/ParkingSpot');
const ParkingFloor = require('../src/models/ParkingFloor');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');

describe('ExitGate', () => {
  test('should create an exit gate with operational status', () => {
    const exitGate = new ExitGate();
    
    expect(exitGate.getOperationalStatus()).toBe(true);
    expect(exitGate.isOperational()).toBe(true);
  });

  test('should create a non-operational exit gate', () => {
    const exitGate = new ExitGate(false);
    
    expect(exitGate.getOperationalStatus()).toBe(false);
    expect(exitGate.isOperational()).toBe(false);
  });

  test('should register vehicle exit and update ticket', () => {
    const exitGate = new ExitGate();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const floor = new ParkingFloor({ level: 1 });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    
    const ticket = new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(floor)
      .logEntryTime(new Date(Date.now() - 5 * 60 * 60 * 1000)); // 5 hours ago
    
    const updatedTicket = exitGate.registerVehicleExit(ticket);
    
    expect(updatedTicket.getExitTime()).not.toBe(null);
    expect(updatedTicket.getPrice()).toBeGreaterThan(0);
    expect(updatedTicket.getIsPaid()).toBe(true);
    expect(spot.isOccupied()).toBe(false);
    expect(spot.getParkedVehicle()).toBe(null);
  });
  
  test('should calculate correct parking fee for LMV', () => {
    const exitGate = new ExitGate();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const floor = new ParkingFloor({ level: 1 });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    
    // Test for 3 hours (below 4 hours threshold)
    const ticket1 = new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(floor)
      .logEntryTime(new Date(Date.now() - 3 * 60 * 60 * 1000));
    
    const updatedTicket1 = exitGate.registerVehicleExit(ticket1);
    expect(updatedTicket1.getPrice()).toBe(80); // Fixed fee for LMV under 4 hours
    
    // Test for 6 hours (above 4 hours threshold)
    spot.parkVehicle(vehicle);
    const ticket2 = new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(floor)
      .logEntryTime(new Date(Date.now() - 6 * 60 * 60 * 1000));
    
    const updatedTicket2 = exitGate.registerVehicleExit(ticket2);
    expect(updatedTicket2.getPrice()).toBe(140); // 80 + (6-4)*30
  });

  test('should calculate correct parking fee for different vehicle types', () => {
    const exitGate = new ExitGate();
    
    // Two Wheeler (TW)
    const twSpot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW });
    const twVehicle = new Vehicle({ 
      type: VEHICLE_TYPE.TW, 
      regNumber: 'KA01TW1234' 
    });
    
    twSpot.parkVehicle(twVehicle);
    const twTicket = new Ticket()
      .setVehicleDetails(twVehicle)
      .setParkingSpot(twSpot)
      .setParkingFloor(new ParkingFloor({ level: 1 }))
      .logEntryTime(new Date(Date.now() - 6 * 60 * 60 * 1000));
    
    const updatedTwTicket = exitGate.registerVehicleExit(twTicket);
    expect(updatedTwTicket.getPrice()).toBe(80); // 40 + (6-4)*20
    
    // Electric Vehicle (EV)
    const evSpot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.EV });
    const evVehicle = new Vehicle({ 
      type: VEHICLE_TYPE.EV, 
      regNumber: 'KA01EV1234' 
    });
    
    evSpot.parkVehicle(evVehicle);
    const evTicket = new Ticket()
      .setVehicleDetails(evVehicle)
      .setParkingSpot(evSpot)
      .setParkingFloor(new ParkingFloor({ level: 1 }))
      .logEntryTime(new Date(Date.now() - 6 * 60 * 60 * 1000));
    
    const updatedEvTicket = exitGate.registerVehicleExit(evTicket);
    expect(updatedEvTicket.getPrice()).toBe(200); // 100 + (6-4)*50
    
    // Heavy Motor Vehicle (HMV)
    const hmvSpot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.HMV });
    const hmvVehicle = new Vehicle({ 
      type: VEHICLE_TYPE.HMV, 
      regNumber: 'KA01HM1234' 
    });
    
    hmvSpot.parkVehicle(hmvVehicle);
    const hmvTicket = new Ticket()
      .setVehicleDetails(hmvVehicle)
      .setParkingSpot(hmvSpot)
      .setParkingFloor(new ParkingFloor({ level: 1 }))
      .logEntryTime(new Date(Date.now() - 6 * 60 * 60 * 1000));
    
    const updatedHmvTicket = exitGate.registerVehicleExit(hmvTicket);
    expect(updatedHmvTicket.getPrice()).toBe(260); // 120 + (6-4)*70
  });

  test('should throw error when trying to process a paid ticket', () => {
    const exitGate = new ExitGate();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    
    const ticket = new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(new ParkingFloor({ level: 1 }))
      .logEntryTime(new Date(Date.now() - 2 * 60 * 60 * 1000))
      .setPaidStatus(true);
    
    expect(() => {
      exitGate.registerVehicleExit(ticket);
    }).toThrow('Ticket already paid!');
  });

  test('should throw error when trying to process a ticket with exit time', () => {
    const exitGate = new ExitGate();
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    
    const ticket = new Ticket()
      .setVehicleDetails(vehicle)
      .setParkingSpot(spot)
      .setParkingFloor(new ParkingFloor({ level: 1 }))
      .logEntryTime(new Date(Date.now() - 2 * 60 * 60 * 1000))
      .logExitTime();
    
    expect(() => {
      exitGate.registerVehicleExit(ticket);
    }).toThrow('Ticket already exited!');
  });

  test('should throw error for invalid ticket', () => {
    const exitGate = new ExitGate();
    
    expect(() => {
      exitGate.registerVehicleExit(null);
    }).toThrow('Invalid ticket!');
  });
}); 