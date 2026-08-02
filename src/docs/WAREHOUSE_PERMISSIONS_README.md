# Warehouse Permission System

This document describes the enhanced warehouse permission system that provides granular control over warehouse data access and display.

## Overview

The warehouse permission system consists of several components that work together to ensure users only see and can interact with warehouse data they have permission to access.

## Components

### 1. Warehouse Permission Utilities (`src/utils/warehousePermissions.js`)

Core utility functions for warehouse permission validation:

- `hasWarehouseDisplayPermission()` - Check if user can display warehouse data
- `canAccessWarehouse()` - Check access to specific warehouse
- `filterWarehouseDataByPermissions()` - Filter warehouse data based on permissions
- `getWarehouseDispatchConfig()` - Determine dispatch configuration
- `shouldRefreshWarehouseData()` - Check if data refresh is needed

### 2. Enhanced useUserPermissions Hook (`src/hooks/useUserPermissions.js`)

The main permission hook now includes:

- Warehouse permission validation
- Filtered warehouse data
- Permission-based dispatch logic
- Optimized data fetching

**New Return Values:**
```javascript
const {
  // Existing returns...
  
  // New warehouse-specific returns
  filteredWarehouseData,        // Warehouse data filtered by permissions
  warehousePermissions,         // Permission status object
  canDisplayWarehouse,          // Boolean: can display warehouse data
  shouldDispatchWarehouse       // Boolean: should dispatch warehouse data
} = useUserPermissions();
```

### 3. Warehouse Permissions Hook (`src/hooks/useWarehousePermissions.js`)

Specialized hook for warehouse permission validation:

```javascript
const {
  // Permission checks
  canDisplayWarehouse,          // Can view warehouse data
  canManageWarehouse,           // Can add/edit/delete warehouses
  canViewWarehouseReports,      // Can access warehouse reports
  canAccessInventory,           // Can view inventory data
  hasAllWarehouseAccess,        // Has access to all warehouses
  
  // Data access
  filteredWarehouses,           // Filtered warehouse array
  accessibleWarehouseIds,       // Array of accessible warehouse IDs
  
  // Utility functions
  checkWarehouseAccess,         // Function to check specific warehouse access
  validateWarehouseOperation,   // Validate operation permissions
  getWarehouseById,             // Get warehouse by ID with permission check
  filterWarehouses              // Filter warehouses by criteria
} = useWarehousePermissions();
```

### 4. Optimized Warehouse Dispatch Hook (`src/hooks/useOptimizedWarehouseDispatch.js`)

Optimized data fetching that only loads permitted data:

```javascript
const {
  // Data
  optimizedWarehouseData,       // Optimized warehouse data
  dispatchStatus,               // Dispatch status information
  
  // Actions
  dispatchWarehouseData,        // Manual dispatch function
  refreshWarehouseData,         // Force refresh data
  fetchSpecificWarehouse,       // Fetch specific warehouse
  fetchMultipleWarehouses,      // Batch fetch warehouses
  
  // State
  isInitialized,                // Is system initialized
  isLoading,                    // Is currently loading
  hasData,                      // Has warehouse data
  canDispatch,                  // Can dispatch data
  hasPermission                 // Has warehouse permissions
} = useOptimizedWarehouseDispatch();
```

## Usage Examples

### Basic Permission Check

```javascript
import useWarehousePermissions from '../hooks/useWarehousePermissions';

const MyComponent = () => {
  const { canDisplayWarehouse, filteredWarehouses } = useWarehousePermissions();
  
  if (!canDisplayWarehouse) {
    return <div>No permission to view warehouses</div>;
  }
  
  return (
    <div>
      {filteredWarehouses.map(warehouse => (
        <div key={warehouse.id}>{warehouse.name}</div>
      ))}
    </div>
  );
};
```

### Validate Specific Operations

```javascript
const { validateWarehouseOperation, getWarehouseById } = useWarehousePermissions();

// Check if user can manage a specific warehouse
const canManageWarehouse = validateWarehouseOperation('manage', warehouseId);

// Get warehouse data with permission check
const warehouse = getWarehouseById(warehouseId);
```

### Optimized Data Fetching

```javascript
const { 
  optimizedWarehouseData, 
  refreshWarehouseData,
  dispatchStatus 
} = useOptimizedWarehouseDispatch();

// Data is automatically fetched based on permissions
// Manual refresh when needed
const handleRefresh = () => {
  refreshWarehouseData();
};
```

## Permission Types

The system recognizes several permission types:

1. **Display Permission** - Can view warehouse data
2. **Management Permission** - Can add/edit/delete warehouses
3. **Report Permission** - Can access warehouse reports
4. **Inventory Permission** - Can view inventory data
5. **All Access Permission** - Can access all warehouses

## Configuration

Permissions are determined by:

- User roles (`roles` object)
- Application permissions (`applicationPermission` object)
- Permission data array (`permissionData`)
- Hierarchy configuration (`hierarchyConfig`)

## Testing

Use the `WarehousePermissionTest` component to validate the permission system:

```javascript
import WarehousePermissionTest from '../components/WarehousePermissionTest';

// Add to your development routes
<Route path="/test-permissions" component={WarehousePermissionTest} />
```

## Migration Guide

### From Old System

1. Replace direct warehouse data usage with filtered data:
   ```javascript
   // Old
   const { wareHouseData } = useSelector(state => state.wareHouse);
   
   // New
   const { filteredWarehouseData } = useUserPermissions();
   ```

2. Add permission checks before displaying warehouse UI:
   ```javascript
   // Old
   return <WarehouseList warehouses={wareHouseData} />;
   
   // New
   const { canDisplayWarehouse, filteredWarehouses } = useWarehousePermissions();
   
   if (!canDisplayWarehouse) return <NoPermissionMessage />;
   return <WarehouseList warehouses={filteredWarehouses} />;
   ```

3. Use optimized dispatch for better performance:
   ```javascript
   // Old
   useEffect(() => {
     dispatch(getWarehouseByLabId({ entity_id, lab_id }));
   }, [entity_id, lab_id]);
   
   // New
   const { optimizedWarehouseData } = useOptimizedWarehouseDispatch();
   // Data is automatically fetched based on permissions
   ```

## Best Practices

1. **Always check permissions** before displaying warehouse-related UI
2. **Use filtered data** instead of raw warehouse data
3. **Validate operations** before allowing user actions
4. **Use optimized dispatch** to reduce unnecessary API calls
5. **Handle permission errors** gracefully with user-friendly messages

## Security Notes

- All permission checks are performed on the frontend for UX purposes
- Backend validation is still required for security
- Never rely solely on frontend permission checks for security
- Always validate permissions on the server side

## Troubleshooting

### Common Issues

1. **No warehouse data showing**: Check if user has display permissions
2. **Dispatch not working**: Verify permission configuration and user roles
3. **Filtered data empty**: Check if user has access to any warehouses
4. **Performance issues**: Use optimized dispatch hook instead of manual dispatching

### Debug Information

Enable debug logging by setting:
```javascript
localStorage.setItem('warehouse_permissions_debug', 'true');
```

This will log permission checks and dispatch decisions to the console.