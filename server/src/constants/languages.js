export const SUPPORTED_LANGUAGES = [
  { id: "c",      name: "C"      },
  { id: "cpp",    name: "C++"    },
  { id: "csharp", name: "C#"     },
  { id: "java",   name: "Java"   },
  { id: "python", name: "Python" },
];

export const getLanguageName = (id) => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.id === id);
  return lang ? lang.name : id;
};