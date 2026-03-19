import CodeEditor from "./CodeEditor.jsx";

function InfoCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      border: '1px solid var(--color-border-tertiary)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
    </div>
  );
}

function OutputPanel({ result, action, targetLanguage }) {
  // Empty state
  if (!result) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-tertiary)',
        fontSize: '14px',
        textAlign: 'center',
        padding: '40px'
      }}>
        <p>Write code, pick an action, and hit <strong>Run</strong></p>
      </div>
    );
  }

  // Translate — show translated code in Monaco editor
  if (action === 'translate') {
    return (
      <div style={{ height: '100%' }}>
        <CodeEditor
          code={result.translatedCode || ''}
          onChange={() => {}}
          language={targetLanguage}
          readOnly={true}
        />
      </div>
    );
  }

  // Analyze — show complexity cards
  if (action === 'analyze') {
    return (
      <div style={{ padding: '20px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        <InfoCard label="Time Complexity"  value={result.timeComplexity}  />
        <InfoCard label="Space Complexity" value={result.spaceComplexity} />
        <div style={{
          background: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border-tertiary)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Explanation
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            {result.explanation}
          </p>
        </div>
      </div>
    );
  }

  // Optimize — show optimized code + suggestions
  if (action === 'optimize') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CodeEditor
            code={result.optimizedCode || ''}
            onChange={() => {}}
            language="python"
            readOnly={true}
          />
        </div>
        <div style={{
          padding: '16px',
          background: 'var(--color-background-secondary)',
          borderTop: '1px solid var(--color-border-tertiary)',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Suggestions
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {result.suggestions}
          </p>
        </div>
      </div>
    );
  }

  // Explain — show plain text explanation
  if (action === 'explain') {
    return (
      <div style={{ padding: '20px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        <div style={{
          background: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border-tertiary)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Explanation
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {result.explanation}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default OutputPanel;