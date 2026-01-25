import axios from "axios";

const basePath = "/api/core";

export const getDocuments = async (): Promise<any> => {
  const response = await axios.get(`${basePath}/documents`);
  return response.data;
};
