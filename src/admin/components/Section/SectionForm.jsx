// SectionForm.jsx - Reusable form component for Create/Edit Section
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import {
  createSection,
  updateSection,
  getSections,
} from "../../apis/sectionApi";

const SectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "MANUAL",
    sectionDiscountType: "PERCENT",
    sectionDiscountValue: "",
    externalLink: "",
    navigate: "",
    products: [{ itemId: "", discountType: "PERCENT", discountValue: "" }],
  });

  // Load section data if editing
  useEffect(() => {
    if (isEdit) {
      const loadSection = async () => {
        try {
          setLoading(true);
          const manualRes = await getSections({ type: "MANUAL" });
          const categoryRes = await getSections({ type: "CATEGORY" });

          const extractItems = (res) => {
            if (res?.data?.items) return res.data.items;
            if (res?.data?.data?.items) return res.data.data.items;
            return [];
          };

          const allSections = [
            ...extractItems(manualRes),
            ...extractItems(categoryRes),
          ];
          const section = allSections.find((s) => s._id === id);

          if (section) {
            setForm({
              title: section.title || "",
              type: section.type || "MANUAL",
              sectionDiscountType: section.discount?.type || "PERCENT",
              sectionDiscountValue: String(section.discount?.value || ""),
              externalLink: section.navigation?.externalLink || "",
              navigate: section.navigation?.navigate || "",
              products:
                section.products?.map((p) => ({
                  itemId: p.itemId || "",
                  discountType: p.discount?.type || "PERCENT",
                  discountValue: String(p.discount?.value || ""),
                })) || [{ itemId: "", discountType: "PERCENT", discountValue: "" }],
            });
          }
        } catch (err) {
          console.error("Error loading section:", err);
        } finally {
          setLoading(false);
        }
      };
      loadSection();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addProduct = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        { itemId: "", discountType: "PERCENT", discountValue: "" },
      ],
    });
  };

  const removeProduct = (index) => {
    const updated = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updated });
  };

  const updateProduct = (index, key, value) => {
    const updated = [...form.products];
    updated[index][key] = value;
    setForm({ ...form, products: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title required");
      return;
    }
    if (!form.sectionDiscountType || form.sectionDiscountValue === "") {
      alert("Section discount required");
      return;
    }
    if (!form.externalLink && !form.navigate) {
      alert("Navigation required (externalLink or navigate)");
      return;
    }

    let payload = {
      title: form.title,
      type: form.type,
      text: "",
      discount: {
        type: form.sectionDiscountType,
        value: Number(form.sectionDiscountValue),
      },
      navigation: {
        externalLink: form.externalLink,
        navigate: form.navigate,
      },
      mobileBanner: [],
      desktopBanner: [],
      isActive: true,
    };

    if (form.type === "MANUAL") {
      const validProducts = form.products.filter((p) => p.itemId);
      if (validProducts.length === 0) {
        alert("At least 1 product required for MANUAL section");
        return;
      }
      payload.products = validProducts.map((p) => ({
        itemId: p.itemId,
        discount: {
          type: p.discountType,
          value: Number(p.discountValue || 0),
        },
      }));
      payload.categoryId = [];
      payload.subcategoryId = [];
    } else {
      payload.products = [];
      payload.categoryId = [];
      payload.subcategoryId = [];
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateSection(id, payload);
      } else {
        await createSection(payload);
      }
      navigate("/admin/sections");
    } catch (err) {
      console.error("Error saving section:", err);
      alert(err?.response?.data?.message || "Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Professional Back Button */}
        <button
          onClick={() => navigate("/admin/sections")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Sections</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Section" : "Create New Section"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isEdit ? "Update section information" : "Add a new section to your site"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter section title"
                required
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
              >
                <option value="MANUAL">MANUAL</option>
                <option value="CATEGORY">CATEGORY</option>
              </select>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="sectionDiscountType"
                  value={form.sectionDiscountType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                >
                  <option value="PERCENT">PERCENT</option>
                  <option value="FLAT">FLAT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sectionDiscountValue"
                  value={form.sectionDiscountValue}
                  onChange={handleChange}
                  placeholder="Enter discount value"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* External Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                External Link
              </label>
              <input
                type="text"
                name="externalLink"
                value={form.externalLink}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Navigate Path */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Navigate Path
              </label>
              <input
                type="text"
                name="navigate"
                value={form.navigate}
                onChange={handleChange}
                placeholder="/home"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>

            {/* Products (for MANUAL type) */}
            {form.type === "MANUAL" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Products <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-gray-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {form.products.map((product, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Item ID"
                        value={product.itemId}
                        onChange={(e) =>
                          updateProduct(index, "itemId", e.target.value)
                        }
                        className="flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      />
                      <select
                        value={product.discountType}
                        onChange={(e) =>
                          updateProduct(index, "discountType", e.target.value)
                        }
                        className="px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                      >
                        <option value="PERCENT">PERCENT</option>
                        <option value="FLAT">FLAT</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Value"
                        value={product.discountValue}
                        onChange={(e) =>
                          updateProduct(index, "discountValue", e.target.value)
                        }
                        className="w-24 px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      />
                      {form.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/sections")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : isEdit ? "Update Section" : "Create Section"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionForm;
