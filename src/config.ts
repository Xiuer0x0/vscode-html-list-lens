import * as vscode from 'vscode';

export interface DecorationStyleConfig extends vscode.WorkspaceConfiguration {
  light: {
    color: string;
    backgroundColor: string;
  };
  dark: {
    color: string;
    backgroundColor: string;
  };
  fontStyle: string;
  fontWeight: string;
}

export function getConfig(): DecorationStyleConfig {
  const config = vscode.workspace.getConfiguration('htmlListLens');

  return {
    ...config,
    light: {
      color: config.get('decorations.lightColor', 'lightgray'),
      backgroundColor: config.get('decorations.lightBackground', 'rgba(0, 0, 0, 0.1)'),
    },
    dark: {
      color: config.get('decorations.darkColor', 'gray'),
      backgroundColor: config.get('decorations.darkBackground', 'rgba(255, 255, 255, 0.1)'),
    },
    fontStyle: config.get('decorations.fontStyle', 'italic'),
    fontWeight: config.get('decorations.fontWeight', 'normal'),
  };
}
