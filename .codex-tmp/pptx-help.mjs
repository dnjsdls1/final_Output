import { FileBlob, PresentationFile } from "@oai/artifact-tool";
const p = await PresentationFile.importPptx(await FileBlob.load("C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 화면정의서.pptx"));
for (const query of ["text.replace", "shape.text.set"]) {
  const x = p.help(query, { include: "index,examples,notes", maxChars: 5000 });
  console.log(query, x.ndjson);
}
