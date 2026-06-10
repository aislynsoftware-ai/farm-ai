const BASE_URL = 'https://aislynajay-product-development.hf.space';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

const api = {
  auth: {
    login: async (email) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const otp = extractOtp(res);
      if (otp) res.otp = otp;
      return res;
    },
    register: async (name, email, phone) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone }),
      });
      const otp = extractOtp(res);
      if (otp) res.otp = otp;
      return res;
    },
    verifyOtp: async (userId, otp) => {
      const res = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, otp }),
      });
      return res;
    },
    updateProfile: (userId, name, phone) =>
      request('/auth/update-profile', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, name, phone }),
      }),
    updateProfilePic: (userId, file) => {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('image', file);
      return request('/auth/update-profile-pic', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
  },
  admin: {
    // Agri titles
    addAgriTitle: (title, file) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('image', file);
      return request('/add_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    updateAgriTitle: (id, title, file) => {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('title', title);
      if (file) fd.append('image', file);
      return request('/update_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    deleteAgriTitle: (id) => {
      const fd = new FormData();
      fd.append('id', id);
      return request('/delete_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    // Crops
    addCrop: (title, agriId, file) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('agri_id', agriId);
      fd.append('image', file);
      return request('/add_crop', { method: 'POST', body: fd, headers: {} });
    },
    updateCrop: (id, title, agriId, file) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('agri_id', agriId);
      if (file) fd.append('image', file);
      return request(`/update_crop/${id}`, { method: 'PUT', body: fd, headers: {} });
    },
    deleteCrop: (id) => request(`/delete_crop/${id}`, { method: 'DELETE' }),
    // Sub-crops
    addSubCrop: (cropId, title, file) => {
      const fd = new FormData();
      fd.append('crop_id', cropId);
      fd.append('title', title);
      fd.append('image', file);
      return request('/add_crop_sub', { method: 'POST', body: fd, headers: {} });
    },
    updateSubCrop: (id, cropId, title, file) => {
      const fd = new FormData();
      fd.append('crop_id', cropId);
      fd.append('title', title);
      if (file) fd.append('image', file);
      return request(`/update_crop_sub/${id}`, { method: 'POST', body: fd, headers: {} });
    },
    deleteSubCrop: (id) => request(`/delete_crop_sub/${id}`, { method: 'DELETE' }),
  },
  predict: {
    tomato: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/leafs/tomato', { method: 'POST', body: fd, headers: {} }); },
    potato: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/leafs/potato', { method: 'POST', body: fd, headers: {} }); },
    brinjal: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/leafs/brinjal', { method: 'POST', body: fd, headers: {} }); },
    chili: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/leafs/chili', { method: 'POST', body: fd, headers: {} }); },
    ladyfinger: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/leafs/ladyfinger', { method: 'POST', body: fd, headers: {} }); },
    brinjalVeg: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/vegtables/brinjal', { method: 'POST', body: fd, headers: {} }); },
    cauliflower: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/vegtables/cauliflower', { method: 'POST', body: fd, headers: {} }); },
    cucumber: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/vegtables/cucumber', { method: 'POST', body: fd, headers: {} }); },
    ridge: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/vegtables/ridge', { method: 'POST', body: fd, headers: {} }); },
    bitterGourd: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/vegtables/bitter_gourd', { method: 'POST', body: fd, headers: {} }); },
    custardApple: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/fruits/custard_apple', { method: 'POST', body: fd, headers: {} }); },
    guava: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/fruits/guava', { method: 'POST', body: fd, headers: {} }); },
    pomegranate: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/fruits/pomegranate', { method: 'POST', body: fd, headers: {} }); },
    lemon: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/fruits/lemon', { method: 'POST', body: fd, headers: {} }); },
    tomatoFruit: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/fruits/tomato', { method: 'POST', body: fd, headers: {} }); },
    jasmine: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/flowers/jasmine', { method: 'POST', body: fd, headers: {} }); },
    rose: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/flowers/rose', { method: 'POST', body: fd, headers: {} }); },
    marigold: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/flowers/marigold', { method: 'POST', body: fd, headers: {} }); },
    chrysanthemum: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/flowers/chrysanthemums', { method: 'POST', body: fd, headers: {} }); },
    pottedPlant: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/potted_plant', { method: 'POST', body: fd, headers: {} }); },
    plantId: (userId, file) => { const fd = new FormData(); fd.append('user_id', userId); fd.append('image', file); return request('/plant_idetification', { method: 'POST', body: fd, headers: {} }); },
    foodId: (file) => { const fd = new FormData(); fd.append('image', file); return request('/food_identification', { method: 'POST', body: fd, headers: {} }); },
  },
  farming: {
    tips: () => request('/get_farming_tips'),
    crops: () => request('/get_crop_sub'),
    agriTitles: () => request('/get_agri_titles'),
    allCrops: () => request('/get_crops'),
    getLeafPredictions: () => request('/get_leaf_predictions'),
    cropWithProducts: () => request('/get_crop_with_products'),
    wallet: (userId) => request(`/user/wallet/${userId}`),
  },
  payment: {
    createOrder: (userId, amount) =>
      request('/create-order', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, amount }),
      }),
    verifyPayment: (data) =>
      request('/verify-payment', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

export default api;
