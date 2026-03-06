// src/pages/admin/CancellationPolicyForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createCancellation,
  updateCancellation,
  getSingleCancellation,
} from "../../apis/CancellationPolicyapi";
import { Save, ArrowLeft, AlertCircle } from "lucide-react";

const CancellationPolicyForm = () => {
  const { id } = useParams(); // if id exists → edit mode
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    cancellationReasons: "",
    maxCancellationTimeInHours: "",
    refundPercentage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const loadPolicy = async () => {
        try {
          setLoading(true);
          const res = await getSingleCancellation(id);
          const p = res?.data || {};
          setForm({
            name: p.name || "",
            description: p.description || "",
            cancellationReasons: p.cancellationReasons?.join(", ") || "",
            maxCancellationTimeInHours: p.policies?.maxCancellationTimeInHours?.join(", ") || "",
            refundPercentage: p.policies?.refundPercentage?.join(", ") || "",
          });
        } catch (err) {
          setError("Failed to load policy data");
        } finally {
          setLoading(false);
        }
      };
      loadPolicy();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Parse comma-separated inputs into arrays
    const reasons = form.cancellationReasons
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const hours = form.maxCancellationTimeInHours
      .split(",")
      .map((h) => parseInt(h.trim(), 10))
      .filter((n) => !isNaN(n));

    const refunds = form.refundPercentage
      .split(",")
      .map((r) => parseInt(r.trim(), 10))
      .filter((n) => !isNaN(n));

    if (!form.name.trim()) return setError("Policy name is required");
    if (reasons.length === 0) return setError("At least one cancellation reason is required");
    if (hours.length === 0) return setError("At least one max cancellation time is required");
    if (refunds.length === 0) return setError("At least one refund percentage is required");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      cancellationReasons: reasons,
      policies: {
        maxCancellationTimeInHours: hours,
        refundPercentage: refunds,
      },
    };

    try {
      setLoading(true);
      if (isEdit) {
        await updateCancellation(id, payload);
        alert("Policy updated successfully!");
      } else {
        await createCancellation(payload);
        alert("Policy created successfully!");
      }
      navigate("/admin/cancellation");
    } catch (err) {
      setError(err?.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-indigo-600 px-6 py-5 text-white">
            <h1 className="text-xl font-semibold">
              {isEdit ? "Edit Cancellation Policy" : "Create New Cancellation Policy"}
            </h1>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Standard 24-Hour Policy"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Optional internal note or customer-facing description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reasons <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cancellationReasons"
                  value={form.cancellationReasons}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Changed mind, Wrong size, Other (comma separated)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Cancellation Time (hours) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="maxCancellationTimeInHours"
                  value={form.maxCancellationTimeInHours}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="24, 48, 72 (comma separated)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Numbers separated by commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Percentages (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="refundPercentage"
                  value={form.refundPercentage}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="100, 50, 0 (comma separated)"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Numbers separated by commas (usually descending)</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
              >
                <Save size={18} />
                {loading ? "Saving..." : isEdit ? "Update Policy" : "Create Policy"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyForm;