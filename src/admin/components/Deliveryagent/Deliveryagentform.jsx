import React, { useEffect, useState } from "react";
import {
  createDeliveryAgent,
  getDeliveryAgentById,
  updateDeliveryAgent,
} from "../../apis/Driverapi";
import { useNavigate, useParams } from "react-router-dom";

const DeliveryAgentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
    licenseNumber: "",
    licenseExpiry: "",
    bikeNumber: "",
    bikeModel: "",
    bikeBrand: "",
    licenseImage: null, // 🔥 file
  });

  // =============================
  // Prefill in Edit Mode
  // =============================

  useEffect(() => {
    if (isEdit) {
      fetchAgent();
    }
  }, [id]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      const res = await getDeliveryAgentById(id);
      const data = res?.data?.data;

      setFormData((prev) => ({
        ...prev,
        name: data?.name || "",
        countryCode: data?.countryCode || "+91",
        phoneNumber: data?.phoneNumber || "",
        email: data?.email || "",
        address: data?.address || "",
        city: data?.city || "",
        pinCode: data?.pinCode || "",
        licenseNumber: data?.licenseNumber || "",
        licenseExpiry: data?.licenseExpiry
          ? data.licenseExpiry.split("T")[0]
          : "",
        bikeNumber: data?.bikeNumber || "",
        bikeModel: data?.bikeModel || "",
        bikeBrand: data?.bikeBrand || "",
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Handle Change
  // =============================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "licenseImage") {
      setFormData({ ...formData, licenseImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // =============================
  // Submit
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (isEdit) {
        await updateDeliveryAgent(id, data);
      } else {
        await createDeliveryAgent(data);
      }

      navigate("/admin/driver");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UI
  // =============================

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/admin/driver")}
          className="mb-4 text-sm text-gray-600 hover:text-black"
        >
          ← Back to Drivers
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Delivery Agent" : "Create Delivery Agent"}
        </h2>

        {loading && <p className="mb-4">Loading...</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {Object.keys(formData).map((key) =>
            key === "licenseImage" ? (
              <div key={key} className="col-span-2">
                <label className="block mb-1 font-medium">
                  License Image
                </label>
                <input
                  type="file"
                  name="licenseImage"
                  onChange={handleChange}
                  className="border p-2 rounded-lg w-full"
                />
              </div>
            ) : (
              <input
                key={key}
                type={key === "licenseExpiry" ? "date" : "text"}
                name={key}
                placeholder={key}
                value={formData[key]}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
            )
          )}

          <div className="col-span-2 flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {isEdit ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/driver")}
              className="bg-gray-300 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default DeliveryAgentForm;
