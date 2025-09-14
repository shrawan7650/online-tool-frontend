import React from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, id }) => {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="h-6 transition-colors duration-300 rounded-full w-11 bg-slate-600 peer peer-checked:bg-blue-500"></div>
        <div className="absolute w-4 h-4 transition-transform duration-300 bg-white rounded-full shadow-md left-1 top-1 peer-checked:translate-x-5"></div>
      </label>
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </div>
  );
};


