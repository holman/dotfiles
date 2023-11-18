/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
	const vscode = acquireVsCodeApi();

  const commands = document.querySelectorAll('.Command');
  for (let i = 0; i < commands.length; i++) {
    const elem = commands[i];
    const msg = JSON.parse(JSON.stringify(elem.dataset));
    elem.addEventListener('click', () => {
      vscode.postMessage(msg);
    })
  }
}());

