import axios from "axios";

// const devEnv = process.env.NODE_ENV !== "production";

// const { REACT_APP_DEV_API, REACT_APP_PROD_API } = process.env;

// const API = axios.create({
//   baseURL: `${devEnv ? REACT_APP_DEV_API : REACT_APP_PROD_API}`,
// });
const API = axios.create({ baseURL: "http://localhost:3001" });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const signIn = (formData) => API.post("/api/users/signin", formData);
export const signUp = (formData) => API.post("/api/users/signup", formData);
export const verfyOPT = (result) => API.post("/api/verify_otp", result);

export const createPost = (postData) =>
  API.post("/api/post", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getPosts = () => API.get("/api/post");
//export const getPosts = (page) => API.get(`/posts?page=${page}`);
export const getPost = (id) => API.get(`/api/post/${id}`);
export const deletePost = (id) => API.delete(`/api/post/${id}`);
export const updatePost = (updatedPostData, id) =>
  API.put(`/api/post/${id}`, updatedPostData);
export const getPostsByUser = (userId) =>
  API.get(`/api/post/userPosts/${userId}`);

export const getPostsBySearch = (searchQuery) =>
  API.get(`/api/post/search?searchQuery=${searchQuery}`);
