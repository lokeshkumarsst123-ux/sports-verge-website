"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import DatePicker from "react-datepicker";

type AdminDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  showTimeSelect?: boolean;
  placeholder?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  ariaLabel?: string;
};

type SegmentedTimeInputProps = {
  date?: Date;
  value?: string;
  onChange?: (time: string) => void;
};

type TimeSegment = "hour" | "minute" | "meridiem" | null;

const pad = (value: number) => String(value).padStart(2, "0");

const parseLocalDate = (value: string) => {
  if (!value) return null;
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  if (![year, month, day].every(Number.isFinite)) return null;
  return new Date(year, month - 1, day, Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0);
};

const formatLocalDate = (date: Date, withTime: boolean) => {
  const dateValue = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return withTime ? `${dateValue}T${pad(date.getHours())}:${pad(date.getMinutes())}` : dateValue;
};

const handleManualTime = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | undefined, value: string, onChange: (value: string) => void, showTimeSelect: boolean) => {
  if (!showTimeSelect || !event) return;
  const input = event.target as HTMLInputElement | null;
  const rawValue = input?.value?.trim() || "";
  const match = rawValue.match(/^(\d{1,2})\s*[:.]\s*(\d{2})\s*(am|pm)?$/i);
  if (!match) return;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes > 59) return;
  if (meridiem) {
    if (hours < 1 || hours > 12) return;
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  } else if (hours > 23) {
    return;
  }
  const baseDate = parseLocalDate(value) || new Date();
  baseDate.setHours(hours, minutes, 0, 0);
  event.preventDefault();
  onChange(formatLocalDate(baseDate, true));
};

function SegmentedTimeInput({ date, value = "", onChange }: SegmentedTimeInputProps) {
  const [openSegment, setOpenSegment] = useState<TimeSegment>(null);
  const parsedHours = Number(value.split(":")[0]);
  const parsedMinutes = Number(value.split(":")[1]);
  const hours24 = Number.isFinite(parsedHours) ? parsedHours : date?.getHours() || 0;
  const minutes = Number.isFinite(parsedMinutes) ? parsedMinutes : date?.getMinutes() || 0;
  const hour12 = hours24 % 12 || 12;
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const commit = (nextHours: number, nextMinutes: number) => {
    onChange?.(`${pad(nextHours)}:${pad(nextMinutes)}`);
    setOpenSegment(null);
  };
  const hourOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const minuteOptions = [0, 15, 30, 45];

  return <div className="admin-time-segment-wrap">
    <span className="admin-time-segment-label">TIME</span>
    <div className="admin-time-segment-control">
      <button type="button" className={`admin-time-segment ${openSegment === "hour" ? "is-open" : ""}`} onClick={() => setOpenSegment(openSegment === "hour" ? null : "hour")} aria-label="Choose hour" aria-haspopup="listbox" aria-expanded={openSegment === "hour"}>{pad(hour12)}</button>
      <span className="admin-time-separator">:</span>
      <button type="button" className={`admin-time-segment ${openSegment === "minute" ? "is-open" : ""}`} onClick={() => setOpenSegment(openSegment === "minute" ? null : "minute")} aria-label="Choose minute" aria-haspopup="listbox" aria-expanded={openSegment === "minute"}>{pad(minutes)}</button>
      <button type="button" className={`admin-time-meridiem ${openSegment === "meridiem" ? "is-open" : ""}`} onClick={() => setOpenSegment(openSegment === "meridiem" ? null : "meridiem")} aria-label="Choose AM or PM" aria-haspopup="listbox" aria-expanded={openSegment === "meridiem"}>{meridiem}<i className="bi bi-chevron-down" /></button>
    </div>
    {openSegment && <div className={`admin-time-segment-menu admin-time-segment-menu-${openSegment}`} role="listbox" aria-label={`Choose ${openSegment}`}>
      {openSegment === "hour" && hourOptions.map((hour) => <button type="button" role="option" aria-selected={hour === hour12} className={hour === hour12 ? "is-selected" : ""} key={hour} onClick={() => commit(meridiem === "PM" ? (hour % 12) + 12 : hour % 12, minutes)}>{pad(hour)}</button>)}
      {openSegment === "minute" && minuteOptions.map((minute) => <button type="button" role="option" aria-selected={minute === minutes} className={minute === minutes ? "is-selected" : ""} key={minute} onClick={() => commit(hours24, minute)}>{pad(minute)}</button>)}
      {openSegment === "meridiem" && ["AM", "PM"].map((option) => <button type="button" role="option" aria-selected={option === meridiem} className={option === meridiem ? "is-selected" : ""} key={option} onClick={() => commit(option === "PM" ? (hour12 % 12) + 12 : hour12 % 12, minutes)}>{option}</button>)}
    </div>}
  </div>;
}

export default function AdminDatePicker({ value, onChange, showTimeSelect = false, placeholder, required = false, minDate, maxDate, ariaLabel }: AdminDatePickerProps) {
  const dateFormat = showTimeSelect ? "dd MMM yyyy, hh:mm aa" : "dd MMM yyyy";
  const placeholderFormat = showTimeSelect ? "DD MMM YYYY, hh:mm AM" : "DD MMM YYYY";
  const displayPlaceholder = placeholder && !placeholder.toLowerCase().startsWith("choose") ? placeholder : placeholderFormat;
  return <DatePicker
    selected={parseLocalDate(value)}
    onChange={(date: Date | null) => onChange(date ? formatLocalDate(date, showTimeSelect) : "")}
    onChangeRaw={(event) => handleManualTime(event, value, onChange, showTimeSelect)}
    showTimeSelect={false}
    showTimeInput={showTimeSelect}
    customTimeInput={showTimeSelect ? <SegmentedTimeInput /> : undefined}
    shouldCloseOnSelect={!showTimeSelect}
    dateFormat={dateFormat}
    placeholderText={displayPlaceholder}
    required={required}
    minDate={minDate}
    maxDate={maxDate}
    isClearable={!required}
    className="form-control admin-form-control admin-datepicker-input"
    calendarClassName="admin-datepicker-calendar"
    popperClassName="admin-datepicker-popper"
    aria-label={ariaLabel}
  />;
}
