/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Task: Enhanced Programmatic Submission Packaging (DOCX + PPTX + ZIP)
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../..");
const SUBMISSION_DIR = path.join(ROOT_DIR, "submission_artifacts");

// Ensure submission directory exists
if (!fs.existsSync(SUBMISSION_DIR)) fs.mkdirSync(SUBMISSION_DIR);

async function generateDocx() {
    console.log("📄 Generating RoadSOS_Submission.docx...");
    const sections = [];
    
    sections.push(new Paragraph({ text: "RoadSoS: Hackathon Submission", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }));
    
    // Assumptions
    sections.push(new Paragraph({ text: "Assumptions", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }));
    const assumptions = fs.readFileSync(path.join(ROOT_DIR, "docs/ASSUMPTIONS.md"), "utf-8");
    sections.push(new Paragraph({ text: assumptions }));

    // Dependencies
    sections.push(new Paragraph({ text: "Software Packages", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }));
    const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8"));
    sections.push(new Paragraph({ text: JSON.stringify(rootPkg.dependencies || {}, null, 2), font: "Courier New" }));

    const doc = new Document({ sections: [{ children: sections }] });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(SUBMISSION_DIR, "RoadSOS_Submission.docx"), buffer);
}

async function generatePptx() {
    console.log("📊 Generating RoadSOS_Presentation.pptx...");
    const pres = new pptxgen();
    const outline = fs.readFileSync(path.join(ROOT_DIR, "docs/hackathon-submission/PRESENTATION_OUTLINE.md"), "utf-8");
    
    const slides = outline.split("---").filter(s => s.includes("Slide"));
    
    slides.forEach(slideText => {
        const slide = pres.addSlide();
        const lines = slideText.trim().split("\n");
        const title = lines[0].replace(/#|#|Slide \d+:/g, "").trim();
        
        slide.addText(title, { x: 0.5, y: 0.5, w: "90%", h: 1, fontSize: 32, bold: true, color: "003366", align: "center" });
        
        const content = lines.slice(1).join("\n").trim();
        slide.addText(content, { x: 0.5, y: 1.5, w: "90%", h: 4, fontSize: 14, color: "333333", align: "left", valign: "top" });
    });

    await pres.writeFile({ fileName: path.join(SUBMISSION_DIR, "RoadSOS_Presentation.pptx") });
}

async function createZip() {
    console.log("📦 Creating final ZIP archive...");
    const output = fs.createWriteStream(path.join(ROOT_DIR, 'RoadSoS_Final_Submission.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(SUBMISSION_DIR, 'docs');
    archive.glob('**/*', {
        cwd: ROOT_DIR,
        ignore: ['node_modules/**', '.git/**', '.env.local', 'RoadSoS_Final_Submission.zip', 'submission_artifacts/**']
    });
    
    await archive.finalize();
    console.log("✅ All submission artifacts packed successfully!");
}

async function main() {
    await generateDocx();
    await generatePptx();
    await createZip();
}

main().catch(err => {
    console.error("❌ Packaging failed:", err);
    process.exit(1);
});
