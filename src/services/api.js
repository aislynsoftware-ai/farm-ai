const BASE_URL = 'https://aislynajay-product-development.hf.space';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.detail || 'Request failed');
  return data;
}

export const auth = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, phone, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    }),
  verifyOtp: (email, otp) =>
    request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),
  updateProfile: (data) =>
    request('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const user = {
  wallet: (userId) => request(`/user/wallet/${userId}`),
};

export const payment = {
  createOrder: (data) =>
    request('/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPayment: (data) =>
    request('/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const farming = {
  tips: () => request('/get_farming_tips'),
  crops: () => request('/get_crops'),
  cropSub: () => request('/get_crop_sub'),
  cropWithProducts: () => request('/get_crop_with_products'),
  tipsDetail: () => request('/get_tips'),
  agriTitles: () => request('/get_agri_titles'),
  leafs: (crop) => request(`/leafs/${crop}`),
  vegetables: (veg) => request(`/vegtables/${veg}`),
  fruits: (fruit) => request(`/fruits/${fruit}`),
  flowers: (flower) => request(`/flowers/${flower}`),
};

export default { auth, user, payment, farming };
