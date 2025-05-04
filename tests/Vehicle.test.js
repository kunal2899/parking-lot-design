const Vehicle = require('../src/models/Vehicle');
const { VEHICLE_TYPE } = require('../src/constants/vehicle');

describe('Vehicle', () => {
  test('should create a vehicle with the correct properties', () => {
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    expect(vehicle.getType()).toBe(VEHICLE_TYPE.LMV);
    expect(vehicle.getVehicleRegNumber()).toBe('KA01AB1234');
  });

  test('should update vehicle type and registration number', () => {
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.LMV, 
      regNumber: 'KA01AB1234' 
    });
    
    vehicle.setVehicleType(VEHICLE_TYPE.HMV);
    vehicle.setRegNumber('MH02CD5678');
    
    expect(vehicle.getType()).toBe(VEHICLE_TYPE.HMV);
    expect(vehicle.getVehicleRegNumber()).toBe('MH02CD5678');
  });

  test('should generate a string representation correctly', () => {
    const vehicle = new Vehicle({ 
      type: VEHICLE_TYPE.TW, 
      regNumber: 'DL03EF9012' 
    });
    
    const result = vehicle.toString();
    expect(result).toContain('Vehicle ID:');
    expect(result).toContain('Type: twoWheeler');
    expect(result).toContain('Registration Number: DL03EF9012');
  });
}); 