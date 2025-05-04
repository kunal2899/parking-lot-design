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
This will execute `src/index.js`, demonstrating vehicle entry, ticketing, and exit with fee calculation.

### Running Tests
Comprehensive unit and integration tests are provided:
```bash
npm test
```
To run a specific test file:
```bash
npm test -- tests/Vehicle.test.js
```

## Usage & Models Overview

The system is built around several core classes:
- **ParkingLot:** Manages floors, entry/exit gates, and overall operations.
- **ParkingFloor:** Represents a floor with multiple parking spots.
- **ParkingSpot:** Represents an individual spot, tracks occupancy and supported vehicle type.
- **Vehicle:** Represents a vehicle with type and registration number.
- **EntryGate/ExitGate:** Handle vehicle entry/exit, ticketing, and payment.
- **Ticket:** Tracks entry/exit times, vehicle, spot, and payment status.

### Example Flow
1. **Initialize Parking Lot:**
   - Create a `ParkingLot` instance.
   - Assign floors, entry gates, and exit gates.
2. **Vehicle Entry:**
   - Register a vehicle at an entry gate.
   - Allocate an available spot and generate a ticket.
3. **Vehicle Exit:**
   - Present the ticket at an exit gate.
   - Calculate the fee based on duration and vehicle type.
   - Mark the spot as available.

See `src/index.js` for a runnable example.

## Customization
- **Add More Floors/Spots:** Modify `createParkingFloors` in `src/utils/parkingLot.js`.
- **Change Fee Rules:** Update fee logic in `ExitGate` model.
- **Support More Vehicle Types:** Add to `src/constants/vehicle.js` and update relevant models.
