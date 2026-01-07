import { hierarchyTypes } from "../constants/arrayFuction";
export const getHierarchyTypeName = (type) => {
  switch (type) {
    case "full":
      return hierarchyTypes[0].label;
    case "simple":
      return hierarchyTypes[1].label;
    case "factory_only":
      return hierarchyTypes[2].label;
    case "lab_only":
      return hierarchyTypes[3].label;
    default:
      return "N/A";
  }
};
