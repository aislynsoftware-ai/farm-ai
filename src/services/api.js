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
  if (!res.ok) throw new Error(data.message || data.detail || data.error || 'Request failed');
  return data;
}

function extractOtp(res) {
  return res?.otp || res?.data?.otp || res?.otp_code || res?.data?.otp_code || res?.code || null;
}

function extractUserId(res) {
  return res?.user_id || res?.data?.user_id || res?.user?.user_id || null;
}

export const auth = {
  login: async (email) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const otp = extractOtp(res);
    if (otp) res.otp = otp;
    const userId = extractUserId(res);
    if (userId) res.user_id_saved = userId;
    return res;
  },
  register: async (name, email, phone, password) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
    const otp = extractOtp(res);
    if (otp) res.otp = otp;
    const userId = extractUserId(res);
    if (userId) res.user_id_saved = userId;
    return res;
  },
  verifyOtp: async (userId, otp) => {
    const res = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, otp }),
    });
    return res;
  },
  updateProfile: (userId, name) =>
    request('/auth/update-profile', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, name }),
    }),
};
