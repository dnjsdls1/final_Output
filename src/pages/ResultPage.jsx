import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import { getAnalysis } from '../api/recommendationApi.js'
import AppLayout from '../components/AppLayout.jsx'
import useApplicationStore from '../store/applicationStore.js'

function ResultPage() {
  const application = useApplicationStore((state) => state.application)
  const [analysis, setAnalysis] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getAnalysis(application)
      .then((data) => {
        setAnalysis(data)
        setStatus(data ? 'ready' : 'empty')
      })
      .catch(() => setStatus('error'))
  }, [application])

  if (status !== 'ready') {
    return <AppLayout><StateBox>{status === 'loading' ? '분석 결과를 계산하고 있습니다.' : status === 'empty' ? '표시할 분석 결과가 없습니다.' : '분석 결과를 불러오지 못했습니다.'}</StateBox></AppLayout>
  }

  return (
    <AppLayout>
      <Main>
        <TitleRow>
          <div><h1>종합 분석 결과</h1><p>입력한 정보를 바탕으로 계산한 차량 구매 예산 예시입니다.</p></div>
          <ResultBadge>예시 분석 완료</ResultBadge>
        </TitleRow>

        <MetricGrid>
          <MetricCard><span>월 납입 가능액</span><strong>{analysis.affordableMonthlyPayment.toLocaleString()}만 원</strong><small>예시 계산 결과</small></MetricCard>
          <MetricCard $tone="amber"><span>재무 안정성</span><strong>{analysis.financialStability}</strong><small>예시 평가 결과</small></MetricCard>
          <MetricCard $tone="green"><span>추천 차량 예산</span><strong>{analysis.recommendedPriceMin.toLocaleString()}~{analysis.recommendedPriceMax.toLocaleString()}만 원</strong><small>선수금과 월 납입액 기준</small></MetricCard>
        </MetricGrid>

        <ChartGrid>
          <Panel>
            <PanelTitle>월 소득 사용처</PanelTitle>
            <PanelSub>전체 월 소득 대비 예시 비중</PanelSub>
            <StackedBar>
              {analysis.expenseBreakdown.map((item) => <span key={item.name} style={{ width: `${item.value}%`, background: item.color }} />)}
            </StackedBar>
            <LegendList>{analysis.expenseBreakdown.map((item) => <li key={item.name}><i style={{ background: item.color }} />{item.name}<b>{item.value}%</b></li>)}</LegendList>
          </Panel>

          <Panel>
            <PanelTitle>현재 대비 권장 수준</PanelTitle>
            <PanelSub>항목별 상대 수준 비교</PanelSub>
            <ChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.debtComparison} barGap={8}>
                  <CartesianGrid stroke="#edf1f5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="current" name="현재" fill="#b8cee4" radius={[4,4,0,0]} />
                  <Bar dataKey="recommended" name="권장" fill="#159887" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          </Panel>
        </ChartGrid>

        <InsightGrid>
          <Insight $tone="amber"><b>부담이 높은 요인</b><p>기존 대출 상환액과 생활비가 월 여유자금에 영향을 줍니다.</p><p>차량 가격뿐 아니라 유지비를 함께 확인하세요.</p></Insight>
          <Insight $tone="green"><b>추천되는 차량 조건</b><p>{application?.preferredBodyType || '경차·준중형'} 중심의 차량을 우선 비교합니다.</p><p>{application?.preferredFuel || '연료 효율이 높은 방식'} 선호를 추천에 반영합니다.</p></Insight>
        </InsightGrid>

        <BudgetPanel>
          <BudgetHeader><div><h2>구매 가능 예산</h2><p>차량가격, 선수금, 월 납입액을 함께 고려한 예시입니다.</p></div><b>권장 차량 가격 {analysis.recommendedPriceMin.toLocaleString()}~{analysis.recommendedPriceMax.toLocaleString()}만 원</b></BudgetHeader>
          <BudgetTable>
            <div><b>구분</b><b>예시값</b><b>설명</b></div>
            <div><span>차량 가격</span><span>{analysis.recommendedPriceMax.toLocaleString()}만 원 이하</span><span>권장 상한 예시</span></div>
            <div><span>선수금</span><span>{Number(application?.desiredDownPayment || 500).toLocaleString()}만 원</span><span>사용자 입력값</span></div>
            <div><span>월 납입액</span><span>{analysis.affordableMonthlyPayment.toLocaleString()}만 원 이하</span><span>mock 계산값</span></div>
          </BudgetTable>
          <Actions><PrimaryLink to="/recommendations">추천 차량 확인하기</PrimaryLink><SecondaryLink to="/apply">입력값 다시 보기</SecondaryLink></Actions>
        </BudgetPanel>

        <Notice><b>금융·차량 예시 안내</b> 이 결과는 모델 흐름 검증용 mock 데이터이며 실제 대출 심사, 금리 또는 구매 가능 여부를 의미하지 않습니다.</Notice>
      </Main>
    </AppLayout>
  )
}

const Main = styled.main`width:min(1000px,calc(100% - 40px));margin:0 auto;padding:36px 0 70px;`
const TitleRow = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px;h1{margin:0;font-size:26px;}p{margin:8px 0 0;color:#8290a2;font-size:12px;}`
const ResultBadge = styled.span`padding:9px 12px;border-radius:7px;color:#087b6c;background:#e8f7f4;font-size:10px;font-weight:800;`
const MetricGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;`
const MetricCard = styled.article`padding:22px;border:1px solid #e0e7ef;border-radius:9px;background:#fff;span{display:block;color:#738195;font-size:10px;}strong{display:block;margin:10px 0 6px;color:${({$tone})=>$tone==='green'?'#159887':$tone==='amber'?'#dd9419':'#215b97'};font-size:22px;}small{color:#9aa4b2;font-size:9px;}`
const ChartGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;@media(max-width:720px){grid-template-columns:1fr;}`
const Panel = styled.section`min-height:250px;padding:22px;border:1px solid #e0e7ef;border-radius:9px;background:#fff;`
const PanelTitle = styled.h2`margin:0 0 5px;font-size:15px;`
const PanelSub = styled.p`margin:0;color:#98a3b0;font-size:9px;`
const StackedBar = styled.div`display:flex;overflow:hidden;height:24px;margin:42px 0 26px;border-radius:5px;span{height:100%;}`
const LegendList = styled.ul`display:grid;gap:11px;margin:0;padding:0;list-style:none;li{display:grid;grid-template-columns:10px 1fr auto;align-items:center;color:#67758a;font-size:10px;}i{width:7px;height:7px;border-radius:50%;}b{color:#30425a;}`
const ChartBox = styled.div`height:180px;margin-top:12px;`
const InsightGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;`
const Insight = styled.section`padding:22px;border-radius:9px;background:${({$tone})=>$tone==='green'?'#eaf8f5':'#fff6df'};b{color:${({$tone})=>$tone==='green'?'#087e6f':'#b6770d'};font-size:13px;}p{margin:10px 0 0;color:#5f6d7f;font-size:10px;}`
const BudgetPanel = styled.section`padding:22px;border:1px solid #e0e7ef;border-radius:9px;background:#fff;`
const BudgetHeader = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;h2{margin:0;font-size:17px;}p{margin:6px 0 0;color:#8a96a5;font-size:10px;}b{color:#148b7c;font-size:12px;}`
const BudgetTable = styled.div`border:1px solid #e6ebf1;border-radius:7px;overflow:hidden;>div{display:grid;grid-template-columns:1fr 1fr 1fr;padding:11px 14px;border-bottom:1px solid #edf1f5;color:#647287;font-size:10px;&:first-child{color:#30425a;background:#f6f8fb;}&:last-child{border-bottom:0;}}`
const Actions = styled.div`display:flex;gap:8px;margin-top:18px;`
const PrimaryLink = styled(Link)`padding:11px 16px;border-radius:6px;color:#fff;background:#153e6d;font-size:10px;font-weight:800;text-decoration:none;`
const SecondaryLink = styled(Link)`padding:11px 16px;border:1px solid #d6dee8;border-radius:6px;color:#475a72;background:#fff;font-size:10px;font-weight:800;text-decoration:none;`
const Notice = styled.div`margin-top:12px;padding:14px;border-radius:7px;color:#756328;background:#fff6df;font-size:9px;b{margin-right:10px;color:#9a7212;}`
const StateBox = styled.div`width:min(1000px,calc(100% - 40px));margin:50px auto;padding:60px;border:1px solid #e0e7ef;border-radius:10px;background:#fff;text-align:center;color:#718096;`

export default ResultPage
