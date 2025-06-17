export interface MailConfig {
  from: string;
}

export interface MailData {
  email: string;
  cc?: string[];
  subject: string;
  param: any;
  fileName: string;
}
