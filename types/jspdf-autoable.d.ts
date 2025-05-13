declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: any;
    pageBreak?: "auto" | "avoid" | "always";
    rowPageBreak?: "auto" | "avoid" | "always";
    tableWidth?: "auto" | "wrap" | number;
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";
    tableLineWidth?: number;
    tableLineColor?: number | string;
    theme?: "grid" | "striped" | "plain";
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    didDrawPage?: (data: any) => void;
  }

  function autoTable(doc: jsPDF, options: UserOptions): void;
  function autoTable(doc: jsPDF, columnStyles: any, body: any[], columns: any[]): void;

  export default autoTable;
}
