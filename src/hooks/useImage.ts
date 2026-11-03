import axios from 'axios';
import type { ImageDTO } from "@/types/image";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

export const getImageUrl = (imageUrl: string): string =>
  new URL(imageUrl, import.meta.env.VITE_API_BASE_URL).toString();

export const getImages = async (plantId: number): Promise<ImageDTO[]> => {
  const response = await api.get<ImageDTO[]>(`/api/plants/${plantId}/images`);

  if (response.status === 204) {
    return [];
  }

  return response.data;
};

export const createImage = async (
    file: File,
    plantId: number,
    isProfilePicture: boolean
) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("plantId", String(plantId));
        formData.append("isProfilePicture", String(isProfilePicture));

        const response = await api.post(`/api/plants/${plantId}/images`, formData);
        return response.data;
    } catch (error) {
        console.error("Error creating image:", error);
        throw error;
    }
};

export const updateImage = async (file: File, plantId: number, imageId: number) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("plantId", String(plantId));

        const response = await api.put(`/api/plants/${plantId}/images/${imageId}`, formData);
        return response.data;
    } catch (error) {
        console.error("Error updating image:", error);
        throw error;
    }
};

export const deleteImage = async (imageId: number) => {
    try {
        const response = await api.delete(`/api/plants/{plantId:int}/images/${imageId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};
