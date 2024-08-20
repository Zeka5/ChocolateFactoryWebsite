# Chocolate Factory Management System

## Project Overview
This web application is designed to manage chocolate factories and includes functionalities for four types of users: Customer, Worker, Manager, and Administrator.

## User Roles and Functionalities

### Administrator
- **Create Factory**: Add a new factory by providing its name, location, working hours, and logo. You must also assign a manager who is not currently managing any other factory.

### Manager
- **Add Worker**: Register new workers for the factory they manage. Complete registration details are required.

### Worker
- **Manage Chocolate Quantities**: Update the quantity of chocolates in the factory. Changes are reflected immediately and made available for customer purchase.

### Customer
- **Browse and Purchase**: View available chocolates at factories, add them to the cart with selectable quantities (limited to in-stock amounts), and proceed to checkout.
- **Leave Review**: After a purchase is approved, leave comments and ratings for the factory.

## Running the Application

### Back-End
1. Navigate to the back-end directory.
2. Start the server with:
   ```bash
   npm start
