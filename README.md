# Assignment

## Exercise Requirements

Please develop a small full-stack application that performs the following:
  - File Upload: Implement drag-and-drop functionality to upload a DICOM file (use the provided example files).
  - Data Display: Show the uploaded DICOM information in a table. Each row should include:
    - Patient Name
    - Patient Birth Date
    - Series Description
    - A button to download the file
    - A button to display the DICOM image

  - DICOM Image Preview: Add a button in the table to display the DICOM image.
  - Docker Configuration: Ensure the application can run using docker-compose. Include a docker-compose.yml file in your GitHub repository.

### Required technologies
  - Docker: https://www.docker.com/resources/what-container
  - Python: Use the PyDicom library to read DICOM files (an example is provided in the attached PPT).
  - MySQL: https://hub.docker.com/_/mysql
  - Node.js: https://hub.docker.com/_/node
  - Database Query System: https://sequelize.org/
  - API Integration: https://graphql.org/
  - Web Interface: https://mui.com/ and https://reactjs.org/
  - Web API for Queries: https://github.com/axios/axios
  - DICOM Images for the Exercise: https://mb-neuro.medical-blocks.ch/shared/file/f1fcd7e0-dcb7-11ef-bab9-d5719e95527c

# Solution Overview

The current version implements all assignment requirements, and planned improvements for the next version of the solution are listed below.

The first version is implemented using Nest.js on the backend and React.js on the frontend.
Git commits follow semantic commit messages so the changelog can be generated automatically.
A Docker multistage build is used for the frontend Docker image to reduce image size.

## Assumptions

The following assumptions were made:

1. For simplicity, it is acceptable to use the local file system as object storage, but the implementation should be flexible enough to easily replace it with cloud object storage like AWS S3.   
2. Authentication and authorization can be omitted since this is just an interview assignment. However, we can discuss potential implementation approaches during the assignment review call.   
3. It is acceptable to create a Python package for DICOM image processing and call it from the Node.js backend as a child process when a user requests a new file upload.   
4. The PowerPoint presentation includes Python code for DICOM image processing, so it is okay to reuse it as is.
5. It is acceptable to use standard MUI styles for the UI. The UI should include all required functionalities, but it does not need to look identical to the frontend design in the PowerPoint presentation.   
6. Unit and integration tests are not required since this is just an interview assignment.
7. The database model is developed to cover use cases for the assignment and can be extended in the future if needed.
8. Cornerstone.js can be used for DICOM image preview.

# Setup Steps

## Quick Start

- From the root folder, run `docker-compose -f docker-compose.yaml up`
  - The first time it may take longer since it is building Docker images for the frontend and backend.

- The following services/apps will be started:
  - `mysql` database on port `3306`
  - `adminer` database web client running on `http://localhost:8080`
  - `backend_api` on port `3000`
  - `frontend` on port `80`

## Local Development Requirements

- Node.js 20.18.1
- Python 3.12.8
- Poetry
- Virtualenv
- Docker
- Docker-compose
- MySQL or a Docker container for MySQL

## Individual Apps Setup Steps

- Backend:
  - Start the database `docker-compose -f docker-compose-local-dev.yaml up`
  - Go to the root folder of the repo.
  - Run `virtualenv dicom-parser-venv`
  - Run `source ./dicom-parser-venv/bin/activate`
  - Run `cd ./backend-api`
  - Run `cd ./dicom-parser`
  - Run `poetry install`
  - Run `cd ../`
  - Run `npm ci`
  - Create `.env` file based on `.env.example`
  - Configure `.env` if needed (turn `on/off DB_INIT flag`)
  - Start the database if needed.
  - Run `npm run start:dev`

- Frontend:
  - Go to the root folder of the repo.
  - Run `cd ./frontend`
  - Run `npm ci`
  - Run `npm run dev` (for development mode)
  - Configure `.env` if needed.

# Improvements

## Backend

- Implement transactions when creating/updating composite entities (e.g., `FileModel`).
- Add proper logging by implementing a separate logging module.
  - Log formatting
  - Log transportation
- Add authentication.
- Add authorization (e.g., role-based guards and resource-based guards).
- Implement a more advanced object-storage service (e.g., use AWS CLI to write to S3).
- Extend the database model based on DICOM metadata when needed.
- Implement a custom configuration service.
- Write tests.
- Implement rate limiting.
- Add caching when needed.
- Comply with company security and data policies.
- Implement DTO validations

## Frontend

- Add theme support so all pages use the same style.
- Implement logging.
- Add authorization.
- Make the app more responsive.
- Write tests.
- Use HTTPS.
- Use a GraphQL client instead of Axios.

## Infrastructure

- Ensure the `backend-api` container waits for the database to be ready before accepting connections (bash script).
- Configure Nginx as an API gateway in front of the `backend-api` service.
- Avoid building Python from source in the backend Docker image (find another image with the desired Python version).

