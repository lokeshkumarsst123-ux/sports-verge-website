"use client";

import { useState } from "react";
import Select, { type StylesConfig } from "react-select";

export type AdminSelectOption = { value: string; label: string };

type AdminSelectProps = {
  options: AdminSelectOption[];
  value: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
  ariaLabel?: string;
  className?: string;
  size?: "default" | "small";
};

const styles: StylesConfig<AdminSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    height: 42,
    borderRadius: 9,
    borderColor: state.isFocused ? "#51e08a" : "#2a303c",
    backgroundColor: "#0d121c",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(81,224,138,.13)" : "none",
    cursor: "pointer",
    transition: "border-color .18s ease, box-shadow .18s ease",
    ":hover": { borderColor: "rgba(112,199,137,.7)" },
  }),
  valueContainer: (base) => ({ ...base, flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", maxHeight: 40, padding: "4px 12px", scrollbarWidth: "none" }),
  multiValue: (base) => ({ ...base, flex: "0 0 auto", margin: "3px 4px 3px 0", maxWidth: 132, backgroundColor: "rgba(81,224,138,.16)", border: "1px solid rgba(112,199,137,.28)", borderRadius: 6 }),
  multiValueLabel: (base) => ({ ...base, overflow: "hidden", color: "#baf5c8", fontSize: 11, fontWeight: 700, textOverflow: "ellipsis", whiteSpace: "nowrap" }),
  multiValueRemove: (base) => ({ ...base, color: "#8bdba0", cursor: "pointer", ":hover": { backgroundColor: "rgba(244,91,105,.18)", color: "#ffb4b4" } }),
  singleValue: (base) => ({ ...base, color: "#f5f8fa", fontSize: 13, fontWeight: 600 }),
  placeholder: (base) => ({ ...base, color: "#718293", fontSize: 13 }),
  input: (base) => ({ ...base, color: "#f5f8fa", fontSize: 13 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base, state) => ({ ...base, padding: "0 12px", color: state.isFocused ? "#aaf2be" : "#80d999", transition: "transform .18s ease", transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none", ":hover": { color: "#b6f5c7" } }),
  clearIndicator: (base) => ({ ...base, color: "#8b929f", ":hover": { color: "#ffb4b4" } }),
  menu: (base) => ({ ...base, zIndex: 2000, marginTop: 7, padding: 5, overflow: "hidden", backgroundColor: "#111822", border: "1px solid #2a303c", borderRadius: 11, boxShadow: "0 18px 45px rgba(0,0,0,.42)" }),
  menuPortal: (base) => ({ ...base, zIndex: 2000 }),
  option: (base, state) => ({ ...base, padding: "10px 11px", color: state.isSelected ? "#eaffef" : "#c7d3dc", backgroundColor: state.isSelected ? "rgba(81,224,138,.18)" : state.isFocused ? "rgba(255,255,255,.07)" : "transparent", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: state.isSelected ? 700 : 500, ":active": { backgroundColor: "rgba(81,224,138,.23)" } }),
  noOptionsMessage: (base) => ({ ...base, color: "#718293", fontSize: 12 }),
};

export default function AdminSelect({ options, value, onChange, placeholder = "Select...", isSearchable = false, isDisabled = false, ariaLabel, className, size = "default" }: AdminSelectProps) {
  const isMulti = Array.isArray(value);
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = isMulti ? options.filter((option) => value.includes(option.value)) : options.find((option) => option.value === value) || null;
  const SelectComponent = Select as any;
  // The react-select multi/single generic is selected dynamically at runtime.
  // @ts-expect-error react-select's overloaded style generic cannot represent both modes here.
  return <SelectComponent className={`admin-select ${size === "small" ? "admin-select-small" : ""} ${className || ""}`} classNamePrefix="admin-select" options={options} value={selected} onChange={(option: AdminSelectOption | AdminSelectOption[] | null) => { const selectedOptions = Array.isArray(option) ? option : option ? [option] : []; onChange(isMulti ? selectedOptions.map((item) => item.value) : selectedOptions[0]?.value || ""); }} placeholder={placeholder} isSearchable={isSearchable} isDisabled={isDisabled} aria-label={ariaLabel} isMulti={isMulti} closeMenuOnSelect={false} blurInputOnSelect={false} menuIsOpen={isMulti ? menuOpen : undefined} onMenuOpen={() => setMenuOpen(true)} onMenuClose={() => setMenuOpen(false)} hideSelectedOptions={false} styles={size === "small" ? { ...styles, control: (base, state) => ({ ...styles.control!(base, state), minHeight: 34 }) } : styles} menuPortalTarget={typeof document === "undefined" ? undefined : document.body} />;
}
