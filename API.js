import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure your API base URL here
const API_BASE_URL = 'https://your-api-url.com/api';

// Helper function to get auth token
const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth APIs
export const login = async (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password, phone) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone }),
  });
};

export const getCurrentUser = async (token) => {
  return apiRequest('/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Task APIs
export const getTasks = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  return apiRequest(`/tasks${queryString ? `?${queryString}` : ''}`);
};

export const getTaskById = async (taskId) => {
  return apiRequest(`/tasks/${taskId}`);
};

export const createTask = async (taskData) => {
  return apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (taskId, updates) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteTask = async (taskId) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

export const assignTask = async (taskId, memberId) => {
  return apiRequest(`/tasks/${taskId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ assigned_to: memberId }),
  });
};

export const uploadTaskPhoto = async (taskId, photoUri) => {
  const formData = new FormData();
  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: 'task-photo.jpg',
  });

  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/upload-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Photo upload failed');
  }

  return response.json();
};

// Team APIs
export const getTeams = async () => {
  return apiRequest('/teams');
};

export const createTeam = async (teamData) => {
  return apiRequest('/teams', {
    method: 'POST',
    body: JSON.stringify(teamData),
  });
};

export const getTeamMembers = async (teamId) => {
  return apiRequest(`/teams/${teamId}/members`);
};

export const addTeamMember = async (teamId, userId) => {
  return apiRequest(`/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
};

// Notification APIs
export const sendEmailNotification = async (taskId, recipientId) => {
  return apiRequest('/notifications/send-email', {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId, recipient_id: recipientId }),
  });
};

export const sendSMSNotification = async (taskId, recipientId) => {
  return apiRequest('/notifications/send-sms', {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId, recipient_id: recipientId }),
  });
};
