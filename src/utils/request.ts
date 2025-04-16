import axios from "axios";

const API_TOKEN = process.env.API_TOKEN || "";

if (!API_TOKEN) {
  console.error("Error: API_TOKEN environment variable is required");
  process.exit(1);
}

const API_DOMAIN = process.env.API_DOMAIN || "";

if (!API_DOMAIN) {
  console.error("Error: API_DOMAIN environment variable is required");
  process.exit(1);
}

axios.defaults.timeout = 120000;
axios.defaults.headers.common["Authorization"] = `Bearer ${API_TOKEN}`;

export const openApiV1 = axios.create({
  baseURL: `https://${API_DOMAIN}/open/v1`,
});
