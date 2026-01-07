import React, { useCallback, useEffect, useState } from "react";
import { getToken, getUserInformation } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";

export default function useSerchMateril({ warehouseId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dataUserById = getUserInformation();

  const searchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      searchParams.append("search_term", searchTerm);
      searchParams.append("entity_id", dataUserById.entity_id);
      searchParams.append("warehouse_id", warehouseId);
      const response = await axiosInstance.get(
        `/api/warehouse/SearchStoreData?${searchParams.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );
      if (response?.data?.response) {
        setSearchResults(response.data.response);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, warehouseId, dataUserById?.entity_id]);

  const handleSelectMaterial = useCallback((material) => {
    setSelectedMaterial(material);
    const name = material?.material_name || material?.name_of_material || "";
    setSearchTerm(name);
  }, []);

  return {
    handleSelectMaterial,
    searchMaterials,
    selectedMaterial,
    searchResults,
    searchTerm,
    setSearchTerm,
    loading,
  };
}
