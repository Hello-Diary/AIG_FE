import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_KEY

const instance = axios.create({
  baseURL: apiKey,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
