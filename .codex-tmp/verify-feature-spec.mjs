import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const outputPath = "C:/finalProject/2jo-final-project/outputs/creditcompass-auto-spec-update/파이널 프로젝트 기능명세서.xlsx";
const input = await FileBlob.load(outputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const [sheetName, range] of [
  ["개요", "B4:C16"],
  ["기능명세", "A3:M13"],
  ["요구사항", "A3:I11"],
]) {
  const check = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!${range}`,
    include: "values,formulas",
    tableMaxRows: 16,
    tableMaxCols: 13,
    maxChars: 10000,
  });
  console.log(sheetName, check.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "saved workbook formula error scan",
});
console.log("ERRORS", errors.ndjson);
