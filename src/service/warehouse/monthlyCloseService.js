import { BackendUrl } from "../../redux/api/axios";
import { axiosInstance } from "../../redux/api/axiosConfig";

const monthlyCloseService = {
    /**
     * Get a preview of materials and batches that will be snapshotted (carried forward)
     */
    getMonthlyClosePreview: async (entityId, year, month, warehouseId) => {
        const response = await axiosInstance.get(
            `${BackendUrl}/api/warehouse/getMonthlyClosePreview?entityId=${entityId}&year=${year}&month=${month}&warehouseId=${warehouseId}`
        );
        return response.data;
    },

    /**
     * Delete a monthly lock (Unlock)
     */
    deleteMonthlyLockById: async (lockId) => {
        const response = await axiosInstance.delete(`${BackendUrl}/api/warehouse/deleteMonthlyLockById/${lockId}`);
        return response.data;
    },

    /**
     * Fetch documents to check their completion status before locking
     */
    getDocumentToCheckInformation: async (entityId, year, month, warehouseId) => {
        const response = await axiosInstance.get(
            `${BackendUrl}/api/warehouse/getDocumentToCheckInformation?entityId=${entityId}&year=${year}&month=${month}&warehouseId=${warehouseId}`
        );
        return response.data;
    }
};

export default monthlyCloseService;
