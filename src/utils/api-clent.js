import axios from "axios";

const DATABASE_URL = "http://localhost:4000/api";

async function client(endpoint, customeConfig = {}) {
  const config = {
    method: "get",
    ...customeConfig,
  };
  try {
    const response = await axios(`${DATABASE_URL}/${endpoint}`, config);
    return response.data;
  } catch (error) {
    return Promise.reject(error.response ? error.response.data : error);
  }
}
export { client };
