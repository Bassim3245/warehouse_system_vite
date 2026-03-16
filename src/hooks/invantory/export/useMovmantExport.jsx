import React, { useState } from "react";

export default function useMovmantExport({ materialId=null , movementMaterialId=null, refreshButton }) {
  const [materialMovements, setMaterialMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchDataByProjectId = useCallback(async () => {
    try {
      setLoading(true);
      let params;
      if (movementMaterialId) {
        params.id = movementMaterialId;
      }
      if (materialId) {
        params.materialId = materialId;
      }
      const movementsResponse = await axiosInstance.get(
        `/api/warehouse/materialExportMovements`,
        {
          params,
        },
      );
      if (movementsResponse?.data) {
        setMaterialMovements(movementsResponse?.data?.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [refreshButton]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [refreshButton]);
  return {
    materialMovements,
    loading,
    error,
  };
}
