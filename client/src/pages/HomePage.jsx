import { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor.jsx';
import OutputPanel from '../components/OutputPanel.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import { STARTER_CODE } from '../constants/languages.js';
import { translateCode, analyzeComplexity, optimizeCode, explainCode } from '../services/codeService.js';

const ACTIONS = ['translate', 'analyze', 'optimize', 'explain'];

function HomePage() {
  const [code, setCode]                   = useState(STARTER_CODE.python);
  const [sourceLanguage, setSourceLanguage] = useState('python');
  const [targetLanguage, setTargetLanguage] = useState('java');
  const [activeAction, setActiveAction]   = useState('translate');
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [copied, setCopied]               = useState(false);

  const handleSourceChange = (langId) => {
    setSourceLanguage(langId);
    if (STARTER_CODE[langId]) setCode(STARTER_CODE[langId]);
    setResult(null);
  };

  const handleSwap = () => {
    if (activeAction !== 'translate') return;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    if (result?.translatedCode) {
      setCode(result.translatedCode);
      setResult(null);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return toast.error('Please write some code first.');
    if (!sourceLanguage) return toast.error('Select a source language.');
    if (activeAction === 'translate' && !targetLanguage)
      return toast.error('Select a target language.');

    setLoading(true);
    setResult(null);

    try {
      const fns = {
        translate: () => translateCode(code, sourceLanguage, targetLanguage),
        analyze:   () => analyzeComplexity(code, sourceLanguage),
        optimize:  () => optimizeCode(code, sourceLanguage),
        explain:   () => explainCode(code, sourceLanguage),
      };
      const data = await fns[activeAction]();
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    let text = '';
    if (activeAction === 'translate') text = result.translatedCode || '';
    else if (activeAction === 'optimize') text = result.optimizedCode || '';
    else if (activeAction === 'explain') text = result.explanation || '';
    else if (activeAction === 'analyze')
      text = `Time: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n\n${result.explanation || ''}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', borderBottom: '1px solid var(--color-border-tertiary)',
        background: 'var(--color-background-primary)', flexShrink: 0
      }}>
        {/* Action tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {ACTIONS.map(a => (
            <button
              key={a}
              onClick={() => { setActiveAction(a); setResult(null); }}
              style={{
                padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
                border: '1px solid', cursor: 'pointer', textTransform: 'capitalize',
                background: activeAction === a ? '#5B4FD9' : 'transparent',
                color: activeAction === a ? '#fff' : 'var(--color-text-secondary)',
                borderColor: activeAction === a ? '#5B4FD9' : 'var(--color-border-secondary)',
              }}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Right side: copy + run */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {result && (
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '13px',
                border: '1px solid var(--color-border-secondary)',
                background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer'
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              padding: '6px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '500',
              background: loading ? '#9991E8' : '#5B4FD9', color: '#fff',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left panel — source */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border-tertiary)' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Source</span>
            <LanguageSelector value={sourceLanguage} onChange={handleSourceChange} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor code={code} onChange={setCode} language={sourceLanguage} />
          </div>
        </div>

        {/* Swap / arrow button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', flexShrink: 0 }}>
          <button
            onClick={handleSwap}
            title={activeAction === 'translate' ? 'Swap languages' : ''}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1px solid var(--color-border-secondary)',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-secondary)',
              cursor: activeAction === 'translate' ? 'pointer' : 'default',
              fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {activeAction === 'translate' ? '⇄' : '→'}
          </button>
        </div>

        {/* Right panel — output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Output</span>
            {activeAction === 'translate' ? (
              <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
            ) : (
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                background: '#EDE9FF', color: '#5B4FD9', fontWeight: '500', textTransform: 'capitalize'
              }}>
                {activeAction}
              </span>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
                Processing...
              </div>
            ) : (
              <OutputPanel result={result} action={activeAction} targetLanguage={targetLanguage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;