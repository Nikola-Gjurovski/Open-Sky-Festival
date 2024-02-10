# Open Sky Festival

Welcome to Open Sky Festival, a dynamic MongoDB, Express.js, Node.js project.

## Setup 🛠️

To set up Open Sky Festival, follow these steps:

1. Create a `config.env` file in the project. Structure it as follows:

    ```env
    DATABASE=YOUR_MONGODB_URL
    DATABASE_PASSWORD=YOUR_MONGODB_PASSWORD

    JWT_SECRET=YOUR_JWT_SECRET_KEY
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=90

    EMAIL_USERNAME=YOUR_EMAIL_USERNAME
    EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
    EMAIL_HOST=sandbox.smtp.mailtrap.io
    EMAIL_PORT=25
    ```

2. Install Node.js.

## How to run the project

To run the project, follow these steps:

1. Open a terminal in the project folder.
2. Enter the following code in the terminal to install required dependencies:
    ```bash
    npm install
    ```
3. After successful installation, run the following code to start the project:
    ```bash
    npm run start
    ```
4. The project will be available on port 4000. Open it in your browser by following this link:
    ```
    http://localhost:4000
    ```
