import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Package, MapPin } from "lucide-react";
import {
  getWarehouses,
  toggleWarehouseStatus,
  deleteWarehouse,
  getWarehousePincodes,
  addWarehousePincodes,
  deleteWarehousePincode,
  getWarehouseStock,
  updateWarehouseStock,
} from "../../apis/Warehouseapi";

export default function Warehouse() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Pincode Modal State
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [pincodes, setPincodes] = useState([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [newPincode, setNewPincode] = useState("");

  // Stock Modal State
  const [showStockModal, setShowStockModal] = useState(false);
  const [stock, setStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockForm, setStockForm] = useState({ sku: "", quantity: "" });

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, debouncedSearchTerm]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await getWarehouses(currentPage, limit, debouncedSearchTerm);
      const data = response?.data?.data || response?.data || {};
      
      const warehouseList = data.warehouses || data.items || data || [];
      const formatted = warehouseList.map((wh, idx) => {
        const addr = wh.address || {};
      
        return {
          id: wh._id || wh.id || `temp-${idx}`,
          name: wh.name || "",
      
          // Convert object to readable string
          address: addr.line
            ? `${addr.line}, ${addr.city}, ${addr.state} - ${addr.pinCode}, ${addr.country}`
            : "—",
      
          city: addr.city || "—",
          state: addr.state || "—",
          pincode: addr.pinCode || "—",
      
          phone: wh.phone || "—",
          email: wh.email || "",
          isActive: wh.isActive !== false,
          createdAt: wh.createdAt || "",
        };
      });
      

      setWarehouses(formatted);
      setTotalPages(data.totalPages || data.pages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load warehouses");
      console.error("Fetch warehouses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter((wh) =>
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (warehouse) => {
    const original = { ...warehouse };
    setWarehouses((prev) =>
      prev.map((wh) =>
        wh.id === warehouse.id ? { ...wh, isActive: !wh.isActive } : wh
      )
    );

    try {
      await toggleWarehouseStatus(warehouse.id);
      fetchWarehouses();
    } catch (err) {
      setWarehouses((prev) =>
        prev.map((wh) =>
          wh.id === warehouse.id ? { ...wh, isActive: original.isActive } : wh
        )
      );
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (warehouseId) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) {
      return;
    }

    try {
      await deleteWarehouse(warehouseId);
      fetchWarehouses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete warehouse");
    }
  };

  const handleEdit = (warehouse) => {
    navigate(`/admin/warehouse/edit/${warehouse.id}`);
  };

  // Pincode Management
  const handleManagePincodes = async (warehouse) => {
    console.log("🔵 handleManagePincodes called with warehouse:", warehouse);
    setSelectedWarehouse(warehouse);
    setShowPincodeModal(true);
    setPincodeLoading(true);
    try {
      console.log("🔵 Fetching pincodes for warehouse ID:", warehouse.id);
      const response = await getWarehousePincodes(warehouse.id);
      console.log("🔵 Full API response:", response);
      console.log("🔵 response type:", typeof response);
      console.log("🔵 response.data:", response?.data);
      console.log("🔵 response.data type:", typeof response?.data);
      console.log("🔵 Is response.data an array?", Array.isArray(response?.data));
      
      // API connector returns response.data, so response is already the data object
      // The structure is: { success: true, message: "...", data: [...] }
      const pincodeList = response?.data || (Array.isArray(response) ? response : []);
      console.log("🔵 Extracted pincodeList:", pincodeList);
      console.log("🔵 pincodeList length:", pincodeList.length);
      console.log("🔵 pincodeList is array?", Array.isArray(pincodeList));
      setPincodes(pincodeList);
      console.log("🔵 Pincodes state set successfully");
    } catch (err) {
      console.error("❌ Error loading pincodes:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error message:", err.message);
      setError("Failed to load pincodes");
    } finally {
      setPincodeLoading(false);
      console.log("🔵 Pincode loading finished");
    }
  };

  const handleAddPincode = async () => {
    console.log("🟢 handleAddPincode called");
    console.log("🟢 newPincode value:", newPincode);
    console.log("🟢 selectedWarehouse:", selectedWarehouse);
    
    if (!newPincode.trim()) {
      console.log("❌ Pincode is empty, showing alert");
      alert("Please enter a pincode");
      return;
    }

    try {
      const pincodeToAdd = newPincode.trim();
      console.log("🟢 Adding pincode:", pincodeToAdd);
      console.log("🟢 Warehouse ID:", selectedWarehouse.id);
      
      // API expects pinCode (not pincodes array)
      const payload = { pinCode: pincodeToAdd };
      console.log("🟢 Payload:", payload);
      
      const addResponse = await addWarehousePincodes(selectedWarehouse.id, payload);
      console.log("🟢 Add pincode API response:", addResponse);
      console.log("🟢 Add pincode response.data:", addResponse?.data);
      
      setNewPincode("");
      console.log("🟢 Cleared newPincode input");
      
      // Reload pincodes
      console.log("🟢 Reloading pincodes after add...");
      const response = await getWarehousePincodes(selectedWarehouse.id);
      console.log("🟢 Reload response:", response);
      console.log("🟢 Reload response type:", typeof response);
      console.log("🟢 Reload response.data:", response?.data);
      console.log("🟢 Is response.data an array?", Array.isArray(response?.data));
      
      // API connector returns response.data, so response is already the data object
      const pincodeList = response?.data || (Array.isArray(response) ? response : []);
      console.log("🟢 Reloaded pincodeList:", pincodeList);
      console.log("🟢 Reloaded pincodeList length:", pincodeList.length);
      console.log("🟢 Reloaded pincodeList is array?", Array.isArray(pincodeList));
      
      setPincodes(pincodeList);
      console.log("🟢 Pincodes updated successfully");
    } catch (err) {
      console.error("❌ Error adding pincode:", err);
      console.error("❌ Error type:", typeof err);
      console.error("❌ Error is string?", typeof err === 'string');
      
      // API connector returns error as string, not error object
      const errorMessage = typeof err === 'string' 
        ? err 
        : (err.response?.data?.message || err.message || "Failed to add pincode");
      
      console.error("❌ Final error message:", errorMessage);
      alert(errorMessage);
      
      // If it's a duplicate/already exists error, reload the list to show the existing pincode
      if (errorMessage.toLowerCase().includes("already") || 
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("linked")) {
        console.log("🟢 Reloading pincodes due to duplicate error...");
        try {
          const response = await getWarehousePincodes(selectedWarehouse.id);
          console.log("🟢 Duplicate error reload response:", response);
          // API connector returns response.data, so response is already the data object
          const pincodeList = response?.data || (Array.isArray(response) ? response : []);
          console.log("🟢 Reloaded pincodes after duplicate error:", pincodeList);
          setPincodes(pincodeList);
          setNewPincode("");
        } catch (reloadErr) {
          console.error("❌ Error reloading pincodes:", reloadErr);
        }
      }
    }
  };

  const handleDeletePincode = async (pincodeId) => {
    console.log("🔴 handleDeletePincode called");
    console.log("🔴 pincodeId to delete:", pincodeId);
    console.log("🔴 selectedWarehouse:", selectedWarehouse);
    
    if (!window.confirm("Are you sure you want to remove this pincode?")) {
      console.log("🔴 User cancelled deletion");
      return;
    }

    try {
      console.log("🔴 Deleting pincode with ID:", pincodeId);
      console.log("🔴 Warehouse ID:", selectedWarehouse.id);
      
      const deleteResponse = await deleteWarehousePincode(selectedWarehouse.id, pincodeId);
      console.log("🔴 Delete API response:", deleteResponse);
      console.log("🔴 Delete response.data:", deleteResponse?.data);
      
      // Reload pincodes
      console.log("🔴 Reloading pincodes after delete...");
      const response = await getWarehousePincodes(selectedWarehouse.id);
      console.log("🔴 Reload response:", response);
      console.log("🔴 Reload response type:", typeof response);
      console.log("🔴 Reload response.data:", response?.data);
      console.log("🔴 Is response.data an array?", Array.isArray(response?.data));
      
      // API connector returns response.data, so response is already the data object
      const pincodeList = response?.data || (Array.isArray(response) ? response : []);
      console.log("🔴 Reloaded pincodeList:", pincodeList);
      console.log("🔴 Reloaded pincodeList length:", pincodeList.length);
      console.log("🔴 Reloaded pincodeList is array?", Array.isArray(pincodeList));
      
      setPincodes(pincodeList);
      console.log("🔴 Pincodes updated after delete");
    } catch (err) {
      console.error("❌ Error deleting pincode:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error response.data:", err.response?.data);
      console.error("❌ Error message:", err.message);
      alert(err.response?.data?.message || "Failed to delete pincode");
    }
  };

  // Stock Management
  const handleManageStock = async (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowStockModal(true);
    setStockLoading(true);
    try {
      const response = await getWarehouseStock(warehouse.id, 1, 100);
      const data = response?.data?.data || response?.data || {};
      setStock(data.stock || data.items || data || []);
    } catch (err) {
      console.error("Error loading stock:", err);
      setError("Failed to load stock");
    } finally {
      setStockLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!stockForm.sku.trim() || !stockForm.quantity) {
      alert("Please enter SKU and quantity");
      return;
    }

    try {
      await updateWarehouseStock(selectedWarehouse.id, {
        sku: stockForm.sku.trim(),
        quantity: Number(stockForm.quantity),
      });
      setStockForm({ sku: "", quantity: "" });
      // Reload stock
      const response = await getWarehouseStock(selectedWarehouse.id, 1, 100);
      const data = response?.data?.data || response?.data || {};
      setStock(data.stock || data.items || data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
            Warehouses
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <input
            type="text"
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
          />
          <button
            onClick={() => navigate("/admin/warehouse/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 w-full sm:w-auto whitespace-nowrap"
          >
            <span>+</span> Add Warehouse
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    #
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    Address
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    City
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    State
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    Pincode
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-gray-500 text-sm"
                    >
                      Loading warehouses...
                    </td>
                  </tr>
                ) : filteredWarehouses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-gray-500 text-sm"
                    >
                      No warehouses found
                    </td>
                  </tr>
                ) : (
                  filteredWarehouses.map((wh, idx) => (
                    <tr
                      key={wh.id}
                      className="group hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-500">
                        {(currentPage - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-black">
                        <div className="max-w-[120px] sm:max-w-[200px] truncate">
                          {wh.name}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                        {wh.address || "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 max-w-[100px] sm:max-w-none truncate">
                        {wh.city || "—"}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-xs text-gray-700 max-w-[100px] sm:max-w-none truncate">
                        {wh.state || "—"}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-600">
                        {wh.pincode || "—"}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-xs text-gray-600">
                        {wh.phone || "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(wh);
                          }}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                            wh.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {wh.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right text-xs">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleManagePincodes(wh);
                            }}
                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap flex items-center gap-1"
                            title="Manage Pincodes"
                          >
                            <MapPin size={14} />
                            Pincodes
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleManageStock(wh);
                            }}
                            className="font-medium text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap flex items-center gap-1"
                            title="Manage Stock"
                          >
                            <Package size={14} />
                            Stock
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(wh);
                            }}
                            className="font-medium text-black hover:text-gray-700 transition-colors whitespace-nowrap"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(wh.id);
                            }}
                            className="font-medium text-red-600 hover:text-red-800 transition-colors whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {warehouses.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
            <div className="text-sm text-gray-700 font-medium">
              Showing <span className="font-bold">{warehouses.length}</span> of{" "}
              <span className="font-bold">{totalPages * limit}</span> warehouses
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Previous
              </button>
              <span className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700 min-w-[140px] text-center">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage >= totalPages || loading}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pincode Management Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                Manage Pincodes - {selectedWarehouse?.name}
              </h2>
              <button
                onClick={() => {
                  console.log("🟡 Closing pincode modal");
                  console.log("🟡 Current pincodes state:", pincodes);
                  setShowPincodeModal(false);
                  setSelectedWarehouse(null);
                  setPincodes([]);
                  setNewPincode("");
                  console.log("🟡 Modal closed, state cleared");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Add Pincode */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => {
                    console.log("🟢 Pincode input changed:", e.target.value);
                    setNewPincode(e.target.value);
                  }}
                  placeholder="Enter pincode (e.g., 400001)"
                  className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  onKeyPress={(e) => {
                    console.log("🟢 Enter key pressed in pincode input");
                    if (e.key === "Enter") {
                      console.log("🟢 Calling handleAddPincode from Enter key");
                      handleAddPincode();
                    }
                  }}
                />
                <button
                  onClick={() => {
                    console.log("🟢 Add button clicked");
                    console.log("🟢 Current newPincode state:", newPincode);
                    handleAddPincode();
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Pincodes List */}
              {(() => {
                console.log("🟣 Rendering pincodes list");
                console.log("🟣 pincodeLoading:", pincodeLoading);
                console.log("🟣 pincodes:", pincodes);
                console.log("🟣 pincodes.length:", pincodes.length);
                return null;
              })()}
              {pincodeLoading ? (
                <div className="text-center py-8 text-gray-500">Loading pincodes...</div>
              ) : pincodes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pincodes added yet</div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            Pincode
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pincodes.map((pin, idx) => {
                          // Extract pincode value from nested structure
                          console.log(`🟡 Rendering pincode ${idx}:`, pin);
                          const pincodeValue = pin.pincodeId?.pinCode || pin.pincode || pin.pinCode || (typeof pin === 'string' ? pin : '—');
                          const pincodeId = pin._id || pin.id;
                          console.log(`🟡 Extracted pincodeValue:`, pincodeValue);
                          console.log(`🟡 Extracted pincodeId:`, pincodeId);
                          
                          return (
                            <tr key={pincodeId || idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                {pincodeValue}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => {
                                    console.log("🟡 Delete button clicked for pincode:", pin);
                                    console.log("🟡 pincodeId to pass:", pincodeId);
                                    handleDeletePincode(pincodeId);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stock Management Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">
                Manage Stock - {selectedWarehouse?.name}
              </h2>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedWarehouse(null);
                  setStock([]);
                  setStockForm({ sku: "", quantity: "" });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Add/Update Stock */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Add / Update Stock</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={stockForm.sku}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, sku: e.target.value })
                    }
                    placeholder="Enter SKU (e.g., SKU-0-S)"
                    className="px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, quantity: e.target.value })
                    }
                    placeholder="Enter quantity"
                    min="0"
                    className="px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    onClick={handleUpdateStock}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus size={16} />
                    Update Stock
                  </button>
                </div>
              </div>

              {/* Stock List */}
              {stockLoading ? (
                <div className="text-center py-8 text-gray-500">Loading stock...</div>
              ) : stock.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No stock items found</div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            Product Name
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stock.map((item, idx) => (
                          <tr key={item._id || item.id || idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                              {item.sku || item.SKU || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.productName || item.name || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-semibold text-right">
                              {item.quantity || item.stock || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
