import React, { useEffect, useState } from "react";
import {
  createDeliveryAgent,
  getDeliveryAgentById,
  updateDeliveryAgent,
} from "../../apis/Driverapi";
import { useNavigate, useParams } from "react-router-dom";

const DeliveryAgentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if exists → edit mode

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
  });

  const isEdit = !!id;

  // 🔥 Prefill if edit
  useEffect(() => {
    if (isEdit) {
      fetchAgent();
    }
  }, [id]);

  const fetchAgent = async () => {
    const res = await getDeliveryAgentById(id);
    const data = res?.data?.data;

    setFormData({
      name: data.name || "",
      countryCode: data.countryCode || "+91",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
      address: data.address || "",
      city: data.city || "",
      pinCode: data.pinCode || "",
      licenseNumber: data.licenseNumber || "",
      licenseExpiry: data.licenseExpiry?.split("T")[0] || "",
      bikeNumber: data.bikeNumber || "",
      bikeModel: data.bikeModel || "",
      bikeBrand: data.bikeBrand || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await updateDeliveryAgent(id, formData);
    } else {
      await createDeliveryAgent(formData);
    }

    navigate("/admin/driver");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Delivery Agent" : "Create Delivery Agent"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type={key === "licenseExpiry" ? "date" : "text"}
              name={key}
              placeholder={key}
              value={formData[key]}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          ))}

          <div className="col-span-2 flex gap-4 mt-4">
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
