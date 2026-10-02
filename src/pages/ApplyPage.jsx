import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AppLayout from '../components/AppLayout.jsx'
import useApplicationStore from '../store/applicationStore.js'

const initialForm = {
  monthlyNetIncome: '', monthlyFixedExpense: '', monthlyLivingExpense: '', cashAndDeposits: '',
  existingLoanBalance: '', existingMonthlyRepayment: '', loanCount: '', hasRecentLoan: '',
  overdueMonths: '', creditHistoryMonths: '', cardCount: '', purchasePurpose: '',
  drivingDistanceType: '', drivingDistance: '', primaryRoad: '', passengerCount: '',
  preferredBodyType: '', preferredFuel: '', vehicleCondition: '', evChargingAvailable: '',
  desiredDownPayment: '', desiredInstallmentMonths: '',
}

const financialFields = [
  ['월 실수령액', 'monthlyNetIncome', '만원'], ['월 고정지출', 'monthlyFixedExpense', '만원'],
  ['월 생활비', 'monthlyLivingExpense', '만원'], ['보유 현금·예금', 'cashAndDeposits', '만원'],
  ['기존 대출 잔액', 'existingLoanBalance', '만원'], ['기존 월 상환액', 'existingMonthlyRepayment', '만원'],
  ['대출 건수', 'loanCount', '건'], ['연체 이력', 'overdueMonths', '개월'],
  ['신용거래 기간', 'creditHistoryMonths', '개월'], ['보유 카드 수', 'cardCount', '장'],
]

function ApplyPage() {
  const navigate = useNavigate()
  const saveApplication = useApplicationStore((state) => state.saveApplication)
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const update = ({ target: { name, value } }) => {
    // 입력 요소의 이름을 키로 사용해 해당 값만 안전하게 갱신합니다.
    setForm((current) => ({ ...current, [name]: value }))
  }

  const monthLabel = (value) => {
    if (!value || Number(value) < 12) return ''
    const years = Math.floor(Number(value) / 12)
    const months = Number(value) % 12
    return months ? `${years}년 ${months}개월` : `${years}년`
  }

  const validateStep = () => {
    const names = step === 1
      ? [...financialFields.map(([, name]) => name), 'hasRecentLoan']
      : ['purchasePurpose', 'drivingDistanceType', 'drivingDistance', 'primaryRoad', 'passengerCount', 'preferredBodyType', 'preferredFuel', 'vehicleCondition', 'evChargingAvailable', 'desiredDownPayment', 'desiredInstallmentMonths']
    const empty = names.some((name) => form[name] === '')
    setError(empty ? '현재 단계의 모든 항목을 입력해 주세요.' : '')
    return !empty
  }

  const goNext = () => {
    if (validateStep()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateStep()) return

    const numericNames = [...financialFields.map(([, name]) => name), 'drivingDistance', 'desiredDownPayment', 'desiredInstallmentMonths']
    const saved = { ...form }
    // 결과 계산에 바로 쓸 수 있도록 숫자 입력만 Number 타입으로 변환합니다.
    numericNames.forEach((name) => { saved[name] = Number(form[name]) })
    saveApplication(saved)
    navigate('/result')
  }

  const disposable = Math.max(0, Number(form.monthlyNetIncome || 0) - Number(form.monthlyFixedExpense || 0) - Number(form.monthlyLivingExpense || 0) - Number(form.existingMonthlyRepayment || 0))

  return (
    <AppLayout>
      <Main>
        <TitleBlock>
          <h1>{step === 1 ? '재무·신용정보 입력' : '차량정보 입력'}</h1>
          <p>{step === 1 ? '차량 구매에 사용할 수 있는 예산을 확인하기 위한 정보입니다.' : '추천 차량을 고르기 위한 이용 조건과 구매 계획입니다.'}</p>
        </TitleBlock>

        <Progress aria-label="입력 진행 단계">
          {['소득·지출', '차량 조건', '재무 분석', '차량 추천', '구매 계획'].map((label, index) => (
            <ProgressItem key={label} $active={index + 1 <= step}><span>{index + 1}</span>{label}</ProgressItem>
          ))}
        </Progress>

        <ContentGrid>
          <FormCard onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <CardHeading><b>1. 소득·지출</b><span>현재 소득과 지출, 신용정보를 입력해 주세요.</span></CardHeading>
                <FieldGrid>
                  {financialFields.map(([label, name, unit]) => (
                    <NumberField key={name} label={label} name={name} unit={unit} value={form[name]} onChange={update} helper={name === 'creditHistoryMonths' ? monthLabel(form[name]) : ''} />
                  ))}
                  <SelectField label="최근 신규 대출" name="hasRecentLoan" value={form.hasRecentLoan} onChange={update} options={['있음', '없음']} />
                </FieldGrid>
                <InfoBox><b>입력값은 추천을 위한 예시 분석에만 사용됩니다.</b><span>실제 심사나 신용평가 결과와 다를 수 있습니다.</span></InfoBox>
              </>
            ) : (
              <>
                <CardHeading><b>2. 차량 조건</b><span>원하는 차량의 이용 방식과 구매 조건을 알려주세요.</span></CardHeading>
                <FieldGrid>
                  <SelectField label="차량 구매 목적" name="purchasePurpose" value={form.purchasePurpose} onChange={update} options={['출퇴근', '업무', '주말 이용', '가족용']} />
                  <DistanceField form={form} onChange={update} />
                  <SelectField label="주요 도로" name="primaryRoad" value={form.primaryRoad} onChange={update} options={['도심', '고속도로', '혼합']} />
                  <SelectField label="탑승 인원" name="passengerCount" value={form.passengerCount} onChange={update} options={['주로 1명', '주로 2명', '4명 이상']} />
                  <SelectField label="선호 차종" name="preferredBodyType" value={form.preferredBodyType} onChange={update} options={['경차', '세단', 'SUV', '상관없음']} />
                  <SelectField label="선호 연료" name="preferredFuel" value={form.preferredFuel} onChange={update} options={['가솔린', '하이브리드', '전기', '상관없음']} />
                  <SelectField label="신차·중고차" name="vehicleCondition" value={form.vehicleCondition} onChange={update} options={['신차', '중고차', '모두']} />
                  <SelectField label="전기차 충전 환경" name="evChargingAvailable" value={form.evChargingAvailable} onChange={update} options={['자택 충전 가능', '자택 충전 불가능']} />
                  <NumberField label="원하는 선수금" name="desiredDownPayment" unit="만원" value={form.desiredDownPayment} onChange={update} />
                  <SelectField label="원하는 할부기간" name="desiredInstallmentMonths" value={form.desiredInstallmentMonths} onChange={update} options={['36개월', '48개월', '60개월']} values={['36', '48', '60']} />
                </FieldGrid>
                <InfoBox><b>차량 조건을 모두 입력하면 분석을 시작합니다.</b><span>결과 화면의 금액과 추천은 모두 예시값입니다.</span></InfoBox>
              </>
            )}

            {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
            <ButtonRow>
              {step === 2 && <BackButton type="button" onClick={() => { setStep(1); setError('') }}>이전</BackButton>}
              {step === 1
                ? <PrimaryButton type="button" onClick={goNext}>다음 단계</PrimaryButton>
                : <PrimaryButton type="submit">분석 결과 보기</PrimaryButton>}
            </ButtonRow>
          </FormCard>

          <SummaryCard>
            <small>실시간 입력 요약 · 예시</small>
            <h2>{disposable.toLocaleString()}만 원</h2>
            <p>현재 월 여유자금</p>
            <SummaryLine><span>월 실수령액</span><b>{Number(form.monthlyNetIncome || 0).toLocaleString()}만 원</b></SummaryLine>
            <SummaryLine><span>월 지출 합계</span><b>{(Number(form.monthlyFixedExpense || 0) + Number(form.monthlyLivingExpense || 0)).toLocaleString()}만 원</b></SummaryLine>
            <SummaryLine><span>기존 월 상환액</span><b>{Number(form.existingMonthlyRepayment || 0).toLocaleString()}만 원</b></SummaryLine>
            <SummaryHint>입력한 정보에 따라 요약 값이 바로 바뀝니다.</SummaryHint>
          </SummaryCard>
        </ContentGrid>
      </Main>
    </AppLayout>
  )
}

function NumberField({ label, name, unit, value, onChange, helper }) {
  return <Field><Label htmlFor={name}>{label}</Label><InputWrap><Input id={name} name={name} type="number" min="0" step="1" value={value} onChange={onChange} required /><Unit>{unit}</Unit></InputWrap>{helper && <Helper>{helper}으로 계산됩니다.</Helper>}</Field>
}

function SelectField({ label, name, value, onChange, options, values = options }) {
  return <Field><Label htmlFor={name}>{label}</Label><Select id={name} name={name} value={value} onChange={onChange} required><option value="">선택해 주세요</option>{options.map((option, index) => <option key={option} value={values[index]}>{option}</option>)}</Select></Field>
}

function DistanceField({ form, onChange }) {
  return <Field><Label htmlFor="drivingDistance">하루 또는 연간 주행거리</Label><DistanceRow><Select aria-label="주행거리 기준" name="drivingDistanceType" value={form.drivingDistanceType} onChange={onChange} required><option value="">기준</option><option value="daily">하루</option><option value="annual">연간</option></Select><InputWrap><Input id="drivingDistance" name="drivingDistance" type="number" min="0" step="1" value={form.drivingDistance} onChange={onChange} required /><Unit>{form.drivingDistanceType === 'daily' ? 'km/일' : 'km/년'}</Unit></InputWrap></DistanceRow></Field>
}

const Main = styled.main`width:min(1000px,calc(100% - 40px));margin:0 auto;padding:36px 0 80px;`
const TitleBlock = styled.div`h1{margin:0;color:#14233d;font-size:26px;}p{margin:8px 0 0;color:#7c899b;font-size:12px;}`
const Progress = styled.div`display:grid;grid-template-columns:repeat(5,1fr);margin:24px 0 34px;border-bottom:4px solid #e7edf4;`
const ProgressItem = styled.div`position:relative;padding:0 0 12px;color:${({$active})=>$active?'#174879':'#8793a4'};font-size:11px;font-weight:700;&:after{content:'';position:absolute;left:0;right:0;bottom:-4px;height:4px;background:${({$active})=>$active?'#159887':'transparent'};}span{display:inline-grid;width:20px;height:20px;margin-right:7px;place-items:center;border-radius:50%;color:${({$active})=>$active?'#fff':'#8793a4'};background:${({$active})=>$active?'#174879':'#edf1f5'};}`
const ContentGrid = styled.div`display:grid;grid-template-columns:minmax(0,1fr) 265px;gap:22px;align-items:start;@media(max-width:760px){grid-template-columns:1fr;}`
const FormCard = styled.form`padding:26px;border:1px solid #e0e7ef;border-radius:10px;background:#fff;box-shadow:0 5px 16px rgba(35,57,82,.05);`
const CardHeading = styled.div`display:grid;gap:6px;margin-bottom:26px;b{font-size:16px;}span{color:#8490a0;font-size:11px;}`
const FieldGrid = styled.div`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 22px;@media(max-width:600px){grid-template-columns:1fr;}`
const Field = styled.div`display:grid;align-content:start;gap:7px;min-width:0;`
const Label = styled.label`color:#3e4c60;font-size:11px;font-weight:700;`
const InputWrap = styled.div`position:relative;min-width:0;`
const control = `width:100%;height:38px;border:1px solid #d6dee8;border-radius:6px;color:#263b56;background:#fff;font-size:12px;outline:none;&:focus{border-color:#159887;box-shadow:0 0 0 3px rgba(21,152,135,.1);}`
const Input = styled.input`${control}padding:0 52px 0 11px;`
const Select = styled.select`${control}padding:0 30px 0 11px;`
const Unit = styled.span`position:absolute;top:50%;right:11px;color:#8793a4;font-size:10px;transform:translateY(-50%);`
const Helper = styled.span`color:#159887;font-size:10px;font-weight:700;`
const DistanceRow = styled.div`display:grid;grid-template-columns:82px 1fr;gap:7px;`
const InfoBox = styled.div`display:grid;gap:4px;margin-top:26px;padding:16px;border-radius:7px;color:#5c7592;background:#f3f7fb;font-size:10px;b{color:#25659f;}`
const ErrorMessage = styled.p`margin:18px 0 0;padding:11px;border-radius:6px;color:#a63838;background:#fff1f1;font-size:11px;`
const ButtonRow = styled.div`display:flex;justify-content:flex-end;gap:8px;margin-top:24px;`
const PrimaryButton = styled.button`padding:11px 18px;border:0;border-radius:6px;color:#fff;background:#153e6d;font-size:11px;font-weight:800;cursor:pointer;`
const BackButton = styled.button`padding:11px 18px;border:1px solid #ccd7e3;border-radius:6px;color:#475a72;background:#fff;font-size:11px;font-weight:800;cursor:pointer;`
const SummaryCard = styled.aside`position:sticky;top:84px;padding:24px;border-radius:10px;color:#fff;background:#173f6d;small{color:#9edbd1;font-size:10px;}h2{margin:17px 0 3px;font-size:27px;}p{margin:0 0 22px;color:#b8c9dc;font-size:10px;}`
const SummaryLine = styled.div`display:flex;justify-content:space-between;padding:13px 0;border-top:1px solid rgba(255,255,255,.12);font-size:10px;span{color:#b8c9dc;}b{font-size:11px;}`
const SummaryHint = styled.div`margin-top:18px;padding:12px;border-radius:6px;color:#b9cada;background:rgba(255,255,255,.08);font-size:9px;line-height:1.5;`

export default ApplyPage
