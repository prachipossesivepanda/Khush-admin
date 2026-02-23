// src/pages/admin/CouponAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Percent, 
  Ticket, Clock, RefreshCw, AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getCouponAnalytics } from '../../apis/couponapi';

const COLORS = ['#4f46e5', '#7c3aed', '#c026d3', '#e11d48', '#ea580c'];

const CouponAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCouponAnalytics();
      if (response?.success) {
        setData(response.data);
        setCurrentPage(1); // reset to page 1 on new data load
      } else {
        setError(response?.message || "Failed to load analytics");
      }
    } catch (err) {
      setError("Network error or server is unreachable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-700 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading coupon analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="w-14 h-14 text-red-600 mx-auto mb-5" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Failed to load data</h2>
          <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    summary, 
    mostUsedCoupons, 
    performanceByType, 
    recentUsage 
  } = data;

  const usageByType = performanceByType.map(item => ({
    name: item.type,
    value: item.totalUsage,
    count: item.totalCoupons,
    users: item.uniqueUsers
  }));

  // ── Pagination logic for recentUsage ────────────────────────────────
  const totalRows = recentUsage.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsage = recentUsage.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Showing {startIndex + 1}–{Math.min(endIndex, totalRows)} of {totalRows}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => 
              p === 1 || 
              p === totalPages || 
              (p >= currentPage - 1 && p <= currentPage + 1)
            )
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1.5 rounded-md border border-gray-300 transition ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Coupon Analytics
            </h1>
            <p className="mt-2 text-gray-600 text-lg">
              Real-time overview of coupon usage and business impact
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-800 font-medium transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={<Ticket className="w-7 h-7 text-indigo-700" />}
            title="Total Coupons"
            value={summary.totalCoupons}
            color="indigo"
          />
          <StatCard 
            icon={<TrendingUp className="w-7 h-7 text-emerald-700" />}
            title="Active Coupons"
            value={summary.activeCoupons}
            color="emerald"
          />
          <StatCard 
            icon={<Users className="w-7 h-7 text-violet-700" />}
            title="Unique Users"
            value={summary.totalUniqueUsers}
            color="violet"
          />
          <StatCard 
            icon={<DollarSign className="w-7 h-7 text-amber-700" />}
            title="Total Discount Given"
            value={`₹${Number(summary.totalDiscountGiven).toLocaleString('en-IN')}`}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Most Used Coupons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-7">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Percent className="w-6 h-6 text-indigo-700" />
              Top Performing Coupons
            </h2>

            {mostUsedCoupons.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">
                No coupon redemptions recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {mostUsedCoupons.slice(0, 5).map((coupon) => (
                  <div 
                    key={coupon.couponId}
                    className="flex items-center justify-between py-4 px-5 bg-gray-50/70 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{coupon.couponCode}</div>
                      <div className="text-sm text-gray-600 mt-0.5">
                        {coupon.discountType} • ₹{coupon.discountValue}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-700">{coupon.totalUsage}</div>
                      <div className="text-xs text-gray-500 mt-0.5">redemptions</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance by Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-7">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <BarChart className="w-6 h-6 text-purple-700" strokeWidth={2} />
              Usage by Discount Type
            </h2>

            <div className="h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceByType} margin={{ top: 5, right: 20, left: -10, bottom: 30 }}>
                  <XAxis dataKey="type" axisLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis axisLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(value) => [`${value} uses`, '']}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                  />
                  <Bar dataKey="totalUsage" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Usage with Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="px-7 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-700" />
              Recent Redemptions
            </h2>
          </div>

          {recentUsage.length === 0 ? (
            <div className="py-16 text-center text-gray-500 italic">
              No recent coupon usage
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/70">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Coupon</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Used At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentUsage.map((usage, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{usage.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{usage.userName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{usage.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {usage.couponCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-emerald-700">
                          ₹{Number(usage.discountAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                          {new Date(usage.usedAt).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls />
            </>
          )}
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 hover:shadow transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-4 rounded-xl bg-${color}-50/70`}>
        {icon}
      </div>
    </div>
  </div>
);

export default CouponAnalytics;