# LearnAI – AI-Powered E-Learning Personalized Recommendation System

LearnAI is a full-stack e-learning platform that uses machine learning and learner activity to provide personalized course recommendations and predict suitable course difficulty levels.

The platform aims to make online learning more personalized by considering learners' interests, skills, educational backgrounds, goals, and learning progress.

## Key Features

### Authentication and Security
- User registration and login
- Google OAuth 2.0 authentication
- Forgot password and password reset
- JWT-based authentication using HTTP-only cookies
- Role-based access control

### Learner Management
- Personalized learner profiles
- Interest, skill, and learning-goal management
- Profile updates and persistence

### Course and Enrollment Management
- Course catalog
- Course enrollment
- Learning progress tracking
- Course completion management

### Personalized Recommendations
- Content-based course recommendation engine
- Learner interest and skill matching
- Recommendations based on course interactions
- Exclusion of already-enrolled and dismissed courses

### Machine Learning Integration
- Python-based ML prediction service
- Random Forest classification model
- Course difficulty prediction
- Prediction confidence and model metrics
- Integration between the Node.js backend and Flask ML service

### Admin Dashboard
- User listing and search
- User role management
- Learner, instructor, and administrator roles

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Machine Learning | Python, Flask, Scikit-learn |
| ML Algorithm | Random Forest |
| Authentication | JWT, Google OAuth 2.0, bcrypt |
| Development Tools | Git, GitHub, Postman, pgAdmin |

## Project Structure

```text
ai-powered-elearning-recommendation-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── prisma/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── ml-service/
│   ├── app.py
│   ├── train.py
│   ├── model.joblib
│   └── metrics.json
│
├── .gitignore
└── README.md
```

## System Architecture

1. The React frontend provides the learner and administrator interfaces.
2. The Express backend handles authentication, authorization, course management, enrollments, interactions, and recommendations.
3. PostgreSQL stores user, course, enrollment, interaction, and prediction information.
4. Prisma ORM manages database operations.
5. The Flask ML service provides course difficulty predictions using the trained Random Forest model.
6. The backend communicates with the ML service and returns prediction results to the frontend.

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Python 3
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sonali18-tech/ai-powered-elearning-recommendation-system.git

cd ai-powered-elearning-recommendation-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure the backend environment variables in a `.env` file using the required values for your database, JWT, email, Google OAuth, and ML service connection.

Run database migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Machine Learning Service Setup

Open another terminal:

```bash
cd ml-service

python -m venv venv
```

Activate the environment:

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask service:

```bash
python app.py
```

The ML service is configured to run locally on port `8000`.

## Application Services

| Service | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| ML Service | http://127.0.0.1:8000 |

## Security Measures

- Password hashing using bcrypt
- JWT authentication with HTTP-only cookies
- Role-based authorization
- Protected API routes
- Request validation
- Helmet security middleware
- Rate limiting
- Secure password-reset token handling

## Future Scope

- Advanced learner behavior analysis
- Improved recommendation algorithms
- Larger real-world learning datasets
- Cloud deployment and scalability enhancements
- Additional learning analytics

## Project Repository

[GitHub – LearnAI](https://github.com/Sonali18-tech/ai-powered-elearning-recommendation-system)

---

**LearnAI – Making Online Learning More Personalized.**
