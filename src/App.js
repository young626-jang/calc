import React, { useState, useEffect, useRef } from "react";

export default function App() {
  // 새로운 공급자 합산기 상태
  const [suppliers, setSuppliers] = useState([{ name: "", amounts: [""] }]);

  const [manualTotal, setManualTotal] = useState("");
  const [supplierCount, setSupplierCount] = useState(2);
  const [manualInputs, setManualInputs] = useState({});
  const [vatInput, setVatInput] = useState("");

  const [vatOutput, setVatOutput] = useState(0);
  const [supplyAmount, setSupplyAmount] = useState(0);

  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("1");

  const [dailyInterest, setDailyInterest] = useState(0);
  const [monthlyInterest, setMonthlyInterest] = useState(0);
  const [yearlyInterest, setYearlyInterest] = useState(0);

  const [dailyRateDisplay, setDailyRateDisplay] = useState("");

  const distSuppliers = Array.from({ length: supplierCount }, (_, i) => String.fromCharCode(65 + i));
  const inputRefs = useRef({});

  const parseNumber = (value) => parseInt((value ?? '').toString().replace(/,/g, "")) || 0;
  const formatNumber = (value) => {
    const num = parseNumber(value);
    if (num === 0 && (value === "" || value === 0)) return "";
    return num.toLocaleString();
  };

  // 공급자 합산기 관련 함수
  const addSupplier = () => {
    setSuppliers([...suppliers, { name: "", amounts: [""] }]);
  };

  const handleSupplierNameChange = (index, name) => {
    const newSuppliers = [...suppliers];
    newSuppliers[index].name = name;
    setSuppliers(newSuppliers);
  };

  const handleAmountChange = (supplierIndex, amountIndex, amount) => {
    const newSuppliers = [...suppliers];
    newSuppliers[supplierIndex].amounts[amountIndex] = amount.replace(/[^0-9,]/g, "");
    setSuppliers(newSuppliers);
  };

  const addAmountField = (supplierIndex) => {
    const newSuppliers = [...suppliers];
    newSuppliers[supplierIndex].amounts.push("");
    setSuppliers(newSuppliers);
  };

  const getSupplierTotal = (amounts) => {
    return amounts.reduce((sum, amount) => sum + parseNumber(amount), 0);
  };


  const getFinalAmount = (key) => {
    const base = parseNumber(manualTotal);
    const manualKeys = distSuppliers.filter(k => manualInputs[k] && manualInputs[k] !== "");
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
    return distSuppliers.reduce((sum, key) => sum + getFinalAmount(key), 0);
  };

  const resetManualInputs = () => {
    const resetInputs = {};
    distSuppliers.forEach((key) => {
      resetInputs[key] = "";
    });
    setManualInputs(resetInputs);
    setManualTotal("");
  };

  useEffect(() => {
    const updatedInputs = {};
    distSuppliers.forEach((key) => {
      updatedInputs[key] = manualInputs[key] || "";
    });
    setManualInputs(updatedInputs);
  }, [supplierCount]);

  useEffect(() => {
    const value = parseNumber(vatInput);
    if (value > 0) {
        const vat = Math.floor(value / 11);
        const supply = value - vat;
        setVatOutput(vat);
        setSupplyAmount(supply);
    } else {
        setVatOutput(0);
        setSupplyAmount(0);
    }
  }, [vatInput]);

  useEffect(() => {
    const principalInManwon = parseNumber(loanAmount);
    const principal = principalInManwon * 10000;
    
    const rateValue = parseFloat(annualRate) || 0;
    const rate = rateValue / 100;
    
    const y = parseInt(years, 10) || 1;

    if (principal > 0 && rate > 0 && y > 0) {
      const year = Math.floor(principal * rate * y);
      const month = Math.floor(year / 12);
      const day = Math.floor(year / 365);
      
      setYearlyInterest(year);
      setMonthlyInterest(month);
      setDailyInterest(day);
    } else {
      setYearlyInterest(0);
      setMonthlyInterest(0);
      setDailyInterest(0);
    }
  }, [loanAmount, annualRate, years]);

  useEffect(() => {
    const rateValue = parseFloat(annualRate) || 0;
    if (rateValue > 0) {
      const dailyRate = (rateValue / 365).toFixed(4);
      setDailyRateDisplay(`연이율 ${rateValue}% 는 하루 이자율 ${dailyRate}% 입니다.`);
    } else {
      setDailyRateDisplay("");
    }
  }, [annualRate]);

  const totalLoanNumber = parseNumber(manualTotal);
  const distributedAmount = getTotalDistributed();
  const difference = distributedAmount - totalLoanNumber;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">다기능 계산기</h1>

      {/* 공급자별 자동금액 합산기 */}
      <div className="border-t pt-4 mb-4">
        <h2 className="text-xl font-bold mb-2">공급자별 자동금액 합산기</h2>
        <button
          onClick={addSupplier}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          공급자 추가 +
        </button>
        {suppliers.map((supplier, supplierIndex) => (
          <div key={supplierIndex} className="mb-4 p-4 border rounded">
            <div className="mb-2">
              <label className="block mb-1 font-semibold">공급자명</label>
              <input
                type="text"
                value={supplier.name}
                onChange={(e) => handleSupplierNameChange(supplierIndex, e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="공급자명을 입력하세요"
              />
            </div>
            {supplier.amounts.map((amount, amountIndex) => (
              <div key={amountIndex} className="mb-2">
                <label className="block mb-1 font-semibold">금액</label>
                <input
                  type="text"
                  value={formatNumber(amount)}
                  onChange={(e) => handleAmountChange(supplierIndex, amountIndex, e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="금액을 입력하세요"
                />
              </div>
            ))}
            <button
              onClick={() => addAmountField(supplierIndex)}
              className="mt-2 px-3 py-1 bg-gray-200 rounded text-sm"
            >
              금액 필드 추가
            </button>
            <div className="mt-2 font-bold text-lg">
              {supplier.name || "공급자"} 합계: {getSupplierTotal(supplier.amounts).toLocaleString()} 원
            </div>
          </div>
        ))}
      </div>


      <div className="border-t pt-4 mb-4">
        <h2 className="text-xl font-bold mb-2">공급자 분배금 계산기</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">총 분배 금액</label>
          <input
            type="text"
            value={formatNumber(manualTotal)}
            onChange={(e) => setManualTotal(e.target.value.replace(/[^0-9,]/g, ""))}
            className="w-full border p-2 rounded"
          />
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
              <th className="border p-2">자동 계산 금액 원</th>
            </tr>
          </thead>
          <tbody>
            {distSuppliers.map((key, index) => (
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
                        const nextKey = distSuppliers[index + 1];
                        if (nextKey && inputRefs.current[nextKey]) {
                          inputRefs.current[nextKey].focus();
                        }
                      }
                    }}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border p-2">{getFinalAmount(key).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-2 text-sm text-gray-700 font-medium">
          총합: {distributedAmount.toLocaleString()}원 / 오차: {difference.toLocaleString()}
        </div>

        <div className="mb-6">
          <button
            onClick={resetManualInputs}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            수기입력 초기화
          </button>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <h2 className="text-xl font-bold mb-2">부가세 계산기</h2>
        <label className="block mb-1 font-semibold">부가세 포함 금액 입력 </label>
        <input
          type="text"
          value={formatNumber(vatInput)}
          onChange={(e) => setVatInput(e.target.value.replace(/[^0-9,]/g, ""))}
          className="w-full border p-2 rounded mb-2"
        />
        <label className="block mb-1 font-semibold">공급가액</label>
        <input
          type="text"
          value={`${supplyAmount.toLocaleString()}`}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />
        <label className="block mb-1 font-semibold">부가세</label>
        <input
          type="text"
          value={`${vatOutput.toLocaleString()}`}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />
        <button
          onClick={() => {
            setVatInput("");
            setVatOutput(0);
            setSupplyAmount(0);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          부가세 초기화
        </button>
      </div>

      <div className="mb-4 border-t pt-4">
        <h2 className="text-xl font-bold mb-4">이자 계산기</h2>

        {dailyRateDisplay && (
          <p className="text-blue-600 font-semibold text-center bg-blue-50 p-3 rounded-md mb-4">
            {dailyRateDisplay}
          </p>
        )}

        <label className="block mb-1 font-semibold">대출금액 (만원)</label>
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

        <label className="block mb-1 font-semibold">이자 계산 연 수 (년)</label>
        <input
          type="text"
          value={years}
          onChange={(e) => setYears(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full border p-2 rounded mb-2"
        />
        
        <label className="block mb-1 font-semibold">하루 이자</label>
        <input
          type="text"
          value={`${dailyInterest.toLocaleString()}원`}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <label className="block mb-1 font-semibold">한달 이자</label>
        <input
          type="text"
          value={`${monthlyInterest.toLocaleString()}원`}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <label className="block mb-1 font-semibold">{years || 1}년 이자</label>
        <input
          type="text"
          value={`${yearlyInterest.toLocaleString()}원`}
          readOnly
          className="w-full border p-2 rounded mb-2 bg-gray-100"
        />

        <button
          onClick={() => {
            setLoanAmount("");
            setAnnualRate("");
            setYears("1");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          이자 초기화
        </button>
      </div>
    </div>
  );
}
