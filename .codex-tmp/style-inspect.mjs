import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const input = await FileBlob.load("C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 기능명세서.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
for (const [sheetId, range] of [["개요","B2:C16"],["기능명세","A1:M13"],["요구사항","A1:I11"]]) {
 const x=await workbook.inspect({kind:"computedStyle",sheetId,range,maxChars:6000}); console.log(sheetId,x.ndjson);
}
