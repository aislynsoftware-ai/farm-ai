const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function cachedRequest(endpoint, options = {}) {
  if (options.method && options.method !== 'GET') {
    cache.clear();
    return request(endpoint, options);
  }
  const cached = getCached(endpoint);
  if (cached) return Promise.resolve(cached);
  return request(endpoint, options).then((data) => {
    setCached(endpoint, data);
    return data;
  });
}

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

async function adminRequest(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
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
    register: async (name, email, phone, address, latitude, longitude) => {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, address, latitude, longitude }),
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
    login: (email, password) =>
      adminRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    verify: () =>
      adminRequest('/admin/verify', { method: 'POST' }),
    getUsers: () =>
      adminRequest('/admin/users'),
    updateUser: (userId, data) =>
      adminRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteUser: (userId) =>
      adminRequest(`/admin/users/${userId}`, { method: 'DELETE' }),
    getPayments: () =>
      adminRequest('/admin/payments'),
    getLeafPredictions: () =>
      adminRequest('/admin/leaf-predictions'),
    deleteLeafPrediction: (id) =>
      adminRequest(`/admin/leaf-predictions/${id}`, { method: 'DELETE' }),
    getUserPlans: () =>
      adminRequest('/admin/user-plans'),
    getPlans: () =>
      adminRequest('/admin/plans'),
    addPlan: (data) =>
      adminRequest('/admin/plans/add', { method: 'POST', body: JSON.stringify(data) }),
    updatePlan: (id, data) =>
      adminRequest(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlan: (id) =>
      adminRequest(`/admin/plans/${id}`, { method: 'DELETE' }),
    getDashboardStats: () =>
      adminRequest('/admin/dashboard-stats'),
    getApiPlans: () =>
      adminRequest('/admin/api-plans'),
    addApiPlan: (data) =>
      adminRequest('/admin/api-plans/add', { method: 'POST', body: JSON.stringify(data) }),
    updateApiPlan: (id, data) =>
      adminRequest(`/admin/api-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteApiPlan: (id) =>
      adminRequest(`/admin/api-plans/${id}`, { method: 'DELETE' }),
    getPredictionsTree: () =>
      adminRequest('/admin/predictions/tree'),
    getDownloadUrl: (crop, disease, type = 'all') => {
      const params = new URLSearchParams();
      if (crop) params.set('crop', crop);
      if (disease) params.set('disease', disease);
      params.set('type', type);
      return `${BASE_URL}/admin/predictions/download?${params.toString()}`;
    },
    deleteProduct: (id) =>
      adminRequest(`/admin/delete-product/${id}`, { method: 'DELETE' }),
    updateProduct: (id, formData) =>
      adminRequest(`/update_product/${id}`, { method: 'POST', body: formData, headers: {} }),
    addProduct: (formData) =>
      adminRequest('/add_product', { method: 'POST', body: formData, headers: {} }),
    // AI Services
    getAIServices: () =>
      adminRequest('/admin/ai-services'),
    addAIService: (data) => {
      const fd = new FormData();
      fd.append('name', data.name);
      if (data.image) fd.append('image', data.image);
      return adminRequest('/admin/ai-services/add', { method: 'POST', body: fd, headers: {} });
    },
    updateAIService: (id, data) => {
      const fd = new FormData();
      fd.append('name', data.name);
      if (data.image) fd.append('image', data.image);
      return adminRequest(`/admin/ai-services/${id}`, { method: 'PUT', body: fd, headers: {} });
    },
    deleteAIService: (id) =>
      adminRequest(`/admin/ai-services/${id}`, { method: 'DELETE' }),
    // Agri titles
    addAgriTitle: (title, file, aiServiceId) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('image', file);
      if (aiServiceId) fd.append('ai_service_id', aiServiceId);
      return adminRequest('/add_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    updateAgriTitle: (id, title, file, aiServiceId) => {
      const fd = new FormData();
      fd.append('id', id);
      fd.append('title', title);
      if (file) fd.append('image', file);
      if (aiServiceId) fd.append('ai_service_id', aiServiceId);
      return adminRequest('/update_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    deleteAgriTitle: (id) => {
      const fd = new FormData();
      fd.append('id', id);
      return adminRequest('/delete_agri_title', { method: 'POST', body: fd, headers: {} });
    },
    // Crops
    addCrop: (title, agriId, file) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('agri_id', agriId);
      fd.append('image', file);
      return adminRequest('/add_crop', { method: 'POST', body: fd, headers: {} });
    },
    updateCrop: (id, title, agriId, file) => {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('agri_id', agriId);
      if (file) fd.append('image', file);
      return adminRequest(`/update_crop/${id}`, { method: 'PUT', body: fd, headers: {} });
    },
    deleteCrop: (id) => adminRequest(`/delete_crop/${id}`, { method: 'DELETE' }),
    // Sub-crops
    addSubCrop: (cropId, title, file) => {
      const fd = new FormData();
      fd.append('crop_id', cropId);
      fd.append('title', title);
      fd.append('image', file);
      return adminRequest('/add_crop_sub', { method: 'POST', body: fd, headers: {} });
    },
    updateSubCrop: (id, cropId, title, file) => {
      const fd = new FormData();
      fd.append('crop_id', cropId);
      fd.append('title', title);
      if (file) fd.append('image', file);
      return adminRequest(`/update_crop_sub/${id}`, { method: 'POST', body: fd, headers: {} });
    },
    deleteSubCrop: (id) => adminRequest(`/delete_crop_sub/${id}`, { method: 'DELETE' }),
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
    tips: () => cachedRequest('/get_farming_tips'),
    crops: () => cachedRequest('/get_crop_sub'),
    agriTitles: () => cachedRequest('/get_agri_titles'),
    allCrops: () => cachedRequest('/get_crops'),
    getLeafPredictions: () => cachedRequest('/get_leaf_predictions'),
    cropWithProducts: () => cachedRequest('/get_crop_with_products'),
    wallet: (userId) => cachedRequest(`/user/wallet/${userId}`),
    aiServices: () => request('/ai-services'),
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
  apiKeys: {
    list: (userId) => request(`/api-keys?user_id=${encodeURIComponent(userId)}`),
    create: (userId) =>
      request('/api-keys/create', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }),
    regenerate: (id, userId) =>
      request('/api-keys/regenerate', {
        method: 'POST',
        body: JSON.stringify({ id, user_id: userId }),
      }),
    revoke: (id, userId) =>
      request('/api-keys/revoke', {
        method: 'POST',
        body: JSON.stringify({ id, user_id: userId }),
      }),
    usage: (userId) => request(`/api-usage/stats?user_id=${encodeURIComponent(userId)}`),
  },
  plan: {
    get: (userId) => request(`/user/plan?user_id=${encodeURIComponent(userId)}`),
    list: () => request('/plans'),
    pricing: () => request('/api-plans'),
    createOrder: (userId, plan) =>
      request('/buy-plan/create-order', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, plan }),
      }),
    verifyPayment: (data) =>
      request('/buy-plan/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    activate: (userId, plan) =>
      request('/buy-plan/activate', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, plan }),
      }),
  },
  plants: {
    list: (userId) => request(`/user/plants?user_id=${encodeURIComponent(userId)}`),
    add: (userId, plantName, file, wateringTime, intervalDays) => {
      const fd = new FormData();
      fd.append('user_id', userId);
      fd.append('plant_name', plantName);
      fd.append('watering_time', wateringTime);
      fd.append('interval_days', String(intervalDays));
      if (file) fd.append('image', file);
      return request('/user/plants/add', { method: 'POST', body: fd, headers: {} });
    },
    update: (id, data) => {
      const fd = new FormData();
      if (data.plant_name) fd.append('plant_name', data.plant_name);
      if (data.watering_time) fd.append('watering_time', data.watering_time);
      if (data.interval_days) fd.append('interval_days', String(data.interval_days));
      if (data.image) fd.append('image', data.image);
      return request(`/user/plants/${id}`, { method: 'PUT', body: fd, headers: {} });
    },
    delete: (id) => request(`/user/plants/${id}`, { method: 'DELETE' }),
    water: (id) => request(`/user/plants/${id}/water`, { method: 'POST' }),
  },
  community: {
    posts: () => request('/community/posts'),
    addPost: (userId, data) => {
      const fd = new FormData();
      fd.append('user_id', userId);
      if (data.title) fd.append('title', data.title);
      if (data.content) fd.append('content', data.content);
      if (data.image) fd.append('image', data.image);
      if (data.video) fd.append('video', data.video);
      if (data.voice) fd.append('voice', data.voice);
      return request('/community/posts/add', { method: 'POST', body: fd, headers: {} });
    },
    deletePost: (postId, userId) => request(`/community/posts/${postId}?user_id=${encodeURIComponent(userId)}`, { method: 'DELETE' }),
    replies: (postId) => request(`/community/posts/${postId}/replies`),
    addReply: (postId, userId, data) => {
      const fd = new FormData();
      fd.append('user_id', userId);
      if (data.content) fd.append('content', data.content);
      if (data.voice) fd.append('voice', data.voice);
      if (data.video) fd.append('video', data.video);
      return request(`/community/posts/${postId}/reply`, { method: 'POST', body: fd, headers: {} });
    },
    deleteReply: (replyId, userId) => request(`/community/replies/${replyId}?user_id=${encodeURIComponent(userId)}`, { method: 'DELETE' }),
  },
  shops: {
    register: (data) => {
      const fd = new FormData();
      fd.append('name', data.name);
      if (data.email) fd.append('email', data.email);
      if (data.phone) fd.append('phone', data.phone);
      fd.append('shop_name', data.shop_name);
      if (data.description) fd.append('description', data.description);
      if (data.address) fd.append('address', data.address);
      if (data.latitude) fd.append('latitude', data.latitude);
      if (data.longitude) fd.append('longitude', data.longitude);
      if (data.shop_phone) fd.append('shop_phone', data.shop_phone);
      (data.photos || []).forEach((p) => fd.append('photos', p));
      return request('/auth/register-shop', { method: 'POST', body: fd, headers: {} });
    },
    nearby: (lat, lng) => request(`/shops/nearby?lat=${lat}&lng=${lng}`),
    detail: (id) => request(`/shops/${id}`),
    myShop: (userId) => request(`/my-shop?user_id=${encodeURIComponent(userId)}`),
    update: (data) => {
      const fd = new FormData();
      fd.append('user_id', data.user_id);
      if (data.shop_name) fd.append('shop_name', data.shop_name);
      if (data.description) fd.append('description', data.description);
      if (data.address) fd.append('address', data.address);
      if (data.latitude) fd.append('latitude', data.latitude);
      if (data.longitude) fd.append('longitude', data.longitude);
      if (data.shop_phone) fd.append('shop_phone', data.shop_phone);
      (data.photos || []).forEach((p) => fd.append('photos', p));
      if (!data.photos?.length && data.photo) fd.append('photo', data.photo);
      return request('/my-shop/update', { method: 'POST', body: fd, headers: {} });
    },
    admin: {
      list: () => adminRequest('/admin/shops'),
      approve: (id) => adminRequest(`/admin/shops/${id}/approve`, { method: 'POST' }),
      reject: (id) => adminRequest(`/admin/shops/${id}/reject`, { method: 'POST' }),
    },
  },
  dailyTips: {
    list: (category) => request(`/daily-tips${category ? `?category=${encodeURIComponent(category)}` : ''}`),
    today: () => request('/daily-tips/today'),
    admin: {
      list: () => adminRequest('/admin/daily-tips'),
      add: (data) => adminRequest('/admin/daily-tips/add', { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} }),
      update: (id, data) => adminRequest(`/admin/daily-tips/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} }),
      delete: (id) => adminRequest(`/admin/daily-tips/${id}`, { method: 'DELETE' }),
    },
  },
  weather: {
    alert: (lat, lng) => request(`/weather-alert?lat=${lat}&lng=${lng}`),
  },
  plantRecs: {
    list: (category) => request(`/plant-recommendations${category ? `?category=${encodeURIComponent(category)}` : ''}`),
    categories: () => request('/plant-recommendations/categories'),
    detail: (id) => request(`/plant-recommendations/${id}`),
    admin: {
      list: () => adminRequest('/admin/plant-recommendations'),
      add: (data) => {
        const fd = new FormData();
        fd.append('category', data.category);
        fd.append('plant_name', data.plant_name);
        if (data.scientific_name) fd.append('scientific_name', data.scientific_name);
        if (data.description) fd.append('description', data.description);
        if (data.benefits) fd.append('benefits', data.benefits);
        if (data.care_tips) fd.append('care_tips', data.care_tips);
        if (data.image) fd.append('image', data.image);
        return adminRequest('/admin/plant-recommendations/add', { method: 'POST', body: fd, headers: {} });
      },
      update: (id, data) => {
        const fd = new FormData();
        fd.append('category', data.category);
        fd.append('plant_name', data.plant_name);
        if (data.scientific_name) fd.append('scientific_name', data.scientific_name);
        if (data.description) fd.append('description', data.description);
        if (data.benefits) fd.append('benefits', data.benefits);
        if (data.care_tips) fd.append('care_tips', data.care_tips);
        if (data.image_url) fd.append('image_url', data.image_url);
        if (data.image) fd.append('image', data.image);
        return adminRequest(`/admin/plant-recommendations/${id}`, { method: 'PUT', body: fd, headers: {} });
      },
      delete: (id) => adminRequest(`/admin/plant-recommendations/${id}`, { method: 'DELETE' }),
    },
  },
};

export default api;
