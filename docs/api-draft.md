# API 초안

현재는 아래 시그니처를 유지하는 비동기 mock 함수이며, 각 요청은 500ms 지연 후 응답합니다.

## 종합 분석 조회

`getAnalysis(application)`

### 요청 예시

```json
{
  "monthlyNetIncome": 320,
  "monthlyFixedExpense": 80,
  "monthlyLivingExpense": 90,
  "existingMonthlyRepayment": 30,
  "desiredDownPayment": 500
}
```

### 응답 예시

```json
{
  "affordableMonthlyPayment": 36,
  "financialStability": "보통",
  "recommendedPriceMin": 1400,
  "recommendedPriceMax": 1800,
  "expenseBreakdown": [],
  "debtComparison": []
}
```

## 추천 차량 조회

`getVehicleRecommendations()`

### 응답 예시

```json
[
  {
    "id": 1,
    "name": "기아 모닝 1.0",
    "type": "경차",
    "fuel": "가솔린",
    "price": "1,300만원",
    "monthly": "약 28만원",
    "fit": 96,
    "reason": "예시 추천 이유"
  }
]
```
