# E-Learning Platform

An advanced e-learning platform designed for seamless course management and an exceptional user experience for both buyers (students) and sellers (instructors). This platform incorporates real-time data tracking, responsive design, and robust functionality tailored to meet the needs of modern users.

---

## Features

### Overall Features
- **Fully Responsive Design**: Ensures a seamless experience across all devices.
- **Real-Time Data Tracking**: Monitor course sales in real-time.
- **Theme Toggling Functionality**: Switch between light and dark modes effortlessly.
- **Login as Guest Functionality**: Enables users to explore the platform without registration.
- **Light and Dark Mode**: Personalized themes for enhanced user satisfaction.
- **Integrated PhonePe Payment Gateway**: Secure and reliable payment processing.

---

### Features for Buyers (Students)
- **Responsive UI/UX**: Optimized for user engagement and satisfaction.
- **Seamless Navigation**: Easy-to-use interface for browsing and purchasing courses.
- **Course Search Functionality**: Locate courses with precision.
- **Sorting by Price**: Helps users find courses within their budget.
- **My Learning Page**: Dedicated section to manage purchased courses.
- **Edit Profile Page**: Allows users to update their profiles effortlessly.

### Features for Instructors (Sellers)
- **Instructor Dashboard**: Create courses, track sales, and analyze revenue in one place.
- **Auto-Navigation During Course Creation**: Simplifies the course setup process.
- **Edit and Manage Courses**: Update course details or toggle course availability dynamically.

---

## Technologies Used
- **Frontend**: React.js, Tailwind CSS, Shadcn
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Gateway**: PhonePe Integration
- **State Management**: ContextAPI
- **Authentication**: JWT-based authentication

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/KumarRahul01/Eduvanza.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Eduvanza
   ```
3. Navigate to Client Side (Frontend):
    ```bash
    cd client
    ```

4. Navigate to Server Side (Backend):
   ```bash
   cd server
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Set up environment variables for client side in a `.env` file:
   ```plaintext
   VITE_BACKEND_URL=<your-backend-url>
   VITE_GUEST_EMAIL=<your-guest-email>
   VITE_GUEST_PASSWORD=<your-guest-email-password>
   ```

7. Set up environment variables for server side in a `.env` file:
   ```plaintext


   // Backend Variables
   MONGO_URI=
   PHONEPE_API_KEY=<your-phonepe-api-key>
   PORT=<your-backend-port>
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>

   // PhonePe Variables
   SALT_KEY= <your-phonepe-salt-key>
   MERCHANT_ID= <your-phonepe-merchant-id>
   FRONTEND_URL=<your-frontend-url>
   BACKEND_URL=<your-backend-url>

   // Cloudinary Variables
   API_KEY=<your-cloudinary-api-key>
   API_SECRET=<your-cloudinary-secret-key>
   CLOUD_NAME=<your-cloudinary-cloud-name>

   ```
8. Start the client side:
   ```bash
   cd client npm run dev

9. Start the development server:
   ```bash
   cd server npm index.js 

10. Access the app in your browser at `http://localhost:5173`.

---
