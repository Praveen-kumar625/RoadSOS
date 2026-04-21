/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Task: Programmatic Generation of Final Hackathon Submission Word Doc
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../..");
const DOC_PATH = path.join(ROOT_DIR, "RoadSoS_Submission_Final.docx");

async function generateDoc() {
    console.log("🚀 Starting Hackathon Document Generation...");

    const sections = [];

    // 1. Title Page
    sections.push(new Paragraph({
        text: "RoadSoS: Near-Instant Accident Response System",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
    }));
    sections.push(new Paragraph({
        text: "IIT Madras COERS Hackathon 2026",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
    }));
    sections.push(new Paragraph({
        children: [
            new TextRun({ text: "Team Name: Divine Coder", bold: true }),
            new TextRun({ text: "\nTeam Lead: Praveen Kumar", bold: true }),
        ],
        alignment: AlignmentType.CENTER,
    }));

    // 2. Assumptions
    sections.push(new Paragraph({ text: "Project Assumptions", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }));
    const assumptions = fs.readFileSync(path.join(ROOT_DIR, "docs/ASSUMPTIONS.md"), "utf-8");
    sections.push(new Paragraph({ text: assumptions }));

    // 3. Software Packages
    sections.push(new Paragraph({ text: "Software Packages & Dependencies", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }));
    const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8"));
    sections.push(new Paragraph({ text: "Monorepo Root Dependencies:", bold: true }));
    sections.push(new Paragraph({ text: JSON.stringify(rootPkg.devDependencies || {}, null, 2), font: "Courier New" }));

    // 4. Source Code Integration
    sections.push(new Paragraph({ text: "Core Source Code Implementation", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }));

    const coreFiles = [
        "apps/api-gateway-service/src/main.js",
        "apps/api-gateway-service/src/routing/spatial-indexer.js",
        "apps/api-gateway-service/src/ingestion/crash-event-ingestion.js",
        "apps/edge-iot-firmware/src/sensor-sim.js",
        "apps/web-client-roadsos/src/app/page.jsx",
        "libs/core-types/src/schemas/crash-event.schema.js"
    ];

    for (const relPath of coreFiles) {
        const fullPath = path.join(ROOT_DIR, relPath);
        if (fs.existsSync(fullPath)) {
            sections.push(new Paragraph({ text: `File: ${relPath}`, heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }));
            const code = fs.readFileSync(fullPath, "utf-8");
            sections.push(new Paragraph({
                children: [new TextRun({ text: code, size: 18, font: "Courier New" })]
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: sections,
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(DOC_PATH, buffer);

    console.log(`✅ Submission document generated successfully at: ${DOC_PATH}`);
}

generateDoc().catch(err => {
    console.error("❌ Failed to generate document:", err);
    process.exit(1);
});
