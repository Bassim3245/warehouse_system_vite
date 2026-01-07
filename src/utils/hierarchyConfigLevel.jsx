export const getWarehouseInsertLevel = (hierarchyConfig) => {
  const { hasCompany, hasFactory, hasLab, hasWarehouse } = hierarchyConfig;

  // إذا عنده شركة + مخزن فقط
  if (hasCompany && !hasFactory && !hasLab && hasWarehouse) {
    return "company"; 
  }

  // إذا عنده شركة + مصنع + مخزن
  if (hasCompany && hasFactory && hasWarehouse) {
    return "factory";
  }

  // إذا عنده مصنع + مخزن
  if (!hasCompany && hasFactory && hasWarehouse) {
    return "factory";
  }

  // إذا عنده معمل + مخزن
  if (hasLab && hasWarehouse) {
    return "lab";
  }

  // إذا عنده بس مخزن
  if (hasWarehouse && !hasCompany && !hasFactory && !hasLab) {
    return "none"; // ما يحق له
  }

  return "none";
};
