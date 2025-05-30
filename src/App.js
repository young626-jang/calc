import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [manualTotal, setManualTotal] = useState("");
  const [supplierCount, setSupplierCount] = useState(5);
  const [manualInputs, setManualInputs] = useState({});
  const [vatInput, setVatInput] = useState("");
  const [vatOutput, setVatOutput] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("");

  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [dailyInterest, setDailyInterest] = useState("");
  const [monthlyInterest, setMonthlyInterest] = useState("");
  const [yearlyInterest, setYearlyInterest] = useState("");

  const suppliers = Array.from({ length: supplierCount }, (_, i) => String.fromCharCode(65 + i));
  const inputRefs = useRef({});

  const parseNumber = (value) => parseInt((value ?? '').toString().replace(/,/g, "")) || 0;
  const formatNumber = (value) => parseNumber(value).toLocaleString();

  const getFinalAmount = (key) => {
    const base = parseNumber(manualTotal);
    const manualKeys = suppliers.filter(k => manualInputs[k] && manualInputs[k] !== "");
    const manualSum = manualKeys.reduce((sum, k) => sum + parseNumber(manualInputs[k]), 0);
    const remaining = base - manualSum;
    const autoCount = supplierCount - manualKeys.length;

    if (manualInputs[key] && manualInputs[key] !== "") {
      return parseNumber(manualInputs[key]);
    } else if (autoCount > 0) {
      return Math.floor(remaining / autoCount);
    } else {
      return 0;
    }
  };

  const getTotalDistributed = () => {
    return suppliers.reduce((sum, key) => sum + getFinalAmount(key), 0);
  };

  const resetManualInputs = () => {
    const resetInputs = {};
    suppliers.forEach((key) => {
      resetInputs[key] = "";
    });
    setManualInputs(resetInputs);
    setManualTotal("");
  };

  useEffect(() => {
    const updatedInputs = {};
    suppliers.forEach((key) => {
      updatedInputs[key] = manualInputs[key] || "";
    });
    setManualInputs(updatedInputs);
  }, [supplierCount]);

  useEffect(() => {
    const value = parseNumber(vatInput);
    const vat = Math.floor(value / 11);
    const supply = value - vat;
    setVatOutput(formatNumber(vat));
    setSupplyAmount(formatNumber(supply));
  }, [vatInput]);

  useEffect(() => {
    const principal = parseNumber(loanAmount);
    const rate = parseFloat(annualRate) / 100;

    if (!isNaN(principal) && !isNaN(rate)) {
      const year = Math.floor(principal * rate);
      const month = Math.floor(year / 12);
      const day = Math.floor(year / 365);

      setYearlyInterest(formatNumber(year));
      setMonthlyInterest(formatNumber(month));
      setDailyInterest(formatNumber(day));
    } else {
      setYearlyInterest("");
      setMonthlyInterest("");
      setDailyInterest("");
    }
  }, [loanAmount, annualRate]);

  const totalLoanNumber = parseNumber(manualTotal);
  const distributedAmount = getTotalDistributed();
  const difference = distributedAmount - totalLoanNumber;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">공급자 분배금 계산기</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">총 대출금액</label>
        <input
          type="text"
          value={formatNumber(manualTotal)}
          onChange={(e) => setManualTotal(e.target.value.replace(/[^0-9,]/g, ""))}
          className="w-full border p-2 rounded"
        />
        <p className="text-sm text-gray-500 mt-1">* 자동 계산되며, 필요시 수기로 입력할 수 있습니다.</p>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">공급자 수</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSupplierCount((c) => Math.max(1, c - 1))}
            className="px-3 py-1 bg-gray-200 rounded text-lg"
          >
            -
          </button>
          <input
            type="text"
            value={supplierCount}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
              if (!isNaN(val) && val >= 1 && val <= 26) setSupplierCount(val);
            }}
            className="border px-4 py-2 w-16 text-center rounded"
          />
          <button
            onClick={() => setSupplierCount((c) => Math.min(26, c + 1))}
            className="px-3 py-1 bg-gray-200 rounded text-lg"
          >
            +
          </button>
        </div>
      </div>

      <table className="w-full text-left border mb-4">
        <thead>
          <tr>
            <th className="border p-2">공급자</th>
            <th className="border p-2">수기 입력 금액</th>
            <th className="border p-2">자동 계산 금액</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((key, index) => (
            <tr key={key}>
              <td className="border p-2">공급자 {key}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={formatNumber(manualInputs[key] || "")}
                  ref={(el) => (inputRefs.current[key] = el)}
                  onChange={(e) =>
                    setManualInputs({
                      ...manualInputs,
                      [key]: e.target.value.replace(/[^0-9,]/g, "")
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const nextKey = suppliers[index + 1];
                      if (nextKey && inputRefs.current[nextKey]) {
                        inputRefs.current[nextKey].focus();
                      }
                    }
                  }}
                  className="w-full border p-1 rounded"
                />
              </td>
              <td className="border p-2">{formatNumber(getFinalAmount(key))} 원</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-2 text-sm text-gray-700 font-medium">
        총합: {formatNumber(distributedAmount)} 원 / 오차: {formatNumber(difference)} 원
      </div>

      <div className="mb-6">
        <button
          onClick={resetManualInputs}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          수기입력 초기화
        </button>
      </div>

      <div className="mb-4 border-t pt-4">
        <h2 className="text-xl font-bold mb-2">부가세 계산기</h2>
        <label className="block mb-1 font-semibold">부가세 포함 금액 입력</label>
        <input
          type="text"
          value={formatNumber(vatInput)}
          onChange={(e) => setVatInput(e.target.value.replace(/[^0-9,]/g, ""))}
          className="w-full border p-2 rounded mb-2"
        />
        <label className="block mb-1 font-semibold">공급가액</label>
        <input
          type="text"
          value={supplyAmount}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />
        <label className="block mb-1 font-semibold">부가세</label>
        <input
          type="text"
          value={vatOutput}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />
        <button
          onClick={() => {
            setVatInput("");
            setVatOutput("");
            setSupplyAmount("");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          부가세 초기화
        </button>
      </div>

      {/* 이자 계산기 */}
      <div className="mb-4 border-t pt-4">
        <h2 className="text-xl font-bold mb-2">이자 계산기</h2>

        <label className="block mb-1 font-semibold">대출금액</label>
        <input
          type="text"
          value={formatNumber(loanAmount)}
          onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9,]/g, ""))}
          className="w-full border p-2 rounded mb-2"
        />

        <label className="block mb-1 font-semibold">연이율 (%)</label>
        <input
          type="text"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full border p-2 rounded mb-2"
        />

        <label className="block mb-1 font-semibold">하루 이자</label>
        <input
          type="text"
          value={dailyInterest}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <label className="block mb-1 font-semibold">한달 이자</label>
        <input
          type="text"
          value={monthlyInterest}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <label className="block mb-1 font-semibold">1년 이자</label>
        <input
          type="text"
          value={yearlyInterest}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <button
          onClick={() => {
            setLoanAmount("");
            setAnnualRate("");
            setDailyInterest("");
            setMonthlyInterest("");
            setYearlyInterest("");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          이자 초기화
        </button>
      </div>
    </div>
  );
}
