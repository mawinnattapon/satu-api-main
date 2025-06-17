export enum Platform {
  web = "web",
  mobile = "mobile",
}

export enum StatusType {
  inactive = 0,
  active = 1,
}

export enum Delete {
  no = 0,
  yes = 1,
}

export enum SortType {
  asc = "ASC",
  desc = "DESC",
}

export enum DueRangeType {
  day = "d",
  week = "w",
  month = "m",
  quarter = "q",
  year = "y",
}

export enum AllowRepeat {
  yes = 1,
  no = 0,
}

export enum Need {
  no = 0,
  yes = 1,
}

export enum Warning {
  no = 0,
  yes = 1,
}

export enum AssmStatus {
  progress = 0,
  repair = 1,
  normal = 2,
}

export enum AssmResult {
  none = null,
  reject = 0,
  approved = 1,
}

export enum InputType {
  short_text = "short_text",
  long_text = "long_text",
  choice = "choice",
  checkbox = "checkbox",
  checkboxDetail = "checkbox-detail",
  dropdown = "dropdown",
  tblMeasuring = "tbl-measuring",
  tblConfirm = "tbl-confirm",
}

export enum SaveType {
  draft = "draft",
  submit = "submit",
}

export enum TrialStatus {
  no = 0,
  yes = 1,
}

export enum SourceImport {
  import_eqm = "import_eqm",
}

export enum FileImportStatusName {
  failed = "failed",
  completed = "completed",
  pending = "pending",
  processing = "processing",
  validate = "validate",
}

export enum FileImportStatus {
  failed = 0,
  completed = 1,
  pending = 2,
  processing = 3,
  read_file = 4,
  validate_data = 5,
  validate_dupl = 6,
  validate_db = 7,
  save_temp = 8,
  save = 9,
}