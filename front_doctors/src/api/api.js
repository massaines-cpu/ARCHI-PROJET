

import axios from "axios";

const API_PASSERELLE_URL = "http://127.0.0.1:8005";
const API_CASES_URL = "http://127.0.0.1:8000";
const API_INFECTIONS_URL = "http://127.0.0.1:8002";

export async function getCases() {
  try {
    const response = await axios.get(`${API_PASSERELLE_URL}/cases`);
    return response.data;
  } catch {
    console.warn("Passerelle down, fallback direct cases");
    const response = await axios.get(`${API_CASES_URL}/cases`);
    return response.data;
  }
}

export async function getInfections() {
  try {
    const response = await axios.get(`${API_PASSERELLE_URL}/infection`);
    return response.data;
  } catch {
    console.warn("Passerelle down, fallback direct infections");
    const response = await axios.get(`${API_INFECTIONS_URL}/infection`);
    return response.data;
  }
}

export async function addCase(caseData) {
  try {
    const response = await axios.post(`${API_PASSERELLE_URL}/case`, caseData);
    return response.data;
  } catch {
    console.warn("Passerelle down, fallback direct addCase");
    const response = await axios.post(`${API_CASES_URL}/case`, caseData);
    return response.data;
  }
}

//import axios from "axios";
//
//const API_CASES_URL = "http://127.0.0.1:8000";
//const API_INFECTIONS_URL = "http://127.0.0.1:8002";
//
//
//export async function getCases() {
//  const response = await axios.get(`${API_CASES_URL}/cases`);
//  console.log("API Data:", response.data);
//  return response.data;
//}
//
//export async function getInfections() {
//  const response = await axios.get(`${API_INFECTIONS_URL}/infection`);
//  console.log("API Infections Data:", response.data);
//  return response.data;
//}
//
//export async function addCase(caseData) {
//  const response = await axios.post(`${API_CASES_URL}/case`, caseData);
//  return response.data;
//}