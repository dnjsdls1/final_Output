import fs from "node:fs/promises";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const source = "C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 화면정의서.pptx";
const output = "C:/finalProject/2jo-final-project/.codex-tmp/test-pptx-edit.pptx";
const presentation = await PresentationFile.importPptx(await FileBlob.load(source));
const target = presentation.resolve("sh/sryl4zqx");
console.log("resolved");
target.text.replace("금융 웹 서비스", "CreditComPass Auto");
console.log("text set");
await (await PresentationFile.exportPptx(presentation)).save(output);
console.log("saved", output);
