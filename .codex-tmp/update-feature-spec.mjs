import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 기능명세서.xlsx";
const outputDir = "C:/finalProject/2jo-final-project/outputs/creditcompass-auto-spec-update";
const outputPath = `${outputDir}/파이널 프로젝트 기능명세서.xlsx`;

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

// 기존 서식과 표 구조는 유지하고 확정된 기획 내용만 교체한다.
const overview = workbook.worksheets.getItem("개요");
overview.getRange("C5:C10").values = [
  ["신용·재무정보 기반 차량 구매 가능 예산 분석 및 맞춤 차량 추천 서비스"],
  ["차량 예산 설정과 차종 선택에 어려움을 겪는 사회초년생 및 첫 차량 구매 예정자"],
  ["현재: Vite·React, Zustand(persist), styled-components, Recharts, Mock API / 향후 연계 후보: Python, Spring Boot, MySQL"],
  ["프론트엔드 프로토타입 구현 및 모델·데이터 기준 검토 중"],
  ["입력 → 분석 결과 → 근거 → 차량 추천 흐름을 검증하며, 모든 예측값은 예시 데이터로 표시"],
  ["기능 ID는 화면 ID와 Mock API ID에 동일하게 연결하고, 향후 실제 API·DB 설계에서도 유지"],
];
overview.getRange("C13:C16").values = [
  ["/main에서 서비스 목적과 이용 흐름을 확인한다."],
  ["/apply에서 재무·신용정보와 차량 선호정보를 입력한다."],
  ["/result에서 예시 분석 결과, 주요 근거, 차트를 확인한다."],
  ["/recommendations에서 조건에 맞는 추천 차량과 추천 이유를 비교한다."],
];
overview.getRange("B5:C10").format.rowHeight = 42;
overview.getRange("B13:C16").format.rowHeight = 36;

const features = workbook.worksheets.getItem("기능명세");
features.getRange("A4:M13").values = [
  ["FN-001", "안내", "서비스 메인", "확정", "상", "일반 사용자", "서비스 목적과 이용 단계를 안내한다.", "없음", "핵심 기능과 5단계 이용 흐름 표시", "입력 시작 또는 추천 차량 보기", "SCR-MAIN", "없음", "/main에서 안내 문구와 이동 버튼이 표시된다."],
  ["FN-002", "입력", "재무·신용정보 입력", "확정", "상", "일반 사용자", "차량 구매 가능 예산 분석에 필요한 정보를 입력한다.", "월 실수령액, 고정지출, 생활비, 현금·예금, 대출 잔액·상환액·건수, 최근 신규 대출, 연체 이력, 신용거래 기간, 카드 수", "필수값과 음수 여부 검증", "검증된 재무·신용정보", "SCR-APPLY", "API-MOCK-INPUT", "빈 값과 음수가 차단되고 올바른 값만 다음 단계로 전달된다."],
  ["FN-003", "입력", "차량 선호정보 입력", "확정", "상", "일반 사용자", "이용 조건과 차량 선호를 입력한다.", "구매 목적, 주행거리, 주요 도로, 탑승 인원, 차종, 연료, 신차·중고차, 충전 환경, 선수금, 할부기간", "필수 선택·숫자값 검증", "검증된 차량 선호정보", "SCR-APPLY", "API-MOCK-INPUT", "모든 필수 항목 입력 후 제출할 수 있다."],
  ["FN-004", "상태", "입력값 저장과 화면 이동", "확정", "상", "일반 사용자", "입력값을 화면 간에 유지한다.", "검증된 입력값", "Zustand persist 스토어에 저장", "/result 이동", "SCR-APPLY", "없음", "제출 시 저장되고 새로고침 뒤에도 입력값이 유지된다."],
  ["FN-005", "분석", "Mock 분석 요청", "확정", "상", "일반 사용자", "재무 상태와 차량 구매 가능 범위를 예시값으로 계산한다.", "저장된 재무·신용정보", "300~800ms 지연 후 단순 규칙 기반 Mock 계산", "월 구매 여력, 재무 안정성 등급, 추천 예산", "SCR-RESULT", "API-MOCK-ANALYSIS", "동일 입력에 동일한 예시 결과가 반환되고 로딩·오류가 처리된다."],
  ["FN-006", "결과", "종합 분석 결과", "확정", "상", "일반 사용자", "핵심 분석 결과와 의미를 쉬운 말로 보여준다.", "Mock 분석 결과", "결과 요약과 상태별 안내 문구 구성", "월 구매 여력, 안정성 등급, 추천 예산", "SCR-RESULT", "API-MOCK-ANALYSIS", "예시 데이터 배지와 주요 결과가 명확히 표시된다."],
  ["FN-007", "근거", "결과 근거 시각화", "확정", "상", "일반 사용자", "분석 결과가 나온 이유를 차트와 비교 정보로 설명한다.", "소득·지출·상환 정보, 분석 결과", "소득 사용 비율과 현재·권장 수준 비교", "Recharts 차트와 영향 요인 설명", "SCR-RESULT", "API-MOCK-ANALYSIS", "차트 1개 이상과 결과 근거가 함께 표시된다."],
  ["FN-008", "추천", "맞춤 차량 추천", "확정", "상", "일반 사용자", "예산과 선호조건에 맞는 차량 후보를 제공한다.", "추천 예산, 차량 선호정보", "조건 일치도와 예시 차량 데이터를 조합", "차량 목록, 추천 점수, 추천 이유", "SCR-RECOMMEND", "API-MOCK-VEHICLES", "추천 차량별 가격·특징·이유가 예시값으로 표시된다."],
  ["FN-009", "추천", "추천 차량 필터", "확정", "중", "일반 사용자", "추천 목록을 원하는 조건으로 좁힌다.", "차종, 연료, 신차·중고차 등", "선택 조건에 맞는 Mock 목록 필터링", "필터링된 추천 목록", "SCR-RECOMMEND", "API-MOCK-VEHICLES", "필터 변경 시 표시 차량이 조건에 맞게 갱신된다."],
  ["FN-010", "공통", "상태 및 오류 안내", "확정", "상", "전체", "로딩, 빈 결과, 잘못된 입력 상태와 다음 행동을 안내한다.", "검증 오류 또는 API 상태", "상태별 사용자 문구로 변환", "오류 메시지와 재시도·이전 단계 안내", "공통", "공통", "기술 정보 노출 없이 원인과 다음 행동을 이해할 수 있다."],
];
features.getRange("A4:M13").format.rowHeight = 78;

const requirements = workbook.worksheets.getItem("요구사항");
requirements.getRange("A4:I11").values = [
  ["RQ-001", "목표", "서비스가 해결할 문제", "사회초년생이 차량 구매 과정에서 겪는 예산 설정과 차종 선택의 어려움을 재무·신용 분석과 차량 추천으로 줄인다.", "상", "메인 문구와 사용자 흐름 검토", "전체", "확정", "입력 → 분석 결과 → 근거 → 추천 흐름"],
  ["RQ-002", "사용자", "주요 사용자", "차량 구매 예산과 자신에게 맞는 차종을 함께 판단하려는 사회초년생 및 첫 차량 구매 예정자", "상", "팀 합의 및 사용자 인터뷰", "전체", "확정", "운영 관리자 화면은 선택 범위"],
  ["RQ-003", "데이터", "입력 데이터 범위", "재무·신용정보 11개와 차량 선호정보 10개를 입력하며 빈 값과 음수 입력을 차단한다.", "상", "입력 화면과 검증 테스트", "FN-002,FN-003", "확정", "신용거래 기간은 개월 입력값을 년·개월로 표시"],
  ["RQ-004", "데이터", "프로토타입 데이터", "현재 프론트엔드에는 실제 개인정보·백엔드·모델 서버 없이 Mock 데이터와 단순 규칙 결과만 사용한다.", "상", "코드와 예시 데이터 배지 확인", "FN-005,FN-006,FN-008", "확정", "실제 수치로 오인되지 않도록 예시값 표시"],
  ["RQ-005", "모델", "학습 데이터·평가 지표 후보", "후보 데이터는 비식별 신용정보, 가계 재무·소비, 차량 제원·가격, 선호·선택 이력이다. 후보 지표는 ROC-AUC·Precision·Recall·F1·Brier Score·MAE·RMSE·NDCG@K 등이다.", "상", "공식 출처·라이선스와 모델 유형 확정 후 선정", "FN-005,FN-008", "미정", "합성 데이터는 화면·흐름 검증용으로만 사용"],
  ["RQ-006", "설계", "향후 API·DB 구조", "향후 사용자 입력, 차량 기본정보, 분석 결과, 추천 결과를 저장·조회할 Spring Boot API와 MySQL 구조를 설계한다.", "중", "ERD와 요청·응답 명세 검토", "FN-002~FN-009", "부분 확정", "현재 프로토타입 구현 범위에는 DB가 없음"],
  ["RQ-007", "표현", "결과 기준과 한계", "금리·신용 기준 등 검증되지 않은 실제 수치를 만들지 않고 예시값으로 표시하며, 추천 확률은 검증 전까지 추천 점수로 표현한다.", "상", "화면 문구와 검증 문서 확인", "FN-006,FN-007,FN-008", "부분 확정", "공식 차량 가격 출처와 기준일 확인 필요"],
  ["RQ-008", "결정", "미결정 사항", "목표값(y)과 등급 경계, 예산 계산 방식, 추천 방식·가중치, 데이터 출처, 데이터 분할·통과 기준, 집단별 공정성, 추천 이후 최종 행동을 확정한다.", "상", "팀 합의 후 model-card와 API 명세 갱신", "FN-005~FN-009", "미정", "확정 전 실제 모델 성능처럼 표현하지 않음"],
];
requirements.getRange("A4:I11").format.rowHeight = 72;

workbook.recalculate();

const featureCheck = await workbook.inspect({
  kind: "table",
  range: "기능명세!A3:M13",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 13,
  maxChars: 18000,
});
console.log(featureCheck.ndjson);

const requirementCheck = await workbook.inspect({
  kind: "table",
  range: "요구사항!A3:I11",
  include: "values,formulas",
  tableMaxRows: 10,
  tableMaxCols: 9,
  maxChars: 12000,
});
console.log(requirementCheck.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT ${outputPath}`);
