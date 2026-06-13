import axios from 'axios';

const API_URL = 'https://aislyn.in/admin/admin/farmly_api.php';

export async function getAllBlogs() {
  const { data } = await axios.get(API_URL);
  let blogs = data?.blogs || (Array.isArray(data) ? data : []);
  return blogs.sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at));
}

export async function getBlogBySlug(slug) {
  const { data } = await axios.get(`${API_URL}?slug=${slug}`);
  return data?.blog || (Array.isArray(data) ? data[0] : null) || null;
}
