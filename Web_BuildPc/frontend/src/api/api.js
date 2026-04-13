import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- AUTH HEADER HELPER ---
// This ensures we always grab the freshest token from localStorage
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// --- HARDWARE COMPONENT ENDPOINTS ---

export const getCPUs = async (search = '', limit = 300) => {
  const response = await axios.get(`${API_URL}/cpu`, { params: { search, limit } });
  return response.data;
};

export const getCPUById = async (id) => {
  const response = await axios.get(`${API_URL}/cpu/${id}`);
  return response.data;
};

export const getGPUs = async (search = '', limit = 300) => {
  const response = await axios.get(`${API_URL}/gpu`, { params: { search, limit } });
  return response.data;
};

export const getGPUById = async (id) => {
  const response = await axios.get(`${API_URL}/gpu/${id}`);
  return response.data;
};

export const getMotherboards = async (search = '', limit = 100) => {
  const response = await axios.get(`${API_URL}/motherboards`, { params: { search, limit } });
  return response.data;
};

export const getMotherboardById = async (id) => {
  const response = await axios.get(`${API_URL}/motherboards/${id}`);
  return response.data;
};

export const getRAMs = async (search = '', limit = 150) => {
  const response = await axios.get(`${API_URL}/ram`, { params: { search, limit } });
  return response.data;
};

export const getRAMById = async (id) => {
  const response = await axios.get(`${API_URL}/ram/${id}`);
  return response.data;
};

export const getPSUs = async (search = '', limit = 80) => {
  const response = await axios.get(`${API_URL}/psu`, { params: { search, limit } });
  return response.data;
};

export const getPSUById = async (id) => {
  const response = await axios.get(`${API_URL}/psu/${id}`);
  return response.data;
};


// --- AUTHENTICATION & USER ENDPOINTS ---

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/auth/profile`, { headers: getAuthHeaders() });
  return response.data;
};


// --- BUILD ENDPOINTS ---

export const saveBuild = async (buildData) => {
  // CRITICAL FIX: Pass headers here so the backend knows who is saving the build
  const response = await axios.post(`${API_URL}/build/save`, { build: buildData }, { headers: getAuthHeaders() });
  return response.data;
};


// --- ORDER ENDPOINTS ---

export const createOrder = async (orderData) => {
  // CRITICAL FIX: Pass headers here so the backend knows who is checking out
  const response = await axios.post(`${API_URL}/orders`, orderData, { headers: getAuthHeaders() });
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`, { headers: getAuthHeaders() });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/orders/${id}`, { headers: getAuthHeaders() });
  return response.data;
};


// --- ADMIN ENDPOINTS ---

export const adminGetOrders = async () => {
  const response = await axios.get(`${API_URL}/admin/orders`, { headers: getAuthHeaders() });
  return response.data;
};

export const adminUpdateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/admin/orders/${id}`, { status }, { headers: getAuthHeaders() });
  return response.data;
};

export const adminGetUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`, { headers: getAuthHeaders() });
  return response.data;
};

export const adminDeleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/users/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
// --- ADMIN COMPONENT CRUD ENDPOINTS ---

export const adminAddComponent = async (type, data) => {
  const response = await axios.post(`${API_URL}/admin/components/${type}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const adminUpdateComponent = async (type, id, data) => {
  const response = await axios.put(`${API_URL}/admin/components/${type}/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const adminDeleteComponent = async (type, id) => {
  const response = await axios.delete(`${API_URL}/admin/components/${type}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
// ... existing imports and functions ...

export const getSSDs = async (search = '', limit = 100) => {
  const response = await axios.get(`${API_URL}/ssd`, { params: { search, limit } });
  return response.data;
};

export const getSSDById = async (id) => {
  const response = await axios.get(`${API_URL}/ssd/${id}`);
  return response.data;
};

// Note: Ensure getMotherboardById, getRAMById, and getPSUById are already in your api.js from our previous steps!// --- UNIVERSAL COMPONENT ENDPOINT ---
export const getComponentById = async (type, id) => {
  // Map the frontend 'type' parameter to the correct backend route
  const routeMap = {
    cpu: 'cpu',
    gpu: 'gpu',
    motherboard: 'motherboards', // Backend uses plural for motherboards
    ram: 'ram',
    psu: 'psu',
    ssd: 'ssd'
  };
  
  const endpoint = routeMap[type] || type;
  const response = await axios.get(`${API_URL}/${endpoint}/${id}`);
  return response.data;
};
// --- ADMIN COMPONENT MUTATIONS ---

// Helper to map the frontend type to the correct backend route
const getRouteEndpoint = (type) => {
  const routeMap = {
    cpu: 'cpu',
    gpu: 'gpu',
    motherboard: 'motherboards', // Matches your backend plural naming
    ram: 'ram',
    psu: 'psu',
    ssd: 'ssd'
  };
  return routeMap[type] || type;
};

// Add a new component (POST)
export const addComponent = async (type, componentData) => {
  const endpoint = getRouteEndpoint(type);
  const token = localStorage.getItem('token'); // Adjust if you store your token differently
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  
  const response = await axios.post(`${API_URL}/${endpoint}`, componentData, config);
  return response.data;
};

// Update an existing component (PUT)
export const updateComponent = async (type, id, componentData) => {
  const endpoint = getRouteEndpoint(type);
  const token = localStorage.getItem('token');
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  
  const response = await axios.put(`${API_URL}/${endpoint}/${id}`, componentData, config);
  return response.data;
};

// Delete a component (DELETE)
export const deleteComponent = async (type, id) => {
  const endpoint = getRouteEndpoint(type);
  const token = localStorage.getItem('token');
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  
  const response = await axios.delete(`${API_URL}/${endpoint}/${id}`, config);
  return response.data;
};