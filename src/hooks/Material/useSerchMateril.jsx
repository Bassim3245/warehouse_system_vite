import React, { useCallback, useEffect, useState, useRef } from "react";
import { getToken, getUserInformation } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";

export default function useSerchMateril({ warehouseId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const dataUserById = getUserInformation();

  const searchMaterials = useCallback(async (isMore = false) => {
    try {
      setLoading(true);
      // Calculate next page: if loading more, use current page + 1, else reset to 1
      const pageToFetch = isMore ? pageRef.current + 1 : 1;
      const searchParams = new URLSearchParams();
      searchParams.append("search_term", searchTerm);
      searchParams.append("entity_id", dataUserById.entity_id);
      searchParams.append("warehouse_id", warehouseId);
      searchParams.append("page", pageToFetch);
      searchParams.append("limit", 10);
      const response = await axiosInstance.get(
        `/api/warehouse/SearchStoreData?${searchParams.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      if (response?.data?.response) {
        const newData = response.data.response;
        const pagination = response.data.pagination;
        
        if (isMore) {
          setSearchResults((prev) => [...prev, ...newData]);
          pageRef.current = pageToFetch;
        } else {
          setSearchResults(newData);
          pageRef.current = 1;
        }

        // Use pagination metadata if available, otherwise fallback to length check
        if (pagination) {
          setHasMore(pagination.currentPage < pagination.totalPages);
        } else {
          setHasMore(newData.length === 10);
        }
      } else {
        if (!isMore) {
          setSearchResults([]);
          pageRef.current = 1;
        }
        setHasMore(false);
      }
    } catch (error) {
      if (!isMore) {
        setSearchResults([]);
        pageRef.current = 1;
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, warehouseId, dataUserById?.entity_id]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      searchMaterials(true);
    }
  }, [loading, hasMore, searchMaterials]);

  const handleSelectMaterial = useCallback((material) => {
    setSelectedMaterial(material);
    const name = material?.material_name || material?.name_of_material || "";
    setSearchTerm(name);
  }, []);

  return {
    handleSelectMaterial,
    searchMaterials,
    loadMore,
    hasMore,
    selectedMaterial,
    searchResults,
    searchTerm,
    setSearchTerm,
    loading,
  };
}
