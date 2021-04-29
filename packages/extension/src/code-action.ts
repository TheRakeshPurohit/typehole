import * as vscode from "vscode";
import * as ts from "typescript";
import { isValidSelection } from "./parse/expression";
import { getAST } from "./parse/module";
import {
  getDescendantAtRange,
  lineCharacterPositionInText,
} from "./parse/utils";

export class TypeHoler implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<vscode.Command[]> {
    const fullFile = document.getText();

    const startPosition = lineCharacterPositionInText(range.start, fullFile);
    const endPosition = lineCharacterPositionInText(range.end, fullFile);

    const selectedNode = getDescendantAtRange(getAST(fullFile), [
      startPosition,
      endPosition,
    ]);
    console.log(ts.SyntaxKind[selectedNode.kind]);

    if (!isValidSelection(selectedNode)) {
      return;
    }

    return [
      {
        command: "typehole.add-a-typehole",
        title: "Add a typehole",
      },
    ];
  }
}
