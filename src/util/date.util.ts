import moment from "moment";

export class DateUtil {
  //

  static timeInt2String = (time: number) => {
    if (time === null || time === undefined) return "";
    return String((time / 100).toFixed(2))
      .padStart(5, "0")
      .replace(".", ":");
  };

  static timeInRang = (a: number, b: number, aa: number, bb: number) => {
    let have = false;
    if (a >= aa && a < bb) have = true;
    if (b > aa && b < bb) have = true;
    return have;
  };

  static appmDateTime = (day: Date, time: number): Date => {
    if (day === null || day === undefined || time === null || time === undefined) throw "DateTime not found.";
    return moment(moment(day).format("YYYY-MM-DD") + " " + DateUtil.timeInt2String(time), "YYYY-MM-DD HH:mm").toDate();
  };
}
