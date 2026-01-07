import { useEffect, useCallback, useMemo, useState } from "react";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";

export const useMovementMaterial = ({ materialId }) => {
  const [materialMovements, setMaterialMovements] = useState([]);
  const getDataImportInventory = useCallback(async () => {
    if (!materialId) return;
    try {
      const movementsResponse = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/materialMovements/${materialId}`,
        {
          headers: { authorization: getToken() },
        }
      );
      if (movementsResponse?.data?.data) {
        setMaterialMovements(movementsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching material movements:", error);
    }
  }, [materialId]);
  useEffect(() => {
    getDataImportInventory();
  }, [getDataImportInventory]);

  return useMemo(
    () => ({
      materialMovements,
    }),
    [materialMovements]
  );
};
