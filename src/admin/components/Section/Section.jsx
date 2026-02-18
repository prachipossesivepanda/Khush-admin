import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSections,
  deleteSection,
} from "../../apis/sectionApi";

const Section = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH SECTIONS =================
  const fetchSections = async () => {
    try {
      setLoading(true);

      const manualRes = await getSections({ type: "MANUAL" });
      const categoryRes = await getSections({ type: "CATEGORY" });

      const extractItems = (res) => {
        if (res?.data?.items) return res.data.items;
        if (res?.data?.data?.items) return res.data.data.items;
        return [];
      };

      const manualItems = extractItems(manualRes);
      const categoryItems = extractItems(categoryRes);

      setSections([...manualItems, ...categoryItems]);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // ================= DELETE SECTION =================
  const handleDelete = async (id) => {
    try {
      await deleteSection(id);
      fetchSections();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ================= EDIT HANDLER =================
  const handleEdit = (id) => {
    navigate(`/admin/sections/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">📦 Sections Admin</h2>
        <button
          onClick={() => navigate("/admin/sections/create")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ➕ Create Section
        </button>
      </div>

      {/* ================= SECTIONS LIST ================= */}
      {loading && <p className="text-blue-500">Loading...</p>}
      {!loading && sections.length === 0 && (
        <p className="text-red-500">No sections found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => (
          <div key={sec._id} className="bg-white border rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">{sec.title}</h3>
            <p className="text-sm text-gray-500">Type: {sec.type}</p>
            <p className="text-sm text-gray-500">
              Products: {sec.products?.length || 0}
            </p>

            <div className="mt-2 space-y-1">
              {sec.products?.map((prod) => (
                <div key={prod._id} className="text-sm">
                  • {prod.itemId} | {prod.discount?.type} :{" "}
                  {prod.discount?.value}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(sec._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sec._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
