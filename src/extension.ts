import * as vscode from 'vscode';
import { extractLiHierarchy, Position } from './parser';
import { getEffectiveLanguages } from './getEffectiveLanguages';
import { getConfig } from './config';

let liDecoration: vscode.TextEditorDecorationType;

function createDecorationType(): vscode.TextEditorDecorationType {
  const config = getConfig();

  return vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 0.5em',
    },
    light: {
      after: {
        color: config.light.color,
        backgroundColor: config.light.backgroundColor,
        fontStyle: config.fontStyle,
        fontWeight: config.fontWeight,
      },
    },
    dark: {
      after: {
        color: config.dark.color,
        backgroundColor: config.dark.backgroundColor,
        fontStyle: config.fontStyle,
        fontWeight: config.fontWeight,
      },
    },
  });
}

export function activate(context: vscode.ExtensionContext) {
  liDecoration = createDecorationType();

  context.subscriptions.push(liDecoration);

  const onChange = vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor || editor.document !== event.document) {
      return false;
    }

    annotateLiTags(editor);
  });

  const onOpen = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      annotateLiTags(editor);
    }
  });

  // 🔥 新增這段：開啟 VS Code 當下就自動標記
  const active = vscode.window.activeTextEditor;

  if (active) {
    annotateLiTags(active);
  }

  vscode.workspace.onDidChangeConfiguration((ev) => {
    if (ev.affectsConfiguration('htmlListLens.decorations')) {
      liDecoration?.dispose();
      liDecoration = createDecorationType();
  
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        annotateLiTags(editor); // 重新套用
      }
    }
  });

  context.subscriptions.push(onChange, onOpen);
}

export function deactivate() {
  if (liDecoration) liDecoration.dispose();
}

async function annotateLiTags(editor: vscode.TextEditor) {
  const lang = editor.document.languageId;
  const allowed = getEffectiveLanguages();

  if (!allowed.includes(lang)) {
    return false;
  }

  const text = editor.document.getText();
  const info = extractLiHierarchy(text);

  const decorations: vscode.DecorationOptions[] = [];

  const renderMark = (position: Position, offsetX: number, path: number[]) => {
    const insertPosition = new vscode.Position(position.line - 1, position.char - 1 + offsetX);
    const hint = `#${path.join('.')}`;

    decorations.push({
      range: new vscode.Range(insertPosition, insertPosition),
      renderOptions: {
        after: {
          contentText: hint,
        },
      },
    });
  };

  for (const li of info) {
    renderMark(li.start, 3, li.path);
    renderMark(li.end, 4, li.path);
  }

  editor.setDecorations(liDecoration, decorations);
}
