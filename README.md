# Streamlining Gas Station Price Signage Management

GasTechSign is an innovative system designed to revolutionize the way gas stations manage their signage, particularly focusing on price signs. Leveraging cutting-edge technology, GasTechSign provides gas station owners and operators with a comprehensive platform to control, update, and synchronize their price signs effortlessly.

## Key Features

- **Remote Access:** GasTechSign can be accessed remotely, allowing operators to manage signage operations from anywhere, at any time, using mobile devices or computers.

- **Real-time Updates:** With GasTechSign, changes to pricing or promotional content are reflected instantly on the price signs, ensuring accurate and up-to-date information for customers.

GasTechSign is the ultimate solution for gas station owners looking to full remote gas price sign.

## Requirement to run the project

1. Auth0 for authentication
2. PostgreSQL for DB
3. Google Map API
   - Maps JavaScript API
   - Places API
   - Geocoding API

## Installation

To install GasTechSign and set up the database using Prisma, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/KhaledGharib/GasTechSign.git
   ```

2. Navigate to the project directory:

   ```bash
   cd GasTechSign
   ```

3. Configure .env:

   - Rename the `.env.example` file to `.env` and then modify the `.env` file as needed for your specific configuration, including adding API keys and other environment variables required by the application.

4. Install dependencies:

   ```bash
   npm install
   ```

5. Run database migrations using Prisma:

   ```bash
   npx prisma migrate dev
   ```

6. Build & Run the Application:

   ```bash
   # Build
   npm run build

   # Run
   npm run start
   ```
