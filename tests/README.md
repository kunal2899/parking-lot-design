# Parking Lot Tests

This folder contains unit and integration tests for the parking lot system. The tests cover all models and various scenarios for the parking lot operations.

## Test Files

- **Vehicle.test.js**: Tests for the Vehicle model
- **ParkingSpot.test.js**: Tests for the ParkingSpot model
- **ParkingFloor.test.js**: Tests for the ParkingFloor model
- **Ticket.test.js**: Tests for the Ticket model
- **EntryGate.test.js**: Tests for the EntryGate model
- **ExitGate.test.js**: Tests for the ExitGate model
- **ParkingLot.test.js**: Tests for the ParkingLot model
- **ParkingLotIntegration.test.js**: Integration tests for complete parking lot flows
- **utils.test.js**: Tests for utility functions

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- tests/Vehicle.test.js
```

## Test Coverage

The tests cover the following scenarios:

### Basic Operations
- Creation of different models with correct parameters
- Getter and setter functionality
- Error handling for invalid inputs

### Vehicle Management
- Different vehicle types (LMV, TW, HMV, EV)
- Vehicle registration and identification

### Parking Operations
- Parking spot allocation based on vehicle type
- Parking spot occupancy status
- Floor availability management

### Ticket Management
- Ticket generation on vehicle entry
- Logging entry and exit times
- Calculating parking fees based on vehicle type and duration
- Handling ticket payment status

### Integration Scenarios
- Complete vehicle entry and exit flow
- Multiple vehicles of different types
- Handling parking lot capacity constraints

Each test focuses on verifying a specific aspect of the system, ensuring that all components work correctly individually and together. 