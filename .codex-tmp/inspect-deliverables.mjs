import fs from "node:fs/promises";
import { FileBlob, PresentationFile, SpreadsheetFile } from "@oai/artifact-tool";

const workspace = "C:/finalProject/2jo-final-project";
const buildDir = `${workspace}/.codex-tmp/deliverables-inspection`;
await fs.mkdir(buildDir, { recursive: true });

const deck = await PresentationFile.importPptx(
  await FileBlob.load(`${workspace}/산출물/파이널 프로젝트 화면정의서.pptx`),
);
const deckSummary = await deck.inspect({
  kind: "presentation,slide,textbox,shape,image,table,chart,notes,layout",
  maxChars: 50000,
});
await fs.writeFile(`${buildDir}/deck-inspect.ndjson`, deckSummary.ndjson, "utf8");
console.log(deckSummary.ndjson);

const book = await SpreadsheetFile.importXlsx(
  await FileBlob.load(`${workspace}/산출물/파이널 프로젝트 기능명세서.xlsx`),
);
const bookSummary = await book.inspect({
  kind: "workbook,sheet,table,region,drawing",
  maxChars: 25000,
  tableMaxRows: 30,
  tableMaxCols: 16,
  tableMaxCellChars: 180,
});
await fs.writeFile(`${buildDir}/book-inspect.ndjson`, bookSummary.ndjson, "utf8");
console.log(bookSummary.ndjson);
