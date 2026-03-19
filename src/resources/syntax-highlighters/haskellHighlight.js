export default function haskellHighlight(monaco) {
  monaco.languages.register({ id: "haskell" });

  monaco.languages.setMonarchTokensProvider("haskell", {
    keywords: [
      "let","in","where","data","type","case","of",
      "if","then","else","do","module","import",
      "deriving","class","instance", 
      "putStr", "putStrLn", "print", "interact", "getLine", "getContent", "lines", "words",
      "head", "tail", "length", "init"
    ],

    tokenizer: {
      root: [
        [/[A-Z][\w']*/, "type.identifier"],

        [
          /[a-z_][\w']*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier"
            }
          }
        ],

        [/[0-9]+/, "number"],
        [/".*?"/, "string"],

        [/--.*$/, "comment"],
        [/\{\-/, "comment", "@comment"]
      ],

      comment: [
        [/[^\-]+/, "comment"],
        [/\-\}/, "comment", "@pop"],
        [/./, "comment"]
      ]
    }
  });

  monaco.languages.setLanguageConfiguration("haskell", {
    comments: {
      lineComment: "--",
      blockComment: ["{-", "-}"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: "{", close: "}" },
      { open: '"', close: '"' }
    ]
  });
}