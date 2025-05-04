const ParkingSpot = require('../src/models/ParkingSpot');
const Vehicle = require('../src/models/Vehicle');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');

describe('ParkingSpot', () => {
  test('should create a parking spot with correct vehicle type support', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    expect(spot.getSupportedVehicleType()).toBe(VEHICLE_TYPE.LMV);
    expect(spot.getOccupancyStatus()).toBe(false);
    expect(spot.isOccupied()).toBe(false);
    expect(spot.getParkedVehicle()).toBe(null);
  });

  test('should correctly check if it can accommodate a given vehicle type', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    expect(spot.canAccommodate(VEHICLE_TYPE.LMV)).toBe(true);
    expect(spot.canAccommodate(VEHICLE_TYPE.TW)).toBe(false);
    expect(spot.canAccommodate(VEHICLE_TYPE.HMV)).toBe(false);
    expect(spot.canAccommodate(VEHICLE_TYPE.EV)).toBe(false);
  });

  test('should park a vehicle correctly', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.TW, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    
    expect(spot.isOccupied()).toBe(true);
    expect(spot.getParkedVehicle()).toBe(vehicle);
  });

  test('should unpark a vehicle correctly', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.TW });
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.TW, 
      regNumber: 'KA01AB1234' 
    });
    
    spot.parkVehicle(vehicle);
    spot.unparkVehicle();
    
    expect(spot.isOccupied()).toBe(false);
    expect(spot.getParkedVehicle()).toBe(null);
  });

  test('should throw error when trying to park in occupied spot', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    const vehicle1 = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    const vehicle2 = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA02CD5678' 
    });
    
    spot.parkVehicle(vehicle1);
    
    expect(() => {
      spot.parkVehicle(vehicle2);
    }).toThrow('Parking spot already occupied!');
  });

  test('should throw error when trying to unpark from empty spot', () => {
    const spot = new ParkingSpot({ supportedVehicleType: VEHICLE_TYPE.LMV });
    
    expect(() => {
      spot.unparkVehicle();
    }).toThrow('Parking spot already empty!');
  });
}); 