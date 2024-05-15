HR-Portal
Overview
HR-Portal is a comprehensive human resource management tool designed to facilitate efficient interactions between HR personnel and employees. This platform allows HR staff to manage employee records, send messages, and schedule or cancel meetings with ease. The system is intended for use by both HR departments and employees, streamlining administrative tasks and communication.

Features
Employee Management: Keep track of employee information and records.
Messaging: HR can send messages directly to employees using a robust chat system.
Meeting Scheduling: Easily schedule, update, and cancel meetings with employees.
Security: Special hidden signup route for HR to enhance security.
Target Audience
This application is intended for human resource departments and employees seeking a unified platform to manage HR-related activities and communication.

Tech Stack
Frontend: React, HTML, CSS, Bootstrap
Backend: Node.js, Express.js, EJS
Database: MongoDB
Real-Time Chat: Integrated with ChatEngine for real-time messaging capabilities.
Installation
Before installing the HR-Portal, ensure you have Node.js and MongoDB installed on your system. You can download and install them from their respective official websites.

Clone the Repository

git clone https://your-repository-url.git
cd HR-Portal

Install Dependencies

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install


Run the Application

# Run the backend server
npm start

# In a new terminal, run the frontend
cd frontend
npm run dev

Usage
After running the application as described above, open your web browser and access the frontend at http://localhost:3000.

To access the hidden HR signup page, navigate to http://localhost:3001/admin.

Contribution
Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

Security
For security purposes, certain features such as HR account creation are restricted and can only be accessed through specific routes as mentioned.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Thanks to ChatEngine for providing the tools necessary for real-time communication features.