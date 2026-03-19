import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";

function CodeEditor({ code, onChange, language, readOnly = false }) {
  return (
    <Editor
      height="100%"
      language={MONACO_LANGUAGE_MAP[language] || "plaintext"}
      value={code}
      onChange={(v) => onChange(v || "")}
      theme="vs-dark"
      options={{ readOnly, minimap: { enabled: false }, fontSize: 14, bracketPairColorization: { enabled: true } }}
    />
  );
}
export default CodeEditor;