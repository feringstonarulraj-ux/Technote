import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('technotes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// drop the stored login if the server says the token is no good
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response && err.response.status;
    if (status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.removeItem('technotes_token');
      localStorage.removeItem('technotes_admin');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const postAPI = {
  getPublic: (params) => api.get('/posts', { params }),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
  getFeatured: (limit = 3) => api.get('/posts/featured', { params: { limit } }),
  getPopular: (limit = 5) => api.get('/posts/popular', { params: { limit } }),
  getRelated: (id) => api.get(`/posts/related/${id}`),

  getAllAdmin: (params) => api.get('/admin/posts', { params }),
  getByIdAdmin: (id) => api.get(`/admin/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  togglePublish: (id) => api.patch(`/posts/${id}/publish`)
};

// categories, tags and authors all share the same CRUD shape
const crud = (path) => ({
  getAll: () => api.get(path),
  create: (data) => api.post(path, data),
  update: (id, data) => api.put(`${path}/${id}`, data),
  delete: (id) => api.delete(`${path}/${id}`)
});

export const categoryAPI = {
  ...crud('/categories'),
  getBySlug: (slug, params) => api.get(`/categories/${slug}`, { params })
};

export const tagAPI = crud('/tags');

export const authorAPI = {
  ...crud('/authors'),
  getById: (id) => api.get(`/authors/${id}`)
};

export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard')
};

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  getAll: () => api.get('/newsletter')
};

export default api;
