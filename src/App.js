import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [manualTotal, setManualTotal] = useState("");
  const [supplierCount, setSupplierCount] = useState(4);
  const [manualInputs, setManualInputs] = useState({});
  const [calculated, setCalculated] = useState({});
  const [vatInput, setVatInput] = useState("");
  const [vatOutput, setVatOutput] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("");
  const inputRefs = useRef({});

  const suppliers = Array.from({ length: supplierCount }, (_, i) => String.fromCharCode(65 + i));

  const parseNumber = (value) => parseInt((value ?? "").toString().replace(/,/g, "")) || 0;
  const formatNumber = (value) => parseNumber(value).toLocaleString();

  useEffect(() => {
    const base = parseNumber(manualTotal) + 1000000;
    const manualKeys = suppliers.filter(k => manualInputs[k] && manualInputs[k] !== "");
    const manualSum = manualKeys.reduce((sum, k) => sum + parseNumber(manualInputs[k]), 0);
    const remaining = base - manualSum;
    const autoKeys = suppliers.filter(k => !manualKeys.includes(k));
    const result = {};

    autoKeys.forEach((k, i) => {
      if (i === autoKeys.length - 1) {
        result[k] = remaining - Math.floor(remaining / autoKeys.length) * i;
      } else {
        result[k] = Math.floor(remaining / autoKeys.length);
      }
    });

    manualKeys.forEach((k) => {
      result[k] = parseNumber(manualInputs[k]);
    });

    setCalculated(result);
  }, [manualTotal, manualInputs, supplierCount]);

  useEffect(() => {
    const value = parseNumber(vatInput);
    const vat = Math.floor(value / 11);
    const supply = value - vat;
    setVatOutput(formatNumber(vat));
    setSupplyAmount(formatNumber(supply));
  }, [vatInput]);

  const resetManualInputs = () => {
    const resetInputs = {};
    suppliers.forEach(key => (resetInputs[key] = ""));
    setManualInputs(resetInputs);
    setManualTotal("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">공급자 분배금 계산기</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">총 대출금액</label>
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
          <button onClick={() => setSupplierCount(c => Math.max(1, c - 1))} className="px-3 py-1 bg-gray-200 rounded text-lg">-</button>
          <input
            type="text"
            value={supplierCount}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
              if (!isNaN(val) && val >= 1 && val <= 26) setSupplierCount(val);
            }}
            className="border px-4 py-2 w-16 text-center rounded"
          />
          <button onClick={() => setSupplierCount(c => Math.min(26, c + 1))} className="px-3 py-1 bg-gray-200 rounded text-lg">+</button>
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
                  onChange={(e) => {
                    수동 입력 설정({
 ...수동 입력,
 [키]: e.target.value.replace(/[^0-9,]/g, "")
 });
                  }}
 onKeyDown={(e) => {
 만약 (예: 키 === "입력") {
 e.preventDefault();
 const nextKey = 공급업체 [지수 + 1];
 만약 (nextKey & inputRefs.current[nextKey]) {
 inputRefs.current[다음 키].포커스 ();
                      }
                    }
                  }}
 className="w-완전 경계 p-1 반올림"
 />
 </td>
 <td className="경계 p-2">{formatNumber(계산된 [키])} 원</td>
 </tr>
          ))}
 </tbody>
 </표>

 <div className="mb-6">
 <클릭={수동 입력 재설정} className="bg-red-500 호버링:bg-red-600 텍스트-흰색 글꼴-볼드 py-2 px-4 둥근">수기입력 초기화</버튼>
 </div>

 <div className="mb-4 border-t pt-4">
 <h2 className="text-xl font-bold mb-2">부가세 계산기</h2>
 <label className="block mb-1 폰트-세미볼트">부가세 포함 금액 입력</label>
 <입력
 type="text"
 value={formatNumber(vatInput)}
 onChange={(e) => setVatInput(e.target.value.replace(/[^0-9,]/g, "")}
 className="w-전체 테두리 p-2 둥근 mb-2"
 />
 <label className="block mb-1 폰트-세미볼트">공급가액</label>
 <입력
 type="text"
 가치 = {공급량}
          읽기 전용
 className="w-전체 테두리 p-2 둥근 mb-2 bg-gray-100"
 />
 <label className="block mb-1 폰트-세미볼트">부가세</label>
 <입력
 type="text"
 값 = {vatOutput}
          읽기 전용
 className="w-전체 테두리 p-2 둥근 mb-2 bg-gray-100"
 />
 버튼
 onClick={(() => {
 setVatInput(""");
 setVatOutput(""");
 공급량 설정;
          }}
 className="bg-blue-500 호버:bg-blue-600 텍스트-흰색 글꼴-볼드 py-2 px-4 반올림"
 >부가세 초기화</button>
 </div>
 </div>
 );
}
