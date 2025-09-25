import jsPDF from "jspdf";

export function exportStudyPackToPDF({ notes, flashcards, quiz, title = "Study Pack" }: any) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 40;
  doc.setFontSize(16);
  doc.text(title, 40, y);
  y += 30;
  doc.setFontSize(12);
  doc.text("Notes:", 40, y);
  y += 20;
  const notesLines = doc.splitTextToSize(notes || "", 500);
  doc.text(notesLines, 40, y);
  y += notesLines.length * 12 + 20;

  doc.text("Flashcards:", 40, y);
  y += 18;
  doc.text(flashcards || "", 40, y);
  y += 100;

  doc.text("Quiz:", 40, y);
  y += 18;
  doc.text(quiz || "", 40, y);
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}
