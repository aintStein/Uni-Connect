import React from 'react';

interface SwitchToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  id?: string;
}

export const SwitchToggle: React.FC<SwitchToggleProps> = ({
  checked,
  onChange,
  ariaLabel,
  disabled,
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-secondary' : 'bg-slate-300 dark:bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ boxSizing: 'border-box' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out"
        style={{
          marginLeft: checked ? '20px' : '0px',
        }}
      />
    </button>
  );
};
