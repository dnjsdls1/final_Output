import analysis from '../mocks/analysis.json'
import vehicles from '../mocks/vehicles.json'

const wait = () => new Promise((resolve) => setTimeout(resolve, 500))

export async function getAnalysis(application) {
  await wait()
  if (!application) return analysis

  // MOCK: 월 여유자금의 일부를 납입 가능액으로 보고 예시 추천 예산을 계산합니다.
  const available = Math.max(
    0,
    application.monthlyNetIncome
      - application.monthlyFixedExpense
      - application.monthlyLivingExpense
      - application.existingMonthlyRepayment,
  )
  const payment = Math.round(available * 0.3)
  const minPrice = Math.round((application.desiredDownPayment + payment * 24) / 100) * 100
  const maxPrice = Math.round((application.desiredDownPayment + payment * 36) / 100) * 100

  return {
    ...analysis,
    affordableMonthlyPayment: payment,
    recommendedPriceMin: minPrice,
    recommendedPriceMax: maxPrice,
  }
}

export async function getVehicleRecommendations() {
  await wait()
  return vehicles
}
