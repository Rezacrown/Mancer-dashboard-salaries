"use client";
import Card from "@/components/shared/Card";
import { ArrowDownLeft, UserCheck, RefreshCw } from "lucide-react";
import { useState } from "react";

const EmployerCreateStream = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    token: "PHII",
    monthlyAmount: "",
    deposit: "",
    transferable: false,
  });

  const onCancel = () => {};
  const onSubmit = () => {};

  const ratePerSecond = formData.monthlyAmount
    ? (parseFloat(formData.monthlyAmount) / (30 * 24 * 3600)).toFixed(10)
    : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowDownLeft className="rotate-90" size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Create Salary Stream
        </h1>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Recipient Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address (Employee)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCheck className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#F9140D] focus:border-[#F9140D] transition-colors"
                placeholder="0x..."
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
              />
            </div>
          </div>

          {/* Token & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token
              </label>
              <select
                className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-[#F9140D] focus:border-[#F9140D] bg-white"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
              >
                <option value="PHII">PHII Coin</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Salary Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="block w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-[#F9140D] focus:border-[#F9140D]"
                  placeholder="5000"
                  value={formData.monthlyAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyAmount: e.target.value })
                  }
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {formData.token}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculated Rate Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <RefreshCw size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Flow Rate Calculator
                </p>
                <p className="text-xs text-blue-600">
                  Converted to UD21x18 fixed-point format
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-800">{ratePerSecond}</p>
              <p className="text-xs text-blue-600">{formData.token} / second</p>
            </div>
          </div>

          {/* Initial Deposit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Deposit
            </label>
            <input
              type="number"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-[#F9140D] focus:border-[#F9140D]"
              placeholder="Recommended: 1 month salary"
              value={formData.deposit}
              onChange={(e) =>
                setFormData({ ...formData, deposit: e.target.value })
              }
            />
          </div>

          {/* Transferable Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="transferable"
              type="checkbox"
              className="h-5 w-5 text-[#F9140D] focus:ring-[#F9140D] border-gray-300 rounded"
              checked={formData.transferable}
              onChange={(e) =>
                setFormData({ ...formData, transferable: e.target.checked })
              }
            />
            <label htmlFor="transferable" className="text-sm text-gray-700">
              Stream NFT is Transferable
            </label>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={
                () => onSubmit()
                //                   {
                //   ...formData,
                //   ratePerMonth: parseFloat(formData.monthlyAmount),
                //   balance: parseFloat(formData.deposit),
                //                   }
              }
              className="flex-1 py-3 bg-[#F9140D] text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Create & Deposit
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployerCreateStream;
