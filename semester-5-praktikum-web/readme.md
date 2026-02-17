# Ujian Praktikum Web

A simple CRUD application built with **React**, **Express**, and **PostgreSQL**. This project demonstrates basic operations such as Create, Read, Update, and Delete with separate frontend and backend implementations.

## Project Structure

The repository is divided into two main directories:

- **crud-frontend**: Contains the React-based frontend for the application.
- **crud-backend**: Contains the Express.js backend with PostgreSQL integration.

## About the Project

This project is created as part of a web development practical exam. It demonstrates the ability to build a full-stack web application, covering the following aspects:

- Designing a responsive and modern front-end interface using **React.js** and **TailwindCSS**.
- Implementing back-end APIs using **Express.js** to handle CRUD (Create, Read, Update, Delete) operations.
- Using **PostgreSQL** as the database to store and manage client data.
- Utilizing **Axios** for seamless communication between the front-end and back-end.

The project is designed to simulate real-world scenarios, such as managing client records, updating data, and building a user-friendly interface to interact with the application.

## Features

- Create, Read, Update, and Delete operations on a sample dataset.
- RESTful API for backend communication using **Axios**.
- PostgreSQL as the database for data storage.
- React for a responsive and interactive user interface.
- Styled with **Tailwind CSS** and **DaisyUI**.

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- A package manager like `npm` or `yarn`

### Backend Setup (crud-backend)

1. Navigate to the backend directory:
   ```bash
   cd crud-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the database:
   - Create a `.env` file in the `crud-backend` directory.
   - Add the following environment variables:
     ```env
     DB_HOST=your_database_host
     DB_PORT=your_database_port
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     ```

4. Start the backend server using **nodemon**:
   ```bash
   npm run dev
   ```

### Frontend Setup (crud-frontend)

1. Navigate to the frontend directory:
   ```bash
   cd crud-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server using:
   ```bash
   npm run dev
   ```

## Usage

1. Ensure the backend server is running.
2. Start the frontend development server.
3. Open your browser and navigate to `http://localhost:3000` to interact with the application.

## Tech Stack

| Technology      | Description                              |
|-----------------|------------------------------------------|
| **React**       | Frontend library for building the UI.    |
| **Express**     | Backend framework for building APIs.     |
| **PostgreSQL**  | Relational database for data storage.    |
| **Axios**       | HTTP client for API communication.       |
| **Tailwind CSS**| Utility-first CSS framework for styling. |
| **DaisyUI**     | Component library for Tailwind CSS.      |
| **Nodemon**     | Tool for running and monitoring backend. |

---

Feel free to contribute or suggest improvements to this project!
