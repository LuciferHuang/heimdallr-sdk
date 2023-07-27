export interface LogItem {
  id?: string;
  otime: Date;
  type: string;
  sub_type: string;
  session_id: string;
  ascription_id: string;
  breadcrumb: string;
  data: string;
  path: string;
  page_title: string;
  user_agent: string;
  language: string;
  platform: string;
}
