import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createInfluencer,
  updateInfluencer,
  getInfluencerById,
} from "../../apis/Influencer";

const InfluencerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    pinCode: "",
    digitalSources: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchInfluencer();
  }, [id]);

  const fetchInfluencer = async () => {
    try {
      const res = await getInfluencerById(id);
      if (res?.success) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error("Fetch By ID Error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDigitalChange = (index, field, value) => {
    const updated = [...formData.digitalSources];
    updated[index][field] = value;
    setFormData({ ...formData, digitalSources: updated });
  };

  const addDigitalSource = () => {
    setFormData({
      ...formData,
      digitalSources: [
        ...formData.digitalSources,
        {
          platform: "",
          handle: "",
          followers: "",
          verified: false,
          link: "",
        },
      ],
    });
  };

  const removeDigitalSource = (index) => {
    const updated = formData.digitalSources.filter((_, i) => i !== index);
    setFormData({ ...formData, digitalSources: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateInfluencer(id, formData);
      } else {
        await createInfluencer(formData);
      }
      navigate("/admin/influencer");
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">

        <button
          onClick={() => navigate("/admin/influencer")}
          className="mb-6 text-indigo-600"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {id ? "Edit Influencer" : "Create Influencer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-3 rounded-lg" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-3 rounded-lg" />
            <input name="phoneNumber" placeholder="Phone" value={formData.phoneNumber} onChange={handleChange} className="border p-3 rounded-lg" />
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-3 rounded-lg" />
          </div>

          {/* Digital Sources */}
          <div>
            <h3 className="font-semibold mb-3">Digital Sources</h3>

           {formData.digitalSources.map((src, index) => (
  <div
    key={index}
    className="border p-4 rounded-lg mb-4 space-y-3 bg-gray-50"
  >
    <div className="grid grid-cols-2 gap-3">

      <input
        placeholder="Platform"
        value={src.platform}
        onChange={(e) =>
          handleDigitalChange(index, "platform", e.target.value)
        }
        className="border p-2 rounded w-full"
      />

      <input
        placeholder="Handle"
        value={src.handle}
        onChange={(e) =>
          handleDigitalChange(index, "handle", e.target.value)
        }
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        placeholder="Followers"
        value={src.followers}
        onChange={(e) =>
          handleDigitalChange(index, "followers", e.target.value)
        }
        className="border p-2 rounded w-full"
      />

      <input
        placeholder="Link"
        value={src.link}
        onChange={(e) =>
          handleDigitalChange(index, "link", e.target.value)
        }
        className="border p-2 rounded w-full"
      />
    </div>

    {/* ✅ VERIFIED CHECKBOX */}
    <div className="flex items-center gap-2 mt-2">
      <input
        type="checkbox"
        checked={src.verified}
        onChange={(e) =>
          handleDigitalChange(index, "verified", e.target.checked)
        }
        className="h-4 w-4 text-indigo-600"
      />
      <label className="text-sm text-gray-700">
        Verified Account
      </label>
    </div>

    <button
      type="button"
      onClick={() => removeDigitalSource(index)}
      className="text-red-500 text-sm mt-2"
    >
      Remove
    </button>
  </div>
))}


            <button
              type="button"
              onClick={addDigitalSource}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              + Add Platform
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg w-full"
          >
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfluencerForm;
