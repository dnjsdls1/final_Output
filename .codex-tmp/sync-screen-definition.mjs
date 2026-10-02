import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const workspace = "C:/finalProject/2jo-final-project";
const skillDir = "C:/Users/user1/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations";
const sourcePath = `${workspace}/산출물/파이널 프로젝트 화면정의서.pptx`;
const buildDir = `${workspace}/.codex-tmp/deliverables-build`;
const stagingDir = `${workspace}/.codex-tmp/deliverables-finalizer`;
const finalPath = `${workspace}/.codex-output/CreditComPass_Auto_화면정의서_정리본.pptx`;
const pythonExecutable = "C:/Users/user1/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });

const presentation = await PresentationFile.importPptx(await FileBlob.load(sourcePath));
console.log("imported");
const initialText = await presentation.inspect({ kind: "textbox", maxChars: 50000 });
console.log("text inspected", initialText.ndjson.length);
const initialTextById = new Map(
  initialText.ndjson
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((record) => record.id && typeof record.text === "string")
    .map((record) => [record.id, record.text]),
);
console.log("text mapped", initialTextById.size);
const setText = (id, value) => {
  const oldValue = initialTextById.get(id);
  if (oldValue === undefined) throw new Error(`Missing original text for ${id}`);
  presentation.resolve(id).text.get(oldValue).text = value;
};
const setNotes = (id, value) => {
  presentation.resolve(id).setText(value);
};

setText("sh/sryl4zqx", "CreditComPass Auto\n화면정의서");
setText("sh/547294r6", "재무·신용 분석 기반 차량 구매 예산 및 맞춤 차량 추천 서비스");
setText("sh/7qp4be9c", "현재 상태");
setText("sh/65g3298r", "React 핵심 화면 4개 구현\nFigma 전체 서비스 화면 10개 이상 구현 중");
setText("sh/ts7md4r2", "2026.10   산출물 정리본");
setNotes("nt/y90nupkv", "프로젝트 전체 정리 문서 기준으로 갱신했습니다. 현재 구현과 확장 계획을 구분합니다.");
console.log("slide 1 updated");

setText("sh/9072xkry", "1. 프로젝트와 사용자 범위");
setText("sh/ozy1ofad", "확정 내용과 현재 프로토타입 범위");
setText("sh/b29kza94", "CreditComPass Auto   React 프로토타입과 전체 서비스 계획");
setText("sh/x4r21kru", "현재 확정 정보");
setText("sh/w3i1sfa9", "• 핵심 사용자: 사회초년생과 첫차 구매자\n• 입력: 재무·신용정보와 차량 이용조건\n• 결과: 월 가용자금, 자체 위험 수준, 추천 예산\n• 후속 화면: 추천 차량과 추천 이유\n• 현재 분석값: Mock 데이터와 예시 규칙");
setText("sh/q5wjelsz", "현재 범위와 확장 계획");
setText("sh/ove9o7yd", "1. React: /main, /apply, /result, /recommendations 구현\n2. Figma: 전체 서비스 흐름 화면 10개 이상 구현 중\n3. 시안 포함: 인증, 상세, 비교, 시뮬레이션, 구매계획\n4. 미연결: 실제 모델, FastAPI, Spring Boot, MySQL\n5. 미정 항목은 팀 승인 후 기능과 화면에 반영");
setNotes("nt/hwbqtkby", "현재 저장소 범위와 전체 서비스 계획을 혼동하지 않도록 분리해 설명합니다.");
console.log("slide 2 updated");

setText("sh/cza94vmx", "2. 화면 목록");
setText("sh/d0jax03i", "현재 프로토타입과 전체 서비스 계획 구분");
setText("sh/298ryl4v", "CreditComPass Auto   화면 ID와 기능 ID 연결");
const screenRows = [
  ["SCR-MAIN 외", "메인·로그인·회원가입", "FN-001 / 미정", "Figma/React"],
  ["SCR-APPLY", "5단계 입력·입력 확인", "FN-002~004", "Figma/React"],
  ["SCR-RESULT", "종합 분석 결과와 근거", "FN-005~007", "Figma/React"],
  ["SCR-RECOMMEND", "추천 차량 목록", "FN-008, 009", "Figma/React"],
  ["미정", "차량 상세·비교", "FN-010", "Figma 시안"],
  ["미정", "조건 시뮬레이션·구매계획", "FN-010", "Figma 시안"],
  ["미정", "마이페이지·모형 설명·관리자", "미정", "Figma 시안"],
];
const screenIds = [
  ["sh/v6l4jq94", "sh/x8nml0ra", "sh/ja54na9g", "sh/e10f2twf"],
  ["sh/03ix43e5", "sh/6d0fytg3", "sh/sfix03y9", "sh/a9kfadwn"],
  ["sh/l4fi9cza", "sh/z2d07mh4", "sh/x0vi5czy", "sh/byd032h8"],
  ["sh/hwzihwzi", "sh/4nuhs7uh", "sh/21szqxcb", "sh/cruhwrud"],
  ["sh/qpczuhc7", "sh/0ve10ru9", "sh/v29cfu18", "sh/xoruhkje"],
  ["sh/nypcba1c", "sh/90rudkji", "sh/7utcne1g", "sh/2p4f6dk3"],
  ["sh/or6x8329", "sh/qtofadkf", "sh/cf6xcn2l", "sh/6xkvytkb"],
];
screenRows.forEach((row, rowIndex) => row.forEach((value, colIndex) => setText(screenIds[rowIndex][colIndex], value)));
setNotes("nt/ofy9wn61", "현재 구현 화면은 경로를 표시하고, 전체 서비스의 확장 화면은 ID 미정과 계획 상태로 남겼습니다.");
console.log("slide 3 updated");

setText("sh/1cj2d8b6", "3. 핵심 사용자 흐름");
setText("sh/0ba143al", "현재 React 프로토타입의 입력, 결과, 근거, 다음 행동 흐름");
setText("sh/rm1k7yt4", "CreditComPass Auto   현재 구현 흐름");
const flowRows = [
  ["서비스 안내", "SCR-MAIN"],
  ["재무·신용정보 입력", "SCR-APPLY 1단계"],
  ["차량 이용조건 입력", "SCR-APPLY 2단계"],
  ["분석 결과와 근거", "SCR-RESULT"],
  ["추천 차량 비교", "SCR-RECOMMEND"],
];
const flowIds = [
  ["sh/sna103ap", "sh/3ihk3et8"],
  ["sh/i94r6xgz", "sh/jadsz2xk"],
  ["sh/v6tsv2xo", "sh/g36tgryd"],
  ["sh/3ytsrmpw", "sh/2xkrih8b"],
  ["sh/et0reh8f", "sh/tsrqlc7u"],
];
flowRows.forEach((row, rowIndex) => row.forEach((value, colIndex) => setText(flowIds[rowIndex][colIndex], value)));
setText("sh/sri9s7q9", "확장 계획: 차량 상세, 최대 3대 비교, 구매조건 시뮬레이션, 구매계획 저장");
setNotes("nt/jyx0ra1s", "현재 핵심 흐름은 로그인 없이 메인, 입력, 결과, 추천 화면으로 이어집니다.");
console.log("slide 4 updated");

setText("sh/dgbulwnm", "4. 종합 분석 결과 화면 (SCR-RESULT)");
setText("sh/cf2tcr61", "핵심 결과, 결과 근거와 다음 행동을 한 화면에서 제공");
setText("sh/z2tcnm5s", "CreditComPass Auto   예시 데이터 표시 원칙 적용");
setText("sh/032tgr6d", "예시 데이터 배지      입력값 기준 요약");
setText("sh/m5kbi1oj", "월 납입 가능액\n만원 단위 예시값");
setText("sh/x4vedgvm", "재무 안정성\n자체 등급");
setText("sh/v2twb6dw", "추천 차량 예산\n만원 범위");
setText("sh/58vehgvy", "소득 사용처 구성 차트\n현재·권장 수준 비교와 긍정·주의 요인\n다음 행동: 추천 차량 확인");
setText("sh/j6dwfqds", "화면 정의");
setText("sh/sb6xsvu9", "연결 기능\nFN-005 Mock 분석\nFN-006 결과 요약\nFN-007 근거 시각화\n\n입력\nZustand에 저장된 신청 정보\n\n상태\n로딩, 입력 없음, API 오류\n\n완료 조건\n예시값과 근거, 다음 행동 표시");
setNotes("nt/i107q5of", "결과는 교육·시연용 자체 분석이며 실제 신용점수나 금융기관 승인 결과가 아닙니다.");
console.log("slide 5 updated");

setText("sh/yhg7epsj", "5. 화면 정의 작성 기준");
setText("sh/zi98nu94", "현재 구현과 향후 화면에 동일한 작성 기준 적용");
setText("sh/87ipkzal", "CreditComPass Auto   화면 명세 공통 기준");
setText("sh/ml07i9sv", "기본 정보");
setText("sh/7m98ru9g", "화면 ID, 화면명, 목적\n사용자, 경로, 연결 기능 ID");
setText("sh/pc76hkr2", "구성 요소");
setText("sh/h4bupgn6", "입력, 결과 카드, 차트, 근거\n예시 데이터 배지와 다음 행동");
setText("sh/v2tcn650", "동작 정의");
setText("sh/u1kbu1ov", "입력 검증과 Zustand 저장\nMock API 요청, 성공 결과, 이동 경로");
setText("sh/47mt0b6x", "상태 정의");
setText("sh/j6dcr65c", "로딩, 빈 결과, 잘못된 입력\nAPI 오류, 재시도와 이전 단계 이동");
setText("sh/twfux0ne", "데이터 표현");
setText("sh/svmt4v6t", "만원·개월·km 단위와 기준일\n예시값, 출처, 분석 한계 표시");
setText("sh/dcnm98zm", "범위 구분");
setText("sh/qpwnet0b", "현재 구현, 계획, 미정 상태\n완료 조건과 테스트 기준");
setNotes("nt/x8f69ofe", "금리, 세금, 보험료와 차량 가격은 출처와 기준일 확인 전까지 예시값으로 표시합니다.");
console.log("slide 6 updated");

setText("sh/cb2tkvap", "6. 확정 사항과 미결정 사항");
setText("sh/dcbud0ra", "현재 팀 합의 내용과 다음 결정 항목");
setText("sh/ydkbm5sv", "CreditComPass Auto   2026-10-02 기준");
setText("sh/kzmdova1", "확정 사항");
setText("sh/l0vuh0rm", "☑ 핵심 사용자는 사회초년생과 첫차 구매자\n\n☑ 재무·신용정보와 차량 조건을 함께 분석\n\n☑ React 핵심 화면 4개는 Mock 데이터로 구현\n\n☑ Figma 전체 서비스 화면 10개 이상 구현 중");
setText("sh/fi9c369c", "미결정 사항");
setText("sh/baxkjqlk", "☐ 최종 데이터 출처와 사용 허가 범위\n\n☐ 모델 목표값, 등급 기준과 평가 통과 기준\n\n☐ 예산 계산 방식과 차량 추천 가중치\n\n☐ 상세·비교·시뮬레이션의 1차 개발 포함 범위");
setNotes("nt/gnmp4jqx", "미결정 항목은 확정 전까지 실제 기능 또는 모델 성능처럼 표현하지 않습니다.");
console.log("slide 7 updated");

const after = await presentation.inspect({
  kind: "slide,textbox,notes,layout",
  maxChars: 50000,
});
await fs.writeFile(`${buildDir}/screen-definition-after.ndjson`, after.ndjson, "utf8");
console.log(after.ndjson);

const candidatePath = `${stagingDir}/screen-definition-candidate.pptx`;
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(
  pathToFileURL(path.join(skillDir, "container_tools/artifact_tool_utils.mjs")).href,
);
await finalizePresentation({
  explicitTotalSlideCount: 7,
  sourceTemplatePath: sourcePath,
  requiredTemplateReferenceSlides: [1, 2, 3, 4, 5, 6, 7],
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
