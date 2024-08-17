# Technical Assessment Project

This project is a Node.js application designed to upload and manage policy information in MongoDB, track real-time CPU utilization, and schedule messages based on a specific day and time.

## Features

1. **Data Upload**: Upload data from XLSX/CSV files into MongoDB using worker threads.
2. **Search API**: Search for policy information by username.
3. **Aggregation API**: Aggregate policy data by each user.
4. **CPU Utilization Monitoring**: Monitor CPU usage and restart the server if it exceeds 70%.
5. **Scheduled Messaging**: Schedule messages to be saved in the database at a specified day and time.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **os-utils**: Utility for tracking CPU usage.
- **xlsx**: Library for reading Excel files.
- **csv-parser**: Library for parsing CSV files.
- **pm2**: Process manager for Node.js applications.

## Installation and Setup

1. Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root of your project.
    - Add the following environment variables:
      ```
      MONGO_URI=<your-mongodb-uri>
      ```

4. Start the server:
    ```bash
    npm start
    ```

5. Start the CPU monitoring worker:
    ```bash
    pm2 start server.js
    ```

6. Start the scheduled message worker:
    ```bash
    npm run worker
    ```

## API Endpoints

### 1. Upload Data
- **Endpoint**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload XLSX/CSV data into MongoDB.

### 2. Search Policy by Username
- **Endpoint**: `/api/policy/search`
- **Method**: `GET`
- **Description**: Search for policy information using the username.
- **Query Parameters**: 
  - `username` (required): The first name of the user.

### 3. Aggregate Policies by User
- **Endpoint**: `/api/policy/aggregate`
- **Method**: `GET`
- **Description**: Aggregate policy data by each user.

### 4. Schedule a Message
- **Endpoint**: `/api/schedule/schedule`
- **Method**: `POST`
- **Description**: Schedule a message to be saved in the database at a specified day and time.
- **Body Parameters**:
  - `message` (required): The message to be scheduled.
  - `day` (required): The day in the format `YYYY-MM-DD`.
  - `time` (required): The time in the format `HH:MM`.

## Running Tests

To test the API endpoints, you can use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

## Additional Information

- **CPU Monitoring**: The server will automatically restart if CPU usage exceeds 70%. This is handled by `os-utils` and `pm2`.
- **Scheduled Messages**: Messages are checked every minute, and if the scheduled time has passed, they will be processed and removed from the database.

## Contributing

Please feel free to fork the project and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
