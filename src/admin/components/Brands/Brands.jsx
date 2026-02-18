import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBrands,
  deleteBrand,
} from "../../apis/BrandApi";

const Brand = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH BRANDS =================
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await getBrands();
      const brandList = res?.data?.data?.brands || res?.data?.brands || [];
      setBrands(brandList);
    } catch (err) {
      console.error("❌ Fetch brands error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);


  // ================= DELETE BRAND =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(id);
      fetchBrands();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete brand");
    }
  };

  // ================= EDIT HANDLER =================
  const handleEdit = (brand) => {
    navigate(`/admin/brands/edit/${brand._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Brand Management
          </h1>
          <button
            onClick={() => navigate("/admin/brands/create")}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Add Brand
          </button>
        </div>

        {/* BRANDS TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">All Brands</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No brands found. Add your first brand above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Logo
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="relative whitespace-nowrap px-6 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {brands.map((brand) => (
                    <tr
                      key={brand._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        {brand.icon?.imageUrl ? (
                          <img
                            src={brand.icon.imageUrl}
                            alt={brand.name}
                            className="h-10 w-10 rounded-md object-contain ring-1 ring-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No logo
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {brand.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="mr-3 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Brand;