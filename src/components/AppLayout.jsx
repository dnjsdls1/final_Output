import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

function AppLayout({ children }) {
  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Logo to="/main">CreditComPass <strong>Auto</strong></Logo>
          <Nav aria-label="주요 메뉴">
            <NavLink to="/main">서비스 소개</NavLink>
            <NavLink to="/apply">재무 진단</NavLink>
            <NavLink to="/result">분석 결과</NavLink>
            <NavLink to="/recommendations">차량 추천</NavLink>
          </Nav>
          <SampleBadge>예시 데이터</SampleBadge>
        </HeaderInner>
      </Header>
      {children}
    </Shell>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  color: #14233d;
  background: #f5f8fc;
`
const Header = styled.header`
  height: 64px;
  border-bottom: 1px solid #e7edf4;
  background: #fff;
`
const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: min(1120px, calc(100% - 40px));
  height: 100%;
  margin: 0 auto;

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;
  }
`
const Logo = styled(NavLink)`
  color: #102c51;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;

  strong { color: #159887; }
`
const Nav = styled.nav`
  display: flex;
  gap: 28px;

  a {
    color: #526077;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
  }

  a.active { color: #123761; }

  @media (max-width: 720px) {
    display: none;
  }
`
const SampleBadge = styled.span`
  justify-self: end;
  padding: 5px 9px;
  border-radius: 5px;
  color: #174574;
  background: #edf4fb;
  font-size: 11px;
  font-weight: 800;
`

export default AppLayout
