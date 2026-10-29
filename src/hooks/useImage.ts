import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

export const getImages = async () => {
    try {
        const response = await api.get('/api/plants/{plantId:int}/images');
        return response.data;
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
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

        const response = await api.post("/images", formData);
        return response.data;
    } catch (error) {
        console.error("Error creating image:", error);
        throw error;
    }
};

export const updateImage = async (imageId: number, image: any) => {
    try {
        const response = await api.put(`/api/plants/{plantId:int}/images/${imageId}`, image);
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
