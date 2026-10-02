import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 기능명세서.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const outputDir = "C:/finalProject/2jo-final-project/.codex-tmp/previews";
await fs.mkdir(outputDir, { recursive: true });
for (const [sheetName, fileName] of [["개요", "overview.png"], ["기능명세", "features.png"], ["요구사항", "requirements.png"]]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const outputPath = `${outputDir}/${fileName}`;
  await preview.save(outputPath);
  console.log(outputPath);
}
