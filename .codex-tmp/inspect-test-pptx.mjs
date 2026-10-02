import { FileBlob, PresentationFile } from "@oai/artifact-tool";
const p = await PresentationFile.importPptx(await FileBlob.load("C:/finalProject/2jo-final-project/.codex-tmp/test-pptx-edit.pptx"));
const x = await p.inspect({ kind: "textbox", search: "CreditComPass|금융 웹 서비스", maxChars: 3000 });
console.log(x.ndjson);
