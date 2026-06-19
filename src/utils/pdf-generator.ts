/**
 * PDF generation utility for the Dev+ Quote Builder
 * Uses jsPDF to create professional quote documents
 */

import jsPDF from "jspdf";
import type { PageSpec, QuoteBreakdown, CrudKey, RelationSpec, ModuleItem } from "@/src/types/quote";

interface PDFParams {
  clientName: string;
  clientEmail: string;
  clientUni: string;
  clientWa: string;
  frontend: string | null;
  devLanguage: string | null;
  backend: string | null;
  database: string | null;
  modules: ModuleItem[];
  pages: PageSpec[];
  fk: boolean;
  relations: RelationSpec[];
  breakdown: QuoteBreakdown[];
  days: number;
}

/**
 * Generate and download a PDF quote document
 */
export async function generatePDF(params: PDFParams): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Colors
    const primary: [number, number, number] = [15, 23, 42];
    const accent: [number, number, number] = [45, 212, 191];
    const lightGray: [number, number, number] = [241, 245, 249];
    const white: [number, number, number] = [255, 255, 255];

    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      yPos: number,
      size: number,
      bold: boolean = false,
      color: [number, number, number] = [0, 0, 0] as [number, number, number]
    ) => {
      pdf.setFontSize(size);
      if (bold) pdf.setFont("helvetica", "bold");
      else pdf.setFont("helvetica", "normal");
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.text(text, x, yPos);
    };

    // Helper to add a filled rectangle
    const addBox = (
      x: number,
      yPos: number,
      w: number,
      h: number,
      color: [number, number, number],
      radius?: number
    ) => {
      pdf.setFillColor(color[0], color[1], color[2]);
      if (radius) {
        pdf.roundedRect(x, yPos, w, h, radius, radius, "F");
      } else {
        pdf.rect(x, yPos, w, h, "F");
      }
    };

    // Helper for RGB color arrays
    const rgb = (r: number, g: number, b: number): [number, number, number] => [r, g, b];

    // Add accent line at top
    addBox(margin, 10, contentWidth, 4, accent);

    // Header Section
    addBox(margin, y, contentWidth, 30, primary, 3);
    addText("Dev+", margin + 8, y + 12, 22, true, white);
    addText("Project Specification", margin + 8, y + 20, 10, false, rgb(200, 200, 200));
    addText(`Generated: ${new Date().toLocaleDateString()}`, margin + 8, y + 27, 8, false, rgb(180, 180, 180));
    y += 38;

    // Client Information Section
    if (params.clientName || params.clientEmail) {
      addText("Client Information", margin, y, 13, true, primary);
      y += 2;
      addBox(margin, y, contentWidth, 0.3, accent);
      y += 5;

      if (params.clientName) {
        addText("Name:", margin + 5, y, 10, true);
        addText(params.clientName, margin + 25, y, 10, false);
        y += 6;
      }
      if (params.clientEmail) {
        addText("Email:", margin + 5, y, 10, true);
        addText(params.clientEmail, margin + 25, y, 10, false);
        y += 6;
      }
      if (params.clientUni) {
        addText("University/Course:", margin + 5, y, 10, true);
        addText(params.clientUni, margin + 35, y, 10, false);
        y += 6;
      }
      if (params.clientWa) {
        addText("WhatsApp:", margin + 5, y, 10, true);
        addText(params.clientWa, margin + 28, y, 10, false);
        y += 6;
      }
      y += 3;
    }

    // Technology Stack Section
    addText("Technology Stack", margin, y, 13, true, primary);
    y += 2;
    addBox(margin, y, contentWidth, 0.3, accent);
    y += 6;

    const stackItems = [
      ["Frontend", params.frontend || "Not selected"],
      ["Language", params.devLanguage || "Not selected"],
      ["Backend", params.backend || "Not selected"],
      ["Database", params.database || "Not selected"],
    ];

    stackItems.forEach(([label, value]) => {
      // Label box
      addBox(margin + 5, y - 3, 25, 6, lightGray, 1);
      addText(label, margin + 7, y + 1, 9, true, primary);
      addText(value, margin + 35, y + 1, 9, false, rgb(0, 0, 0));
      y += 8;
    });
    y += 3;

    // Features & Modules Section
    const activeModules = params.modules.filter((m) => m.active);
    if (activeModules.length > 0) {
      addText("Features & Modules", margin, y, 13, true, primary);
      y += 2;
      addBox(margin, y, contentWidth, 0.3, accent);
      y += 6;

      // Display modules in a grid-like format
      let moduleX = margin + 5;
      activeModules.forEach((mod) => {
        const moduleWidth = 40;
        if (moduleX + moduleWidth > pageWidth - margin) {
          moduleX = margin + 5;
          y += 8;
        }
        addBox(moduleX, y - 2, moduleWidth, 6, lightGray, 1);
        addText(`✓ ${mod.label}`, moduleX + 2, y + 2, 8, true, primary);
        moduleX += moduleWidth + 3;
      });
      y += 12;
    }

    // Database Tables Section
    addText("Database Tables", margin, y, 13, true, primary);
    y += 2;
    addBox(margin, y, contentWidth, 0.3, accent);
    y += 6;

    params.pages.forEach((page, idx) => {
      if (y > pageHeight - 60) {
        pdf.addPage();
        y = 20;
      }

      const crudKeys: CrudKey[] = ["create", "read", "update", "delete", "search"];
      const ops = crudKeys
        .filter((key) => page[key])
        .map((key) => key.toUpperCase())
        .join("/");

      // Table header
      addBox(margin + 5, y - 3, contentWidth - 10, 7, lightGray, 1);
      addText(
        `${idx + 1}. ${page.topic || `Table ${idx + 1}`}`,
        margin + 8,
        y + 2,
        10,
        true,
        primary
      );
      addText(`[${ops || "None"}]`, margin + contentWidth - 35, y + 2, 8, false, accent);
      y += 7;

      // Table fields
      page.fields.forEach((field) => {
        addText(`  └─ ${field.label || "unnamed"}`, margin + 10, y, 9, true, rgb(100, 116, 139));
        addText(`: ${field.type}`, margin + 60, y, 9, false, rgb(100, 116, 139));
        y += 5;
      });
      y += 3;
    });
    y += 3;

    // Relationships Section
    if (params.fk && params.relations.length > 0) {
      addText("Database Relationships", margin, y, 13, true, primary);
      y += 2;
      addBox(margin, y, contentWidth, 0.3, accent);
      y += 6;

      params.relations.forEach((rel) => {
        addText(`→ ${rel.sourceTable}`, margin + 8, y, 10, true, primary);
        addText(`${rel.relationType}`, margin + 45, y, 10, false, accent);
        addText(`${rel.targetTable}`, margin + 95, y, 10, true, primary);
        y += 7;
      });
      y += 3;
    }

    // Delivery Timeline - Highlighted Section
    y += 5;
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = 20;
    }

    addBox(margin, y, contentWidth, 20, primary, 3);
    addText("Estimated Delivery", margin + 8, y + 8, 12, true, white);
    addText(`${params.days}-${params.days + 2} working days`, margin + 8, y + 16, 14, true, accent);
    y += 25;

    // Footer
    const footerY = pageHeight - 25;
    addBox(margin, footerY, contentWidth, 15, lightGray, 2);
    addText("Thank you for choosing Dev+!", margin + 8, footerY + 7, 10, true, primary);
    addText(
      "Contact: anuk200101@gmail.com | WhatsApp: +94 70 379 9364",
      margin + 8,
      footerY + 13,
      8,
      false,
      rgb(100, 116, 139)
    );

    pdf.save(`DevPlus-Spec-${params.clientName.replace(/\s+/g, "-") || "Project"}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}