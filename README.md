# Django Task Management System

A feature-rich Task Management System built using Django and PostgreSQL.

## About the Project

This project helps users organize, manage, and track their daily tasks through a responsive dashboard.

Users can create an account, manage personal tasks, track progress, set priorities, and organize work efficiently.

## Features

- User Registration, Login and Logout
- User Profile and Profile Picture
- Change Password and Delete Account
- Add, View, Edit and Delete Tasks
- User-wise Task Security
- Task Completion and Pending Status
- Priority Management (High, Medium, Low)
- Category Management (Personal, Work, Study, Shopping)
- Task Search, Filters and Sorting
- Dashboard Statistics
- Task Completion Progress Bar
- Overdue Tasks Alerts
- Priority-wise Task Chart
- Due Date Reminders
- Task Calendar
- Task Details Page
- Notes and Comments
- Task Attachments
- Responsive Dashboard Design

## Technology Stack

- Python
- Django
- PostgreSQL
- HTML
- CSS
- JavaScript
- Git and GitHub

## Project Structure

```text
PORTFOLIO/
│
├── backend/
│   ├── accounts/
│   ├── tasks/
│   ├── config/
│   ├── templates/
│   ├── media/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vishalnagar566-collab/django-task-management-system.git
```

### 2. Open Backend Folder

```bash
cd django-task-management-system/backend
```

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add your own configuration:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432
```

Do not upload your actual `.env` file or passwords to GitHub.

### 7. Run Database Migrations

```bash
python manage.py migrate
```

### 8. Start Development Server

```bash
python manage.py runserver
```

Open your browser:

http://127.0.0.1:8000/

## Developer

**Vishal Nagar**

GitHub: https://github.com/vishalnagar566-collab

## License

This project is available for learning and portfolio demonstration.