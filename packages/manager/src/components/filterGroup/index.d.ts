import { Option } from "helper/types";
import { InputConfig } from "components/smartBox/index";
import { OptionConfig } from "components/selectBox/index";
import { IDatePickerType } from "element-plus/lib/components/date-picker/src/date-picker.type";
type RenderType = "input" | "select" | "smartbox" | "datepicker";
type DateType =
  | "year"
  | "month"
  | "date"
  | "dates"
  | "week"
  | "datetime"
  | "datetimerange"
  | " daterange"
  | "monthrange";

declare interface FilterConfig extends InputConfig {
  multiple?: boolean;
  type?: IDatePickerType;
  filterable?: boolean;
  all?: boolean;
  optionConfig?: OptionConfig;
}

export declare interface FilterItem {
  prop: string;
  label: string;
  renderType: string;
  placeholder?: string;
  options?: Array<Option>;
  readonly?: boolean;
  config?: FilterConfig;
}
