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

## Running the Application in VSC
- make sure to install necessary modules with 'npm install'

### Back-End
1. Navigate to the project directory.
2. Start the server with:
   ```bash
   npm start
### Front-End
1. Navigate to the Frontend directory.
2. Run with:
   ```bash
   npm run serve

## Login Data
- Check the users.json file in Database folder

## Project Overview In Images
- Guest View
![Guest view](https://github.com/user-attachments/assets/a97ee843-4366-47bf-b246-3894d452b0ca)

- Factories as Guest
![Factory1](https://github.com/user-attachments/assets/b928f63a-361d-40c0-be29-790f0356846c)
![Factory2](https://github.com/user-attachments/assets/af58a98c-8b1c-455c-a20e-11a9d00bc5f1)

- Add Factory Module
![AddFactory](https://github.com/user-attachments/assets/4f79a54d-cf40-4287-879d-a9f26cd0344e)

- Admin Users Overview
![AdminWindow1](https://github.com/user-attachments/assets/b64c8a51-ce31-4f95-81bb-dc41dac11537)
![AdminWindow2](https://github.com/user-attachments/assets/aaa0a8b6-4490-4ac7-bfc7-05a3413ff575)

- Manager Factory Overview
![ManagerFactory](https://github.com/user-attachments/assets/24a3b101-88db-4f26-8278-a8f3c31015ed)

- Invalid Login
![InvalidLogin](https://github.com/user-attachments/assets/b8b36df9-242e-4173-9c77-75796712da6a)

- Customer Factory Overview
![CustomerFactory](https://github.com/user-attachments/assets/37593e55-1136-4308-a659-27bd0fc1751e)

