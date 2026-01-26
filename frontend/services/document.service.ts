import axios from "axios";

const basePath = "/api/core";

export const getDocuments = async (): Promise<any> => {
  const response = await axios.get(`${basePath}/documents`);
  return response.data;
};

export const createFolder = async (folder: any): Promise<any> => {
  const response = await axios.post(`${basePath}/create-folder`, folder);
  return response.data;
};

export const uploadFile = async (file: any): Promise<any> => {
  const response = await axios.post(`${basePath}/upload-file`, file);
  return response.data;
};

export const deleteDocument = async (id: string): Promise<any> => {
  const response = await axios.delete(`${basePath}/documents/${id}`);
  return response.data;
};
