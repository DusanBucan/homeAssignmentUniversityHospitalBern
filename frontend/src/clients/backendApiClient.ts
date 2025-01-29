import axios from 'axios';

const BACKEND_API_BASE_URL = 'http://localhost:3000/api/v1/';
const BACKEND_API_GQL_BASE_URL = 'http://localhost:3000/graphql';

const backendApiInstanceREST = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const backendApiInstanceGQL = axios.create({
  baseURL: BACKEND_API_GQL_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { backendApiInstanceREST, backendApiInstanceGQL };
