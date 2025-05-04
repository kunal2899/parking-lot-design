# Parking Lot Design

A modular, object-oriented parking lot management system implemented in Node.js. This project simulates the core functionalities of a real-world parking lot, including vehicle entry/exit, ticketing, parking spot allocation, and fee calculation for different vehicle types.

## Features

- **Vehicle Management:** Supports multiple vehicle types (Two Wheeler, Light Motor Vehicle, Heavy Motor Vehicle, Electric Vehicle).
- **Parking Spot Allocation:** Allocates spots based on vehicle type and availability.
- **Parking Floors:** Multiple floors, each with configurable spots for different vehicle types.
- **Entry/Exit Gates:** Handles vehicle entry and exit, ticket generation, and payment processing.
- **Ticketing System:** Issues tickets on entry, logs entry/exit times, and calculates parking fees.
- **Fee Calculation:** Dynamic fee calculation based on vehicle type and parking duration.
- **Error Handling:** Robust error handling for invalid operations (e.g., double parking, invalid tickets).
- **Extensible Design:** Easily add new vehicle types, fee rules, or floor/spot configurations.
- **Concurrency Simulation:** Example of handling multiple simultaneous operations with Promises.

## Project Structure

```
parking-lot-design/
├── src/
│   ├── constants/         # Vehicle and floor constants
│   ├── models/            # Core classes (ParkingLot, Vehicle, Ticket, etc.)
│   ├── utils/             # Utility functions
│   └── index.js           # Example usage (entry point)
├── tests/                 # Unit and integration tests
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kunal2899/parking-lot-design.git
   cd parking-lot-design
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Example
To see a sample parking lot flow in action:
```bash
npm start
```
This will execute `src/index.js`, demonstrating vehicle entry, ticketing, and exit with fee calculation, including concurrent operations simulation.

### Running Tests
Comprehensive unit and integration tests are provided:
```bash
npm test
```
To run a specific test file:
```bash
npm test -- tests/Vehicle.test.js
```

## Usage & API Overview

The system is built around several core classes:
- **ParkingLot:** Manages floors, entry/exit gates, and overall operations.
- **ParkingFloor:** Represents a floor with multiple parking spots.
- **ParkingSpot:** Represents an individual spot, tracks occupancy and supported vehicle type.
- **Vehicle:** Represents a vehicle with type and registration number.
- **EntryGate/ExitGate:** Handle vehicle entry/exit, ticketing, and payment.
- **Ticket:** Tracks entry/exit times, vehicle, spot, and payment status.

### Concurrent Operations Example

The project includes a demonstration of how to handle concurrent operations using Promises:

```javascript
// In index.js
// Simulate concurrent operations - multiple vehicles entering at once
const entryPromises = [
  parkingLot.parkVehicle(vehicle1),
  parkingLot.parkVehicle(vehicle2),
  parkingLot.parkVehicle(vehicle3)
];

// Wait for all entries to complete
const tickets = await Promise.all(entryPromises);

// Simulate concurrent exit operations
const exitPromises = tickets.map(ticket => 
  parkingLot.exitVehicle(ticket)
);

// Wait for all exits to complete
const updatedTickets = await Promise.all(exitPromises);
```

### Example Flow
1. **Initialize Parking Lot:**
   ```javascript
   const parkingLot = new ParkingLot();
   parkingLot.assignParkingFloors(createParkingFloors());
   parkingLot.assignEntryGates([new EntryGate()]);
   parkingLot.assignExitGates([new ExitGate()]);
   ```

2. **Vehicle Entry:**
   ```javascript
   const availableFloor = parkingLot.getAvailableParkingFloor();
   const entryGate = parkingLot.getAvailableEntryGate();
   const ticket = entryGate.registerVehicleEntry(vehicle, availableFloor);
   ```

3. **Vehicle Exit:**
   ```javascript
   const exitGate = parkingLot.getAvailableExitGate();
   const updatedTicket = exitGate.registerVehicleExit(ticket);
   ```

See `src/index.js` for a complete example including concurrent operations.

## Customization
- **Add More Floors/Spots:** Modify `createParkingFloors` in `src/utils/parkingLot.js`.
- **Change Fee Rules:** Update fee logic in `ExitGate` model.
- **Support More Vehicle Types:** Add to `src/constants/vehicle.js` and update relevant models.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](LICENSE)

## Author
Kunal Jain

---
For any questions or issues, please open an issue on the [GitHub repository](https://github.com/kunal2899/parking-lot-design).
