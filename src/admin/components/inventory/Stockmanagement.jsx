import { useEffect, useState, useRef } from "react";
import { PackageSearch, Warehouse as WarehouseIcon, Search, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getWarehouses,
  getWarehouseStock,
  updateWarehouseStock,
} from "../../apis/Warehouseapi";
import { getItemsWithSkus } from "../../apis/itemapi";

const STOCK_PAGE_SIZE = 10;
const ITEM_PAGE_SIZE = 10;
const LOW_STOCK_THRESHOLD = 10;

export default function Stockmanagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(true);
  const [warehousesError, setWarehousesError] = useState(null);
  const updateFormRef = useRef(null);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Warehouse Stock
  const [stock, setStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [stockSearch, setStockSearch] = useState("");
  const [stockPage, setStockPage] = useState(1);
  const [stockTotalPages, setStockTotalPages] = useState(1);
  const [stockTotalItems, setStockTotalItems] = useState(0);

  // Catalog: Items + SKUs
  const [itemSkuRows, setItemSkuRows] = useState([]);
  const [itemSkuLoading, setItemSkuLoading] = useState(false);
  const [itemSkuError, setItemSkuError] = useState(null);
  const [itemSearch, setItemSearch] = useState("");
  const [itemPage, setItemPage] = useState(1);
  const [itemTotalPages, setItemTotalPages] = useState(1);

  // Inline update: which row is being updated (warehouse stock table)
  const [updatingSku, setUpdatingSku] = useState(null);
  // Inline quantity inputs for warehouse stock rows (keyed by sku)
  const [stockEditQty, setStockEditQty] = useState({});
  // Inline quantity inputs for catalog rows (keyed by row key)
  const [catalogEditQty, setCatalogEditQty] = useState({});
  const [updatingCatalogKey, setUpdatingCatalogKey] = useState(null);

  // Top form (optional quick add)
  const [stockForm, setStockForm] = useState({ sku: "", quantity: "" });
  const [updatingStock, setUpdatingStock] = useState(false);

  // ────────────────────────────────────────────────
  // Load warehouses (once)
  // ────────────────────────────────────────────────
  useEffect(() => {
    const fetchWarehouses = async () => {
      setWarehousesLoading(true);
      try {
        const response = await getWarehouses(1, 200, "");
        const data = response?.data?.data || response?.data || {};
        const warehouseList = data.warehouses || data.items || data || [];

        const formatted = warehouseList.map((wh, idx) => {
          const addr = wh.address || {};
          return {
            id: wh._id || wh.id || `temp-${idx}`,
            name: wh.name || "",
            city: addr.city || "",
            state: addr.state || "",
            displayName: wh.name
              ? `${wh.name}${addr.city ? ` — ${addr.city}` : ""}`
              : `Warehouse ${idx + 1}`,
          };
        });

        setWarehouses(formatted);
        setWarehousesError(null);
      } catch (err) {
        console.error("Failed to load warehouses:", err);
        setWarehousesError(err?.response?.data?.message || "Failed to load warehouses");
      } finally {
        setWarehousesLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  // Load items + SKUs (catalog)
  useEffect(() => {
    const fetchItemsWithSkus = async () => {
      setItemSkuLoading(true);
      setItemSkuError(null);

      try {
        const response = await getItemsWithSkus(
          itemPage,
          ITEM_PAGE_SIZE,
          1,           // assuming this is some level/minimum SKU count or similar
          50,          // assuming this is max SKUs per item or similar
          itemSearch   // ← search term sent to backend
        );

        const data = response?.data?.data || response?.data || {};
        const items = data.items || data || [];

        const rows = [];
        items.forEach((item) => {
          const name = item.name || "—";
          const itemId = item.itemId || item._id || "";
          const skus = item.skuIds || item.skus || [];

          skus.forEach((skuId) => {
            rows.push({
              itemName: name,
              itemId,
              sku: skuId,
            });
          });
        });

        setItemSkuRows(rows);
        const pagination = data.pagination || {};
        setItemTotalPages(pagination.totalPages || pagination.pages || 1);
      } catch (err) {
        console.error("Failed to load items with SKUs:", err);
        setItemSkuError(err?.response?.data?.message || "Failed to load items/SKUs");
      } finally {
        setItemSkuLoading(false);
      }
    };

    fetchItemsWithSkus();
  }, [itemPage, itemSearch]);

  // ────────────────────────────────────────────────
  // Load warehouse stock (backend search + pagination)
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedWarehouseId) {
      setSelectedWarehouse(null);
      setStock([]);
      setStockError(null);
      setStockTotalPages(1);
      setStockTotalItems(0);
      return;
    }

    const wh = warehouses.find((w) => w.id === selectedWarehouseId) || null;
    setSelectedWarehouse(wh);

    const fetchStock = async () => {
      setStockLoading(true);
      setStockError(null);

      try {
        const response = await getWarehouseStock(
          selectedWarehouseId,
          stockPage,
          STOCK_PAGE_SIZE,
          stockSearch
        );

        // API returns { success, message, data: { data: [ ... ] } } or { data: [ ... ] }
        const resData = response?.data ?? response;
        const list = Array.isArray(resData)
          ? resData
          : Array.isArray(resData?.data)
            ? resData.data
            : resData?.stock || resData?.items || [];
        const safeList = Array.isArray(list) ? list : [];
        setStock(safeList);

        const pagination = (resData && !Array.isArray(resData) ? resData.pagination : null) || {};
        const totalFromApi = pagination.total ?? pagination.totalCount;
        const total = totalFromApi != null ? Number(totalFromApi) : null;
        let totalPages = pagination.totalPages ?? pagination.pages;
        if (totalPages == null || totalPages === undefined) {
          totalPages = total != null && total > 0
            ? Math.ceil(total / STOCK_PAGE_SIZE)
            : safeList.length >= STOCK_PAGE_SIZE
              ? stockPage + 1
              : stockPage;
        }
        const inferredTotal = total != null ? total : (stockPage - 1) * STOCK_PAGE_SIZE + safeList.length;
        setStockTotalItems(inferredTotal);
        setStockTotalPages(Math.max(1, totalPages));
      } catch (err) {
        console.error("Failed to load warehouse stock:", err);
        setStockError(
          err?.response?.data?.message || "Failed to load stock for this warehouse"
        );
      } finally {
        setStockLoading(false);
      }
    };

    fetchStock();
  }, [selectedWarehouseId, warehouses, stockPage, stockSearch]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────
  const handleWarehouseChange = (e) => {
    const value = e.target.value;
    setSelectedWarehouseId(value);
    setStock([]);
    setStockSearch("");
    setStockPage(1);
    setStockForm({ sku: "", quantity: "" });
    setStockEditQty({});
    setCatalogEditQty({});
  };

  const handleUpdateStock = async () => {
    if (!selectedWarehouseId) {
      alert("Please select a warehouse first");
      return;
    }
    const sku = stockForm.sku.trim();
    const quantity = Number(stockForm.quantity);
    if (!sku || Number.isNaN(quantity)) {
      alert("Please enter a valid SKU and quantity");
      return;
    }
    setUpdatingStock(true);
    try {
      await updateWarehouseStock(selectedWarehouseId, { sku, quantity });
      const response = await getWarehouseStock(selectedWarehouseId, stockPage, STOCK_PAGE_SIZE, stockSearch);
      const resData = response?.data ?? response;
      const list = Array.isArray(resData) ? resData : resData?.data ?? resData?.stock ?? resData?.items ?? [];
      setStock(Array.isArray(list) ? list : []);
      const pagination = (resData && !Array.isArray(resData) ? resData.pagination : null) || {};
      const total = pagination.total ?? pagination.totalCount;
      if (total != null) setStockTotalItems(Number(total));
      const totalPages = pagination.totalPages ?? pagination.pages ?? (total > 0 ? Math.ceil(Number(total) / STOCK_PAGE_SIZE) : 1);
      setStockTotalPages(Math.max(1, totalPages));
      setStockForm({ sku: "", quantity: "" });
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleUpdateStockFromRow = async (item) => {
    if (!selectedWarehouseId) return;
    const sku = item.sku || item.SKU || "";
    const quantity = Number(stockEditQty[sku] ?? item.quantity ?? 0);
    if (!sku || Number.isNaN(quantity) || quantity < 0) {
      alert("Enter a valid quantity");
      return;
    }
    setUpdatingSku(sku);
    try {
      await updateWarehouseStock(selectedWarehouseId, { sku, quantity });
      const response = await getWarehouseStock(selectedWarehouseId, stockPage, STOCK_PAGE_SIZE, stockSearch);
      const resData = response?.data ?? response;
      const list = Array.isArray(resData) ? resData : resData?.data ?? resData?.stock ?? resData?.items ?? [];
      setStock(Array.isArray(list) ? list : []);
      const pagination = (resData && !Array.isArray(resData) ? resData.pagination : null) || {};
      const total = pagination.total ?? pagination.totalCount;
      if (total != null) setStockTotalItems(Number(total));
      const totalPages = pagination.totalPages ?? pagination.pages ?? (total > 0 ? Math.ceil(Number(total) / STOCK_PAGE_SIZE) : 1);
      setStockTotalPages(Math.max(1, totalPages));
      setStockEditQty((prev) => ({ ...prev, [sku]: undefined }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingSku(null);
    }
  };

  const handleUpdateQuantityFromCatalog = async (row, rowKey) => {
    if (!selectedWarehouseId) {
      alert("Select a warehouse first to update quantity.");
      return;
    }
    const key = rowKey ?? `${row.itemId}-${row.sku}`;
    const quantity = Number(catalogEditQty[key] ?? 0);
    if (Number.isNaN(quantity) || quantity < 0) {
      alert("Enter a valid quantity");
      return;
    }
    setUpdatingCatalogKey(key);
    try {
      await updateWarehouseStock(selectedWarehouseId, { sku: row.sku, quantity });
      setCatalogEditQty((prev) => ({ ...prev, [key]: undefined }));
      const response = await getWarehouseStock(selectedWarehouseId, stockPage, STOCK_PAGE_SIZE, stockSearch);
      const resData = response?.data ?? response;
      const list = Array.isArray(resData) ? resData : resData?.data ?? resData?.stock ?? resData?.items ?? [];
      setStock(Array.isArray(list) ? list : []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingCatalogKey(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center">
            <PackageSearch size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Stock Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Select a warehouse, then update stock from the tables or the form below.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 max-w-7xl mx-auto">
        {/* Warehouse selector */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <WarehouseIcon size={20} className="text-gray-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Warehouse
              </p>
              <p className="text-sm font-medium text-gray-900">
                {selectedWarehouse?.name || "Select a warehouse"}
              </p>
            </div>
          </div>
          <div className="w-full md:w-80">
            <select
              value={selectedWarehouseId}
              onChange={handleWarehouseChange}
              disabled={warehousesLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
            >
              <option value="">
                {warehousesLoading ? "Loading..." : "Select warehouse"}
              </option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.displayName}
                </option>
              ))}
            </select>
            {warehousesError && (
              <p className="mt-1 text-xs text-red-600">{warehousesError}</p>
            )}
          </div>
        </div>

        {/* Quick update form */}
        <div
          ref={updateFormRef}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-1">Quick update (SKU + quantity)</h2>
          <p className="text-xs text-gray-500 mb-4">Or use the Update button in each table row below.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="SKU (e.g. TL-BLK-S)"
              value={stockForm.sku}
              onChange={(e) => setStockForm((prev) => ({ ...prev, sku: e.target.value }))}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
            />
            <input
              type="number"
              placeholder="Quantity"
              min="0"
              value={stockForm.quantity}
              onChange={(e) => setStockForm((prev) => ({ ...prev, quantity: e.target.value }))}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
            />
            <button
              type="button"
              onClick={handleUpdateStock}
              disabled={updatingStock || !selectedWarehouseId}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingStock ? "Updating..." : "Update stock"}
            </button>
          </div>
          {!selectedWarehouseId && (
            <p className="mt-2 text-xs text-amber-600">Select a warehouse first.</p>
          )}
        </div>

        {/* Warehouse Stock Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="border-b border-gray-100 px-4 sm:px-5 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Warehouse stock
              </h2>
              <p className="text-xs text-gray-500">
                Search by SKU or product. Enter new quantity and click Update to save.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKU or product..."
                value={stockSearch}
                onChange={(e) => {
                  setStockSearch(e.target.value);
                  setStockPage(1);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-b-xl">
            {stockLoading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading stock...</div>
            ) : stockError ? (
              <div className="py-12 text-center text-sm text-red-600">{stockError}</div>
            ) : !selectedWarehouseId ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Select a warehouse to view its stock.
              </div>
            ) : stock.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                {stockSearch.trim()
                  ? "No matching stock records found."
                  : "No stock records in this warehouse yet."}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                          New quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {stock.map((item) => {
                        const sku = item.sku || item.SKU || "";
                        const qty = item.quantity ?? 0;
                        const isLow = qty < LOW_STOCK_THRESHOLD;
                        const editVal = stockEditQty[sku] !== undefined ? stockEditQty[sku] : "";
                        const isUpdating = updatingSku === sku;
                        return (
                          <tr
                            key={item._id || item.id || sku}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 font-mono">
                              {sku || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.productName || item.name || "—"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-semibold ${isLow ? "text-red-600" : "text-gray-900"}`}>
                                {qty}
                              </span>
                              {isLow && (
                                <span className="ml-1.5 inline-block px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded-md">
                                  Low
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <input
                                type="number"
                                min="0"
                                placeholder={String(qty)}
                                value={editVal}
                                onChange={(e) => setStockEditQty((prev) => ({ ...prev, [sku]: e.target.value }))}
                                className="w-20 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-right focus:border-black focus:ring-1 focus:ring-black"
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleUpdateStockFromRow(item)}
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Pencil size={14} />
                                {isUpdating ? "Updating..." : "Update"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100 text-sm text-gray-600 bg-gray-50/50">
                  <span>
                    Showing {(stockPage - 1) * STOCK_PAGE_SIZE + 1}–{Math.min(stockPage * STOCK_PAGE_SIZE, stockTotalItems || stock.length)} of {stockTotalItems || stock.length} SKUs
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Page {stockPage} of {Math.max(1, stockTotalPages)}</span>
                    <button
                      onClick={() => setStockPage((p) => Math.max(1, p - 1))}
                      disabled={stockPage <= 1}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setStockPage((p) => Math.min(stockTotalPages, p + 1))}
                      disabled={stockPage >= stockTotalPages}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* All Items & SKUs */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="border-b border-gray-100 px-4 sm:px-5 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                All items & SKUs
              </h2>
              <p className="text-xs text-gray-500">
                Set quantity for the selected warehouse. Select a warehouse first to enable update.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search item name or SKU..."
                value={itemSearch}
                onChange={(e) => {
                  setItemSearch(e.target.value);
                  setItemPage(1);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-b-xl">
            {itemSkuLoading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading catalog...</div>
            ) : itemSkuError ? (
              <div className="py-12 text-center text-sm text-red-600">{itemSkuError}</div>
            ) : itemSkuRows.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                {itemSearch.trim()
                  ? "No matching items or SKUs found."
                  : "No items/SKUs available in catalog."}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-28">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {itemSkuRows.map((row, idx) => {
                        const key = `${row.itemId || "i"}-${row.sku}-${idx}`;
                        const qtyVal = catalogEditQty[key] !== undefined ? catalogEditQty[key] : "";
                        const isUpdating = updatingCatalogKey === key;
                        return (
                          <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {row.itemName}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-700">
                              {row.sku}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={qtyVal}
                                onChange={(e) => setCatalogEditQty((prev) => ({ ...prev, [key]: e.target.value }))}
                                disabled={!selectedWarehouseId}
                                className="w-24 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-right focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantityFromCatalog(row, key)}
                                disabled={!selectedWarehouseId || isUpdating}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Pencil size={14} />
                                {isUpdating ? "Updating..." : "Update quantity"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100 text-sm text-gray-600 bg-gray-50/50">
                  <span>Page {itemPage} of {Math.max(1, itemTotalPages)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setItemPage((p) => Math.max(1, p - 1))}
                      disabled={itemPage === 1 || itemSkuLoading}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setItemPage((p) => Math.min(itemTotalPages, p + 1))}
                      disabled={itemPage >= itemTotalPages || itemSkuLoading}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}