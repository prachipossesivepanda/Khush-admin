import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPincodes, deletePincode } from "../../apis/PincodeApi";
import { Plus, Trash2, Edit } from "lucide-react";

const PincodePage = () => {
  const navigate = useNavigate();
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    try {
      setLoading(true);
      const res = await getPincodes();

      console.log("FULL RESPONSE 👉", res);
      console.log("DATA 👉", res.data);
      console.log("PINCODE LIST 👉", res.data.data);

      setPincodes(res.data || []); // ✅ FINAL FIX
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load pincodes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pincode) => {
    if (!window.confirm("Are you sure you want to delete this pincode?")) return;

    try {
      await deletePincode(pincode);
      fetchPincodes();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete pincode");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Serviceable Pincodes
          </h1>

          <button
            onClick={() => navigate("/admin/pincode/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Pincode
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : pincodes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No pincodes yet
            </h3>
            <p className="text-gray-500">Add your first serviceable pincode</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Pincode
                    </th>
                    <th className="px-8 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pincodes.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/60 transition-colors duration-150"
                    >
                      <td className="px-8 py-4 font-medium text-gray-900">
                        {item.pinCode}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/pincode/edit/${item.pinCode}`)
                            }
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} strokeWidth={2} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.pinCode)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PincodePage;