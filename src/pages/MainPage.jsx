import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getVehicleRecommendations } from '../api/recommendationApi.js'
import AppLayout from '../components/AppLayout.jsx'

function MainPage() {
  const [vehicles, setVehicles] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getVehicleRecommendations()
      .then((data) => {
        setVehicles(data.slice(0, 3))
        setStatus(data.length ? 'ready' : 'empty')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <AppLayout>
      <Hero>
        <HeroInner>
          <HeroCopy>
            <Kicker>자동차 구매 재무설계 서비스</Kicker>
            <h1>첫차, 가격보다 감당할 수 있는<br />비용부터 확인하세요.</h1>
            <p>소득·지출·대출 정보를 바탕으로 적정 차량 예산과 월 납입 가능액을 예시로 안내합니다.</p>
            <Actions>
              <PrimaryButton to="/apply">내 재무 진단하기</PrimaryButton>
              <SecondaryButton to="/recommendations">추천 차량 미리보기</SecondaryButton>
            </Actions>
          </HeroCopy>
          <BudgetCard>
            <span>현재 예상 차량 예산</span>
            <strong>1,800 ~ 2,400만 원</strong>
            <Divider />
            <MetricRow><span>월 납입 가능액</span><b>75만 원</b><em>보통</em></MetricRow>
            <CarVisual><CarBody /><CarWheel /><CarWheel /></CarVisual>
          </BudgetCard>
        </HeroInner>
      </Hero>

      <Main>
        <MiniNav>
          <span>✓ 입력은 3분이면 충분해요</span>
          <span>✓ 결과는 예시 데이터로 제공돼요</span>
          <span>✓ 차량별 구매 비용을 비교해요</span>
        </MiniNav>

        <Section>
          <SectionTitle>내 상황에 맞는 첫차 기준을 한눈에</SectionTitle>
          <SectionSub>복잡한 차량 구매 판단을 네 단계로 정리했습니다.</SectionSub>
          <FeatureGrid>
            {[
              ['01', '소득·지출 기반 예산', '월 가용자금에서 무리 없는 차량 예산을 확인합니다.'],
              ['02', '차량 선호정보 반영', '차종과 연료, 주행환경을 추천에 반영합니다.'],
              ['03', '총 유지비 함께 확인', '차량 가격뿐 아니라 월 부담을 함께 봅니다.'],
              ['04', '추천 근거 제공', '왜 이 차량이 맞는지 핵심 이유를 알려드립니다.'],
            ].map(([number, title, body]) => (
              <FeatureCard key={number}><i>{number}</i><strong>{title}</strong><p>{body}</p></FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section>
          <SectionTitle>5단계면 추천까지 완료</SectionTitle>
          <Steps>
            {['재무정보 입력', '차량 선택', '예산 계산', '차량 추천', '구매계획'].map((step, index) => (
              <StepBox key={step} $active={index === 4}><small>0{index + 1}</small><b>{step}</b></StepBox>
            ))}
          </Steps>
        </Section>

        <DarkBanner>
          <div><small>지금 시작하면</small><h2>취업 2년 차 직장인</h2><p>월 소득과 지출을 입력하고 감당 가능한 차량 예산을 확인해 보세요.</p></div>
          <BannerMetric><span>소득 대비</span><strong>보통</strong></BannerMetric>
          <BannerMetric><span>추천 차량 가격</span><strong>최대 55만 원</strong></BannerMetric>
          <BannerMetric><span>추천 조건</span><strong>경차·소형·준중형</strong></BannerMetric>
        </DarkBanner>

        <Section>
          <SectionTitle>예산 안에서 고른 추천 차량</SectionTitle>
          {status === 'loading' && <StateBox>추천 차량을 불러오는 중입니다.</StateBox>}
          {status === 'error' && <StateBox>추천 차량을 불러오지 못했습니다.</StateBox>}
          {status === 'empty' && <StateBox>표시할 추천 차량이 없습니다.</StateBox>}
          {status === 'ready' && (
            <VehicleGrid>
              {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </VehicleGrid>
          )}
        </Section>

        <Notice><b>안내</b> 화면의 금액과 추천 결과는 서비스 흐름 확인을 위한 예시값이며 실제 금융 판단 기준이 아닙니다.</Notice>
      </Main>
      <Footer><b>CreditComPass Auto</b><span>예시 데이터를 사용하는 금융·차량 추천 프로토타입입니다.</span></Footer>
    </AppLayout>
  )
}

function VehicleCard({ vehicle }) {
  return (
    <VehicleCardBox>
      <CarImage><CarBody /></CarImage>
      <Match>예시 적합도 {vehicle.fit}%</Match>
      <h3>{vehicle.name}</h3>
      <SpecRow><span>{vehicle.type}</span><span>{vehicle.fuel}</span><span>{vehicle.efficiency}</span></SpecRow>
      <Price>{vehicle.price} · 월 {vehicle.monthly}</Price>
      <Reason><b>추천 이유</b>{vehicle.reason}</Reason>
    </VehicleCardBox>
  )
}

const Hero = styled.section`background: linear-gradient(110deg, #f7fbff 0%, #edf8f7 100%);`
const HeroInner = styled.div`
  display: grid; grid-template-columns: 1.45fr .8fr; gap: 70px; align-items: center;
  width: min(1000px, calc(100% - 40px)); min-height: 400px; margin: 0 auto;
  @media (max-width: 760px) { grid-template-columns: 1fr; padding: 56px 0; }
`
const HeroCopy = styled.div`
  h1 { margin: 12px 0 18px; color: #12345d; font-size: 42px; line-height: 1.25; letter-spacing: -2px; }
  p { max-width: 620px; margin: 0; color: #66758a; line-height: 1.7; }
`
const Kicker = styled.span`color: #159887; font-size: 13px; font-weight: 800;`
const Actions = styled.div`display: flex; gap: 10px; margin-top: 28px;`
const PrimaryButton = styled(Link)`padding: 13px 20px; border-radius: 8px; color: #fff; background: #123761; font-size: 13px; font-weight: 800; text-decoration: none;`
const SecondaryButton = styled(Link)`padding: 13px 20px; border: 1px solid #dbe4ee; border-radius: 8px; color: #31445d; background: #fff; font-size: 13px; font-weight: 800; text-decoration: none;`
const BudgetCard = styled.aside`
  padding: 28px; border: 1px solid #d8e3eb; border-radius: 14px; background: rgba(255,255,255,.9); box-shadow: 0 12px 30px rgba(39,65,93,.08);
  > span { color: #617186; font-size: 12px; }
  > strong { display: block; margin-top: 10px; color: #173c68; font-size: 24px; }
`
const Divider = styled.div`height: 1px; margin: 22px 0; background: #e8edf3;`
const MetricRow = styled.div`display: flex; align-items: center; gap: 10px; font-size: 12px; b { color: #159887; font-size: 18px; } em { color: #e29a18; font-style: normal; font-weight: 800; }`
const CarVisual = styled.div`position: relative; height: 86px; margin-top: 18px; border-radius: 10px; background: #e9f0f7;`
const CarBody = styled.div`position: absolute; left: 50%; top: 50%; width: 150px; height: 38px; border-radius: 18px 26px 9px 9px; background: #6c95b8; transform: translate(-50%,-50%);`
const CarWheel = styled.span`position: relative; display: block; top: 58px; left: 52px; width: 18px; height: 18px; margin-bottom: -18px; border-radius: 50%; background: #1d3856; &:last-child { left: 190px; }`
const Main = styled.main`width: min(1000px, calc(100% - 40px)); margin: 0 auto; padding-bottom: 46px;`
const MiniNav = styled.div`display: flex; justify-content: center; gap: 42px; margin: -18px 0 54px; padding: 18px; border-radius: 10px; background: #fff; box-shadow: 0 5px 18px rgba(44,68,96,.07); color: #6d7888; font-size: 12px; @media (max-width: 700px) { display: none; }`
const Section = styled.section`margin: 0 0 52px;`
const SectionTitle = styled.h2`margin: 0 0 7px; color: #14233d; font-size: 23px; letter-spacing: -.7px;`
const SectionSub = styled.p`margin: 0 0 22px; color: #8490a0; font-size: 13px;`
const FeatureGrid = styled.div`display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; @media(max-width:760px){grid-template-columns:1fr 1fr;}`
const FeatureCard = styled.article`min-height: 145px; padding: 22px; border: 1px solid #e0e7ef; border-radius: 10px; background: #fff; i { display:block; margin-bottom:18px; color:#159887; font-size:12px; font-style:normal; font-weight:800; } strong { font-size:14px; } p { margin:9px 0 0; color:#7d8999; font-size:11px; line-height:1.55; }`
const Steps = styled.div`display:grid; grid-template-columns:repeat(5,1fr); gap:10px;`
const StepBox = styled.div`padding:18px; border:1px solid #dfe6ee; border-radius:9px; background:${({$active})=>$active?'#eaf8f5':'#fff'}; small{display:block;color:#159887;font-weight:800;} b{display:block;margin-top:12px;font-size:13px;}`
const DarkBanner = styled.section`display:grid; grid-template-columns:1.3fr repeat(3,1fr); gap:12px; margin-bottom:52px; padding:30px; border-radius:12px; color:#fff; background:#153b67; h2{margin:6px 0;font-size:22px;} p{margin:0;color:#b9c9dc;font-size:11px;} small{color:#8ddacc;}`
const BannerMetric = styled.div`padding:22px; border-radius:8px; background:rgba(255,255,255,.1); span{display:block;color:#aec1d7;font-size:11px;} strong{display:block;margin-top:12px;font-size:15px;}`
const VehicleGrid = styled.div`display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:22px; @media(max-width:760px){grid-template-columns:1fr;}`
const VehicleCardBox = styled.article`padding:12px; border:1px solid #dce5ee; border-radius:10px; background:#fff; h3{margin:10px 0;font-size:16px;}`
const CarImage = styled.div`position:relative;height:126px;border-radius:8px;background:#edf3f8;`
const Match = styled.span`display:inline-block;margin-top:12px;color:#159887;font-size:10px;font-weight:800;`
const SpecRow = styled.div`display:flex;gap:12px;color:#6e7c8f;font-size:10px;`
const Price = styled.p`margin:10px 0;color:#273a53;font-size:11px;font-weight:800;`
const Reason = styled.p`display:grid;gap:4px;margin:0;padding:10px;border-radius:6px;color:#6e7c8f;background:#f2f6fa;font-size:10px;line-height:1.45;b{color:#2460a8;}`
const StateBox = styled.div`margin-top:20px;padding:40px;border:1px solid #e0e7ef;border-radius:10px;background:#fff;text-align:center;color:#718096;`
const Notice = styled.div`padding:17px;border-radius:8px;color:#7f641c;background:#fff7df;font-size:11px;b{margin-right:12px;color:#9a7415;}`
const Footer = styled.footer`display:flex;flex-direction:column;gap:8px;padding:28px calc((100% - 1000px)/2);color:#c4d2e2;background:#112f53;font-size:11px;b{color:#fff;font-size:14px;}`

export default MainPage
