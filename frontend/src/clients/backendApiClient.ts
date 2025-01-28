import axios from 'axios';

const BACKEND_API_BASE_URL = 'http://localhost:3000/api/v1/';

const restInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const graphQlInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { restInstance, graphQlInstance };
