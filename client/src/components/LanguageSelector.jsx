import { LANGUAGES } from '../constants/languages.js';

function LanguageSelector({ value, onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: '4px 10px',
        borderRadius: '6px',
        border: '1px solid var(--color-border-secondary)',
        background: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)',
        fontSize: '13px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      {LANGUAGES.map(lang => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;