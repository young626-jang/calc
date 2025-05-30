import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [manualTotal, setManualTotal] = useState("");
  const [supplierCount, setSupplierCount] = useState(2);
  const [manualInputs, setManualInputs] = useState({});
  const [vatInput, setVatInput] = useState("");
  const [vatOutput, setVatOutput] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("");

  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("1");
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
 setVatOutput(형식 번호(vat));
 공급량 설정(형식 번호(공급량));
 }, [vatInput];

 useEffect((() => {
 const principal = parseNumber(대출 금액);
 constrate = parseFloat(연간 속도) / 100;
 const y = 구문 분석Int(년, 10년) || 1;

 만약 (!isNaN(주요) & &!isNaN(비율) & y > 0) {
 상수 연도 = Math.floor (주요 * 비율 * y);
 상수 월 = Math.floor (연도 / 12 / y);
 일정한 날 = Math.floor (년 / 365 / y);

 연도별 관심도 설정(형식 번호(년));
 월별 설정관심사(형식 번호(월));
 셋데일리관심사(형식 번호(일));
    } 또 다른 {
 연간 이자 설정(""");
 월별 설정관심(""");
 셋데일리관심(""");
    }
 }, [대출 금액, 연간 요율, 연도];

 const totalLoanNumber = parseNumber(manualTotal);
 구성된 분산 금액 = getTotalDistribution();
 상수 차이 = 분산 금액 - 총 대출 건수;

  돌아가다 (
 <div className="p-6 max-w-3 xl mx-auto">
 <h1 className="text-2xl font-bold mb-4">공급자 분배금 계산기</h1>

 <div className="mb-4">
 <label className="block mb-1 폰트-세미볼트">총 대출금액</label>
 <입력
 type="text"
 value={formatNumber(manualTotal)}
 onChange={(e) => setManualTotal(e.target.value.replace(/[^0-9,]/g, "")}
 className="w-완전 경계 p-2 반올림"
 />
 <p className="text-sm text-gray-500 mt-1">* 자동 계산되며, 필요시 수기로 입력할 수 있습니다.</p>
 </div>

 <div className="mb-4">
 <label className="block mb-1 폰트-세미볼트">공급자 수</label>
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
 className="경계 px-4 py-2 w-16 텍스트 중심 반올림"
 />
 <부토n
 onClick={(() => setSupplierCount(((c)) => Math.min(26, c + 1))}
 className="px-3 py-1 bg-gray-200 둥근 텍스트-lg"
 >
 +
 </버튼>
 </div>
 </div>

 <table className="w-전체 텍스트-왼쪽 테두리 mb-4">
 <헤드>
 <tr>
 <th className="경계 p-2">공급자</th>
 <th className="경계 p-2">수기 입력 금액</th>
 <th className="경계 p-2">자동 계산 금액</th>
 </tr>
 </thead>
 <tbody>
 {suppliers.map((키, 인덱스) =>)
 <tr key={key}>
 <td className="경계 p-2">공급자 {key}</td>
 <td className="경계 p-2">
 <입력
 type="text"
 value={formatNumber(manualInputs[key] || "")}
 ref={(el) => (입력Refs.current[키] = el)}
 온체인지={(e) =>
                    수동 입력 설정({
 ...수동 입력,
 [키]: e.target.value.replace(/[^0-9,]/g, "")
                    })
                  }
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
 <td className="border p-2">{formatNumber(getFinalAmount(키))} 원</td>
 </tr>
          ))}
 </tbody>
 </표>

      <div className="mb-2 text-sm text-gray-700 font-medium">
        총합: {formatNumber(distributedAmount)} 원 / 오차: {formatNumber(difference)} 원
      </div>

      <div className="mb-6">
 <부토n
 onClick={수동 입력 재설정}
 className="bg-red-500 호버링:bg-red-600 텍스트-흰색 글꼴-볼드 py-2 px-4 반올림"
 >
          수기입력 초기화
 </버튼>
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

        <label className="block mb-1 font-semibold">{years || 1}년 이자</label>
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
            setYears("1");
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
