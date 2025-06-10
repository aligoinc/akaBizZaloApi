import axios from "axios";
import queryString from "query-string";
import { AKABIZ_API_URL } from "../constants/urlConstant.js";

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const akaBizAxiosClient = axios.create({
  baseURL: AKABIZ_API_URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

akaBizAxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default akaBizAxiosClient;
