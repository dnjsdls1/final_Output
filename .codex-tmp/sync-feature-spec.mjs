import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workspace = "C:/finalProject/2jo-final-project";
const sourcePath = `${workspace}/산출물/파이널 프로젝트 기능명세서.xlsx`;
const outputDir = `${workspace}/.codex-tmp/deliverables-build`;
const outputPath = `${outputDir}/파이널 프로젝트 기능명세서.xlsx`;

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourcePath));

// 전체 서비스 계획과 현재 React 프로토타입 범위를 한 문서에서 구분한다.
const overview = workbook.worksheets.getItem("개요");
overview.getRange("C5:C10").values = [
  ["신용·재무정보 기반 차량 구매 가능 예산 분석 및 맞춤 차량 추천 서비스"],
  ["첫 자동차 구매를 준비하며 적정 예산과 차종 판단이 어려운 사회초년생"],
  ["현재: Vite·React, Zustand(persist), styled-components, Recharts, Mock API / 계획: Python, FastAPI, Spring Boot, MySQL"],
  ["React 핵심 화면 4개 구현, 현재 전체 서비스 흐름에 대한 화면 10개 이상을 Figma로 구현 중"],
  ["확정된 현재 구현, 전체 서비스 계획, 미결정 사항을 구분해 기록"],
  ["기능 ID는 화면정의서와 Mock API에 연결하고 향후 실제 API·DB 설계에서도 유지"],
];
overview.getRange("C13:C16").values = [
  ["/main에서 서비스 목적과 핵심 이용 흐름을 확인한다."],
  ["/apply에서 재무·신용정보와 차량 이용조건을 2단계로 입력한다."],
  ["/result에서 월 가용자금, 자체 위험 수준, 추천 예산과 근거를 확인한다."],
  ["/recommendations에서 추천 차량, 추천 점수와 이유를 비교한다."],
];
overview.getRange("B5:C10").format.rowHeight = 42;
overview.getRange("B13:C16").format.rowHeight = 36;

const features = workbook.worksheets.getItem("기능명세");
features.getRange("A4:M13").values = [
  ["FN-001", "안내", "서비스 메인", "현재 구현", "상", "일반 사용자", "서비스 목적과 이용 단계를 안내한다.", "없음", "핵심 기능과 이용 흐름 표시", "입력 시작 또는 추천 차량 보기", "SCR-MAIN", "없음", "/main에서 소개, 이용 단계와 이동 버튼이 표시된다."],
  ["FN-002", "입력", "재무·신용정보 입력", "현재 구현", "상", "일반 사용자", "차량 구매 여력 분석에 필요한 11개 정보를 입력한다.", "소득, 지출, 자산, 대출, 연체, 신용거래 기간, 카드 수", "필수값과 음수 여부 검증", "검증된 재무·신용정보", "SCR-APPLY", "API-MOCK-INPUT", "빈 값과 음수가 차단되고 신용거래 기간이 년·개월로 표시된다."],
  ["FN-003", "입력", "차량 이용조건 입력", "현재 구현", "상", "일반 사용자", "차량 이용조건과 선호를 입력한다.", "구매 목적, 주행거리, 도로, 인원, 차종, 연료, 차량 상태, 충전, 선수금, 할부기간", "필수 선택과 숫자값 검증", "검증된 차량 선호정보", "SCR-APPLY", "API-MOCK-INPUT", "모든 필수 항목을 입력해야 제출할 수 있다."],
  ["FN-004", "상태", "입력 저장과 이동", "현재 구현", "상", "일반 사용자", "입력값을 화면 이동과 새로고침 이후에도 유지한다.", "검증된 입력값", "Zustand persist 스토어 저장", "/result 이동", "SCR-APPLY", "없음", "제출 시 입력값이 저장되고 결과 화면으로 이동한다."],
  ["FN-005", "분석", "Mock 재무 분석", "현재 구현", "상", "일반 사용자", "월 가용자금과 차량 구매 가능 범위를 예시 규칙으로 계산한다.", "저장된 재무·신용정보", "500ms 지연 후 규칙 기반 Mock 계산", "월 납입 가능액, 재무 안정성, 추천 예산", "SCR-RESULT", "API-MOCK-ANALYSIS", "동일 입력에 동일한 예시 결과가 반환되며 로딩과 오류를 처리한다."],
  ["FN-006", "결과", "종합 분석 결과", "현재 구현", "상", "일반 사용자", "핵심 결과와 그 의미를 쉬운 말로 보여준다.", "Mock 분석 결과", "결과 요약과 안내 문구 구성", "핵심 결과 카드와 다음 행동", "SCR-RESULT", "API-MOCK-ANALYSIS", "예시 데이터 배지와 추천 차량 이동 버튼이 표시된다."],
  ["FN-007", "근거", "결과 근거 시각화", "현재 구현", "상", "일반 사용자", "분석 결과가 나온 이유를 그래프와 영향 요인으로 설명한다.", "소득·지출·상환 정보와 분석 결과", "소득 사용처와 현재·권장 수준 비교", "Recharts 차트와 긍정·주의 요인", "SCR-RESULT", "API-MOCK-ANALYSIS", "차트 1개 이상과 결과 근거가 함께 표시된다."],
  ["FN-008", "추천", "맞춤 차량 추천", "현재 구현", "상", "일반 사용자", "예산과 선호조건을 반영한 예시 차량 후보를 제공한다.", "추천 예산과 차량 선호정보", "조건과 Mock 차량 데이터 조합", "차량 목록, 추천 점수, 추천 이유", "SCR-RECOMMEND", "API-MOCK-VEHICLES", "차량별 가격, 연비, 예상 월 납입액과 추천 이유가 표시된다."],
  ["FN-009", "추천", "추천 차량 필터", "현재 구현", "중", "일반 사용자", "차종, 연료, 신차·중고차 조건으로 추천 목록을 좁힌다.", "추천순, 가격, 차종, 연료, 차량 상태", "선택 조건에 맞는 Mock 목록 필터링", "필터링된 추천 목록", "SCR-RECOMMEND", "API-MOCK-VEHICLES", "필터 변경 시 표시 차량이 조건에 맞게 갱신된다."],
  ["FN-010", "확장", "차량 상세·비교·시뮬레이션", "Figma 시안", "중", "일반 사용자", "차량 상세와 최대 3대 비교, 구매조건 변경 결과를 제공한다.", "차량, 선수금, 할부기간, 예상금리, 주행거리", "월 비용과 구매 후 가용자금 재계산", "상세, 비교표, 조건별 결과, 구매계획", "미정", "미정", "Figma 시안 검토와 계산 기준 확정 후 React 구현 범위를 결정한다."],
];
features.getRange("A4:M13").format.rowHeight = 78;

const requirements = workbook.worksheets.getItem("요구사항");
requirements.getRange("A4:I11").values = [
  ["RQ-001", "목표", "서비스가 해결할 문제", "사회초년생이 차량 구매 과정에서 겪는 예산 설정과 차종 선택의 어려움을 재무·신용 분석과 차량 추천으로 줄인다.", "상", "서비스 한 문장과 핵심 흐름 검토", "전체", "확정", "재무상태를 먼저 분석한 뒤 차량 범위를 제안"],
  ["RQ-002", "범위", "현재 프로토타입 범위", "/main, /apply, /result, /recommendations의 입력, 결과, 근거, 다음 행동 흐름을 React로 검증한다. 현재 전체 서비스 흐름에 대한 화면 10개 이상은 Figma로 구현 중이다.", "상", "브라우저 화면·라우팅과 Figma 흐름 확인", "FN-001~FN-009", "확정", "로그인·마이페이지·관리자 기능은 현재 React 코드 범위 밖"],
  ["RQ-003", "데이터", "입력 데이터 범위", "현재 화면은 재무·신용정보 11개와 차량 이용조건 11개를 받으며 빈 값과 음수를 차단한다.", "상", "입력 화면과 검증 테스트", "FN-002,FN-003", "확정", "전체 서비스의 5단계 상세 입력은 확장 계획"],
  ["RQ-004", "결과", "결과와 근거", "월 납입 가능액, 재무 안정성, 추천 예산, 추천 차량을 제공하고 소득 사용처와 주요 영향 요인을 함께 설명한다.", "상", "결과·추천 화면 검토", "FN-005~FN-009", "확정", "모든 현재 결과는 Mock 또는 예시값"],
  ["RQ-005", "모델", "학습 데이터·평가 지표 후보", "비식별 신용정보, 가계 재무·소비, 차량 제원·가격, 선호 이력을 후보로 검토한다. 모델 유형에 따라 ROC-AUC, F1, Brier Score, MAE, RMSE, NDCG@K 등을 검토한다.", "상", "출처·라이선스와 목표값 확정 후 선정", "FN-005,FN-008", "미정", "가상 시나리오는 화면 검증용이며 성능 증거가 아님"],
  ["RQ-006", "설계", "향후 API·DB 구조", "사용자 입력, 차량 기본정보, 분석 결과, 추천 결과, 구매계획을 다룰 FastAPI·Spring Boot 계약과 MySQL 구조를 설계한다.", "중", "ERD와 요청·응답 명세 검토", "FN-002~FN-010", "계획", "현재 저장소에는 백엔드, 모델 서버와 DB가 없음"],
  ["RQ-007", "표현", "금융 결과의 한계", "자체 결과를 NICE·KCB 점수나 금융기관 승인으로 표현하지 않는다. 확인되지 않은 가격, 금리, 보험료와 세금은 예시값으로 표시한다.", "상", "화면 문구와 사실 확인 문서 점검", "FN-005~FN-010", "부분 확정", "공식 출처와 기준일 확인 필요"],
  ["RQ-008", "결정", "미결정 사항", "최종 목표값과 등급 기준, 예산 계산 방식, 추천 방식·가중치, 데이터 출처, 모델 통과 기준, 추천 점수 표현, 1차 개발의 확장 범위를 확정한다.", "상", "팀 합의 후 모델 카드·API·화면 명세 갱신", "FN-005~FN-010", "미정", "차량 상세·비교·시뮬레이션의 구현 시점 포함"],
];
requirements.getRange("A4:I11").format.rowHeight = 76;

workbook.recalculate();

for (const [sheetName, range] of [["개요", "B4:C16"], ["기능명세", "A3:M13"], ["요구사항", "A3:I11"]]) {
  const check = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!${range}`,
    include: "values,formulas",
    tableMaxRows: 16,
    tableMaxCols: 13,
    maxChars: 12000,
  });
  console.log(sheetName, check.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
await (await SpreadsheetFile.exportXlsx(workbook)).save(outputPath);
console.log(outputPath);
