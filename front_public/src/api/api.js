import axios from "axios";

const API_CASES_URL = "http://127.0.0.1:8000";
const API_INFECTIONS_URL = "http://127.0.0.1:8002";


export async function getCases() {
  const response = await axios.get(`${API_CASES_URL}/cases`);
  console.log("API Data:", response.data);
  return response.data;
}

export async function getInfections() {
  const response = await axios.get(`${API_INFECTIONS_URL}/infection`);
  console.log("API Infections Data:", response.data);
  return response.data;
}
