# Modern CRM Application

A comprehensive Customer Relationship Management system built with modern technologies.

## Features

### Core CRM Functionality

- **Customer Management**: Complete customer profiles with contact information, communication history, and relationship tracking
- **Lead Management**: Lead capture, qualification, scoring, and conversion tracking
- **Deal Pipeline**: Visual pipeline management with drag-and-drop functionality and stage tracking
- **Contact Management**: Centralized contact database with advanced search and filtering
- **Activity Tracking**: Log calls, emails, meetings, and tasks with automated reminders

### Enhanced Features

- **Analytics Dashboard**: Real-time insights with interactive charts and KPI tracking
- **Task Management**: Project and task management with team collaboration
- **Email Integration**: Built-in email client with template management
- **Reporting System**: Customizable reports with export functionality
- **User Role Management**: Granular permissions and role-based access control
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Hook Form** for form management
- **React Query** for data fetching and caching
- **Recharts** for data visualization
- **React Router** for navigation
- **Zustand** for state management

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email functionality
- **Express Validator** for input validation

### Development Tools

- **ESLint** and **Prettier** for code quality
- **Husky** for git hooks
- **Jest** for testing
- **Docker** for containerization

## Project Structure

```
CRM/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── stores/        # State management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── package.json
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm run install:all
```

2. Set up environment variables:

   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your configuration

3. Start the development servers:

```bash
npm run dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:3000) servers.

### Environment Variables

#### Server (.env)

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your-jwt-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Client (.env)

```
VITE_API_URL=http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Leads

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Deals

- `GET /api/deals` - Get all deals
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
