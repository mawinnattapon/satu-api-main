export class Util {
  static isNumber(val: string): boolean {
    if (!val) return false;
    if (`${val}`.replace(/\D/g, "").length !== `${val}`.length) return false;
    return true;
  }
  static toNumber(val: string): number {
    if (!val) return null;
    return parseInt(`${val}`.replace(/\D/g, ""));
  }
  static hideText(text: string, size: number = 4): string {
    if (!text) return "";
    if (text.length < size) size = Math.ceil(text.length / 2);
    let start = Math.ceil((text.length - size) / 2);
    return text
      .split("")
      .map((e, i) => (i >= start && i < start + size ? "X" : e))
      .join("");
  }
  static toHtml(val: string): string {
    if (!val) return "";
    return val.replace(/(?:\r\n|\r|\n)/g, "<br />");
  }
  static isEmail(val: string): boolean {
    if (!val) return false;
    if (!val.trim()) return false;
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
  }
}
