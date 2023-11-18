import {
  CancellationToken,
  DocumentSymbol,
  DocumentSymbolProvider,
  Location,
  Position,
  ProviderResult,
  SymbolInformation,
  SymbolKind,
  TextDocument,
} from "vscode";
import { tokenize } from "protobufjs";

type ProvideSymbolsResult = ProviderResult<SymbolInformation[] | DocumentSymbol[]>;

export class Proto3DocumentSymbolProvider implements DocumentSymbolProvider {
  constructor(private state: "free" | "rpc" | "message" = "free") {}

  provideDocumentSymbols(doc: TextDocument, token: CancellationToken): ProvideSymbolsResult {
    const ret: SymbolInformation[] = [];

    const tokenizer = tokenize(doc.getText(), false);
    for (;;) {
      const tok = tokenizer.next();
      if (tok === null) {
        break;
      }

      switch (tok) {
        case "message":
          this.state = "message";
          break;

        case "rpc":
          this.state = "rpc";
          break;

        default:
          if (this.state === "free") {
            continue;
          }

          if (!/^[a-zA-Z_]+\w*/.test(tok)) {
            // identifier expected but found other token
            this.state = "free";
            continue;
          }

          const location = new Location(doc.uri, new Position(tokenizer.line - 1, 0));
          const kind = this.state === "message" ? SymbolKind.Class : SymbolKind.Method;
          ret.push(new SymbolInformation(tok, kind, "", location));
          this.state = "free";
          break;
      }
    }

    return ret;
  }
}
