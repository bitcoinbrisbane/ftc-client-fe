import axios from "axios";

const baseURL = process.env.NODE_ENV === 'development'
  ? "http://localhost:8080"
  : process.env.REACT_APP_API_URL;

const open = axios.create({
	baseURL: baseURL,
	headers: {
		"Cache-Control": "no-store"
	}
});

const secure = axios.create({
	baseURL: baseURL,
	headers: {
		"Cache-Control": "no-store"
	}
});

secure.interceptors.request.use(
	async (config) => {
		const user = JSON.parse(window.localStorage.getItem("user"));
		const { token } = user;
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default { open, secure };
