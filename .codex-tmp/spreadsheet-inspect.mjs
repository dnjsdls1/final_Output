import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 기능명세서.xlsx";
const previewDir = "C:/finalProject/2jo-final-project/.codex-tmp/previews";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({
  kind: "workbook,sheet,table,region,drawing",
  maxChars: 20000,
  tableMaxRows: 30,
  tableMaxCols: 16,
  tableMaxCellChars: 160,
});
console.log(summary.ndjson);

await fs.mkdir(previewDir, { recursive: true });
const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 5000 });
console.log("SHEETS", sheets.ndjson);

for (const sheetName of ["개요", "기능명세", "요구사항"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const safeName = sheetName.replace(/[\\/:*?"<>|]/g, "_");
  const previewPath = `${previewDir}/${safeName}.png`;
  await preview.save(previewPath);
  console.log("PREVIEW", previewPath);
}
