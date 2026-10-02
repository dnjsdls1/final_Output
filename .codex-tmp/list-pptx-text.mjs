import fs from "node:fs/promises";
import JSZip from "jszip";

const data = await fs.readFile("C:/finalProject/2jo-final-project/산출물/파이널 프로젝트 화면정의서.pptx");
const zip = await JSZip.loadAsync(data);
for (let slide = 1; slide <= 7; slide += 1) {
  const xml = await zip.file(`ppt/slides/slide${slide}.xml`).async("string");
  const texts = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((match) => match[1]);
  console.log(`SLIDE ${slide}`);
  texts.forEach((text, index) => console.log(index, text));
}
