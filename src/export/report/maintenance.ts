import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { Workbook, Worksheet } from "exceljs";
import moment from "moment";
import { ReportFindReq } from "src/app/report/req/find";
import { ReportRes } from "src/app/report/res/report";

export class ExportRpMt {
  private r: number = 0;
  private readonly data: ReportRes;
  private readonly form: ReportFindReq;
  private readonly tested_keys: string[];

  constructor(data: ReportRes, form: ReportFindReq) {
    this.data = data;
    this.form = form;
    this.tested_keys = ["test_pass", "test_date", "test_by"];

    if (this.form.column.length > 0) this.form.column.unshift("no");
  }

  async export() {
    const wb: Workbook = new Workbook();
    const sh: Worksheet = wb.addWorksheet("sheet");

    this.summary(sh);
    this.table(sh);

    const bf = await wb.csv.writeBuffer();
    return Buffer.from(bf).toString("base64");
  }

  private colsName(key: string[]): string[] {
    const cols = {
      no: "No.",
      eqm_name: "Name",
      alt_no: "Equipment ID",
      model_name: "Model",
      brand_name: "Brand",
      category_name: "Category",
      type_name: "Type",
      location: "Location",
      purchase_date: "Purchase Date",
      installation_date: "Installation Date",
      test_pass: "Test Pass",
      test_date: "Test Date",
      test_by: "Tested By",
      form_name: "Report Name",
      active: "Status",
    };
    return key.map((i) => cols?.[i] ?? i);
  }

  private newRow(sh: Worksheet, total: number) {
    this.r++;
    for (let index = 1; index <= total; index++) {
      sh.getRow(this.r).getCell(index).value = "";
    }
  }

  private summary(sh: Worksheet) {
    const { data: rp_data, form_name, summary, qst } = this.data;
    const { form_id, created_start, created_end, column } = this.form;

    const cols_key_test = [...qst, ...this.tested_keys];
    const cols_name_test = this.colsName(cols_key_test);
    const count_dt = isNotEmpty(form_id) ? column.length + cols_name_test.length : column.length;

    if (isNotEmpty(form_id)) {
      // Report Name
      this.newRow(sh, count_dt);
      sh.getRow(this.r).getCell(1).value = form_name ? `${form_name.trim()} Summary` : "";
    }

    // Date
    let date: string = "";
    const date_start = moment(created_start).format("MMMM D, YYYY");
    const date_end = moment(created_end).format("MMMM D, YYYY");
    date = `${date_start} - ${date_end}`;
    if (isNotEmpty(created_start) && isNotEmpty(created_end)) {
      this.newRow(sh, count_dt);
      sh.getRow(this.r).getCell(1).value = `${date}`;
    }

    // Summary
    if (isNotEmptyObject(summary)) {
      this.newRow(sh, count_dt);
      this.newRow(sh, count_dt);
      const headers = Object.keys(summary ?? {});
      headers.forEach((header, i) => {
        sh.getRow(this.r).getCell(i + 1).value = header.charAt(0).toUpperCase() + header?.slice(1);
      });

      this.newRow(sh, count_dt);
      headers.forEach((header, i) => {
        sh.getRow(this.r).getCell(i + 1).value = header === "total" || isNotEmpty(form_id) ? summary[header] : "-";
      });
    }
    this.newRow(sh, count_dt);
  }

  private table(sh: Worksheet) {
    const { data: rp_data, form_name, summary, qst } = this.data;
    const { form_id, created_start, created_end, column: cols_keys } = this.form;

    const cols_name = this.colsName(cols_keys);
    const cols_key_test = [...qst, ...this.tested_keys];
    const cols_name_test = this.colsName(cols_key_test);
    const count_dt = isNotEmpty(form_id) ? cols_name.length + cols_name_test.length : cols_name.length;

    // header
    this.newRow(sh, count_dt);
    cols_name.forEach((header, i) => {
      sh.getRow(this.r).getCell(i + 1).value = header;
    });

    if (isNotEmpty(form_id)) {
      cols_name_test.forEach((header, i) => {
        sh.getRow(this.r).getCell(i + cols_name.length + 1).value = header;
      });
    }

    // body
    rp_data.forEach((d) => {
      this.newRow(sh, count_dt);

      cols_keys.forEach((key, i) => {
        sh.getRow(this.r).getCell(i + 1).value = d[key] ?? "-";
      });

      if (isNotEmpty(form_id)) {
        qst.forEach((key, i) => {
          sh.getRow(this.r).getCell(i + cols_name.length + 1).value = d.test_results[i] ?? "-";
        });

        cols_key_test.slice(qst.length).forEach((key, i) => {
          sh.getRow(this.r).getCell(i + cols_name.length + qst.length + 1).value = d[key] ?? "-";
        });
      }
    });
  }
}
