const ParkingFloor = require('../src/models/ParkingFloor');
const ParkingSpot = require('../src/models/ParkingSpot');
const Vehicle = require('../src/models/Vehicle');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');
const { UNAVAILABILITY_REASON } = require('../src/constants/parkingFloor');

describe('ParkingFloor', () => {
  test('should create a parking floor with the correct level', () => {
    const floor = new ParkingFloor({ level: 2 });
    
    expect(floor.getFloorLevel()).toBe(2);
    expect(floor.getFloorAvailability().isAvailable).toBe(true);
  });

  test('should create an unavailable parking floor with reason', () => {
    const floor = new ParkingFloor({ 
      level: 3, 
      isAvailable: false, 
      unAvailabilityReasons: UNAVAILABILITY_REASON.UNDER_MAINTENANCE 
    });
    
    expect(floor.getFloorLevel()).toBe(3);
    const availability = floor.getFloorAvailability();
    expect(availability.isAvailable).toBe(false);
    expect(availability.reason).toBe(UNAVAILABILITY_REASON.UNDER_MAINTENANCE);
  });

  test('should assign parking spots correctly', () => {
    const floor = new ParkingFloor({ level: 1 });
    const spots = [
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV }),
      new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW })
    ];
    
    floor.assignParkingSpots(spots);
    
    expect(floor.getAllParkingSpots()).toBe(spots);
    expect(floor.getAllAvailableParkingSpots().length).toBe(2);
  });

  test('should filter available parking spots correctly', () => {
    const floor = new ParkingFloor({ level: 1 });
    const spot1 = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const spot2 = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    spot1.parkVehicle(vehicle);
    
    floor.assignParkingSpots([spot1, spot2]);
    
    expect(floor.getAllParkingSpots().length).toBe(2);
    expect(floor.getAllAvailableParkingSpots().length).toBe(1);
    expect(floor.getAllAvailableParkingSpots()[0]).toBe(spot2);
    expect(floor.getAvailableParkingSpot()).toBe(spot2);
  });

  test('should throw error when assigning invalid parking spots', () => {
    const floor = new ParkingFloor({ level: 1 });
    const invalidSpots = [{ id: 'spot-1' }, { id: 'spot-2' }];
    
    expect(() => {
      floor.assignParkingSpots(invalidSpots);
    }).toThrow(`Can't assign invalid parking spots data!`);
  });
}); 