import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import JSZip from "jszip";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const workspace = "C:/finalProject/2jo-final-project";
const skillDir = "C:/Users/user1/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations";
const sourcePath = `${workspace}/산출물/파이널 프로젝트 화면정의서.pptx`;
const stagingDir = `${workspace}/.codex-tmp/deliverables-finalizer`;
const candidatePath = `${stagingDir}/screen-definition-candidate.pptx`;
const finalPath = `${workspace}/.codex-output/CreditComPass_Auto_화면정의서_정리본.pptx`;
const pythonExecutable = "C:/Users/user1/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
process.env.RUNTIME_NODE = "C:/Users/user1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe";
process.env.RUNTIME_NODE_MODULES = "C:/Users/user1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
process.env.RUNTIME_BIN_DIR = "C:/Users/user1/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override";

const slideTexts = [
  [
    "CreditComPass Auto", "화면정의서",
    "재무·신용 분석 기반 차량 구매 예산 및 맞춤 차량 추천 서비스",
    "현재 상태", "React 4개 구현 · Figma 전체 흐름 10개 이상 구현 중",
    "2026.10   산출물 정리본",
  ],
  [
    "1. 프로젝트와 사용자 범위", "확정 내용과 현재 프로토타입 범위",
    "CreditComPass Auto   React 프로토타입과 전체 서비스 계획", "현재 확정 정보",
    "• 핵심 사용자: 사회초년생과 첫차 구매자",
    "• 입력: 재무·신용정보와 차량 이용조건",
    "• 결과: 월 가용자금, 자체 위험 수준, 추천 예산",
    "• 후속 화면: 추천 차량과 추천 이유",
    "• 현재 분석값: Mock 데이터와 예시 규칙",
    "현재 범위와 확장 계획",
    "1. React 핵심 화면 4개 구현",
    "2. Figma 전체 서비스 화면 10개 이상 구현 중",
    "3. 차량 상세·비교·시뮬레이션·구매계획 시안 포함",
    "4. 실제 모델·FastAPI·Spring Boot·MySQL은 미연결",
    "5. 미정 항목은 팀 승인 후 기능과 화면에 반영",
  ],
  [
    "2. 화면 목록", "현재 React 화면과 Figma 전체 서비스 시안 구분",
    "CreditComPass Auto   화면 ID와 기능 ID 연결", "화면 ID", "화면명", "기능 ID", "상태",
    "SCR-MAIN 외", "메인·로그인·회원가입", "FN-001 / 미정", "Figma/React",
    "SCR-APPLY", "5단계 입력·입력 확인", "FN-002~004", "Figma/React",
    "SCR-RESULT", "종합 분석 결과와 근거", "FN-005~007", "Figma/React",
    "SCR-RECOMMEND", "추천 차량 목록", "FN-008, 009", "Figma/React",
    "미정", "차량 상세·비교", "FN-010", "Figma 시안",
    "미정", "조건 시뮬레이션·구매계획", "FN-010", "Figma 시안",
    "미정", "마이페이지·관리자", "미정", "Figma 시안",
    "미정", "분석모형 설명·서비스 구조", "미정", "Figma 시안",
  ],
  [
    "3. 핵심 사용자 흐름", "현재 React 프로토타입의 입력, 결과, 근거, 다음 행동 흐름",
    "CreditComPass Auto   현재 구현 흐름", "1", "서비스 안내", "SCR-MAIN", "→",
    "2", "재무·신용정보 입력", "SCR-APPLY 1단계", "→",
    "3", "차량 이용조건 입력", "SCR-APPLY 2단계", "→",
    "4", "분석 결과와 근거", "SCR-RESULT", "→",
    "5", "추천 차량 비교", "SCR-RECOMMEND",
    "Figma 확장 흐름: 상세, 비교, 조건 시뮬레이션, 구매계획, 마이페이지와 관리자 화면",
  ],
  [
    "4. 종합 분석 결과 화면 (SCR-RESULT)", "핵심 결과, 결과 근거와 다음 행동을 한 화면에서 제공",
    "CreditComPass Auto   예시 데이터 표시 원칙 적용", "예시 데이터 배지      입력값 기준 요약",
    "월 납입 가능액", "만원 단위 예시값", "재무 안정성", "자체 등급", "추천 차량 예산", "만원 범위",
    "소득 사용처 구성 차트", "현재·권장 수준, 긍정·주의 요인, 추천 차량 이동",
    "화면 정의", "연결 기능", "FN-005 Mock 분석", "FN-006~007 결과와 근거", "",
    "입력", "Zustand에 저장된 신청 정보", "", "상태", "로딩, 입력 없음, API 오류", "",
    "완료 조건", "예시값, 근거와 다음 행동 표시",
  ],
  [
    "5. 화면 정의 작성 기준", "현재 구현과 Figma 시안에 동일한 작성 기준 적용",
    "CreditComPass Auto   화면 명세 공통 기준", "기본 정보", "화면 ID / 화면명 / 목적",
    "사용자 / 경로 / 관련 기능 ID", "구성 요소", "입력 / 결과 카드 / 차트 / 근거",
    "예시 데이터 배지 / 다음 행동", "동작 정의", "입력 검증 / Zustand 저장",
    "Mock API 요청 / 성공 결과 / 이동 경로", "상태 정의", "로딩 / 빈 결과 / 잘못된 입력",
    "API 오류 / 재시도 / 이전 단계", "데이터 표현", "만원 / 개월 / km / 기준일",
    "예시값 / 출처 / 분석 한계", "범위 구분", "현재 구현 / Figma 시안 / 미정",
    "완료 조건 / 테스트 기준",
  ],
  [
    "6. 확정 사항과 미결정 사항", "현재 팀 합의 내용과 다음 결정 항목",
    "CreditComPass Auto   2026-10-02 기준", "확정 사항",
    "☑ 핵심 사용자는 사회초년생과 첫차 구매자", "",
    "☑ 재무·신용정보와 차량 조건을 함께 분석", "",
    "☑ React 핵심 화면 4개는 Mock 데이터로 구현", "",
    "☑ Figma 전체 서비스 화면 10개 이상 구현 중", "미결정 사항",
    "☐ 최종 데이터 출처와 사용 허가 범위", "",
    "☐ 모델 목표값, 등급 기준과 평가 통과 기준", "",
    "☐ 예산 계산 방식과 차량 추천 가중치", "",
    "☐ 전체 기능 중 1차 개발에 포함할 범위",
  ],
];

const noteTexts = [
  "현재 React 구현과 Figma 전체 서비스 화면 구성을 구분합니다.",
  "Figma에서는 전체 서비스 흐름의 화면 10개 이상을 구현 중입니다.",
  "현재 구현 화면과 Figma 시안을 상태 열에서 구분했습니다.",
  "React 핵심 흐름은 로그인 없이 메인, 입력, 결과, 추천 화면으로 이어집니다.",
  "결과는 교육·시연용이며 실제 신용점수나 금융기관 승인 결과가 아닙니다.",
  "가격과 금융비용은 출처와 기준일 확인 전까지 예시값으로 표시합니다.",
  "미결정 항목은 확정 전까지 실제 기능이나 모델 성능처럼 표현하지 않습니다.",
];

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const source = await fs.readFile(sourcePath);
const zip = await JSZip.loadAsync(source);

for (let slideNumber = 1; slideNumber <= slideTexts.length; slideNumber += 1) {
  const slidePath = `ppt/slides/slide${slideNumber}.xml`;
  let xml = await zip.file(slidePath).async("string");
  let index = 0;
  xml = xml.replace(/<a:t>([\s\S]*?)<\/a:t>/g, () => {
    const value = slideTexts[slideNumber - 1][index];
    if (value === undefined) throw new Error(`Slide ${slideNumber} text count mismatch at ${index}`);
    index += 1;
    return `<a:t>${escapeXml(value)}</a:t>`;
  });
  if (index !== slideTexts[slideNumber - 1].length) {
    throw new Error(`Slide ${slideNumber} expected ${slideTexts[slideNumber - 1].length} text runs but found ${index}`);
  }
  zip.file(slidePath, xml);

  const notesPath = `ppt/notesSlides/notesSlide${slideNumber}.xml`;
  const notesFile = zip.file(notesPath);
  if (notesFile) {
    let notesXml = await notesFile.async("string");
    const oldText = `슬라이드 ${slideNumber}: 후보 기능은 프로젝트 주제 확정 후 변경합니다.`;
    notesXml = notesXml.replace(escapeXml(oldText), escapeXml(noteTexts[slideNumber - 1]));
    zip.file(notesPath, notesXml);
  }
}

await fs.mkdir(stagingDir, { recursive: true });
const candidateBytes = await zip.generateAsync({ type: "nodebuffer" });
await fs.writeFile(candidatePath, candidateBytes);

const verified = await PresentationFile.importPptx(await FileBlob.load(candidatePath));
const snapshot = await verified.inspect({ kind: "slide,textbox,notes,layout", maxChars: 50000 });
await fs.writeFile(`${stagingDir}/screen-definition-after.ndjson`, snapshot.ndjson, "utf8");
console.log(snapshot.ndjson);

const { finalizePresentation } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href,
);
await finalizePresentation({
  explicitTotalSlideCount: 7,
  sourceTemplatePath: sourcePath,
  requiredTemplateReferenceSlides: [1, 2, 3, 4, 5, 6, 7],
  minimumTemplateCoverageRatio: 1,
  requireExactTemplateDimensions: true,
  requireTemplatePlaceholderGeometry: false,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir: workspace,
  candidatePath,
  finalPath,
  pythonExecutable,
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
  ],
  verifyArtifactToolImport: true,
  receiptPath: `${stagingDir}/screen-definition.validation.json`,
});
console.log(finalPath);
