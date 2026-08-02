import { useGetEntitiesQuery } from "../../redux/EntitiesState/EntitiesApi";

export const useEntities = () => {
  const { data: Entities = [], isLoading, isError } = useGetEntitiesQuery();
  return { Entities, isLoading, isError };
};

export default useEntities;
