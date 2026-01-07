import { useState, useCallback, useMemo } from "react";
import { axiosInstance } from "../redux/api/axiosConfig";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Memoize the fetchData function to prevent unnecessary re-renders
  const fetchData = useCallback(
    async ({
      endpoint,
      method = "GET",
      params = {},
      data = null,
      onSuccess = () => {},
      onError = () => {},
    }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance({
          method,
          url: endpoint,
          params,
          data,
        });
        
        onSuccess(response.data);
        return response.data;
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
        onError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Memoize additional utility functions for common HTTP methods
  const get = useCallback(
    (endpoint, params = {}, onSuccess, onError) =>
      fetchData({ endpoint, method: "GET", params, onSuccess, onError }),
    [fetchData]
  );

  const post = useCallback(
    (endpoint, data = null, onSuccess, onError) =>
      fetchData({ endpoint, method: "POST", data, onSuccess, onError }),
    [fetchData]
  );

  const put = useCallback(
    (endpoint, data = null, onSuccess, onError) =>
      fetchData({ endpoint, method: "PUT", data, onSuccess, onError }),
    [fetchData]
  );

  const del = useCallback(
    (endpoint, onSuccess, onError) =>
      fetchData({ endpoint, method: "DELETE", onSuccess, onError }),
    [fetchData]
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    loading,
    error,
    fetchData,
    get,
    post,
    put,
    delete: del,
    clearError,
  }), [loading, error, fetchData, get, post, put, del, clearError]);
};
