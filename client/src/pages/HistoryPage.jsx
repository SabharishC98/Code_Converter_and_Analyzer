import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import CodeEditor from '../components/CodeEditor.jsx';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/historyService.js';

// ---- HistoryList (inline since it's small) ----
function HistoryList({ entries, onView, onDelete }) {
  if (entries.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
        No history yet
      </div>
    );
  }
  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry._id}
          onClick={() => onView(entry)}
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background-secondary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px', fontWeight: '500', padding: '2px 8px',
                borderRadius: '12px', background: '#EDE9FF', color: '#5B4FD9', textTransform: 'uppercase'
              }}>
                {entry.type}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                {entry.sourceLanguage}
                {entry.targetLanguage ? ` → ${entry.targetLanguage}` : ''}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: 0 }}>
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry._id); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: '16px', padding: '4px', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ---- HistoryPage ----
function HistoryPage() {
  const [entries, setEntries]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(currentPage, 8);
      setEntries(data.entries);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success('Deleted');
      if (selectedEntry?._id === id) setSelectedEntry(null);
      fetchHistory();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    try {
      await clearHistory();
      toast.success('History cleared');
      setEntries([]);
      setSelectedEntry(null);
      setCurrentPage(1);
    } catch {
      toast.error('Failed to clear history');
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: '320px', flexShrink: 0,
        borderRight: '1px solid var(--color-border-tertiary)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--color-background-primary)'
      }}>
        {/* Sidebar header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>History</h2>
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{ fontSize: '12px', color: '#E24B4A', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading
            ? <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>Loading...</div>
            : <HistoryList entries={entries} onView={setSelectedEntry} onDelete={handleDelete} />
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--color-border-secondary)', background: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: 'var(--color-text-secondary)', fontSize: '13px' }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--color-border-secondary)',
                  background: currentPage === p ? '#5B4FD9' : 'none',
                  color: currentPage === p ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--color-border-secondary)', background: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: 'var(--color-text-secondary)', fontSize: '13px' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedEntry ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Detail header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '12px', background: '#EDE9FF', color: '#5B4FD9', textTransform: 'uppercase' }}>
                {selectedEntry.type}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
                {new Date(selectedEntry.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>

          {/* Detail body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Input code */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Input — {selectedEntry.sourceLanguage}
              </p>
              <div style={{ height: '220px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border-tertiary)' }}>
                <CodeEditor
                  code={selectedEntry.inputCode}
                  onChange={() => {}}
                  language={selectedEntry.sourceLanguage}
                  readOnly={true}
                />
              </div>
            </div>

            {/* Output */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Output
              </p>

              {selectedEntry.type === 'translate' && (
                <div style={{ height: '220px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border-tertiary)' }}>
                  <CodeEditor
                    code={selectedEntry.output?.translatedCode || ''}
                    onChange={() => {}}
                    language={selectedEntry.targetLanguage}
                    readOnly={true}
                  />
                </div>
              )}

              {selectedEntry.type === 'analyze' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, padding: '14px', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)' }}>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>TIME COMPLEXITY</p>
                      <p style={{ fontSize: '18px', fontWeight: '500', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{selectedEntry.output?.timeComplexity}</p>
                    </div>
                    <div style={{ flex: 1, padding: '14px', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)' }}>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>SPACE COMPLEXITY</p>
                      <p style={{ fontSize: '18px', fontWeight: '500', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{selectedEntry.output?.spaceComplexity}</p>
                    </div>
                  </div>
                  <div style={{ padding: '14px', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{selectedEntry.output?.explanation}</p>
                  </div>
                </div>
              )}

              {selectedEntry.type === 'optimize' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border-tertiary)' }}>
                    <CodeEditor
                      code={selectedEntry.output?.optimizedCode || ''}
                      onChange={() => {}}
                      language={selectedEntry.sourceLanguage}
                      readOnly={true}
                    />
                  </div>
                  <div style={{ padding: '14px', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>SUGGESTIONS</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedEntry.output?.suggestions}</p>
                  </div>
                </div>
              )}

              {selectedEntry.type === 'explain' && (
                <div style={{ padding: '16px', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)' }}>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selectedEntry.output?.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
          Select an entry to view details
        </div>
      )}
    </div>
  );
}

export default HistoryPage;