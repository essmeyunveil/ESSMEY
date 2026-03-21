import { createClient } from "@sanity/client";

// Create a server-side client with write permissions
const serverClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN,
});

export const createDocument = async (type, data) => {
  try {
    const result = await serverClient.create({
      _type: type,
      ...data,
    });
    return result;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const updateDocument = async (id, data) => {
  try {
    const result = await serverClient.patch(id).set(data).commit();
    return result;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (id) => {
  try {
    const result = await serverClient.delete(id);
    return result;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
