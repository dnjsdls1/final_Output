import fs from "node:fs/promises";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const workspace = "C:/finalProject/2jo-final-project";
const deck = await PresentationFile.importPptx(
  await FileBlob.load(`${workspace}/산출물/파이널 프로젝트 화면정의서.pptx`),
);
const outputDir = `${workspace}/.codex-tmp/source-deck-render`;
await fs.mkdir(outputDir, { recursive: true });
const slideIds = ["sl/y90nupkv", "sl/hwbqtkby", "sl/ofy9wn61", "sl/jyx0ra1s", "sl/i107q5of", "sl/x8f69ofe", "sl/gnmp4jqx"];
for (let index = 0; index < slideIds.length; index += 1) {
  const slide = deck.resolve(slideIds[index]);
  const preview = await slide.export({ format: "png", scale: 1 });
  await fs.writeFile(`${outputDir}/slide-${index + 1}.png`, new Uint8Array(await preview.arrayBuffer()));
}
const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(`${outputDir}/montage.webp`, new Uint8Array(await montage.arrayBuffer()));
console.log(outputDir);
