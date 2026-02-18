import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCartCharges,
  updateCartCharges,
  getCartCharges,
} from "../../apis/Cartapi";

const CartChargesConfigForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configId, setConfigId] = useState(null); // ✅ real MongoDB id

  const [formData, setFormData] = useState({
    isActive: true,
    cartCharge: [
      { key: "delivery", rules: { min: 0, max: 500, value: 20 } },
      { key: "packing", rules: { min: 0, max: 1000, value: 30 } },
      { key: "platformfee", rules: { base: 5, percent: 2 } },
      { key: "surge", rules: { threshold: 3, multiplier: 1.5 } },
      { key: "nightcharge", rules: { startTime: "22:00", endTime: "06:00", value: 50 } },
    ],
  });

  // ✅ Load existing config (from getAll)
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);

        const response = await getCartCharges();
        const data = response?.data?.[0]; // ✅ first config

        if (data) {
          setConfigId(data._id); // ✅ real id
          setFormData({
            isActive: data.isActive !== false,
            cartCharge: data.cartCharge || [],
          });
        }
      } catch (err) {
        console.error("Error loading cart charges:", err);
        setError("Failed to load cart charges configuration");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateChargeRule = (index, field, value) => {
    const newCharges = [...formData.cartCharge];
    newCharges[index] = {
      ...newCharges[index],
      rules: {
        ...newCharges[index].rules,
        [field]: value,
      },
    };
    setFormData((prev) => ({ ...prev, cartCharge: newCharges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      isActive: formData.isActive,
      cartCharge: formData.cartCharge,
    };

    try {
      setLoading(true);
      setError(null);

      if (configId) {
        // ✅ Update existing config
        await updateCartCharges(configId, payload);
      } else {
        // ✅ Create new config
        const res = await createCartCharges(payload);
        setConfigId(res?.data?._id);
      }

      alert("✅ Cart charges saved successfully!");
      navigate("/admin/cart-charges");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save cart charges configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-6">Cart Charges Configuration</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700">{error}</div>}
      {loading && <div className="mb-4">Loading...</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Enable Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          Enable Cart Charges
        </label>

        {/* Charges UI */}
        {formData.cartCharge.map((charge, index) => (
          <div key={charge.key} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3 capitalize">{charge.key}</h3>

            {Object.keys(charge.rules).map((ruleKey) => (
              <div key={ruleKey} className="mb-2">
                <label className="text-sm capitalize">{ruleKey}</label>
                <input
                  type="text"
                  value={charge.rules[ruleKey]}
                  onChange={(e) =>
                    updateChargeRule(index, ruleKey, e.target.value)
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default CartChargesConfigForm;
