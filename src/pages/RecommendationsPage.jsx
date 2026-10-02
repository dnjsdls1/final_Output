import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getVehicleRecommendations } from '../api/recommendationApi.js'
import AppLayout from '../components/AppLayout.jsx'
import useApplicationStore from '../store/applicationStore.js'

function RecommendationsPage() {
  const application = useApplicationStore((state) => state.application)
  const [vehicles, setVehicles] = useState([])
  const [status, setStatus] = useState('loading')
  const [filter, setFilter] = useState('전체')

  useEffect(() => {
    getVehicleRecommendations()
      .then((data) => {
        setVehicles(data)
        setStatus(data.length ? 'ready' : 'empty')
      })
      .catch(() => setStatus('error'))
  }, [])

  const filteredVehicles = useMemo(() => {
    if (filter === '전체') return vehicles
    return vehicles.filter((vehicle) => vehicle.type === filter || vehicle.fuel === filter)
  }, [filter, vehicles])

  return (
    <AppLayout>
      <Main>
        <TitleBlock><h1>추천 차량</h1><p>입력한 재무정보와 차량 조건을 반영한 예시 추천 목록입니다.</p><strong>권장 예산 범위에 맞는 차량을 비교해 보세요.</strong></TitleBlock>

        <SummaryBar>
          <span>추천 조건</span>
          <b>{application?.preferredBodyType || '상관없음'}</b>
          <i>·</i>
          <b>{application?.preferredFuel || '상관없음'}</b>
          <i>·</i>
          <b>{application?.vehicleCondition || '모두'}</b>
          <i>·</i>
          <b>{application?.desiredInstallmentMonths || 48}개월 할부</b>
        </SummaryBar>

        <FilterRow>
          <b>조건에 맞는 차량 6대</b>
          <FilterList>{['전체', '경차', '세단', 'SUV', '가솔린', '하이브리드'].map((item) => <FilterButton key={item} type="button" $active={filter === item} onClick={() => setFilter(item)}>{item}</FilterButton>)}</FilterList>
          <small>※ 모든 가격과 납입액은 예시값입니다.</small>
        </FilterRow>

        {status === 'loading' && <StateBox>추천 차량을 불러오는 중입니다.</StateBox>}
        {status === 'error' && <StateBox>추천 차량을 불러오지 못했습니다.</StateBox>}
        {status === 'empty' && <StateBox>표시할 추천 차량이 없습니다.</StateBox>}
        {status === 'ready' && filteredVehicles.length === 0 && <StateBox>선택한 조건에 맞는 차량이 없습니다.</StateBox>}
        {status === 'ready' && filteredVehicles.length > 0 && (
          <VehicleGrid>
            {filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
          </VehicleGrid>
        )}

        <Actions><PrimaryLink to="/apply">구매조건 다시 입력하기</PrimaryLink><SecondaryLink to="/result">재무분석 돌아가기</SecondaryLink></Actions>
      </Main>
    </AppLayout>
  )
}

function VehicleCard({ vehicle }) {
  return (
    <Card>
      <CarImage><CarBody /></CarImage>
      <Match>예시 적합도 {vehicle.fit}%</Match>
      <h2>{vehicle.name}</h2>
      <Specs><span>차종 <b>{vehicle.type}</b></span><span>연료 <b>{vehicle.fuel}</b></span><span>연비 <b>{vehicle.efficiency}</b></span></Specs>
      <Price><span>차량 가격 <b>{vehicle.price}</b></span><span>예상 월 납입 <b>{vehicle.monthly}</b></span></Price>
      <Reason><b>추천 이유</b><span>{vehicle.reason}</span></Reason>
    </Card>
  )
}

const Main = styled.main`width:min(960px,calc(100% - 40px));margin:0 auto;padding:36px 0 80px;`
const TitleBlock = styled.div`h1{margin:0 0 8px;font-size:26px;}p{margin:0;color:#7d8999;font-size:11px;}strong{display:block;margin-top:14px;color:#159887;font-size:11px;}`
const SummaryBar = styled.div`display:flex;align-items:center;gap:12px;margin:22px 0;padding:16px 20px;border-radius:8px;background:#eef3f8;color:#637287;font-size:10px;span{font-weight:800;}b{color:#2f435c;}i{color:#a3adba;font-style:normal;}`
const FilterRow = styled.div`display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;margin-bottom:16px;b{font-size:13px;}small{color:#98a2b0;font-size:9px;}`
const FilterList = styled.div`display:flex;gap:6px;`
const FilterButton = styled.button`padding:6px 11px;border:1px solid ${({$active})=>$active?'#163f6d':'#d9e1ea'};border-radius:999px;color:${({$active})=>$active?'#fff':'#657387'};background:${({$active})=>$active?'#163f6d':'#fff'};font-size:9px;cursor:pointer;`
const VehicleGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:12px;@media(max-width:760px){grid-template-columns:1fr 1fr;}@media(max-width:520px){grid-template-columns:1fr;}`
const Card = styled.article`padding:12px;border:1px solid #dbe4ed;border-radius:9px;background:#fff;h2{margin:10px 0 12px;font-size:15px;}`
const CarImage = styled.div`position:relative;height:128px;border-radius:7px;background:#edf3f8;`
const CarBody = styled.div`position:absolute;left:50%;top:50%;width:150px;height:40px;border-radius:20px 28px 10px 10px;background:#6e98ba;transform:translate(-50%,-50%);`
const Match = styled.span`display:inline-block;margin-top:11px;color:#159887;font-size:9px;font-weight:800;`
const Specs = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:6px;color:#8792a1;font-size:8px;span{display:grid;gap:3px;}b{color:#33465e;font-size:9px;}`
const Price = styled.div`display:flex;gap:16px;margin:13px 0;color:#8490a0;font-size:8px;span{display:grid;gap:3px;}b{color:#263b55;font-size:10px;}`
const Reason = styled.div`display:grid;gap:5px;padding:10px;border-radius:6px;color:#65758a;background:#f2f6fa;font-size:9px;line-height:1.5;b{color:#2460a8;}`
const Actions = styled.div`display:flex;justify-content:center;gap:8px;margin-top:42px;`
const PrimaryLink = styled(Link)`padding:11px 17px;border-radius:6px;color:#fff;background:#153e6d;font-size:10px;font-weight:800;text-decoration:none;`
const SecondaryLink = styled(Link)`padding:11px 17px;border:1px solid #d6dee8;border-radius:6px;color:#51627a;background:#fff;font-size:10px;font-weight:800;text-decoration:none;`
const StateBox = styled.div`padding:60px;border:1px solid #e0e7ef;border-radius:9px;background:#fff;text-align:center;color:#718096;font-size:12px;`

export default RecommendationsPage
