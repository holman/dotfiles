## v0.29.0 - 26 Oct, 2021

A list of all issues and changes can be found in the [v0.29.0 milestone](https://github.com/golang/vscode-go/milestone/37) and [commit history](https://github.com/golang/vscode-go/compare/v0.28.1...v0.29.0).

### Changes

- Prompt users for the 2021 Go Developer survey. `go.survey.prompt` is a new setting to control survey prompts.
- Use `go install` for tools installation when using go1.16+. From go1.18, `go get` will no longer build/install tools. See [the deprecation notice](https://golang.org/doc/go-get-install-deprecation). ([Issue 1825](https://github.com/golang/vscode-go/issues/1825)) <!-- CL 355974 --> The extension runs `go install` from the workspace root directory, and the old workaround for [Issue 757](https://github.com/golang/vscode-go/issues/757) is unnecessary.
- Language Server:
  - Print all `GOPATH`s when there are multiple GOPATHs. ([Issue 1848](https://github.com/golang/vscode-go/issues/1848)) <!-- CL 356909 -->
  - Synced settings @ gopls/v0.7.3
- "Go: Generate Interface Stubs" allows `'-'` as an acceptable char for interface names. ([Issue 1670](https://github.com/golang/vscode-go/issues/1670)) <!-- CL 343829 -->
- Test UX:
  - Visualize profiles. ([Issue 1747](https://github.com/golang/vscode-go/issues/1747)) <!-- CL 345477 -->
  - Added view for profiles. ([Issue 1641](https://github.com/golang/vscode-go/issues/1641)) <!-- CL 345470 -->
  - Added single-test debugging support to the Test Explorer UI. ([CL 348571](https://golang.org/cl/348571))
  - Shows test output on run. ([CL 352309](https://golang.org/cl/352309))
- Debug:
  - Added `showLog`/`logOutput`/`dlvFlags` to `go.delveConfig` setting that change the default values for them. ([Issue 1723](https://github.com/golang/vscode-go/issues/1723)) <!-- CL 351249 -->
  - Handle directory with `'.'` in its name correctly and warn users for invalid `program` ([Issue 1826](https://github.com/golang/vscode-go/issues/1826), [1769](https://github.com/golang/vscode-go/issues/1769)) <!-- CL 353990 -->

### Thanks

Thank you for your contribution, @firelizzard18, @Zamiell, @mislav, @polinasok, @hyangah, @stamblerre, @suzmue, and @yinheli!

## v0.28.1 - 24 Sep, 2021

A list of all issues and changes can be found in the [v0.28.1 milestone](https://github.com/golang/vscode-go/milestone/38) and [commit history](https://github.com/golang/vscode-go/compare/v0.28.0...v0.28.1).

### Fixes
- Skipped launch configuration adjustment to address build errors when debugging using externally launched delve DAP servers. (Issue [1793](https://github.com/golang/vscode-go/issues/1793))
- Restore the fix for Issue [1729](https://github.com/golang/vscode-go/issues/1729) that was accidentally dropped during merge for release.

## v0.28.0 - 20 Sep, 2021

This version requires VS Code 1.59 or newer.

🎉🧪 The extension implements [the Testing API of VS Code](https://code.visualstudio.com/api/extension-guides/testing). You can navigate and run/profile tests using the test explorer UI! Windows support and further work for better profiling and debugging support through the test explorer is underway. Please give it a try and provide feedback.

A list of all issues and changes can be found in the [v0.28.0 milestone](https://github.com/golang/vscode-go/milestone/34) and [commit history](https://github.com/golang/vscode-go/compare/v0.27.2...v0.28.0).

### Changes

- Require VS Code engine 1.59+.
- Implement the Testing API ([Issue 1579](https://github.com/golang/vscode-go/issues/1579)). <!-- CL 330809 -->
The test provider discovers all Go tests and benchmarks including `stretchr` test suits ([Issue 1641](https://github.com/golang/vscode-go/issues/1641)) <!-- CL 343489 --> and sub-tests ([Issue 1641](https://github.com/golang/vscode-go/issues/1641)). <!-- CL 343433 --> You can adjust behavior with the  [`go.testExplorer.*` settings](https://github.com/golang/vscode-go/blob/master/docs/settings.md#gotestexploreralwaysrunbenchmarks). 
- Offer basic profiling support through the testing API. ([Issue 1685](https://github.com/golang/vscode-go/issues/1685)) <!-- CL 344149 -->
- Debugging
	- Allow to connect to a Delve DAP server running on a different host using `host` and `port` launch properties. ([Issue 1729](https://github.com/golang/vscode-go/issues/1729)) <!-- CL 346269 -->
	- Disabled check for active debug session ([Issue 1710](https://github.com/golang/vscode-go/issues/1710)). <!-- CL 349596 --> This will allow to run multiple debug sessions simultaneously.
	- Disabled the go version check by supplying the `--check-go-version=false` delve flag ([Issue 1716](https://github.com/golang/vscode-go/issues/1716)). <!-- CL 347562 --> This is to allow users of older versions of Go to debug using Delve DAP which requires Delve 1.6.1 or newer. If you need to use Delve 1.6.0 or older, please use [the legacy debug adapter](https://github.com/golang/vscode-go/blob/master/docs/debugging-legacy.md).
	- Fixed a legacy debug adapter's bug that broke remote debugging when breakpoints were set in irrelevant files. ([Issue 1762](https://github.com/golang/vscode-go/issues/1762)) <!-- CL 348972 -->
	- Added [the new FAQs section](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#faqs).
- Removed tools version check hack that triggerred unnecessary warnings about go and tools version mismatch issues ([Issue 1698](https://github.com/golang/vscode-go/issues/1698)). <!-- CL 349752 --> 
- Export an API with which other extensions can query the location of go tools. ([Issue 233](https://github.com/golang/vscode-go/issues/233)) <!-- CL 336509 -->
- Fixed regexps for test function names ([CL 344130](https://go-review.googlesource.com/c/vscode-go/+/344130)).
- Track the language server's restart history and include it in the automated gopls crash report ([CL 344130](https://go-review.googlesource.com/c/vscode-go/+/344130)).
- Code Health
	- Use `esbuild` instead of `webpack` ([Issue 1705](https://github.com/golang/vscode-go/issues/1705)). <!-- CL 343791 -->
	- Removed the temporary security workaround in favor of [VS Code's Workspace Trust concept](https://code.visualstudio.com/docs/editor/workspace-trust). <!-- CL 347690 -->
	- Updated the gopls settings documentation to reflect gopls/v0.7.2 settings.

### Thanks

Thank you for your contribution, Nicolas Lepage, 180909, Polina Sokolova, Rebecca Stambler, and Suzy Mueller! Special thanks to Ethan Reesor for the Test Explorer work!

## v0.27.2 - 1st Sep, 2021

A list of all issues and changes can be found in the [v0.27.2 milestone](https://github.com/golang/vscode-go/milestone/36) and [commit history](https://github.com/golang/vscode-go/compare/v0.27.1...v0.27.2).

### Enhancement
- Supports `replay` and `core` debug launch modes. ([PR 1268](https://github.com/golang/vscode-go/pull/1268))
- `gopls` now watches changes in `go.work` files to support [Go Proposal 45713](https://go.googlesource.com/proposal/+/master/design/45713-workspace.md).

### Fixes
- Fixed issues around building binaries for debugging when symlinks or case-insensitive file systems are involved. (Issues [1680](https://github.com/golang/vscode-go/issues/1680), [1677](https://github.com/golang/vscode-go/issues/1677), [1713](https://github.com/golang/vscode-go/issues/1713))
- Clarified the `dlvLoadConfig` setting is no longer necessary with the new debug adapter (`dlv-dap`). ([CL 344370)(https://go-review.googlesource.com/c/vscode-go/+/344370))
- Increased the timeout limit from 5sec to 30sec. If `dlv-dap` still fails to start, please check firewall/security settings do not prevent installation or execution of the `dlv-dap` (or `dlv-dap.exe`) binary. ([Issue 1693](https://github.com/golang/vscode-go/issues/1693))
- `Go: Install/Update Tools` command picks the `dlv-dap` from the main branch.

### Thanks
Thanks for your contributions, Suzy Mueller, Luis Gabriel Gomez, Polina Sokolova, Julie Qiu, and Hana Kim!

## v0.27.1 - 12 Aug, 2021

A list of all issues and changes can be found in the [v0.27.1 milestone](https://github.com/golang/vscode-go/milestone/35) and [commit history](https://github.com/golang/vscode-go/compare/v0.27.0...v0.27.1).


### Fixes
- Fixed process pickers used in attach mode debugging. ([Issue 1679](https://github.com/golang/vscode-go/issues/1679))
- Fixed the failure of debugging when `CGO_CFLAGS` is set. ([Issue 1678](https://github.com/golang/vscode-go/issues/1678))
- Fixed the `dlv-dap` installation issue. ([Issue 1682](https://github.com/golang/vscode-go/issues/1682))

### Thanks
Thanks for your contributions, Luis Gabriel Gomez, Suzy Mueller, and Hana Kim!

## v0.27.0 - 9 Aug, 2021

📣 Delve's native DAP implementation ([`dlv-dap`](https://github.com/go-delve/delve/blob/master/Documentation/usage/dlv_dap.md))
is enabled by default for local debugging. We updated the [Documentation for Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md)
to show the new features available with dlv-dap. This change does not apply to remote debugging yet.
For remote debugging, keep following the instruction in the
[legacy debug adapter documentation](https://github.com/golang/vscode-go/blob/master/docs/debugging-legacy.md).

A list of all issues and changes can be found in the [v0.27.0 milestone](https://github.com/golang/vscode-go/milestone/33?closed=1) and [commit history](https://github.com/golang/vscode-go/compare/v0.26.0...v0.27.0).

### Enhancements
- The new [`go.terminal.activateEnvironment`](https://github.com/golang/vscode-go/blob/master/docs/settings.md#goterminalactivateenvironment)
allows to prevent the extension from changing integrated terminal's environment variables. ([Issue 1558](https://github.com/golang/vscode-go/issues/1558), [1098](https://github.com/golang/vscode-go/issues/1098)) <!-- CL 336409 -->
- The [`Go: Locate Configured Go Tools`](https://github.com/golang/vscode-go/blob/master/docs/commands.md#go-locate-configured-go-tools)
command prints the build information of detected tools. <!-- CL 337989 -->
- Use `dlv-dap` as the default debug adapter for local debugging. The new debug adapter offers
[many new features and improvements](https://github.com/golang/vscode-go/issues?q=is%3Aissue+is%3Aclosed+label%3AFixedInDlvDAPOnly).
- Added Gitpod to a recognized Cloud-based IDE, for which the extension will minimize the number of toast or notification messages. ([Issue 1616](https://github.com/golang/vscode-go/issues/1616)) 
- The [`Go: Subtest At Cursor`](https://github.com/golang/vscode-go/blob/master/docs/commands.md#go-subtest-at-cursor) command prompts for subtest name if there is no subtest at cursor ([Issue 1602](https://github.com/golang/vscode-go/issues/1602)). <!-- CL 333309 -->

### Fixes
- Debugging
    - Setting the `logOutput` property without `showLog: true` does not break debugging any more. <!-- CL 335029 -->
    - Fixed a bug in the legacy debug adapter that caused jumping at each step after upgrading to VS Code 1.58+. ([Issue 1617](https://github.com/golang/vscode-go/issues/1617), [1647](https://github.com/golang/vscode-go/issues/1647)) <!-- CL 338194 -->
    - Fixed a bug that broke Attach mode debugging using the legacy debug adapter if `cwd` is not set. ([Issue 1608](https://github.com/golang/vscode-go/issues/1608)) <!-- CL 334111 -->
    - Made the `dlv-dap` mode ignore the `port` property. It was initially suggested as a temporary alternative
    to the remote debugging, but we decided to revisit the functionality for better remote debugging support.
    Use the `debugServer` property if you want to connect to a manually launched `dlv dap` server. 

### Code Health
- The version of `dlv-dap` is pinned to [v1.7.1-0.20210804080032-f95340ae1bf9](https://github.com/go-delve/delve/tree/f95340ae1bf9fed8740d5fd39f5758d41770d967) and `dlv-dap` is marked as a required tool.
- Updated the hard-coded default gopls version string to v0.7.1.
- Added `tools/relnotes`, a script to help generate CHANGELOG.md. <!-- CL 256579 -->
- Added go1.17 RC to CI. ([Issue 1640](https://github.com/golang/vscode-go/issues/1640)) <!-- CL 336310 -->
- Enabled tests that were skipped in dlv-dap mode since dlv-dap reached feature parity. <!-- CL 332109 -->
- Use StackOverflow as the channel for Q&A.

### Thanks

Thank you for your contribution, Ahmed W, Hana, Michael Currin, Polina Sokolova, Rebecca Stambler, Suzy Mueller, and Sven Efftinge!

## v0.26.0 - 17 Jun, 2021

📣 [`Delve`'s native DAP implementation](https://github.com/golang/vscode-go/blob/master/docs/dlv-dap.md) is now available for use. In order to use this new debug adapter (`dlv-dap`) when debugging Go programs, add the following settings in your `settings.json`:

```json5
    "go.delveConfig": {
        "debugAdapter": "dlv-dap",
    },
```

Please learn more about [the new adapter's features and configuration parameters](https://github.com/golang/vscode-go/blob/master/docs/dlv-dap.md), and share your feedback and report the issues in our issue tracker.

A list of all issues and changes can be found in the [v0.26.0 milestone](https://github.com/golang/vscode-go/milestone/30?closed=1) and [commit history](https://github.com/golang/vscode-go/compare/v0.25.1...v0.26.0).

### Enhancements
- `dlv-dap` is ready for use in local debugging.
- Added the new `"Go: Test Function At Cursor or Test Previous"` command. ([PR 1509](https://github.com/golang/vscode-go/pull/1509))
- `"Go: Add Imports"` command uses `gopls` instead of `gopkg`. This requires `gopls@v0.7.0` or newer. ([Go Issue 43351](https://github.com/golang/go/issues/43351))

### Fixes
- Fixed `"Go: Lint Workspace"` that failed no editor is active. ([Issue 1520](https://github.com/golang/vscode-go/issues/1520))
- Fixed `gopls` crash caused by Untitled files. ([Issue 1559](https://github.com/golang/vscode-go/issues/1559))

### Thanks
Thanks for your contributions, @mislav, @marwan-at-work, @findleyr, @lggomez, @fflewddur, @suzmue, @hyangah!

## v0.25.1 - 24 May, 2021

A list of all issues and changes can be found in the [v0.25.1 milestone](https://github.com/golang/vscode-go/issues?q=is%3Aissue+milestone%3Av0.25.1+is%3Aclosed).

### Fixes
- Change the default path separator to `/` when applying `substitutePath` debug configuration. ([Issue 1497](https://github.com/golang/vscode-go/issues/1497))
- Warn users when `go.goroot` setting is used. ([Issue 1501](https://github.com/golang/vscode-go/issues/1501))

### Enhancements
- Update to latest version of `dlv-dap`. Some of newest additions to `dlv dap` include optimized function detection, exception info, pause, function breakpoints while running, evaluate over hover, set variables. Documentation of current features and limitations can be found in [the documentation](https://github.com/golang/vscode-go/blob/master/docs/dlv-dap.md).
- Adjusted feedback survey prompt probability.

### Thanks
Thanks for the contribution, @suzmue, @fflewddur!

## v0.25.0 - 12 May, 2021

A list of all issues and changes can be found in the
[v0.25.0 milestone](https://github.com/golang/vscode-go/issues?q=is%3Aissue+milestone%3Av0.25.0+is%3Aclosed).

If you have a feature requests for this extension, please file it through the github issue tracker.

### Enhancements
- Update to latest version of `dlv-dap`. Documentation of current features and limitations can be found in [the documentation](https://github.com/golang/vscode-go/blob/master/docs/dlv-dap.md)
- Add debug previous command ([Issue 798](https://github.com/golang/vscode-go/issues/798))
- Add `Go: Initialize go.mod` command to run `go mod init` in the current workspace folder ([Issue 1449](https://github.com/golang/vscode-go/issues/1449))
- Use `program` in debug configuration to determine mode in `auto` ([Issue 1422](https://github.com/golang/vscode-go/issues/1422))
- Auto update `dlv-dap` if autoUpdates enabled ([Issue 1404](https://github.com/golang/vscode-go/issues/1404))
- Set `editor.suggest.snippetsPreventQuickSuggestions` to false by default to enable code completion and quick suggestions inside a snippet ([Issue 839](https://github.com/golang/vscode-go/issues/839))

### Fixes
- Set the `GOROOT` to the user specified `GOROOT` in `go.goroot`
- Fixed missing file bug in debug adapter ([Issue 1447](https://github.com/golang/vscode-go/issues/1447))
- Fixed inconsistent workpsaceFolder value bug in debug configuration ([Issue 1448](https://github.com/golang/vscode-go/issues/1448))
- Allow `dlv-dap` to shut down gracefully and clean up debugged process ([Issue 120](https://github.com/golang/vscode-go/issues/120))

### Thanks

Thank you for your contribution, @hyangah, @JadenSimon, @rstambler, @polinasok, @rfindley, and @suzmue!

## v0.24.2 - 19 Apr, 2021
A list of all issues and changes can be found in the
[v0.24.2 milestone](https://github.com/golang/vscode-go/issues?q=is%3Aissue+milestone%3Av0.24.2+is%3Aclosed).

### Fixes
- Fixed regression in the `lintOnSave` feature. ([Issue 1429](https://github.com/golang/vscode-go/issues/1429))
- Fixed `dlv-dap` installation to correcly use `GOBIN` environment variable. ([Issue 1430](https://github.com/golang/vscode-go/issues/1430))
- Fixed duplicate error notifications when missing `dlv-dap`. ([Issue 1426](https://github.com/golang/vscode-go/issues/1426))

## Enhancements
- Updated the minimum required dlv-dap version. The new version includes support for
[`substitutePath`](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#launch-configurations) and shadowed variable annotation.

## v0.24.1 - 15 Apr, 2021

### Enhancements
- Cleaned up launch configuration snippets for easier debug setup
- To use `dlv-dap` by default for all launch configurations (including codelenses), set the `debugAdapter` field in the `go.delveConfig` setting ([Issue 1293](https://github.com/golang/vscode-go/issues/1293))
- The list of debugging features only available with `dlv-dap` is now available [here](https://github.com/golang/vscode-go/issues?q=is%3Aissue+label%3Afixedindlvdaponly)
- Updated extension settings to match gopls v0.6.10

### Fixes
- Tightened the test function detection regex for codelenses ([Issue 1417](https://github.com/golang/vscode-go/issues/1417))
- Show error message when dlv-dap fails to launch ([Issue 1413](https://github.com/golang/vscode-go/issues/1413))
- Corrected install instructions for dlv-dap in popup ([Issue 1395](https://github.com/golang/vscode-go/issues/1395))

## Code Health
- Updated latest version of dlv-dap and gopls (v0.6.10)

## v0.24.0 - 6th Apr, 2021

🧪 We re-enabled the option to use `dlv dap` (Delve's native DAP implementation) instead of the old debug
adapter when debugging go code. See [the documentation](https://github.com/golang/vscode-go/blob/master/docs/dlv-dap.md#how-to-use-dlv-dap)
to learn more about Delve's native DAP implementation, and how to choose `dlv dap`.

Full list of issues and changes can be found in the [v0.24.0 milestone](https://github.com/golang/vscode-go/milestone/25) and the [changes since v0.23.3](https://github.com/golang/vscode-go/compare/v0.23.3...release).

### Enhancements
* Supports custom format tools when gopls is enabled. ([Issue 1238](https://github.com/golang/vscode-go/issues/1238))
* Allows to use `dlv dap` for debugging.

### Fixes
* Do not lint with `staticcheck` if it is enabled in `gopls`. ([CL 301053](https://go-review.googlesource.com/c/vscode-go/+/301053))
* Use `go list` to check availability of newly released gopls. ([CL 295418](https://go-review.googlesource.com/c/vscode-go/+/295418))
* Use `go env -json` to query go env variables. ([CL 301730](https://go-review.googlesource.com/c/vscode-go/+/301730))
* Include gopls, go versions and OS info to the opt-out survey.

### Code Health

* npm audit fix
* Removed the deprecated `go.overwriteGoplsMiddleware` setting.
* Added more testing for debug features using dlv-dap.

### Thanks

Thanks for the contributions, @hoanggc, @suzmue, @rstambler, @polinasok!

## v0.23.3 - 19th Mar, 2021

### Enhancements

* Always check the gopls version before activating automated issue reporter regardless of the gopls update settings.
* Updated the hard-coded latest gopls version to v0.6.8 and the gopls settings.

## v0.23.2 - 12th Mar, 2021

### Fixes

* Updated the gopls version requirement. v0.23.1 requires v0.6.6+. ([Issue 1300](https://github.com/golang/vscode-go/issues/1300))

## v0.23.1 - 11th Mar, 2021

🎉 &nbsp;&nbsp;We use [`staticcheck`](https://staticcheck.io/)
as the default lint tool. We also changed to use `goimports` for formatting when not using `gopls`.

This version requires VS Code 1.52 or newer.

A list of all issues and changes can be found in the
[v0.23.1 milestone](https://github.com/golang/vscode-go/milestone/24?closed=1)
and the [changes since v0.22.1](https://github.com/golang/vscode-go/compare/v0.23.0...v0.23.1)

### Enhancements

* Changed the default lint/format tools. ([Issue 189](https://github.com/golang/vscode-go/issues/189), [192](https://github.com/golang/vscode-go/issues/192))
* Enhanced `dlv-dap` start logic ([Issue 1270](https://github.com/golang/vscode-go/issues/1270)) and improved output/error message forwarding. ([CL 296930](https://go-review.googlesource.com/c/vscode-go/+/296930))

### Fixes

* Fixed the spurious popup message about the use of `goreturns`. ([CL 300430](https://go-review.googlesource.com/c/vscode-go/+/300430))
* Fixed orphaned progress notification after restarting `gopls`. ([Issue 1153](https://github.com/golang/vscode-go/issues/1153))
* Fixed cryptic error messages that appear when `gopls` commands fail. ([Issue 1237](https://github.com/golang/vscode-go/issues/1237))
* Fixed incomplete folding range info issue caused by parse errors. Complete fix requires `gopls` v0.6.7+ ([Issue 1224](https://github.com/golang/vscode-go/issues/1224))

### Code Health
* Updated LSP to 3.16.0 (stable), and DAP to 1.44.0.

## v0.23.0 - 4th Mar, 2021

A list of all issues and changes can be found in the
[v0.23.0 milestone](https://github.com/golang/vscode-go/milestone/21?closed=1)
and the [changes since v0.22.1](https://github.com/golang/vscode-go/compare/v0.22.1...v0.23.0)

### Enhancements

* Improved debugging workflow of attaching to local process.
([Issue 183](https://github.com/golang/vscode-go/issues/183))
By setting `processId` to the command name of the process, `${command:pickProcess}`, or
`${command:pickGoProcess}` a quick pick menu will show a list of processes to choose from.
* Enabled access to Delve DAP again. Simplified the Delve DAP launch workflow
and removed the intermediate Node.JS adapter.
If `"debugAdapter": "dlv-dap"` is specified in launch.json configurations,
the extension will use Delve DAP for the debug session. When using Delve DAP,
install the dev version of `dlv` built from master
(`cd; GO111MODULE=on go get github.com/go-delve/delve/cmd/dlv@master`)
to pick up the latest bug fixes and feature improvement.
([Issue 23](https://github.com/golang/vscode-go/issues/23),
[822](https://github.com/golang/vscode-go/issues/822),
[844](https://github.com/golang/vscode-go/issues/844))
* Added an opt-in "Always Update" setting for `gopls` auto-update.
([Issue 1095](https://github.com/golang/vscode-go/issues/1095))
* `Go: Reset Global State` and `Go: Reset Workspace State` commands are
available for easier extension state reset.
* Enabled survey to collect feedback from users who disabled `gopls`.
* Added a new setting (`"go.disableConcurrentTests"`) that prevents concurrent `go test` invocation.
([Issue 1089](https://github.com/golang/vscode-go/issues/1089))

### Fixes
* [Issue 1113](https://github.com/golang/vscode-go/issues/1113): error message when debugee terminates fast.
* [Issue 179](https://github.com/golang/vscode-go/issues/179): disable stackTrace error pop-ups during debugging.
* [CL 290289](https://go-review.googlesource.com/c/vscode-go/+/290289): check incorrect gopls flag usage before automated gopls crash report.
* [Issue 948](https://github.com/golang/vscode-go/issues/948): show lint tool's name as the lint diagnostic collection name.
* [Issue 1252](https://github.com/golang/vscode-go/issues/1252): search `C:\Program Files\Go\bin`,
`C:\Program Files (x86)\Go\bin\go.exe`, the new default Go installation path in Windows.

### Code Health

* Migrated to use `gts` to enforce consistent coding style. ([Issue 1227](https://github.com/golang/vscode-go/issues/1227))
* Preview mode features are available in both Nightly and the dev version.
* Enabled integration test in Go module mode.
* Enabled Delve DAP integration test.
* Removed the `latest` branch.
### Thanks

Thanks for your contributions, @Charliekenney23, @eneuschild, @suzmue, @stamblerre, @pjweinbgo, @polinasok!

## v0.22.1 - 8th Feb, 2021

### Enhancements
- Added error details to automated error reports. ([CL 287952](https://go-review.googlesource.com/c/vscode-go/+/287952))
- Used clickable links in `"go.languageServerExperimentalFeatures"` setting deprecation error messages. ([CL 288133](https://go-review.googlesource.com/c/vscode-go/+/288133))

### Fixes
- Fixed a race during language client restarts. ([CL 288372](https://go-review.googlesource.com/c/vscode-go/+/288372), [CL 288352](https://go-review.googlesource.com/c/vscode-go/+/288352))
- Disabled the language server when using workspace folders over ssh. ([Issue 1171](https://github.com/golang/vscode-go/issues/1171))
- Added `dlv` to the `"go.alternateTools"` example value list. ([CL 289231](https://go-review.googlesource.com/c/vscode-go/+/289231))

### Code Health
- Bumped `ini` to 1.3.8 to address a vulnerability report from `npm audit`.

### Thanks
Thank you for your contribution, @stamblerre, @hyangah, @patrasap0908!

## v0.22.0 - 26th Jan, 2021

- The language server, `gopls`, is enabled by default. ([Issue 1037](https://github.com/golang/vscode-go/issues/1037))

### Enhancements
- Added the new Go welcome page. ([Issue 949](https://github.com/golang/vscode-go/issues/949))
- Updated documentation. (troubleshooting, customization, settings guide)
- Updated the hardcoded latest gopls version to 0.6.4.

### Thanks
Thank you for your contribution, @suzmue, @stamblerre, @findleyr, @heschik, @hyangah!

## v0.21.1 - 21st Jan, 2021
A list of all issues and changes can be found in the [v0.21.1 milestone](https://github.com/golang/vscode-go/milestone/22?closed=1).

### Fixes
- Fixed the `Cannot get property 'get' of undefined` error. ([Issue 1104](https://github.com/golang/vscode-go/issues/1104))
- Restored the `"go.languageServerExperimentalFeatures"` setting for users who depend on this to run custom vet analyzers. ([Issue 1110](https://github.com/golang/vscode-go/issues/1110))

## v0.21.0 - 20th Jan, 2021

A list of all issues and changes can be found in the [v0.21.0 milestone](https://github.com/golang/vscode-go/milestone/16?closed=1).
### Enhancements
- The new `dlvFlags` debug attribute is available for conveniently supply extra flags to `dlv`. ([Issue 978](https://github.com/golang/vscode-go/issues/978))
- Stop using workspace/folder-level settings from untrusted repositories that can be used to run arbitrary binaries. ([Issue 1024](https://github.com/golang/vscode-go/issues/1094))
- The extension now deduplicates diagnostics from both the language server and the linter. ([Issue 142](https://github.com/golang/vscode-go/issues/142))
- Disabled `gotype-live` automatically when the language server is enabled. ([Issue 1021](https://github.com/golang/vscode-go/issues/1021))
- Removed the `"go.languageServerExperimentalFeatures"` setting. ([CL 280601](https://go-review.googlesource.com/c/vscode-go/+/280601)). The `documentLink` feature is replaced with `gopls`'s [`ui.navigation.importShortcut`](https://github.com/golang/tools/blob/master/gopls/doc/settings.md#importshortcut-enum) setting. The `diagnostics` feature replacement is still under discussion. Please provide feedback in [Issue 50](https://github.com/golang/vscode-go/issues/50).

### Code Health
* Experimental features that were available only in the nightly extension are enabled in the master branch, and in presubmit & CI tests running on the master branch.
### Thanks

Thank you for your contribution, @hyangah, @suzmue, @pjweinbgo, @stamblerre!

## v0.20.2 - 8th Jan, 2021

### Enhancement
- Updated [`"gopls"` settings](https://github.com/golang/vscode-go/blob/705272cba4001b8caf71a1542f376daa2e0be089/docs/settings.md#gopls-1) to match gopls v0.6.2. ([CL 279728](https://go-review.googlesource.com/c/vscode-go/+/279728))

## v0.20.1 - 29th Dec, 2020

### Fixes
- Fixed a bug that caused incorrect fallback to a common `go` installation path when `go` couldn't be found from the regular PATH ([Issue 1065](https://github.com/golang/vscode-go/issues/1065))

## v0.20.0 - 22nd Dec, 2020

A list of all issues and changes can be found in the [v0.20.0 milestone](https://github.com/golang/vscode-go/milestone/18?closed=1).

### Enhancements
- Debugging
    - The new `substitutePath` config property allows users to translate their symlinked directories to the actual paths, and
    the local paths to the remote paths. See [Launch Configurations](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#launch-configurations)
    and [Remote Debugging](https://github.com/golang/vscode-go/blob/master/docs/debugging.md#remote-debugging) for details.
    - Quick pick menu for creating `launch.json` was added. ([Issue 131](https://github.com/golang/vscode-go/issues/131))
    - Report that `next` is automatically cancelled by delve if interrupted, for example, because breakpoint is set. See [Issue 787](https://github.com/golang/vscode-go/issues/787) for details. ([CL 261078](https://go-review.googlesource.com/c/vscode-go/+/261078))
- The new `tyf` snippet for `type name func()` was added. ([Issue 1002](https://github.com/golang/vscode-go/issues/1002))
- Include the `gopls` settings section definition based on `gopls` v0.6.0. ([Issue 197](https://github.com/golang/vscode-go/issues/197), [CL 278355](https://go-review.googlesource.com/c/vscode-go/+/278355))
- `go.buildFlags` and `go.buildTags` are propagated to `gopls` unless `"gopls": {"buildFlags": ..}` is set. ([Issue 155](https://github.com/golang/vscode-go/issues/155))
- The new `go.toolsManagement.checkForUpdates` setting allows users to completely disable version checks.
This deprecates `go.useGoProxyToCheckForToolUpdates`. ([Issue 963](https://github.com/golang/vscode-go/issues/963))

### Fixes
- Added a workaround for [the VSCode `PATH` setup issue](https://github.com/microsoft/vscode/issues/108003). When `go` isn't
found from `PATH`, the extension will check `/usr/local/bin` too ([Issue 971](https://github.com/golang/vscode-go/issues/971)).
- Fixed language client crashes or duplicate language features on the guest side of a VS Live Share session.
The initial fix added in v0.19.0 for VS Live Share wasn't sufficient. (Issue [605](https://github.com/golang/vscode-go/issues/605), [1024](https://github.com/golang/vscode-go/issues/1024))
- Stop requiring to install legacy tools when the language server is used. ([Issue 51](https://github.com/golang/vscode-go/issues/51))
- Update `gopls` if the existing version in the system is older than the minimum required version when the extension enables `gopls` automatically. ([Issue 938](https://github.com/golang/vscode-go/issues/938))
- Show language server start progress and allow only one outstanding language server restart request. ([Issue 1011](https://github.com/golang/vscode-go/issues/1011))
- Fixed a gocode-gomod installation bug that caused to ignore `GOBIN` setting. ([CL 275877](https://go-review.googlesource.com/c/vscode-go/+/275877))
- Marked settings that are not applicable when using the language server. ([Issue 155](https://github.com/golang/vscode-go/issues/155))

### Code Health
- Deprecated unused settings such as `go.overwriteGoplsMiddleware` and marked deprecated settings.
- Improved stability of debug functionality tests on windows.
- Improve the automated gopls issue template message. It includes the extension name and version.
- Prompt users to file an issue for feedback when they choose to opt out of gopls.
- CI test workflow now runs `vsce package` to detect packaging errors early.

### Thanks
Thank you for your contribution, @hyangah, @suzmue, and @programmer04!


## v0.19.1 - 9th Dec, 2020

A list of all issues and changes can be found in the [v0.19.1 milestone](https://github.com/golang/vscode-go/milestone/17?closed=1).

### Fixes

- Fixed `Run without Debugging` for Windows. This was a regression found in v0.19.0 ([Issue 918](https://github.com/golang/vscode-go/issues/918)). <!-- CL 276214 -->
- Fixed snippets that used the reserved keyword ('var') as variable names ([Issue 969](https://github.com/golang/vscode-go/issues/969)).<!-- CL 276213 -->
- Fixed a file path expansion bug in subtest failure messages ([Issue 956](https://github.com/golang/vscode-go/issues/956)). <!-- CL 276212 -->
- Fixed unhandled promise rejection error in debug adapter ([Issue 982](https://github.com/golang/vscode-go/issues/982)). <!-- CL 274932 --> 

### Enhancements

- Disabled the experimental `godlvdap` debug configuration from the stable version. It is still available in [Go Nightly](https://marketplace.visualstudio.com/items?itemName=golang.go-nightly) ([Issue 960](https://github.com/golang/vscode-go/issues/960)).
- Enabled user survey ([Issue 910](https://github.com/golang/vscode-go/issues/910)). <!-- CL 276216 --> 

### Thanks

Thank you for your contribution, @suzmue, @RomanKornev, @hyangah!
 
## v0.19.0 - 25th Nov, 2020

A list of all issues and changes can be found in the [v0.19.0 milestone](https://github.com/golang/vscode-go/milestone/14).

### Community

- Go Nightly users are encouraged to discuss issues and share feedback in the [#vscode-go-nightly](https://gophers.slack.com/archives/C01DQ2KBMNU) slack channel as well as the newly created [Go Nightly mailing list](https://groups.google.com/g/vscode-go-nightly) ([Issue 817](https://github.com/golang/vscode-go/issues/817)) <!-- CL 266419 -->
- All experiments have been turned on for Go nightly ([Issue 818](https://github.com/golang/vscode-go/issues/818)) <!-- CL 264317 --> <!-- CL 267678 -->

### Enhancements

- Added a snippet for TestMain ([Issue 629](https://github.com/golang/vscode-go/issues/629)) <!-- CL 254497 -->
- Added `lispcase`, `pascalcase` and `keep` as transform variants for go.addTags ([Issue 906](https://github.com/golang/vscode-go/issues/906), [936](https://github.com/golang/vscode-go/issues/936)) <!-- CL 271357 -->
- Added support for `gomodifytags`'s --template flag ([Issue 826](https://github.com/golang/vscode-go/issues/826)) <!-- CL 264299 -->
- Language Server
	* Upgraded to the latest vscode-languageclient pre-release ([Issue 42148](https://github.com/golang/go/issues/42148)) <!-- CL 266497 -->
- Debugging
	* package.json: activate extension onDebugInitialConfigurations ([Issue 131](https://github.com/golang/vscode-go/issues/131)) <!-- CL 267899 -->


### Fixes

- Fixed test streaming output handling to correctly add -json flag ([Issue 471](https://github.com/golang/vscode-go/issues/471)) <!-- CL 268839 -->
- Fixed bug that unnecessarily buffered test output ([Issue 917](https://github.com/golang/vscode-go/issues/917)) <!-- CL 269917 -->
- Fixed a bug that occurred when choosing a new Go environment using the file picker ([Issue 868](https://github.com/golang/vscode-go/issues/868), [864](https://github.com/golang/vscode-go/issues/864)) <!-- CL 267898 -->
- Hide running test StatusBarItem after cancelling tests <!-- CL 268838 -->
- Tool Installation
	* Unset GOOS/GOARCH/GOROOT/... from tool installation env since the tools need to be built for the host machine ([Issue 628](https://github.com/golang/vscode-go/issues/628)) <!-- CL 264323 -->
	* Changed the dependency tool installation to use the `go` command chosen from the current `GOROOT/bin` for gocode-gomode too ([Issue 757](https://github.com/golang/vscode-go/issues/757)) <!-- CL 264318 -->
- Filter out unsupported document types to improve VS Code Live Share experience ([Issue 605](https://github.com/golang/vscode-go/issues/605)) <!-- CL 269157 -->
- Fixed language server survey computation error <!-- CL 270039 -->
- Debugging
	* No longer shows a warning about editing Go files if there is no Go Debug Session running. <!-- CL 269137 -->
	* Now removes user set '--gcflags' before passing the program to the debugger, since the debugger adds its own flags before building resulting in an error ([Issue 117](https://github.com/golang/vscode-go/issues/117)) <!-- CL 265580 -->
	* Fixed bug where the working directory passed in by the user is ignored ([Issue 918](https://github.com/golang/vscode-go/issues/918)) <!-- CL 270437 -->

### Code Health

- Debugging
	* Added additional tests for the debug adapter including for disconnect requests<!-- CL 262297 --> and remote attach scenarios ([Issue 779](https://github.com/golang/vscode-go/issues/779), [790](https://github.com/golang/vscode-go/issues/790)) <!-- CL 262442 -->
	* Added tests for the debug configuration to test the user settings that should affect the debug configuration
- Improved the extension contributor experience by renaming the test fixtures folder to avoid errors being shown for these files <!-- CL 264324 -->
- Language Server Tests
	- Changed the test environment setup to use single file edit ([Issue 655](https://github.com/golang/vscode-go/issues/655), [832](https://github.com/golang/vscode-go/issues/832)) <!-- CL 266418 --> <!-- CL 270802 --> <!-- CL 268878 -->
- Adjusted home directory used in gerrit CI since recent changes in kokoro were restricting access ([Issue 833](https://github.com/golang/vscode-go/issues/833)) <!-- CL 264877 -->
- Updated Github workflows actions/setup-go to v2 <!-- CL 268997 -->
- Restructured the goTest code to be more readable and easier to test <!-- CL 268837 --> <!-- CL 268839 -->
- Continued to improve the gopls settings documentation generator ([Issue 197](https://github.com/golang/vscode-go/issues/197)) <!-- CL 265742 -->


### Thanks

Thank you for your contribution, @pofl, @hyangah, @perrito666, @pjweinbgo, @quoctruong,  @stamblerre, @skaldesh, and @suzmue!

## v0.18.1 - 30th Oct, 2020

A list of all issues and changes can be found in the [v0.18.1 milestone](https://github.com/golang/vscode-go/milestone/15?closed=1).

### Enhancement
- New `Go: extract language server logs to editor` command was added ([CL 263526](https://go-review.googlesource.com/c/vscode-go/+/263526)).

### Fixes
- Fixed a bug that hid the Go status bar when there is no active text editor ([Issue 831](https://github.com/golang/vscode-go/issues/831)).

### Thanks
Thank you for your contributions, @suzmue, @pjweinbgo!

## v0.18.0 - 23rd Oct, 2020

Unified Go status UI ⚡, many debugger feature improvements, and LSP 3.16 features! A list of all issues fixed with this release can be found in the [v0.18.0 milestone](https://github.com/golang/vscode-go/milestone/11?closed=1).

### New Features
- The new Go status bar provides a menu to manage the go version, open the gopls trace, open the `go.mod` file, and more. The old `Go Modules` status bar was removed in favor of this new unified status bar. See [VS Code Go UI documentation](https://github.com/golang/vscode-go/blob/master/docs/ui.md) to learn more about this.
- New `Go: Toggle gc details` command toggles the display of compiler optimization choice for the open Go source file ([CL 256658](https://go-review.googlesource.com/c/vscode-go/+/256658)).
- Upgraded LSP to [`3.16`](https://microsoft.github.io/language-server-protocol/specifications/specification-3-16/#whatIsNew). Users of recent `gopls` can access new features such as [`Call hierarchy`](https://code.visualstudio.com/updates/v1_33#_call-hierarchy) and [`Semantic tokens`](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#semantic-token-provider).

### Enhancement

- Debugging:
  * Correctly presents the reason when the debugged program stops due to `panic` and `fatal error` ([Issue 648](https://github.com/golang/vscode-go/issues/649)).
  * Be explicit about conditional breakpoint support ([Issue 781](https://github.com/golang/vscode-go/issues/781)).
  * Debug Adapter logs all the environment variables passed to dlv when verbose logging is enabled.
- Language Server Client: sends `gopls` config as LSP initialization options for correct workspace symbols computation ([CL 259138](https://go-review.googlesource.com/c/vscode-go/+/259138)).
- Snippets: adds a placeholder for the `for` statement snippet ([Issue 734](https://github.com/golang/vscode-go/issues/734)).
- Excludes `vendor` directories from `go.inferGopath` disable mechanism ([Issue 301](https://github.com/golang/vscode-go/issues/301)).
- New `go.logging.level` setting allows extra logging to help debugging extension issues ([CL 256557](https://go-review.googlesource.com/c/vscode-go/+/256557)).
- For Nightly extension users, `Go: Show Survey Config` and `Go: Reset Survey Config` commands are available.

### Fixes
- Fixed the bug that caused the debug adapter to leave bogus null items in the map type variable presentation ([Issue 199](https://github.com/golang/vscode-go/issues/199)).
- Fixed several debug adapter bugs that caused remote debug to hang ([Issue 740](https://github.com/golang/vscode-go/issues/740), [766](https://github.com/golang/vscode-go/issues/766), [761](https://github.com/golang/vscode-go/issues/761), [764](https://github.com/golang/vscode-go/issues/764)).
- Restored the correct handling of language server configuration change when users opt for enabling language server and installing `gopls`. ([CL 258997](https://go-review.googlesource.com/c/vscode-go/+/258997)).
- Fixed a diagnostics error visualization issue when multiple files with errors are open ([Issue 743](https://github.com/golang/vscode-go/issues/743)).
- Changed the dependency tool installation to use the `go` command chosen from the current `GOROOT/bin`. This helps avoid using a different version of `go` command for `asdf` or `direnv` users ([Issue 757](https://github.com/golang/vscode-go/issues/757)).

### Documentation
- Documented the current limitation of symlink support in debugging ([CL 257204](https://go-review.googlesource.com/c/vscode-go/+/257204)), improved the instruction for CLI application debugging ([CL 259677](https://go-review.googlesource.com/c/vscode-go/+/259677)), and fixed syntax errors in example task configuration snippets ([CL 259077](https://go-review.googlesource.com/c/vscode-go/+/259077)).

### Code Health
- Added an initial set of tests for debug adapters ([Issue 137](https://github.com/golang/vscode-go/issues/137)). We will keep working to improve our test coverage.

### Thanks

Thank you for your contributions, @suzmue, @vologab, @amitlevy21, @danielhelfand, @egonk, @quoctruong, @polinasok, @pjweinbgo, @stamblerre, @hyangah!

## v0.17.2 - 29th Sep, 2020

### Fixes
- Fixed a regression caused by the change for ([Issue 679](https://github.com/golang/vscode-go/issues/679)).
If `go` is not found from `PATH` available to the extension, the extension tries a couple of well-known
default locations to find the `go` binary. In this case, we need to mutate `PATH` so other tools including
`gopls` or `dlv` can choose the same go version. ([Issue 713](https://github.com/golang/vscode-go/issues/713)).

## v0.17.1 - 28th Sep, 2020

### Enhancement
- Mutate the `PATH`/`Path` environment variable only if users
explicitly configure to select the go command using `go.goroot`,
`go.alternateTools`, or `Go: Choose Go Environment` menu.
([Issue 679](https://github.com/golang/vscode-go/issues/679))
- Includes sanitized gopls crash traces in the automated gopls crash report.
([CL 256878](https://go-review.googlesource.com/c/vscode-go/+/256878))

### Fixes
- Changed the default of `go.coverMode` to be `default`. ([Issue 666](https://github.com/golang/vscode-go/issues/666))
- Fixed a missing promise reject when go is not found. ([Issue 660](https://github.com/golang/vscode-go/issues/660))

Thank you for reporting issues!

## v0.17.0 - 18th Sep, 2020

Go code debugging and code coverage support is getting better.

The extension will help you stay updated with the new Go releases.

### New Features

- Delve's [call](https://github.com/go-delve/delve/tree/master/Documentation/cli#call) feature is now accessible.
To use this feature, explicitly specify the `call` command. E.g. `call myAwesomeFunc()`.
It is an experimental feature in Delve.
Please see [the current limitations](https://github.com/go-delve/delve/tree/master/Documentation/cli#call).
([Issue 100](https://github.com/golang/vscode-go/issues/100))
- The extension checks the go official download site and notifies users of
newly available Go versions. When a newer version is available,
`Go Update Available` status bar item will appear.
This feature is available only if `go.useGoProxyToCheckForToolUpdates`
is set true. ([Issue 483](https://github.com/golang/vscode-go/issues/483))
- The new `go.coverMode` setting allows to use different coverage modes
(`atomic`, `count`, `set (default)`). `go.coverShowCounts`,
`go.coverageDecorator.{coveredBorderColor, uncoveredBorderColor}`
were newly added. We are still investigating better ways to
visualize the `count` coverage data; feedback and contribution is welcome!
(Issue [256](https://github.com/golang/vscode-go/issues/256),
[594](https://github.com/golang/vscode-go/issues/594))

### Enhancement

- Expands `'~'` in the `cwd` attribute of the launch configuration.
([Issue 116](https://github.com/golang/vscode-go/issues/116))
- Debug config's `showGlobalVariables` is disabled by default, and
this change improves speed. You can still inspect the global
variables by registering them in the `WATCH` section, or by
configuring `showGlobalVariables` in `launch.json`.
([Issue 138](https://github.com/golang/vscode-go/issues/138))
- `gofumpt`, `gofumports` is added to recognized formatters list.
([Issue 587](https://github.com/golang/vscode-go/issues/587))
- Automatically restarts the language server if `go.toolsEnvVars` configuration is changed.
([CL 254370](https://go-review.googlesource.com/c/vscode-go/+/254370))
- Reports `go env` failures.
([Issue 555](https://github.com/golang/vscode-go/issues/555))

### Fixes
- Fixed to use absolute file paths in error messages appearing in the DEBUG OUTPUT.
This allows VS Code to locate the correct files.
([Issue 456](https://github.com/golang/vscode-go/issues/456))
- Fixed handling of absolute file paths in coverage profile, on windows.
([Issue 553](https://github.com/golang/vscode-go/issues/553))
- Changed to pass `GOROOT` when invoking the `gopkgs` tool so `gopkgs`
continues to work with different go versions without being recompiled.
([CL 254137](https://github.com/golang/vscode-go/blob/HEAD/ https://go-review.googlesource.com/c/vscode-go/+/254137))
- Fixed to provide explicit directory for running go list and go version.
([Issue 610](https://github.com/golang/vscode-go/issues/610),
CL [253600](https://github.com/golang/vscode-go/blob/HEAD/ https://go-review.googlesource.com/c/vscode-go/+/253600),
[253602](https://github.com/golang/vscode-go/blob/HEAD/ https://go-review.googlesource.com/c/vscode-go/+/253602))
- Fixed to trigger extension activation when commands for diagnostics,
such as `Go: Locate Configured Go Tools` are invoked.
([Issue 457](https://github.com/golang/vscode-go/issues/457))
- Fixed to prepend `GOROOT/bin` to integrated terminal's PATH
environment variable when `go.goroot` is set on OS X.
([Issue 544](https://github.com/golang/vscode-go/issues/544))
- Fixed to correctly apply environment variables setting read from `envFile`
in the launch configuration. We reworked how the environment variables
configuration is processed during this cycle. Now the extension processes
the `envFile` attribute instead of asking the debug adapter process to
read the specified `envFile`.
([Issue 452](https://github.com/golang/vscode-go/issues/452))
- Disabled `go.installDependenciesWhenBuilding` by default. When this is
enabled, the extension runs `go` commands with `-i`, which is no longer
recommended with recent versions of Go.
([Issue 568](https://github.com/golang/vscode-go/issues/568))
- Fixed a bug where we are not sending back 'configuration done' response.
([Issue [eclipse-theia/theia#8455](https://github.com/eclipse-theia/theia/issues/8455)](https://github.com/eclipse-theia/theia/issues/8455),
[CL 254959](https://go-review.googlesource.com/c/vscode-go/+/254959))

### Documentation

- Added new documentation about
[switching go versions](https://github.com/golang/vscode-go/blob/master/docs/go-version.md),
and settings for [standard library development](https://github.com/golang/vscode-go/blob/master/docs/stdlib.md).
- Improved debugging instruction and contribution guide. Enhanced automated settings documentation generation.

### Code Health

- Removed the obsolete string-type coverageDecorator support.
([Issue 519](https://github.com/golang/vscode-go/issues/519))
- When gopls integration tests fail, tests print the observed gopls traces
to help debugging.

### Experimental Features

- We plan to delegate computation of various `run test` CodeLenses to `gopls`.
This experimental feature can be enabled with the following setting:
```
"go.useLanguageServer": true,
"gopls": {
	"codelens": { "test": true }
}
```

### Thanks

Thank you for your contribution, @suzmue, @pjweinbgo, @ekulabuhov, @stamblerre, @tpbg, @FiloSottile, @findleyr, @quoctruong, @polinasok, @hyangah!

## v0.16.2 - 2nd Sep, 2020

### Fixed

- Fixed the compile error message parsing bug that prevented correct file name expansion in test output. ([Issue 522](https://github.com/golang/vscode-go/issues/522)).
- Fixed the regression that caused to run tests in the local directory mode and
  result in more verbose output than the package list mode. ([Issue 528](https://github.com/golang/vscode-go/issues/528)).
- Fixed `"go.alternateTools"` settings to accept any tool names without
  settings.json diagnostics warning. ([Issue 526](https://github.com/golang/vscode-go/issues/526))


## v0.16.1 - 5th Aug, 2020

### Fixed

- Fixed the bug that made test output verbose by default ([Issue 471](https://github.com/golang/vscode-go/issues/469)).
- Fixed the extension host crash bug due to a process-wide uncaught exception handler accidentally installed along with the inlined debug adapter. This crash bug also caused connection drops when used with the VS Code Remote extension ([Issue 467](https://github.com/golang/vscode-go/issues/467), [469](https://github.com/golang/vscode-go/issues/469)).
- Readded the predefined variable resolution support for `go.goroot` and `go.toolsEnvVars` ([Issue 464](https://github.com/golang/vscode-go/issues/464), [413](https://github.com/golang/vscode-go/issues/413)).

## v0.16.0 - 3rd Aug, 2020

This version requires VS Code 1.46+.

Older versions of VS Code will not receive updates any more.

### New Features

- Users can select/install a different version of Go with `Go: Choose Go Environment` command.
When clicking the `Go` status bar that displays the currently active Go version, users will be
prompted with the list of Go versions installed locally or available for download.
This feature was built based on the [`golang.org/dl`](https://pkg.go.dev/golang.org/dl?tab=overview)
tools.
The selected Go version applies to the workspace, takes precedence over the
system default or the `"go.goroot"` and `"go.alternateTools"` settings, and persists
across sessions. You can clear the choice by selecting the `Clear Selection` item.
([Issue 253](https://github.com/golang/vscode-go/issues/253))
- When the Go version changes, the extension prepends `$GOROOT/bin` to the `PATH` or `Path`
environment variable which then applies the change to the integrated terminal windows.
- This version includes an experimental version of the new Debug Adapter that uses Delve's
native DAP implementation. It currently supports `launch` type requests in `debug` or `test`
mode. This is still in the early stages and requires
[`dlv`](https://github.com/go-delve/delve) built from its unreleased, master
branch. Subscribe to
[golang/vscode-go#23](https://github.com/golang/vscode-go/issues/23) for updates.

### Enhancement

- Bundles the extension using webpack, which reduced the extension size
(4.7MB -> 1MB) and the extension loading overhead (3.4K files -> 3 files)
([Issue 53](https://github.com/golang/vscode-go/issues/53)).
- `Go: Apply Cover Profile` applies code coverage for multiple packages
([CL 238697](https://go-review.googlesource.com/c/vscode-go/+/238697)).
We fixed bugs in processing coverage profiles on Windows.
- Suggests the official Go download page when no `go` tool is found.
- Utilizes the `GOMODCACHE` environment variable, introduced in
[Go 1.15](https://tip.golang.org/doc/go1.15#go-command).
- Prevents multiple debug sessions from launching
([Issue 109](https://github.com/golang/vscode-go/issues/109)).
- Streams test output when tests run with the `-v` option.
This feature requires 1.14 or newer versions of Go
([Issue 316](https://github.com/golang/vscode-go/issues/316)).
- Sets `additionalProperties` to `false` for the settings that don't expect
more properties. This allows VS Code to handle these settings better in
its new settings GUI ([Issue 284](https://github.com/golang/vscode-go/pull/284)).
- `Go: Locate Configured Go Tools` includes `go env` results
([Issue 195](https://github.com/golang/vscode-go/issues/195)).
- Avoids prompting users to switch the default format tool in modules mode
if users enable the language server.

### Fixed

- Fixed the `PATH` environment variable adjustment when users use a wrapper as an alternate
tool for `go` ([CL 239697](https://go-review.googlesource.com/c/vscode-go/+/239697)).
- Fixed a bug in test output processing, which prevented VS code from linking test log messages with locations in the source file.
- Fixed a `gocode-gomod` installation bug when `GOPATH` includes multiple directories
([Issue 368](https://github.com/golang/vscode-go/issues/368)).
- Avoids attempting to kill already terminated processes ([Issue 334](https://github.com/golang/vscode-go/issues/334)).
- Fixed `godef` to locate standard packages correctly by passing the `GOROOT` environment variable.
- Fixed a `golangci-lint` integration bug that prevented displaying the lint results correctly when
linters like `nolintlint` are enabled ([Issue 411](https://github.com/golang/vscode-go/issues/411)).
- Fixed lost test function name arguments when running `Go: Test Previous`
([Issue 269](https://github.com/golang/vscode-go/issues/269)).

### Code Health

- Many enhancements to improve test reliability and test coverage were made during this dev cycle.
- TryBot is enabled, and the test results are posted to Gerrit CL. Currently, only the internal team members
can see the details of the test results, but we will continue working to make them public.
- Windows tests are now fixed and enabled in GitHub Action-based CI.
- Refactored code shared by the extension and the debug adapters to prevent accidental debug adapter breakages.
- Updated `json-rpc2` and `lodash` to address vulnerability reports from `npm audit`.

### Thanks

Thank you for your contribution, fujimoto kyosuke, OneOfOne, Aditya Thakral, Oleg Butuzov, Rebecca Stambler, Peter Weinberger, Brayden Cloud, Eli Bendersky, Robert Findley, Hana Kim!

## v0.15.2 - 21st July, 2020

### Fixed

- Do not fail tools installation when gocode is not already running ([Issue 355](https://github.com/golang/vscode-go/issues/355)).

## v0.15.1 - 7th July, 2020

### Enhancement

- Improved `gopls` error report suggestion and changed to send reports to the vscode-go issue tracker instead of the go issue tracker ([cl/240506](https://golang.org/cl/240506)). 

### Fixed

- Removed the `preview` note in the published extension ([Issue 273](https://github.com/golang/vscode-go/issues/273)).

## v0.15.0 - 29th June, 2020

### New Features

- The new command `Go: Subtest At Cursor` runs an individual subtest if the subtest's name is a simple string ([cl/235447](https://golang.org/cl/235447)).
- The new setting `go.trace.server` controls tracing between VS Code and the language server ([cl/232458](https://golang.org/cl/232458)). Unlike tracing using `gopls` [flags](https://github.com/golang/tools/blob/master/gopls/doc/troubleshooting.md#vs-code), this controls client-side tracing, and does not require to restart the server to change the value. This client-side trace is presented in the `gopls` output channel. The server-side trace has been moved to the new `gopls (server)` output channel ([cl/233598](https://golang.org/cl/233598)).
- There is now a new Go version status bar item. Clicking it currently only pops up the current `GOROOT`. We plan to add Go version switch, and other features using this status bar item.

### Enhancement

- `Go: Add Tags To Struct Fields` prompts transform parameter input if the setting `go.addTags.promptForTags` is true ([Issue 2546](https://github.com/microsoft/vscode-go/issues/2546)).
- `Go: Locate Go Tools` command output includes the `GOBIN` value. ([cl/235197](https://golang.org/cl/235197)).
- Improved debugging experience
    - The debug adapter automatically infers the mapping between remote and local paths for easy remote debugging ([cl/234020](https://golang.org/cl/234020), [Issue 45](https://github.com/golang/vscode-go/issue/45)).
    - The debug adapter handles errors that can occur during remote connection setup ([cl/237550](https://golang.org/cl/237550), [Issue 215](https://github.com/golang/vscode-go/issue/215)).
    - Failed watch expression evaluation no longer pops up error message windows. The error is visible in the watch window instead ([cl/236999](https://golang.org/cl/236999), [Issue 143](https://github.com/golang/vscode-go/issue/143)).
- Better language server integration
    - Restart the language server automatically when changes in its configuration or the language server version are detected ([cl/232598](https://golang.org/cl/232598), [cl/233159](https://golang.org/cl/233159)).
    - Prompts user to file an issue if `gopls` crashes ([cl/233325](https://golang.org/cl/233325)).
- `go.gopath`, `go.goroot`, `go.toolsGopath` are now [machine-overridable](https://code.visualstudio.com/api/references/contribution-points#Configuration-property-schema) ([cl/236539](https://golang.org/cl/236539), [Issue 2981](https://github.com/microsoft/vscode-go/issues/2981)).
- The extension does not mutate the `GOROOT` environment variable any more. `go.goroot` is used to select the `go` command under the specified directory ([Issue 146](https://github.com/golang/vscode-go/issue/146)).
- A redundant code action provider was removed when using the language server ([cl/239284](https://golang.org/cl/239284)).

### Fixed

- Fixed `gopls` version detection and upgrade logic when pre-release versions are involved ([cl/235524](https://golang.org/cl/235524)).
- Processes started with `Run > Run Without Debugging (^F5)` are now cleaned up when the run sessions end ([cl/236879](https://golang.org/cl/236879)).
- When `go.alternateTools.go` is set, the path to `$(go env GOROOT)/bin` is passed to underlying tools to ensure they use the same `go` version ([cl/239697](https://golang.org/cl/239697)).
- Now the extension avoids invoking buggy `pgrep` on mac OS ([cl/236538](https://golang.org/cl/236538), [Issue 90](https://github.com/golang/vscode-go/issues/90)).

### Code Health

- More test coverage
    - Added new tests for gopls update logic ([cl/233158](https://golang.org/cl/233158)), tools installation behavior ([cl/233557](https://golang.org/cl/233557)).
    - Fixed Build Tags checking tests ([cl/233517](https://golang.org/cl/233517)).
- Upgraded dependencies including websocket-extensions from 0.1.3 to 0.1.4 ([cl/228617](https://golang.org/cl/228617), [cl/236839](https://golang.org/cl/236839), [pr/3261](https://github.com/microsoft/vscode-go/pull/3261)).

### Thanks

Thank you for your contribution, Brayden Cloud, Bulent Rahim Kazanci, Eli Bendersky, Hana Kim, Polina Sokolova, Quoc Truong, Rebecca Stambler, Rohan Talip, Ryan Koski, Sean Caffery, Ted Silbernagel, Vincent Jo, and codekid!

## 0.14.4 - 8th June, 2020

This is the first version published with `golang` publisher ID. This version is functionally identical to 0.14.3 except the following modifications.

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Update documentation to reflect repository migration.

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Remove old telemetry code.

## 0.14.3 - 21st May, 2020

This is the last version published with `ms-vscode` publisher ID.

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Fix the bug introduced in the previous update where the code coverage does not disappear when edits to the file are saved.

## 0.14.2 - 14th May, 2020

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Allow debugging when having multiple versions of Go. Fixes [Bug 3152](https://github.com/Microsoft/vscode-go/issues/3152) with [PR 3159](https://github.com/Microsoft/vscode-go/pull/3159)
    * Fix bug introduced in the last update where there is no prompt to install/update `gopls`. Fixes [Bug 3194](https://github.com/Microsoft/vscode-go/issues/3194) with [PR 3197](https://github.com/Microsoft/vscode-go/pull/3197)
    * Avoid grouping pseudo imports into an import block. Fixes [Bug 1701](https://github.com/Microsoft/vscode-go/issues/1701) with [PR 3045](https://github.com/Microsoft/vscode-go/pull/3045)

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * When using the language server, drop support for disabling `format` and `highlight` features as these features have stabilized in `gopls`.
    Also fixes [Bug 2446](https://github.com/Microsoft/vscode-go/issues/2446) with [PR 3156](https://github.com/Microsoft/vscode-go/pull/3156) 
    * When language server is restarted using the `Go: Restart Language Server` command, respect any changes to the related settings.
    [PR 3186](https://github.com/Microsoft/vscode-go/pull/3186)

* [Mike Patnode (@mpatnode)](https://github.com/mpatnode)
    * Add note to use WSL 2 for debugging to work in Windows Subsystem for Linux. [PR 3167](https://github.com/Microsoft/vscode-go/pull/3167)

* [mo2zie (@stdupp)](https://github.com/stdupp)
    * Fix the `Go: Fill struct` to work correctly when file has multi byte characters. [PR 2611](https://github.com/Microsoft/vscode-go/pull/2611)

* [Kegsay @Kegsay](https://github.com/Kegsay)
    * Invalidate applied code coverage on file save instead of on file change. Fixes [Bug 2551](https://github.com/Microsoft/vscode-go/issues/2551) with [PR 2853](https://github.com/Microsoft/vscode-go/pull/2853)

* [Felipe Munhoz (@fnmunhoz)](https://github.com/fnmunhoz)
    * Allow setting breakpoints on a file from the module cache. [PR 3079](https://github.com/Microsoft/vscode-go/pull/3079)

* [@neclepsio](https://github.com/neclepsio)
    * Fix bug where gopls does not start behind a blocking proxy. Fixes [Bug 3204](https://github.com/Microsoft/vscode-go/issues/3204) with [PR 3205](https://github.com/Microsoft/vscode-go/pull/3205)

* [@polinasok](https://github.com/https://github.com/polinasok)
    * Improve the error message seen when debugging for "bad access". [PR 3196](https://github.com/Microsoft/vscode-go/pull/3196)

* [@tom-shan](https://github.com/tom-shan)
    * Fix placeholder in the debug configuration snippet for debugging single file. Fixes [Bug 3154](https://github.com/Microsoft/vscode-go/issues/3154) with [PR 3155](https://github.com/Microsoft/vscode-go/pull/3155)

## 0.14.1 - 15th April, 2020

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Update the version of `vscode-languageclient` being used to make use of all the upstream fixes. This changes the min version of the VS Code for
    upcoming updates of this extension to be 1.41. Older versions of VS Code will no longer receive any updates from this extension.

## 0.14.0 - 15th April, 2020
 
### Debugging improvements

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Fix the `Run: Start Without Debugging` command when using modules or when there is no launch.json file. Fixes [Bug 3121](https://github.com/Microsoft/vscode-go/issues/3121) with [PR 3125](https://github.com/Microsoft/vscode-go/pull/3125)

* [Quoc Truong (@quoctruong)](https://github.com/quoctruong)
    * Fix issue of breakpoints not being hit due to mismatch in the path separators in the file paths
    used by VS Code and the file paths returned by delve. Fixes [Bug 2010](https://github.com/Microsoft/vscode-go/issues/2010) with [PR 3108](https://github.com/Microsoft/vscode-go/pull/3108)
    * Show warning if `cwd` is not passed when remote debugging in `attach` mode. [PR 2999](https://github.com/Microsoft/vscode-go/pull/2999) 

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Add stacktrace dump and better error messages on EXC_BAD_ACCESS panics. Fixes [Bug 1903](https://github.com/Microsoft/vscode-go/issues/1903) with [PR 2904](https://github.com/Microsoft/vscode-go/pull/2904) 

* [@marcel-basel](https://github.com/marcel-basel)
    * When debugging with the `program` attribute in the debug configuration pointing to a file, debug
    just the file and not the entire package. This allows one to debug single files when a folder has multiple files with the `main` function. [Feature Request 1229](https://github.com/Microsoft/vscode-go/issues/1229) implemented with [PR 3016](https://github.com/Microsoft/vscode-go/pull/3016)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Show debug watch failures as warnings instead of errors to reduce the noise in debug console.
    Fixes [Bug 3006](https://github.com/Microsoft/vscode-go/issues/3006) with [commit 430362e](https://github.com/microsoft/vscode-go/commit/430362e2553680af91817d27e52bf9af12ae1824)
    * Use `go run .` instead of passing the current file to the `go run` command when the command `Run: Start Without Debugging` command is executed with the `program` attribute in the debug configuration pointing to a folder. Previously, this would result in errors for cases when the current file uses members from a separate file in the same pacakge. [Feature Request 3096](https://github.com/Microsoft/vscode-go/issues/3096) implemented with [commit 78518d7e](https://github.com/microsoft/vscode-go/commit/78518d7e9736670d75fe2cd648c7c3eb23413157)

* [polinasok](https://github.com/https://github.com/polinasok)
    * Use 'entry' as stopped event reason when stopping on entry.  [PR 3150](https://github.com/Microsoft/vscode-go/pull/3150)
    * Remove redundant support for thread events. [PR 3145](https://github.com/Microsoft/vscode-go/pull/3145)

### Other improvements

* [Carlton Henderson (@CarltonHenderson)](https://github.com/CarltonHenderson)
    * Fix issue of no linting warnings when using a custom output format with `golangci-lint`. [PR 3112](https://github.com/Microsoft/vscode-go/pull/3112)

* [Alexandre Vilain (@alexandrevilain)](https://github.com/alexandrevilain)
    * Retain last used cover profile path in the input box when using the command `Go: Apply Cover Profile`. [PR 3119](https://github.com/Microsoft/vscode-go/pull/3119) 

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Expand suspected relative file paths in test output only in case of error messages. Fixes [Bug 1836](https://github.com/Microsoft/vscode-go/issues/1836) with [commit 893b29bbf](https://github.com/microsoft/vscode-go/commit/893b29bbfed41a0baf711df2651ed6d1fe544483) & [commit 92d149c8](https://github.com/microsoft/vscode-go/commit/92d149c8dee8d1fc4bcc399af43c78c5b8a75214)

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Include link to `gopls` release notes when prompting to update the tool.
    * When using `gopls` with parameter hints is disabled , avoid showing the parameter hints after auto-completing a method. Fixes [Bug 3075](https://github.com/Microsoft/vscode-go/issues/3075) with [PR 3084](https://github.com/Microsoft/vscode-go/pull/3084)
    * New command `Go: Locate Configured Go Tools` that prints the location of the Go tools that this
    extension depends on

* [Zac Bergquist (@zmb3)](https://github.com/zmb3)
    * Fix the cancelling of stale processes on non Windows machines. [PR 3131](https://github.com/Microsoft/vscode-go/pull/3131) 

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Remove support for the language server from Sourcegraph. [PR 3127](https://github.com/Microsoft/vscode-go/pull/3127) 

## 0.13.1 - 27th February, 2020

* [Ilya Danilkin (@nezorflame)](https://github.com/nezorflame)
    * Use v2 of the `gopkgs` tool to avoid the error in tool installation. Fixes [Bug 3050](https://github.com/Microsoft/vscode-go/issues/3050) with [PR 3057](https://github.com/Microsoft/vscode-go/pull/3057)

* [Hyang-Ah Hana Kim (@hyangah)](https://github.com/hyangah)
    * Stop tools listed in the `go.alternateTools` setting from appearing in the drop down resulting
    from the `Go: Install/Update Tools` command. Fixes [Bug 3024](https://github.com/Microsoft/vscode-go/issues/3024) with [PR 3046](https://github.com/Microsoft/vscode-go/pull/3046)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Ensure users on versions older than 0.3.1 of `gopls` get prompted to update the language server.

## 0.13.0 - 3rd February, 2020

* [Henry Kwan (@piengeng)](https://github.com/piengeng)
    * The outline feature now shows constants different from variables, and interfaces different from types. [PR 2973](https://github.com/Microsoft/vscode-go/pull/2973)

* [@marcel-basel](https://github.com/marcel-basel)
    * The `Go: Generate Unit Tests For Function` commands now respects the receiver type and generate tests only for
    current function instead of all functions that match the name. Fixes [Bug 2282](https://github.com/Microsoft/vscode-go/issues/2282) with [PR 2987](https://github.com/Microsoft/vscode-go/pull/2987)
    * Use `GOBIN` to look for the installed Go tools as well. Fixes [Bug 2122](https://github.com/Microsoft/vscode-go/issues/2122) with [PR 3001](https://github.com/Microsoft/vscode-go/pull/3001)

* [Tobias Salzmann (@Eun)](https://github.com/Eun)
    * A new command `Go: Apply Cover Profile` to apply code coverage decorators from a custom cover profile. [Feature Request 1596](https://github.com/Microsoft/vscode-go/issues/1596) implemented with [PR 2361](https://github.com/Microsoft/vscode-go/pull/2361)

* [@SteelPhase](https://github.com/SteelPhase)
    * The `envFile` in the debug configuration now supports configuring multiple env files. [Feature Request 1746](https://github.com/Microsoft/vscode-go/issues/1746) implemented with [PR 2395](https://github.com/Microsoft/vscode-go/pull/2395)

* [Drake Gens (@drakegens)](https://github.com/drakegens)  
    * Skip attempts to toggle the test file after generating unit tests for functions in a test file. Fixes [Bug 2822](https://github.com/Microsoft/vscode-go/issues/2822) with [PR 2883](https://github.com/Microsoft/vscode-go/pull/2883)

* [Jakub Warczarek (@programmer04)](https://github.com/programmer04)
    * Improve the code snippet for the for loop by replacing `index` with `i`. [Feature Request 2943](https://github.com/Microsoft/vscode-go/issues/2943) implemented with [PR 3010](https://github.com/Microsoft/vscode-go/pull/3010)

## 0.12.0 - 31st December, 2019

### Language server updates

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * The setting `go.languageServerExperimentalFeatures` which allows you to disable experimental features from the
    language server has been trimmed the features that can be thus disabled to the below as rest of the features are
    deemed to be stable.
        - format
        - documentLink
        - diagnostics
    * Fix error "Cannot read property 'clear' of undefined" that appears on running the command `Restart language server` if the language server had not started successfully. 
     

### New features

* [Oleg Kovalov (@cristaloleg)](https://github.com/cristaloleg)
    * New setting `go.coverOnSingleTestFile` to enable applying code coverage resulting from running all tests in current file either using
    the code lens `run file tests` or the command `Go: Test File`. [Feature Request 2873](https://github.com/Microsoft/vscode-go/issues/2873) implemented with [PR 2884](https://github.com/Microsoft/vscode-go/pull/2884)

* [C S Madhav (@csmadhav)](https://github.com/csmadhav)
    * Add the option `Don't show again` to the warning that appears on saving changes to files when in the midst of debugging. [Feature Request 2880](https://github.com/Microsoft/vscode-go/issues/2880) implemented with [PR 2906](https://github.com/Microsoft/vscode-go/pull/2906)

* [Zac Bergquist (@zmb3)](https://github.com/zmb3)
    * Activate the Go extension when the workspace contains Go files rather than wait for a Go file to be opened. [Feature Request 2821](https://github.com/Microsoft/vscode-go/issues/2821) implemented with [PR 2859](https://github.com/Microsoft/vscode-go/pull/2859)

* [Nisheet Sinvhal (@Ashniu123)](https://github.com/Ashniu123)
    * Use tags and options specified in the `go.addTags` and `go.removeTags` settings as placeholders in the input boxes that appear when running the `Go: Add Tags To Struct Fields` and `Go: Remove Tags From Struct Fields` commands. [Feature Request 2929](https://github.com/Microsoft/vscode-go/issues/2929) implemented with [PR 2944](https://github.com/Microsoft/vscode-go/pull/2944)

### Others

* [Ryan Boehning (@y0ssar1an)](https://github.com/y0ssar1an)
    * Update travis.yml with latest VM and improve time taken during cloning step. For more details, see [PR 2915](https://github.com/Microsoft/vscode-go/pull/2915)

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Update package dependencies. [PR 2900](https://github.com/Microsoft/vscode-go/pull/2900)

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Fix issues with installing single tools when using the `Go: Install/Update Tools` command. Fixes [Bug 2936](https://github.com/Microsoft/vscode-go/issues/2936) with [PR 2945](https://github.com/Microsoft/vscode-go/pull/2945) and [PR 2948](https://github.com/Microsoft/vscode-go/pull/2948)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Ensure the build tags from `go.buildTags` and `go.testTags` are respected by the `Go: Debug Test At Cursor` command. Fixes [Bug 2953](https://github.com/Microsoft/vscode-go/issues/2953) with [commit d6b6668](https://github.com/microsoft/vscode-go/commit/d6b666873a7fd75916dca77fa2bb0139d8f17c8f)
    * Ensure that test arguments passed to `go.testFlags` are treated as arguments and not build flags by delve when debugging tests. Fixes [Bug 2115](https://github.com/Microsoft/vscode-go/issues/2115) with [commit 9ab7b8bff](https://github.com/microsoft/vscode-go/commit/9ab7b8bff49c38830ae4625718f605ba73fec0dc)



## 0.11.9 - 5th November, 2019

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Run `go mod tidy` before installing tools to fix [Bug 2886](https://github.com/Microsoft/vscode-go/issues/2886) with [PR 2877](https://github.com/Microsoft/vscode-go/pull/2877)


## 0.11.8 - 5th November, 2019

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre) & [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Use Go proxy to check if user has an older version of `gopls` and prompt to update accordingly. 
    This can be disabled using the new setting `go.useGoProxyToCheckForToolUpdates`.
    
* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre) 
    * Support installing Go tools in module mode when using Go 1.11. Previously, this worked only in Go 1.12 and above
    * Clear diagnostics when language server restarts to avoid linger errors from the previous run.
    * Enable the `Go to Implementation` feature when using the language server.

* [Aravind (@scriptonist)](https://github.com/scriptonist)
    * Fixes [Bug 2260](https://github.com/Microsoft/vscode-go/issues/2260) with [PR 2285](https://github.com/Microsoft/vscode-go/pull/2285)
    where extension failed to run tests if `-run` was part of the user provided test flags

* [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr)
    * Add flag `highlight` to `go.languageServerExperimentalFeatures` setting to allow disabling of the highlighting feature from language server. Fixes [Bug 2664](https://github.com/Microsoft/vscode-go/issues/2664) with [PR 2833](https://github.com/Microsoft/vscode-go/pull/2833)
    * Distinguish between arrays with `nil` value and zero length. Fixes [Bug 2813](https://github.com/Microsoft/vscode-go/issues/2813) with [PR 2839](https://github.com/Microsoft/vscode-go/pull/2839)
    * Sort standard library packages before others in the drop down result of the `Go: Add Import` command. [Feature Request 2683](https://github.com/Microsoft/vscode-go/issues/2683) implemented with [PR 2803](https://github.com/Microsoft/vscode-go/pull/2803)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * In Go 1.13, GO111MODULE with value `auto` inside the GOPATH now looks at the presence of go.mod file to determine module mode.
    Updated our debug adapter similarly to recognize module mode. Fixes [Bug 2828](https://github.com/Microsoft/vscode-go/issues/2828) with [PR 2846](https://github.com/Microsoft/vscode-go/pull/2846) 

* [Roman Levin (@romanlevin)](https://github.com/romanlevin) 
    * Fix the placeholder text when extracting method. [PR 2799](https://github.com/Microsoft/vscode-go/pull/2799)

* [Ilya Danilkin (@nezorflame)](https://github.com/nezorflame)
    * Updated links to `gopls` wiki and added link to recommended VS Code settings when using `gopls`. [PR 2852](https://github.com/Microsoft/vscode-go/pull/2852)

### Engineering improvements

* [Kegsay @Kegsay](https://github.com/Kegsay) & [Zac Bergquist (@zmb3)](https://github.com/zmb3)
    * Enable more rules via tslint.

* [Marcus Farkas (@ToothlessGear)](https://github.com/ToothlessGear)
    * Re-enable linux tests in travis runs.

* [Julio C. Ramos (@ramosisw)](https://github.com/ramosisw)
    * Use the new template for bug reports. [PR 2840](https://github.com/Microsoft/vscode-go/pull/2840)


## 0.11.7 - 27th September, 2019

### Bug Fixes

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)

    - Fix for [bug 2766](https://github.com/microsoft/vscode-go/issues/2766) where the `Go: Test All Packages In Workspace` command failed to run tests since the last update.
    - Fix for [bug 2765](https://github.com/microsoft/vscode-go/issues/2765) where the `Go: Build Workspace` command failed to run the build command since the last update
    - Fix for [bug 2770](https://github.com/microsoft/vscode-go/issues/2770) where failure to find the path to the go binary results in `gopls` results in the extension throwing error & not working as expected since the last update
    - Use `go vet .` instead of `go vet ./...` when vetting current package for better performance.

* [Quoc Truong (@quoctruong)](https://github.com/quoctruong)

    - Fix for bug where remote debugging failed if the configured remote path was just `/`. Fixes [Bug 2119](https://github.com/Microsoft/vscode-go/issues/2119) with [PR 2794](https://github.com/Microsoft/vscode-go/pull/2794)

* [Joel Hendrix (@jhendrixMSFT)](https://github.com/jhendrixMSFT)

    - Respect the `stopOnEntry` debug configuration by providing a dummy thread when no threads exist. Fixes [Bug 763](https://github.com/Microsoft/vscode-go/issues/763) with [PR 2762](https://github.com/Microsoft/vscode-go/pull/2762)

## 0.11.6 - 21st September, 2019

* The prompt to update your `gopls` that was introduced in the previous update, relied on making calls to https://proxy.golang.org.
In this patch release, we replace such calls with a check against a known hard-coded value for the latest version of `gopls`. Details on the next steps here are captured in the [issue 2776](https://github.com/microsoft/vscode-go/issues/2776)

## 0.11.5 - 19th September, 2019

### Debugging improvements
* [Quoc Truong (@quoctruong)](https://github.com/quoctruong)
    * Fix the bug where setting breakpoint fails if the remote program is started through dlv with --continue switch. [Bug 2690](https://github.com/Microsoft/vscode-go/issues/2690)
    * Fix the bug where disconnecting (after attaching to) the remote program terminates it [Bug 2592](https://github.com/Microsoft/vscode-go/issues/2592)
    * Fix the bug where setting breakpoint will fail if a breakpoint already exists (if dlv is started through multi client and another client sets the breakpoint).

* [Hary Prabowo Suryoatmojo (@haryps)](https://github.com/haryps)
    * Show a warning if an edit to a Go file is saved when a debug session is active. Fixes [Bug 2559](https://github.com/Microsoft/vscode-go/issues/2559) with [PR 2653](https://github.com/Microsoft/vscode-go/pull/2653)

### Tooling improvements

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Use the `latest` tag on `gopls` when installing instead of the master branch. Prompt to update `gopls` if you have an older version. [PR 2719](https://github.com/Microsoft/vscode-go/pull/2719)
    * Install the Go tools in module mode if supported. [PR 2700](https://github.com/Microsoft/vscode-go/pull/2700)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * `gopls` can now be used when using Go from the tip
    * A new status bar item "Go Modules" will show up when the extension has determined that modules are being used.
    On clicking, this will take you to the wiki page for [Go modules support in VS Code](https://github.com/microsoft/vscode-go/wiki/Go-modules-support-in-Visual-Studio-Code)

* [Nurbol Alpysbayev (@anurbol)](https://github.com/anurbol)
    * Allow the use of `go.alternateTools` setting to provide an alternative for `gopls`. [PR 2660](https://github.com/Microsoft/vscode-go/pull/2660)

## 0.11.4 - 9th July, 2019

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Revert marking `go.goroot` setting to be of scope `machine` in order to support it to be configured at worksapce level. More in this is discussed at [2576](https://github.com/microsoft/vscode-go/issues/2576).
    * Support custom arguments when running tests by passing them after `-args` in `go.testFlags` setting. Fixes [Bug 2457](https://github.com/microsoft/vscode-go/issues/2457) 

* [James George (@jamesgeorge007)](https://github.com/jamesgeorge007)
    * Update README to contain Table of Contents. [PR 2634](https://github.com/Microsoft/vscode-go/pull/2634)


## 0.11.2 - 5th July, 2019

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Mark only `go.goroot` and not `go.gopath`, `go.toolsGopath` setting to be of scope `machine` in order to support the latter two to be configured at worksapce level. More in this is discussed at [2576](https://github.com/microsoft/vscode-go/issues/2576).

* [Daniel Mundt (@dmundt)](https://github.com/dmundt)
    * Update the banner color to have a beter color contrast witht he new logo in the marketplace. [PR 2631](https://github.com/Microsoft/vscode-go/pull/2631)

## 0.11.1 - 2nd July, 2019

### Bug Fixes

* [Daniel Mundt (@dmundt)](https://github.com/dmundt)
    * Update the extension to use new Go logo! [PR 2582](https://github.com/Microsoft/vscode-go/pull/2582)

* [Cooper Maruyama (@coopermaruyama)](https://github.com/coopermaruyama)
    * The values in the `go.testEnvVars` setting should override the ones in the file specified in the `go.testEnvFile` setting rather than the other way around. Fixes [Bug 2398](https://github.com/Microsoft/vscode-go/issues/2398) with [PR 2585](https://github.com/Microsoft/vscode-go/pull/2585)

* [Benjamin Kane (@bbkane)](https://github.com/bbkane)
    * Add link to all the code snippets provided by the extension in the README. [PR 2603](https://github.com/Microsoft/vscode-go/pull/2603)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support the `output` attribute in the debug configuration when `mode` is set to `test`. Fixes [Bug 2445](https://github.com/Microsoft/vscode-go/issues/2445) with [commit 373f0743](https://github.com/microsoft/vscode-go/commit/373f07436b81da8f0da5696e53f29f4b2a50c069) 
    * Fix bug that got introduced in the previous update where nested variables show empty values when debugging. Fixes [Bug 2601](https://github.com/Microsoft/vscode-go/issues/2601) with [commit e89118e42](https://github.com/microsoft/vscode-go/commit/e89118e42ba581453f3a5587840fef915b74db68)
    * Warnings regarding the inability to find the go binary in the PATH environment variable now includes the value of the PATH being checked.
    * The prompt to choose `goimports` instead of the default `goreturns` as the formatting tool when using modules without the language server, now
    has the option to not be shown again for cases when you don't want to use `goimports`. Fixes [Bug 2578](https://github.com/Microsoft/vscode-go/issues/2578) with [commit 658db8d4](https://github.com/microsoft/vscode-go/commit/658db8d45f3a38eafcf536e73326ad98946c133c)
    * Avoid unwanted prompt to re-compile tools when current goroot is different from the previous only in terms of casing. Fixes [Bug 2606](https://github.com/Microsoft/vscode-go/issues/2606) with [commit b0a2d2d](https://github.com/microsoft/vscode-go/commit/b0a2d2debb5c1e32f09184060572cb86ad900a81)
    * Preserve text highlighting as part of code coverage in multiple editor groups. Fixes [Bug 2608](https://github.com/Microsoft/vscode-go/issues/2608) with [commit 0de7e94e](https://github.com/microsoft/vscode-go/commit/0de7e94e4d313b06ab63dcd484aa85405941e771)
    * Update code coverage decorators in the visible editor immediately after corresponding setting is changed rather than wait for focusing on the editor. [commit 86df86fd6](https://github.com/microsoft/vscode-go/commit/86df86fd65b9c360b033c4b58af6fd8c0125c17e)
    * Mark `go.goroot`, `go.gopath` and `go.toolsGopath` settings to be of scope `machine` as per upstream request
    [2576](https://github.com/microsoft/vscode-go/issues/2576) from VS Code to better support remote scenarios.

## 0.11.0 - 17th June, 2019

* [@BetaXOi](https://github.com/BetaXOi) & [Joel Hendrix (@jhendrixMSFT)](https://github.com/jhendrixMSFT)
    * When debugging, support attaching to a local Go process and detaching gracefully without killing the process.
    This uses the [attach](https://github.com/go-delve/delve/blob/master/Documentation/usage/dlv_attach.md) command 
    [delve](https://github.com/go-delve/delve). [Feature Request 1599](https://github.com/Microsoft/vscode-go/issues/1599) implemented with [PR 2125](https://github.com/Microsoft/vscode-go/pull/2125).

    Please note the feature of attaching to a local process using process id only works when the process is started by running the compiled code i.e the executable and not by using the command `go run`. This is a limitation from delve.

* [@SteelPhase](https://github.com/SteelPhase)
    * A new command `Go: Restart Language Server` to restart the language server which previously was possible only by reloading the VS Code window. [Feature Request 2500](https://github.com/Microsoft/vscode-go/issues/2500) implemented with [PR 2530](https://github.com/Microsoft/vscode-go/pull/2530)

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Enable diagnostics feature from `gopls` by default and add the feature to provide to clickable Godoc links for import statements. [PR 2518](https://github.com/microsoft/vscode-go/pull/2518)

* [Ian Cottrell (@ianthehat)](https://github.com/ianthehat)
    * Add a new option `incrementalSync` to `go.languageServerExperimentalFeatures` setting. If true, the language server will accept incremental document synchronization. [PR 2493](https://github.com/Microsoft/vscode-go/pull/2493)

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Fix issues with signature help getting triggered at wrong times. Fixes [Bug 2481](https://github.com/Microsoft/vscode-go/issues/2481) with [PR 2496](https://github.com/Microsoft/vscode-go/pull/2496)

* [Caleb Doxsey (@calebdoxsey )](https://github.com/calebdoxsey)
    * Improve syntax highlighting in `go.mod` files. Fixes [Bug 2423](https://github.com/Microsoft/vscode-go/issues/2423) with [PR 2424](https://github.com/Microsoft/vscode-go/pull/2424)

* [@tamayika](https://github.com/tamayika)
    * Resolve `${workspaceRoot}` and `${workspaceFolder}` for the `-vetTtool` flag provided in `go.vetFlags` setting. [Feature Request 2527](https://github.com/Microsoft/vscode-go/issues/2527) implemented with [PR 2528](https://github.com/Microsoft/vscode-go/pull/2528)

* [John (@pseudo-su)](https://github.com/pseudo-su)
    * Resolve `${workspaceRoot}` and `${workspaceFolder}` for the values provided to the `go.alternateTools` setting. [Feature Request 2543](https://github.com/Microsoft/vscode-go/issues/2543) implemented with [PR 2544](https://github.com/Microsoft/vscode-go/pull/2544)

* [Stuart Grigg (@stuartgrigg)](https://github.com/stuartgrigg)
    * Improve linting in the vscode-go project. [PR 2524](https://github.com/Microsoft/vscode-go/pull/2524) and [PR 2568](https://github.com/Microsoft/vscode-go/pull/2568)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Ensure Go binary is in the PATH when running Go tools. Fixes [Bug 2514](https://github.com/Microsoft/vscode-go/issues/2514) with [commit d93a0aec](https://github.com/microsoft/vscode-go/commit/d93a0aec2a1a57e820cff3a9511cedbc7f13b61c)
    * Use `gotype-live` to provide diagnostics as you type only when the user is not using `gopls` and is not in module mode. This is because `gopls` supports this feature out of the box and the tool doesnt support modules. Fixes [Bug 1950](https://github.com/Microsoft/vscode-go/issues/1950) with [commit d1bf95c5](https://github.com/microsoft/vscode-go/commit/d1bf95c51d4bf3e730689045ef8c78de85d21152)


## 0.10.2 - 30th April, 2019

This patch release has fixes for the below bugs
- [Bug 2469](https://github.com/Microsoft/vscode-go/issues/2469): When the setting `go.autocompleteUnimportedPackages` is enabled,
packages show up in completion list when typing `.` after a variable or existing package.
- [Bug 2473](https://github.com/Microsoft/vscode-go/issues/2473): Adding of missing imports and removal of unused imports don't work on saving file after using `gopls`.

## 0.10.1 - 25th April, 2019

This patch release has fixes for the below bugs

- [Bug 2459](https://github.com/Microsoft/vscode-go/issues/2459): `gopls` crashes when `-trace` is set in the `go.languageServerFlags` setting
- [Bug 2461](https://github.com/Microsoft/vscode-go/issues/2461): Extension uses high CPU due to being stuck in an infinite loop when `go.useLanguageServer` is set to `true`, but no language server can be found
- [Bug 2458](https://github.com/Microsoft/vscode-go/issues/2458): Reference to GOPATH when dependent tools are missing misleads users to think that they need GOPATH for the extension to work


## 0.10.0 - 23rd April, 2019

### Go Modules support improvements

* [Caleb Doxsey (@calebdoxsey )](https://github.com/calebdoxsey)
    * Add grammar for `go.mod` and `go.sum` files, thus providing syntax highlighting for them. [Feature Request 1886](https://github.com/Microsoft/vscode-go/issues/1886) implemented with [PR 2344](https://github.com/Microsoft/vscode-go/pull/2344)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
  * Support `gopls`, the language server from Google as the one from Sourcegraph is no longer under active development. Also because `gopls` supports Go modules. [PR 2383](https://github.com/Microsoft/vscode-go/pull/2383). Please read our [updated README on language servers](https://github.com/Microsoft/vscode-go/tree/8ea6e4708dfd141ab65b4c7eb4f71e55d098a222#go-language-server-experimental) for the latest on what we recommend.
  * Use `goimports` for formatting when using Go modules without the language server because `goreturns`(the default formatting tool) doesn't work with modules yet. Fixes [Bug 2309](https://github.com/Microsoft/vscode-go/issues/2309)
  * Fix build on save, install and debug features when `GO111MODULE` is set to `on` inside the GOPATH. Fixes [Bug 2238](https://github.com/Microsoft/vscode-go/issues/2238) with [commit 15f571e4](https://github.com/Microsoft/vscode-go/commit/15f571e490e35a4c531aca6585aae7d07dfaae93)
    

### New features

* [Aswin M Prabhu (@aswinmprabhu)](https://github.com/aswinmprabhu)
    * Refactor commands to extract functions and variables using [godoctor](https://github.com/godoctor/godoctor). [Feature Request 588](https://github.com/Microsoft/vscode-go/issues/588) implemented with [PR 2139](https://github.com/Microsoft/vscode-go/pull/2139)
        - `Go: Extract to function`
        - `Go: Extract to variable`


### Debugging improvements

* [Vlad Barosan (@vladbarosan)](https://github.com/vladbarosan)
    * Fix issue of debug file not being cleared after debugging on Windows. Fixes [Bug 2265](https://github.com/Microsoft/vscode-go/issues/2265) with [PR 2332](https://github.com/Microsoft/vscode-go/pull/2332)

* [Joel Hendrix (@jhendrixMSFT)](https://github.com/jhendrixMSFT)
    * Fix variable display when debugging when the name has `-` in it. Fixes [Bug 2328](https://github.com/Microsoft/vscode-go/issues/2328) with [PR 2320](https://github.com/Microsoft/vscode-go/pull/2320)

* [Alex Schade (@aschade92)](https://github.com/aschade92)
    * You can now control whether global variables are shown or not in the variable pane while debugging by tweaking the `showGlobalVariables` property in the `go.delveConfig` setting. [Feature Request 2323](https://github.com/Microsoft/vscode-go/issues/2323) implemented with [PR 2351](https://github.com/Microsoft/vscode-go/pull/2351)



### Others

* [Filippo Valsorda (@FiloSottile)](https://github.com/FiloSottile) & [Vlad Barosan (@vladbarosan)](https://github.com/vladbarosan)
    * Avoid prompts to re-compile Go tools when the `go.toolsGopath` is different between workspaces. [PR 1589](https://github.com/Microsoft/vscode-go/pull/1589)

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Avoid moving to the next parameter in the Signature Help feature, when provided parameter value is a string with commas. Fixes [Bug 1682](https://github.com/Microsoft/vscode-go/issues/1682) with [PR 1738](https://github.com/Microsoft/vscode-go/pull/1738)
    * Improvements to the README for the debug adapter that provides information on how to debug the debug adapter. [PR 2341](https://github.com/Microsoft/vscode-go/pull/2341)
    * Add module definitions for test fixtures. [PR 2306](https://github.com/Microsoft/vscode-go/pull/2306)

* [Sardorbek (@oneslash)](https://github.com/oneslash)
    * Remove support for older versions of Go. Fixes [Bug 1026](https://github.com/Microsoft/vscode-go/issues/1026) with [PR 2319](https://github.com/Microsoft/vscode-go/pull/2319)
    * Fix auto-completion when there is a string with `//` in the same line before the current position. Fixes [Bug 2240](https://github.com/Microsoft/vscode-go/issues/2240) with [PR 2316](https://github.com/Microsoft/vscode-go/pull/2316)

* [Edouard SCHWEISGUTH (@Edznux)](https://github.com/Edznux)
    * Fix single quotes uses for JSON examples in setting descriptions. [PR 2036](https://github.com/Microsoft/vscode-go/pull/2036)

* [Utsob Roy (@uroybd)](https://github.com/uroybd)
    * Improve the snippet for anonymous go function. [PR 2354](https://github.com/Microsoft/vscode-go/pull/2354)

* [Chris Broadfoot (@broady)](https://github.com/broady)
    * Improve documentation usage of VS Code commands in README. Fixes [Bug 2385](https://github.com/Microsoft/vscode-go/issues/2385) with [PR 2390](https://github.com/Microsoft/vscode-go/pull/2390)

* [Jackson Kearl (@JacksonKearl)](https://github.com/JacksonKearl) & [Vlad Barosan (@vladbarosan)](https://github.com/vladbarosan)
    * Use the latest apis for the Outline feature. [Feature Request 1772](https://github.com/Microsoft/vscode-go/issues/1772) implemented with [PR 1795](https://github.com/Microsoft/vscode-go/pull/1795)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Clean up the temporary directory created by the Go extension when VS Code window is closed. Fixes [Bug 2188](https://github.com/Microsoft/vscode-go/issues/2188) with [commit 4a241f80](https://github.com/Microsoft/vscode-go/commit/4a241f806809465afa7085a3f62729ff37fa63cd)
    * Show the start of on save features in the output panel. Fixes [Bug 1869](https://github.com/Microsoft/vscode-go/issues/1869) with [commit 058eccf17](https://github.com/Microsoft/vscode-go/commit/058eccf17f1b0eebd607581591828531d768b98e)
    * Ignore `GOBIN` when user has set `go.toolsGopath` setting. Fixes [Bug 2339](https://github.com/Microsoft/vscode-go/issues/2339) with [commit 9f99c30](https://github.com/Microsoft/vscode-go/commit/9f99c306e00209a221abc1962c4f419565141ffb)
       

## 0.9.2 - 12th February, 2019

* When the program being debugged closes naturally, avoid showing the error from delve when trying to halt it. Fixes [Bug 2313](https://github.com/Microsoft/vscode-go/issues/2313) with [commit fd5a488c2](https://github.com/Microsoft/vscode-go/commit/fd5a488c2d73d27cbe3ce9f32be8bd0b586ef108)

## 0.9.1 - 6th February, 2019

* Fix regression where benchmarks get run without the -bench flag

## 0.9.0 - 6th February, 2019

### Debugging improvements

* [@xiphon](https://github.com/xiphon)
    * Fix the Pause command. Fixes [Bug 978](https://github.com/Microsoft/vscode-go/issues/978) with [PR 2126](https://github.com/Microsoft/vscode-go/pull/2126)
    * Allow adding/removing breakpoints when debuggee is running. Fixes [Bug 2002](https://github.com/Microsoft/vscode-go/issues/2002) with [PR 2128](https://github.com/Microsoft/vscode-go/pull/2128)
    * Use unique stack frame ids to be compliant with Debug Adapter Protocol. [PR 2130](https://github.com/Microsoft/vscode-go/pull/2130)

* [Joel Hendrix (@jhendrixMSFT)](https://github.com/jhendrixMSFT)
    * Display nested content of structs in variables pane. Fixes [Bug 1010](https://github.com/Microsoft/vscode-go/issues/1010) with [PR 2198](https://github.com/Microsoft/vscode-go/pull/2198)
    * Display shadowed variables in variables pane. Fixes [Bug 1974](https://github.com/Microsoft/vscode-go/issues/1974) with [PR 2254](https://github.com/Microsoft/vscode-go/pull/2254)
    * Fix the slowness during debugging that got introduced a few releases ago, by caching the package info used to call `ListPackageVars` command in delve. [PR 2289](https://github.com/Microsoft/vscode-go/pull/2289)

* [Adrian Suwała (@Ashiroq)](https://github.com/Ashiroq) & * [Vlad Barosan (@vladbarosan)](https://github.com/vladbarosan)
    * New command `Go: Debug Test at Cursor` to debug the test function under the cursor. This provides the same feature as the debug codelens, but in the form of a command. [Feature Request 1088](https://github.com/Microsoft/vscode-go/issues/1088) implemented with [PR 2059](https://github.com/Microsoft/vscode-go/pull/2059)

* [Segev Finer (@segevfiner)](https://github.com/segevfiner) 
    * Fix bug that got introduced in the previous release where only the top call stack frame was shown. Fixes [Bug 2187](https://github.com/Microsoft/vscode-go/issues/2187) with [PR 2200](https://github.com/Microsoft/vscode-go/pull/2200)
    * Upstream bug fix in VS Code to avoid the frequent jump to `proc.go` file when stepping in/out during debugging. Fixes https://github.com/Microsoft/vscode/issues/65920

* [Bryce Kahle (@brycekahle)](https://github.com/brycekahle)
    * Use `LoggingDebugSession` to show logs from the VS Code debug adapter. [Feature Request 858](https://github.com/Microsoft/vscode-go/issues/858) implemented with [PR 2081](https://github.com/Microsoft/vscode-go/pull/2081)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Trace levels updated to include `log` which would be the old `verbose`. The new `verbose` will include logs from the VS Code debug adapter. 
    * Avoid showing global variables by default as it affects performance. [PR 2133](https://github.com/Microsoft/vscode-go/pull/2133)

* [Kuntal Majumder (@hellozee)](https://github.com/hellozee)
    * Use the new respository link for delve. [PR 2277](https://github.com/Microsoft/vscode-go/pull/2277)

* [Jonathan Hernández (@aggressivepixels)](https://github.com/aggressivepixels)
    * Skip installing delve on 32 bit platforms that dont support it. Fixes [Bug 2191](https://github.com/Microsoft/vscode-go/issues/2191) with [PR 2195](https://github.com/Microsoft/vscode-go/pull/2195)


### Others

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * When no folder is opened in VS Code, `Go to definition` feature now works on individual files. Fixes [Bug 2246](https://github.com/Microsoft/vscode-go/issues/2246) with [commit 58817b8](https://github.com/Microsoft/vscode-go/commit/58817b85b1609c3d939f9f6b5429817fafe93c69)
    * When the main module is opened in VS Code, `Go to definition` feature now works for sub modules as well. Fixes [Bug 2180](https://github.com/Microsoft/vscode-go/issues/2180) with [PR 2262](https://github.com/Microsoft/vscode-go/pull/2262)
    * Run the on save features only for current file. This will improve performance when multiple files are being saved at once, for eg: after find replace across files. Fixes [Bug 2202](https://github.com/Microsoft/vscode-go/issues/2202) with [commit cf0a61c](https://github.com/Microsoft/vscode-go/commit/cf0a61c20b6b883e57c01e344ec943024cbccad7)
    * Allow disabling of documentation in the auto-completion widget to solve the perf issue due to multiple `go doc` processes being spawned. Fixes [Bug 2152](https://github.com/Microsoft/vscode-go/issues/2152) with [commit e4522ba1](https://github.com/Microsoft/vscode-go/commit/e4522ba15e8216e2bafd330453bc21ad4ce42771). This is done using the flag `-excludeDocs` in the `go.gocodeFlags` setting.
    
* [Catalin Pirvu (@katakonst)](https://github.com/katakonst)
    * Show test coverage even if the test fails. [Feature Request 2193](https://github.com/Microsoft/vscode-go/issues/2193) implemented with [PR 2263](https://github.com/Microsoft/vscode-go/pull/2263)

* [Karl Goffin (@kagof)](https://github.com/kagof)
    * Suggest exported member name only at the start of the comment. Fixes [Bug 2063](https://github.com/Microsoft/vscode-go/issues/2063) with [PR 2070](https://github.com/Microsoft/vscode-go/pull/2070)

* [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr)
    * Avoid invalidating code coverage when updating single line comments. [PR 1996](https://github.com/Microsoft/vscode-go/pull/1996)

* [Shreyas Karnik (@shreyu86)](https://github.com/shreyu86)
    * Fix tool descriptions in the dropdown from `Go: Install/Update Tools` command. [PR 2235](https://github.com/
Microsoft/vscode-go/pull/2235)

* [Sardorbek (@oneslash)](https://github.com/oneslash)
    * Use `godef` instead of the fork for modules as all changes are merged upstream now. [PR 2234](https://github.com/Microsoft/vscode-go/pull/2234)
    * Replace use of megacheck with staticcheck as the former is deprecated. Fixes [Bug 2231](https://github.com/Microsoft/vscode-go/issues/2231) with [PR 2232](https://github.com/Microsoft/vscode-go/pull/2232)

* [kerem (@keremgocen)](https://github.com/keremgocen)
    * Check if the file at the expected tool path is executable before using it. Fixes [Bug 2220](https://github.com/Microsoft/vscode-go/issues/2220) with [PR 2230](https://github.com/Microsoft/vscode-go/pull/2230)

* [Segev Finer (@segevfiner)](https://github.com/segevfiner) 
    * Use the right documentation in auto-completion widget when there are multiple functions of the same name but on different receivers. Fixes [Bug 2107](https://github.com/Microsoft/vscode-go/issues/2107) with [PR 2215](https://github.com/Microsoft/vscode-go/pull/2215)

* [@richardatphilo](https://github.com/richardatphilo)
    * Fix `Find all references` feature when text is selected. Fixes [Bug 2197](https://github.com/Microsoft/vscode-go/issues/2197) with [PR 2226](https://github.com/Microsoft/vscode-go/pull/2226)




## 0.8.0 - 12th December, 2018

### Modules

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Support modules when `GO111MODULE` is explicitly set inside GOPATH.

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support Go to Definition feature when using modules even when VS Code is not started from the same path as the project.
    * Support Go to Definition feature on a symbol from a file from module cache.

### Debugging 

* [Bryce Kahle (@brycekahle)](https://github.com/brycekahle)
    * Support setting of variables during debugging in the variable pane. [Feature Request 1129](https://github.com/Microsoft/vscode-go/issues/1129) implemented with [PR 2076](https://github.com/Microsoft/vscode-go/pull/2076)
    * Show pointer values during debugging in the variable pane. [Feature Request 1989](https://github.com/Microsoft/vscode-go/issues/1989) implemented with [PR 2075](https://github.com/Microsoft/vscode-go/pull/2075)
    * Support the paging feature in stack traces during debugging. [Feature Request 946](https://github.com/Microsoft/vscode-go/issues/946) implemented with [PR 2080](https://github.com/Microsoft/vscode-go/pull/2080)
    * Run without debugging should use current file when the debug configuration points to package and respect the args, buildFlags set in the debug configuration. Fixes [Bug 2085](https://github.com/Microsoft/vscode-go/issues/2085) & [Bug 2086](https://github.com/Microsoft/vscode-go/issues/2086) with [PR 2123](https://github.com/Microsoft/vscode-go/pull/2123)
    
* [Segev Finer (@segevfiner)](https://github.com/segevfiner) 
    * Use `dlv` from the path set in the `go.toolsGopath` setting. Fixes [Bug 2099](https://github.com/Microsoft/vscode-go/issues/2099) with [PR 2108](https://github.com/Microsoft/vscode-go/pull/2108)

### Code Navigation

* [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr)
    * Differentiate structs from interfaces in the outline view. [PR 2114](https://github.com/Microsoft/vscode-go/pull/2114)

* [Dima (@hummerd)](https://github.com/hummerd)
    * Support the `Go to Type Definition` & `Peek to Type Definition` commands. [Feature Request 2121](https://github.com/Microsoft/vscode-go/issues/2121) implemented with [PR 2136](https://github.com/Microsoft/vscode-go/pull/2136)

### Diagnostics

* [Segev Finer (@segevfiner)](https://github.com/segevfiner) 
    * Avoid duplicate diagnostics when using tasks with build on save feature. Fixes [Bug 2100](https://github.com/Microsoft/vscode-go/issues/2100) with [PR 2109](https://github.com/Microsoft/vscode-go/pull/2109)
    * Set diagnostic source so that each problem in the Problems view shows the source. Fixes [Bug 2101](https://github.com/Microsoft/vscode-go/issues/2101) with [PR 2109](https://github.com/Microsoft/vscode-go/pull/2109)
    

### Testing

* [Charles Kenney (@Charliekenney23)](https://github.com/Charliekenney23)
    * Support test functions with names `Test`, `Example` in codelens. Fixes [Bug 2071](https://github.com/Microsoft/vscode-go/issues/2071) with [PR 2072](https://github.com/Microsoft/vscode-go/pull/2072)

* [JP Moresmau (@JPMoresmau)](https://github.com/JPMoresmau)
    * Fix bug where tests from another file are run due to partial match of function names. Fixes [Bug 2144](https://github.com/Microsoft/vscode-go/issues/2144) with [PR 2155](https://github.com/Microsoft/vscode-go/pull/2155)


### Others

* [Nisheet Sinvhal (@Ashniu123)](https://github.com/Ashniu123)
    * Rebuild the package after running `Go: Get Package` to get rid of the missing import errors. Fixes [Bug 2087](https://github.com/Microsoft/vscode-go/issues/2087) with [PR 2129](https://github.com/Microsoft/vscode-go/pull/2129)

* [Zac Bergquist (@zmb3)](https://github.com/zmb3)
    * Close the gocode daemon when closing VS Code. Fixes [Bug 2132](https://github.com/Microsoft/vscode-go/issues/2132) with [PR 2137](https://github.com/Microsoft/vscode-go/pull/2137)

* [Sardorbek (@oneslash)](https://github.com/oneslash)
    * Fix error that shows up when typing if no packages are found. Fixes [Bug 2134](https://github.com/Microsoft/vscode-go/issues/2134) with [PR 2135](https://github.com/Microsoft/vscode-go/pull/2135)


## 0.7.0 - 6th November, 2018

* [Segev Finer (@segevfiner)](https://github.com/segevfiner) 
    * Support documentation in auto-completion widget. [Feature Request 194](https://github.com/Microsoft/vscode-go/issues/194) implemented with [PR 2054](https://github.com/Microsoft/vscode-go/pull/2054)

* [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr)
    * Support `Copy Value`, `Copy as expression` and `Add to Watch` features in the context menu on the variables pane in the debug viewlet. [Feature Request 1990](https://github.com/Microsoft/vscode-go/issues/1990) implemented with [PR 2020](https://github.com/Microsoft/vscode-go/pull/2020)

* [Sewon Park (@sphawk)](https://github.com/sphawk)
    * `go.gopath` & `go.toolsGopath` settings now support the use of environment variables using the format `${env:XXX}`. [Feature Request 1732](https://github.com/Microsoft/vscode-go/issues/1732) implemented with [PR 1743](https://github.com/Microsoft/vscode-go/pull/1743)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Language Server from Sourcegraph is now supported on Windows as well.
    * Fallback to using `nsf/gocode` when using Go version 1.8 or older due to [mdempsky/gocode#73](https://github.com/mdempsky/gocode/issues/73)
    * `golint` and `gogetdoc` are no longer supported in Go version 1.8 or older
    * Use `go doc` instead of `godoc` for the showing the documentation when hovering over symbols and the Signature Help widget.

* [Marcus Farkas (@ToothlessGear)](https://github.com/ToothlessGear)
    * Pass list of packages to single `go build` call instead of calling `go build` on each package to improve performance. Fixes [Bug 1890](https://github.com/Microsoft/vscode-go/issues/1890) with [PR 2021](https://github.com/Microsoft/vscode-go/pull/2021)

* [Denys Yaroshenko (@freezlite)](https://github.com/freezlite)
    * Skip auto-generated stack frames from delve. Fixes [Bug 1987](https://github.com/Microsoft/vscode-go/issues/1987) & [Bug 2038](https://github.com/Microsoft/vscode-go/issues/2038) with [PR 2029](https://github.com/Microsoft/vscode-go/pull/2029)

* [Diogo Monteiro (@diogogmt)](https://github.com/diogogmt)
    * Clear coverage decorators before applying new ones to avoid brighthned coverages. Fixes [Bug 2045](https://github.com/Microsoft/vscode-go/issues/2045) with [PR 2047](https://github.com/Microsoft/vscode-go/pull/2047)

Engineering Updates

* [Alexandros Dorodoulis (@alexdor)](https://github.com/alexdor)
    * Update all dependencies and use latest typescript. [PR 2014](https://github.com/Microsoft/vscode-go/pull/2014)
    * Use latest version in `launch.json` and `tasks.json` files, update README for debugging. [PR 2013](https://github.com/Microsoft/vscode-go/pull/2013)

* [AnguloHerrera (@angulito)](https://github.com/angulito)
    * Fix failing travis tests

* [@SteelPhase](https://github.com/SteelPhase)
    * Refactor the fix for [Bug 2045](https://github.com/Microsoft/vscode-go/issues/2045) with [PR 2068](https://github.com/Microsoft/vscode-go/pull/2068)

* [@wachino](https://github.com/wachino)
    * Add more tests for util.ts file

Documentation Updates

* [@annnnur](https://github.com/annnnur)
* [Zachary Russell (@zachary-russell)](https://github.com/zachary-russell)
* [Joel Williams (@flowonyx)](https://github.com/flowonyx)
* [Wim (@42wim )](https://github.com/42wim )
* [@nxadm](https://github.com/nxadm)

## 0.6.93 - 18th October, 2018

Fix for issue with installing/updating tools when using the `Go: Install/Update Tools` command.
[Bug 2024](https://github.com/Microsoft/vscode-go/issues/1874) fixed by [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr) and [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)

## 0.6.92 - 17th October, 2018

* [Logan (@brainsnail)](https://github.com/brainsnail)
    * Add option `file` to `go.lintOnSave` setting to enable linting just the current file instead of package/workspace on file save. [Feature Request 1931](https://github.com/Microsoft/vscode-go/issues/1931) implemented with [PR 1965](https://github.com/Microsoft/vscode-go/pull/1965)

* [饺子w (@eternal-flame-AD)](https://github.com/eternal-flame-AD)
    * Support auto-completion during cross-compilation. Fixes [Bug 1874](https://github.com/Microsoft/vscode-go/issues/1874) with [PR 2015](https://github.com/Microsoft/vscode-go/pull/2015)

* [Ralph Schmieder (@rschmied)](https://github.com/rschmied)
    * Enable the use of `args` in test flags to pass arguments to tests. Fixes [Bug 1534](https://github.com/Microsoft/vscode-go/issues/1534) with [PR 1976](https://github.com/Microsoft/vscode-go/pull/1976)

* [Tobiasz Heller (@nephe)](https://github.com/nephe)
    * New snippet for `select` statements. [PR 2004](https://github.com/Microsoft/vscode-go/pull/2004)

* [Vimal Kumar (@vimak78)](https://github.com/vimak78)
    * Include out of the box commands for Go to definition, implementation and symbol in the `Go: Show All Commands` feature. [Feature Request 1822](https://github.com/Microsoft/vscode-go/issues/1822) implmented with [PR 1952](https://github.com/Microsoft/vscode-go/pull/1952)

* [Cezar Sá Espinola (@cezarsa)](https://github.com/cezarsa)
    * Use different icons for structs, interfaces and types. [PR 1961](https://github.com/Microsoft/vscode-go/pull/1961)

* [Kaarthik Rao Bekal Radhakrishna (@karthikraobr)](https://github.com/karthikraobr)
    * Use the new import path for `golint`. Fixes [Bug 1997](https://github.com/Microsoft/vscode-go/issues/1997) with [PR 1998](https://github.com/Microsoft/vscode-go/pull/1998)

* [ShowerYing (@showerying)](https://github.com/showerying), [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Remove `godoc` from the list of installable Go tools as it doesnt support CLI mode anymore. Use `godoc` binary which is shipped as part of the Go distribution instead.

* [Jay R. Wren (@jrwren)](https://github.com/jrwren)
    * Fix the bug where the forks of `gocode` & `godef` failed to install when user has multiple GOPATH. Fixes [Bug 1966](https://github.com/Microsoft/vscode-go/issues/1966) with [PR 1988](https://github.com/Microsoft/vscode-go/pull/1988)

* [Bradley Weston (@bweston92)](https://github.com/bweston92)
    * Include bazel option in `go.gocodePackageLookupMode` setting. Note: This only applies when using nsf/gocode. Latest versions of the Go extension uses mdempsky/gocode by default. [PR 1908](https://github.com/Microsoft/vscode-go/pull/1908)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix the regression introduced in the previous update where the testify suites arent being indentified as tests by the codelens unless `go.gotoSymbol.includeImports` was enabled.
    * Fix the regression where auto-completions are messed up when multiple packages match with the one being used. Fixes [Bug 2011](https://github.com/Microsoft/vscode-go/issues/2011) with [commit d789de0f](https://github.com/Microsoft/vscode-go/commit/d789de0f9561a1c9aa979a145cb64bcbfbe185cf)

Documentation Updates

* [@chiijlaw](https://github.com/chiijlaw)
* [Miguel Carvajal (@krvajal)](https://github.com/krvajal)
* [Forrest Cahoon (@forrcaho)](https://github.com/forrcaho)

Engineering Updates

* [@wachino](https://github.com/wachino)
    * Fix failing tests with [PR 2016](https://github.com/Microsoft/vscode-go/pull/2016)

* [Nguyen Long Nhat (@torn4dom4n)](https://github.com/torn4dom4n)
    * Replace the use of deprecated `$workspaceRoot` with `$workspaceFolder`. [PR 1977](https://github.com/Microsoft/vscode-go/pull/1977)



## 0.6.91 - 10th October, 2018

* [Mathias Griffe (@Mathiasgr)](https://github.com/MathiasGr)
    * Fix the regression introduced in the previous update where the testify suites arent being indentified as tests by the codelens. [Bug 1968](https://github.com/Microsoft/vscode-go/issues/1968) fixed with [PR 1969](https://github.com/Microsoft/vscode-go/pull/1969)

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr) and [Alec Thomas (@alecthomas)](https://github.com/alecthomas)
    * Improve the `iferr` snippet. [PR 1980](https://github.com/Microsoft/vscode-go/pull/1980) fixes [Bug 1962](https://github.com/Microsoft/vscode-go/issues/1962)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix the bug where code coverage is not displayed when using Go modules. [Bug 1927](https://github.com/Microsoft/vscode-go/issues/1927)
    * Fix the bug where file paths in the test output are not clickable when using Go modules. [Bug 1973](https://github.com/Microsoft/vscode-go/issues/1973)
    * Dont display the `Analysis Tools Missing` warning for the forks of `godef` and `gocode`. They are needed only when using Go modules and there are prompts to install them when the extension detects the use of modules.


## 0.6.90 - 3rd October, 2018

* [Rebecca Stambler (@stamblerre)](https://github.com/stamblerre)
    * Use of forks for the tools `godef` and `gocode` to provide `Go to definition` and `Auto-completion` features respectively when using Go modules. The binaries installed from these forks will have the suffix `-gomod` and will only be used when you use Go modules.

* [Bianca Rosa de Mendonça (@biancarosa)](https://github.com/biancarosa)
    * New commands `Go: Benchmark File`, `Go: Benchmark Package` and codelens to run all the benchmarks in current file & package respectively. [Feature Request 1522](https://github.com/Microsoft/vscode-go/issues/1522) with [PR 1898](https://github.com/Microsoft/vscode-go/pull/1898) & [PR 1899](https://github.com/Microsoft/vscode-go/pull/1899)

* [Jeffrey Bean (@jeffbean)](https://github.com/jeffbean)
    * New setting `go.generateTestsFlags` to provide flags for the `gotests` tool when generating tests. [PR 1841](https://github.com/Microsoft/vscode-go/pull/1841)

* [Johan Lejdung (@johan-lejdung)](https://github.com/johan-lejdung)
    * New setting `go.testTags` to be used for running tests. This way, you can use the existing `go.buildTags` for compiling and a different set of tags for running tests. [Feature Request 1842](https://github.com/Microsoft/vscode-go/issues/1842) implemented with [PR 1877](https://github.com/Microsoft/vscode-go/pull/1877)

* [Ryan Gurney (@ragurney)](https://github.com/ragurney)
    * Skip the blank identifiers in file outline. [Bug 1889](https://github.com/Microsoft/vscode-go/issues/1889) fixed with [PR 1893](https://github.com/Microsoft/vscode-go/pull/1893)

* [Benas Svipas (@svipben)](https://github.com/svipben)
    * Fix accessibility issues with the `Analysis Tools Missing` button in the status bar. [PR 1922](https://github.com/Microsoft/vscode-go/pull/1922)

* [Alec Thomas (@alecthomas)](https://github.com/alecthomas)
    * Improve snippets for `iferr` and `forr` i.e  "if err ..." the "for range". [Feature Request 1920](https://github.com/Microsoft/vscode-go/issues/1920) implemented with [PR 1924](https://github.com/Microsoft/vscode-go/pull/1924)

* [Charles Kenney (@Charliekenney23)](https://github.com/Charliekenney23)
    * Create new tmp directory for each session to avoid insecure use of the temporary files created by the extension. Fixes [Bug 1905](https://github.com/Microsoft/vscode-go/issues/1905) with [PR 1912](https://github.com/Microsoft/vscode-go/pull/1912)

* [Shreyas Karnik (@shreyu86)](https://github.com/shreyu86)
    * Provide auto-completions for symbols from unimported packages even when the package name has multiple matches. Fixes [Bug 1884](https://github.com/Microsoft/vscode-go/issues/1884) with [PR 1900](https://github.com/Microsoft/vscode-go/pull/1900)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Use random port instead of hard-coded 2345 when running delve. Fixes [Bug 1906](https://github.com/Microsoft/vscode-go/issues/1906)
    * Fix issue where tests using the check package cannot be run using the `Go: Test File` command. [Bug 1911](https://github.com/Microsoft/vscode-go/issues/1911)
    * Disable module support when installing the Go tools. Fixes [Bug 1919](https://github.com/Microsoft/vscode-go/issues/1919)
    * Use version 2 of delve apis by default instead of version 1. Replace existing `useApiV1` setting/configuration with `apiVersion`. [Feature Request 1876](https://github.com/Microsoft/vscode-go/issues/1876)
    * Prompt to update `gogetdoc` and `gopkgs` if using Go modules.
    * Disable `go.inferGopath` in workspace settings when using Go modules automatically.
    * Add support for the below features when using Go modules
        * `Go: Add Import` command that gives you a list of importable packages to add to the import block of current file
        * `Go: Browse Packages` command that lets you browse available packages and their files
        * Auto-completion of unimported packages when `go.autocompleteUnimportedPackages` setting is enabled.


## 0.6.89 - 30th August, 2018

* Show package variables and not just local variables in the debug viewlet when debugging. [Feature Request 1854](https://github.com/Microsoft/vscode-go/issues/1854) implemented with [PR 1865](https://github.com/Microsoft/vscode-go/pull/1865)
* Fix issue with anti virus scans blocking download of the Go plugin due to a dependency. [Bug 1871](https://github.com/Microsoft/vscode-go/pull/1871)
* Fix broken code coverage feature in Windows in Go 1.11 as the cover profile no longer uses backward slashes. [Bug 1847](https://github.com/Microsoft/vscode-go/issues/1847)
* Update existing Go tools when Go version or goroot changes, instead of the checkbox UI where user has to select the tools to update.

## 0.6.87 and 0.6.88 - 16th August, 2018

### Bug Fixes

* Extension host crashing with SIGPIPE error on machines that do not have the Go tools that the extension depends on instead of graceful error handling. [Bug 1845](https://github.com/Microsoft/vscode-go/issues/1845)
* Build fails on unix machines if user doesnt have entry in the /etc/passwd file. [Bug 1850](https://github.com/Microsoft/vscode-go/issues/1850)
* Avoid repeating gopath when the inferred gopath is the same as env gopath

## 0.6.86 - 13th August, 2018

### Debugging improvements

* [Zyck (@qzyse2017)](https://github.com/qzyse2017)
   * Introducing a new mode for debugging called `auto`. In this mode, the debugging sessions will run in `test` mode automatically if the current active file is a test file. Otherwise this defaults to the usual `debug` mode. [Feature Request 1780](https://github.com/Microsoft/vscode-go/issues/1780)

* [Luis GG (@lggomez)](https://github.com/lggomez)
   * Errors from delve api calls are now shown in the debug console when `"showLog": true` is added to the debug configuration. [PR 1815](https://github.com/Microsoft/vscode-go/pull/1815).

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
   * Fix bug when debugging a program that runs in a loop forever is not stopped when the stop button is clicked. [Bug 1814](https://github.com/Microsoft/vscode-go/issues/1814)
   * Fix bug when a previous failed debugging session due to compile errors results in failure of future sessions after fixing the compile error. [Bug 1840](https://github.com/Microsoft/vscode-go/issues/1840)
   * The environment variables in `go.toolsEnvVars` setting which gets used by all Go tools in this extension will now be passed to `dlv` as well during debugging sessions. With this change you dont need to repeat the variables in the debug configuration if you have already added it in the settings. [Feature Request 1839](https://github.com/Microsoft/vscode-go/issues/1839)

### Others

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
   * The `go.gopath` command when run programatically by other extensions now returns the GOPATH as determined by this extension. Useful for other extensions that want to provide additional features but do not want to repeat the work done by this extension to determine the GOPATH.

* [Darrian @(rikkuness)](https://github.com/rikkuness)
   * Fix bug with permission issues when there are mutliple user accounts on the same machine by using separate tmp files. [Bug 1829](https://github.com/Microsoft/vscode-go/issues/1829) fixed with [PR 1835](https://github.com/Microsoft/vscode-go/pull/1835)

* [Filip Stanis @(fstanis)](https://github.com/fstanis)
   * Fix error handling when the error returned by the process that runs formatting is not a string. [PR 1828](https://github.com/Microsoft/vscode-go/pull/1828)

## 0.6.85 - 26th July, 2018

* [Shannon Wynter @freman](https://github.com/freman)
    * New command `Go: Add Package to Workspace` that will add selected imported package to the current workspace. [Feature Request 1733](https://github.com/Microsoft/vscode-go/issues/1733) implemented with [PR 1745](https://github.com/Microsoft/vscode-go/pull/1745)

* [Jackson Kearl (@JacksonKearl)](https://github.com/JacksonKearl)
    * Fix perf issues when using linters. [Bug 1775](https://github.com/Microsoft/vscode-go/issues/1775) fixed with [PR 1791](https://github.com/Microsoft/vscode-go/pull/1791)
    * Improve performance of the Outline view. [PR 1766](https://github.com/Microsoft/vscode-go/pull/1766)

* [Marwan Sulaiman (@marwan-at-work)](https://github.com/marwan-at-work)
    * When suggesting unimported custom packages, show the ones form current workspace before the others. [PR 1782](https://github.com/Microsoft/vscode-go/pull/1782)

* [Halil Kaskavalci (@kaskavalci)](https://github.com/kaskavalci)
    * Fix bug with function snippets such that they are not inserted when functions are being filling in as parameters of another function call. [Bug 1779](https://github.com/Microsoft/vscode-go/issues/1779) fixed with [PR 1788](https://github.com/Microsoft/vscode-go/pull/1788)

* [Matt Strong (@xmattstrongx)](https://github.com/xmattstrongx)
    * Fix bug in debug variable and hover when using multi byte characters. [Bug 1777](https://github.com/Microsoft/vscode-go/issues/1777) fixed with [PR 1790](https://github.com/Microsoft/vscode-go/pull/1790)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix error with `Go: Generate Interface Stubs` command when using on an interface that is defined inside an "internal" folder.[Bug 1769](https://github.com/Microsoft/vscode-go/issues/1769)
    * Fix bug where auto-completions dont show built-in types. [Bug 1739](https://github.com/Microsoft/vscode-go/issues/1739)
    * Look at GOROOT before PATH when looking for the Go binary. Fixes [Bug 1760](https://github.com/Microsoft/vscode-go/issues/1760) which was a regression.
    * Clean up the debug binary that gets generated by delve at the end of the debugging session. [Bug 1345](https://github.com/Microsoft/vscode-go/issues/1345)

## 0.6.84 - 29th June, 2018

* [Michal Hruby (@mhr3)](https://github.com/mhr3)
    * Support to run tests that use the test suites from [stretchr/testify](https://github.com/stretchr/testify) suite using codelens. [PR 1707](https://github.com/Microsoft/vscode-go/pull/1707)

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * New setting `go.delveConfig` to configure the use of v2 apis from delve to be used when debugging tests as well normal code. [Feature Request 1735](https://github.com/Microsoft/vscode-go/issues/1735) implemented with [PR 1749](https://github.com/Microsoft/vscode-go/pull/1749)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Option to install/update selected tools required by the Go extension. [Feature Request 1731](https://github.com/Microsoft/vscode-go/issues/1731)


## 0.6.83 - 15th Jun, 2018

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Support for Conditional Breakpoints when debugging. [Feature Request 1720](https://github.com/Microsoft/vscode-go/issues/1720) implemented with [PR 1721](https://github.com/Microsoft/vscode-go/pull/1721)
    * Fix the watch feature in the debug panel that got introduced in the previous update. Fixes [Bug 1714](https://github.com/Microsoft/vscode-go/issues/1714) with [PR 1718](https://github.com/Microsoft/vscode-go/pull/1718)

* [@ikedam](https://github.com/ikedam)
    * New setting `go.alternateTools` to provide alternate tools or alternate paths for the same tools used by the Go extension. Provide either absolute path or the name of the binary in GOPATH/bin, GOROOT/bin or PATH.
    Useful when you want to use wrapper script for the Go tools or versioned tools from https://gopkg.in. [PR 1297](https://github.com/Microsoft/vscode-go/pull/1297). Some scenarios:
        * Map `go` to `goapp` when using App Engine Go
        * Map `gometalinter` to `gometalinter.v2` if you want to use the stable version of the tool

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support the new outline feature which is in preview. [Bug 1725](https://github.com/Microsoft/vscode-go/issues/1725)
    * Close `gocode` before updating and show appropriate message when failed to do so.

## 0.6.82 - 6th June, 2018

* [Tyler Bunnell (@tylerb)](https://github.com/tylerb)
    * Status bar item to cancel running tests. [Feature Request 1047](https://github.com/Microsoft/vscode-go/issues/1047) implemented with [PR 1218](https://github.com/Microsoft/vscode-go/pull/1218)

* [Frederik Ring (@m90)](https://github.com/m90)
    * Use `mdempsky/gocode` instead of `nsf/gocode` for auto-completion feature as the latter fails in Go 1.10 onwards.  Fixes [Bug 1645](https://github.com/Microsoft/vscode-go/issues/1645) with [PR 1710](https://github.com/Microsoft/vscode-go/pull/1710)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix the regression in the code coverage where the coverage doesnt get applied/removed as expected. Fixes [Bug 1716](https://github.com/Microsoft/vscode-go/issues/1716) and [Bug 1717](https://github.com/Microsoft/vscode-go/issues/1717) with [commit abe97240](https://github.com/Microsoft/vscode-go/commit/abe97240e573e9d2c11cea00bfd8c1e77c41398e)

## 0.6.81 - 4th June, 2018

### Features

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Use debug configuration to choose to use version 2 of delve apis when debugging. [Feature Request 1555](https://github.com/Microsoft/vscode-go/issues/1555) implemented with [PR 1647](https://github.com/Microsoft/vscode-go/pull/1647). This enables you to set configuration to increase the size of arrays and strings that are watchable during debugging which fixes [Bug 868](https://github.com/Microsoft/vscode-go/issues/868)

* [@golangci](https://github.com/golangci)
    * Support the use of `golangci-lint` as a linter. [Feature Request 1693](https://github.com/Microsoft/vscode-go/issues/1693) implemented with [PR 1693](https://github.com/Microsoft/vscode-go/pull/1693)

* [Minko Gechev (@mgechev)](https://github.com/mgechev) and [Mark Wolfe (@wolfeidau)](https://github.com/wolfeidau)
    * Support the use of `revive` as a linter. [Feature Request 1697](https://github.com/Microsoft/vscode-go/issues/1697) implemented with [PR 1699](https://github.com/Microsoft/vscode-go/pull/1699), [PR 1703](https://github.com/Microsoft/vscode-go/pull/1703) and commit [d31636](https://github.com/Microsoft/vscode-go/commit/d31636a89931add2b799610d91dce1f67b27d5d8)

* [Kent Quirk (@kentquirk)](https://github.com/kentquirk)
    * Customize the colors used in highlighting covered/uncovered code or the gutter styles used to indicated covered/uncovered code using the setting `go.coverageDecorator`. [Feature Request 1302](https://github.com/Microsoft/vscode-go/issues/1302) implemented with [PR 1695](https://github.com/Microsoft/vscode-go/pull/1695).

* [Shreyas Karnik (@shreyu86)](https://github.com/shreyu86)
    * Include exported member name in completions when starting a comment above it. Use Ctrl+Space to trigger completions inside comments. [Feature Request 1005](https://github.com/Microsoft/vscode-go/issues/1005) implemented with [PR 1675](https://github.com/Microsoft/vscode-go/pull/1675) and [PR 1706](https://github.com/Microsoft/vscode-go/pull/1706)

* [Frederik Ring (@m90)](https://github.com/m90), [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Get code completion and formatting features when using language server. Use the new setting `go.languageServerExperimentalFeatures` to opt-in to try such new features from the language server that might not be feature complete yet. [Feature Request 1593](https://github.com/Microsoft/vscode-go/issues/1593) implemented with [PR 1607](https://github.com/Microsoft/vscode-go/pull/1607)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Resolve `~`, `${workspaceRoot}`, `${workspaceFolder}` in the `go.testFlags` setting. [Feature Request 928](https://github.com/Microsoft/vscode-go/issues/928)
    * Ensure `Go: Add Import` shows up the list of imports ASAP. Fixes [Feature Request 1450](https://github.com/Microsoft/vscode-go/issues/1450)
    * Prompt user to install missing tool when they change either of `go.formatTool`, `go.lintTool` or `go.docsTool` setting to a tool that they dont have installed yet.
    * Pass the environment variables in the `go.toolsEnvVars` setting to the process that runs the language server.
    * Include the GOPATH from environment variable in the inferred GOPATH when `go.inferGopath` setting is enabled. [Feature Request 1525](https://github.com/Microsoft/vscode-go/issues/1525)

### Bug Fixes

* [Kent Quirk (@kentquirk)](https://github.com/kentquirk)
    * Fix code coverage when code is covered by multiple tests. [Bug 1683](https://github.com/Microsoft/vscode-go/issues/1683).

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Imrpove performance when using `gopkgs`. Fixes [Bug 1490](https://github.com/Microsoft/vscode-go/issues/1490) with [PR 1658](https://github.com/Microsoft/vscode-go/pull/1658)
    * Internal packages at the root of GOROOT should not be importable. [PR 1681](https://github.com/Microsoft/vscode-go/pull/1681).

* [Gordon Tyler (@doxxx)](https://github.com/doxxx)
    * Fix the improper usage of Cancellation Tokens that resulted in lint/vet processes getting cancelled. [PR 1704](https://github.com/Microsoft/vscode-go/pull/1704)

* [Luis GG (@lggomez)](https://github.com/lggomez)
    * Exlcude parameters in the function snippet in auto-completions if there is a `()` after cursor. Fixes [Bug 1655](https://github.com/Microsoft/vscode-go/issues/1655) with [PR 1696](https://github.com/Microsoft/vscode-go/pull/1696)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support `Go to Definition` feature when the entire symbol is selected with cursor at the end. Fixes [Bug 891](https://github.com/Microsoft/vscode-go/issues/891).

## 0.6.80 - 14th May, 2018

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * New setting `go.installDependenciesWhenBuilding` to control whether the `-i` flag is passed to `go build`/`go test` when compiling. [Feature Request 1464](https://github.com/Microsoft/vscode-go/issues/1464)
    * Use GOROOT from `go env` if not set as environment variable explicitly.
    * Fix bug where the output pane keeps showing up when using language server. [Bug 1662](https://github.com/Microsoft/vscode-go/issues/1662)
    * Show rename errors in the output channel. Fixes [Bug 1663](https://github.com/Microsoft/vscode-go/issues/1663)

* [@tanguylebarzic](https://github.com/tanguylebarzic)
    * Fixed regression bug where environment variables set in `go.toolsEnvVars` arent being used. [PR 1665](https://github.com/Microsoft/vscode-go/pull/1665)

* [Gordon Tyler (@doxxx)](https://github.com/doxxx)
    * Fix broken links in test output when `Go: Test All Packages In Workspace` command is run. [Bug 1626](https://github.com/Microsoft/vscode-go/issues/1626) and [PR 1651](https://github.com/Microsoft/vscode-go/pull/1651)
    * Expand function snippet for inline functions in auto-completions. [Feature Request 1287](https://github.com/Microsoft/vscode-go/issues/1287) and [PR 1673](https://github.com/Microsoft/vscode-go/pull/1673)
    * Avoid completions in line comments. [Bug 1659](https://github.com/Microsoft/vscode-go/issues/1659) and [PR 1671](https://github.com/Microsoft/vscode-go/pull/1671)

* [Jon Calhoun (@joncalhoun)](https://github.com/joncalhoun)
    * Expand function snippet for function types in auto-completions. [Feature Request 1553](https://github.com/Microsoft/vscode-go/issues/1553) and [PR 1560](https://github.com/Microsoft/vscode-go/pull/1560)

## 0.6.79 - 4th May, 2018

* [Frederik Ring (@m90)](https://github.com/m90)
    * New setting `go.gotoSymbol.includeGoroot`. If enabled, the symbols from the standard library are included when doing a workspace symbol search using the `Go to Symbol in Workspace` command. [Feature Request 1567](https://github.com/Microsoft/vscode-go/issues/1567) and [PR 1604](https://github.com/Microsoft/vscode-go/pull/1604)

* [Antoine @primalmotion](https://github.com/primalmotion)
    * New setting `go.coverOnSingleTest`. If enabled, code coverage will be shown in the editor when running individual tests. [Feature Request 1637](https://github.com/Microsoft/vscode-go/issues/1637) and [PR 1638](https://github.com/Microsoft/vscode-go/pull/1638)

* [lixiaohui (@leaxoy)](https://github.com/leaxoy)
    * Use the right icons for completion items of type `const`, `package`, `type` and `var`. [PR 1624](https://github.com/Microsoft/vscode-go/pull/1624)

* [Michael Novak (@novak)](https://github.com/novak)
    * Use the `go.buildTags` setting when running `go vet`. [Bug 1591](https://github.com/Microsoft/vscode-go/issues/1591) and [PR 1625](https://github.com/Microsoft/vscode-go/pull/1625)

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Package name suggestion should be `main` in a test file if the folder contains a `main.go`. [PR 1630](https://github.com/Microsoft/vscode-go/pull/1630)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Non string values for environment variables are now allowed in settings like `go.testEnvVars` and `go.toolsEnvVars`. [Bug 1608](https://github.com/Microsoft/vscode-go/issues/1608)
    * Support the `Go to Implementation` and `Peek Implmentation` commands when using the Go Language Server. [Feature Request 1611](https://github.com/Microsoft/vscode-go/issues/1611)
    * Fix automatic imports of packages when there is a comment in the end of the import block. [Bug 1606](https://github.com/Microsoft/vscode-go/issues/1606)
    * Fix automatic imports of packages when package alias starts with any keyword in the import block. [Bug 1618](https://github.com/Microsoft/vscode-go/issues/1618)

## 0.6.78 - 3rd April, 2018

### New Features and Enhancements

* [Teruo Kunihiro @1984weed](https://github.com/1984weed)
    * Configure the `output` option of delve in debug configuration.The location provided here is where delve will output the binary it then uses for debugging. [PR 1564](https://github.com/Microsoft/vscode-go/pull/1564)

* [Harry Kalogirou @harkal](https://github.com/harkal)
    * Codelens to debug benchmarks. [PR 1566](https://github.com/Microsoft/vscode-go/pull/1566)

* [David Howden @dhowden](https://github.com/dhowden)
    * Show build errors at the right column in a line instead of showing them at the start of the line by using columns numbers returned from `go build`. [PR 1573](https://github.com/Microsoft/vscode-go/pull/1573)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Make links in test output clickable when it fails due to build errors. [Feature Request 1562](https://github.com/Microsoft/vscode-go/issues/1562)
    * Enable `Go to Implementation` to work both ways. [Feature Request 1536](https://github.com/Microsoft/vscode-go/issues/1536)

* [Dan Mick @dmick](https://github.com/dmick)
    * Include comments from struct definitions when showing the definitions on hover. [PR 1559](https://github.com/Microsoft/vscode-go/pull/1559)

* [KataKonst @KataKonst](https://github.com/KataKonst)
    * Use `go vet` instead of `go tool vet` from Go 1.10 onwards as the latter now supports all vet flags. [PR 1576](https://github.com/Microsoft/vscode-go/pull/1576)

* [Luis GG @lggomez](https://github.com/lggomez)
    * Add option to never show the warning on editing generated files. [PR 1537](https://github.com/Microsoft/vscode-go/pull/1537)

* [Jan Koehnlein @JanKoehnlein](https://github.com/JanKoehnlein)
    * Show warning when go binary is not found during build. [PR 1543](https://github.com/Microsoft/vscode-go/pull/1543)

### Bug Fixes

* [Kegsay @Kegsay](https://github.com/Kegsay)
    * Fix bug where debug codelens would debug all tests that match the current test name. [PR 1561](https://github.com/Microsoft/vscode-go/pull/1561)

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Fix bug where internal packages are allowed to be imported when their path is substring of current package. [PR 1535](https://github.com/Microsoft/vscode-go/pull/1535)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix `Go to Implementation` feature when GOPATH is directly opened in VS Code. [Bug 1545](https://github.com/Microsoft/vscode-go/issues/1545) and [Bug 1554](https://github.com/Microsoft/vscode-go/issues/1554)
    * Fix issue with debugging into std lib when remote debugging and remote path is a complete substring of the local path.


## 0.6.77 - 20th February, 2018

* [Robin Bartholdson @buyology](https://github.com/buyology)
    * New command `Go: Fill Struct` integrates the `fillstruct` tool that lets you fill struct fields with default values. [PR 1506](https://github.com/Microsoft/vscode-go/pull/1506)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Show key value pairs of map variables correctly in the variable pane when debugging. Fixes [Bug 1384](https://github.com/Microsoft/vscode-go/issues/1384)

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Fix the issue of various features not working with Go 1.10 due to regex failure on fetching the version. [PR 1523](https://github.com/Microsoft/vscode-go/pull/1523)

* [Kevin Wiesmüller @kwiesmueller](https://github.com/kwiesmueller)
    * Generating Unit Tests will not open a new editor for generated/updated test file if the file is already open and visible in another editor group. [PR 1517](https://github.com/Microsoft/vscode-go/pull/1517)

* [Murad Korejo (@mkorejo)](https://github.com/mkorejo)
    * Notify user when `gopkgs` fails to get packages that are needed to provide the completions for unimported packages. [PR 1528](https://github.com/Microsoft/vscode-go/pull/1528)

* [Anatoly Milkov (@anatolym)](https://github.com/anatolym) and [Christian Winther (@jippi)](https://github.com/jippi)
    * Documentation Updates

## 0.6.76 - 10th February, 2018

* [Bug 1449](https://github.com/Microsoft/vscode-go/issues/1449): Rename fails due to cgo not being able to find the go executable.
* [Bug 1508](https://github.com/Microsoft/vscode-go/issues/1508): Broken Path in Windows when running Go tools

## 0.6.74 - 8th February, 2018

* [Nikhil Raman (@cheesedosa)](https://github.com/cheesedosa)
    * [Feature Request 1456](https://github.com/Microsoft/vscode-go/issues/1456): Show build/vet/lint status in status bar instead of opening output pane when run manually

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * [Bug 1470](https://github.com/Microsoft/vscode-go/issues/1470): `Go: Build Workspace` command or the setting `"go.buildOnSave": "workspace"` results in persistent error from trying to build the root directory with no Go files.
    * [Bug 1469](https://github.com/Microsoft/vscode-go/issues/1469): Formatting adds �� in Chinese files some times.
    * [Bug 1481](https://github.com/Microsoft/vscode-go/issues/1481): Untitled files in empty workspace results in build errors
    * [Bug 1483](https://github.com/Microsoft/vscode-go/issues/1483): Generating unit tests for a function generates tests for other functions with similar names

## 0.6.72 - 9th January, 2018

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix the issue that got introduced in the previous release, where formatter reverts changes unless `goreturns` is updated. Fixes [Bug 1447](https://github.com/Microsoft/vscode-go/issues/1447)
    * `~`, `$workspaceRoot` and `$workspaceFolder` are now supported in the `go.goroot` setting
* [Ben Wood @(benclarkwood)](https://github.com/golang/vscode-go/blob/HEAD/benclarkwood)
    * Collapse single line imports into an import block when auto-completing symbols from unimported packages or when using the `Go: Add Import` command. Fixes [Bug 374](https://github.com/Microsoft/vscode-go/issues/374) with [PR 500](https://github.com/Microsoft/vscode-go/pull/500)

## 0.6.71 - 5th January, 2018

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Setting `go.inferGopath` will now infer the correct GOPATH even in the below 2 cases which wasnt supported before
         - When a Go file is opened in VS Code directly without opening any workspace.
         - When GOPATH itself is directly opened in VS Code. Fixes [Bug 1213](https://github.com/Microsoft/vscode-go/issues/1213)
    * Use byte offset when calling `gocode` to fix issue with code completion when there are unicode characters in the file. Fixes [Bug 1431](https://github.com/Microsoft/vscode-go/issues/1431)
    * Add descriptions to the contributed snippets. These descriptions will appear in auto-completion and when using the `Insert Snippet` command
    * Fix "maxBufferExceeded" error by using `spawn` instead of `exec` when running formatters.
    * Use the new `onDebugResolve` activation event instead of `onDebug` to avoid activating the Go extension when other type of debug sessions are started

* [halfcrazy](https://github.com/halfcrazy)
    * Fixed the upstream issue with `goreturns`: [PR [sqs/goreturns#42](https://github.com/sqs/goreturns/issues/42)](https://github.com/sqs/goreturns/pull/42). This in turn fixes [Bug 613](https://github.com/Microsoft/vscode-go/issues/613) and [Bug 630](https://github.com/Microsoft/vscode-go/issues/630)

* [Nikhil Raman (@cheesedosa)](https://github.com/cheesedosa)
    * Show a warning when user edits a generated file. [Feature Request 1295](https://github.com/Microsoft/vscode-go/issues/1295) via [PR 1425](https://github.com/Microsoft/vscode-go/pull/1425)

## 0.6.70 - 19th December, 2017

* [Avihay Kain (@grooveygr)](https://github.com/grooveygr)
    * Snippets for methods on types during auto-completion. [Feature Request 168](https://github.com/Microsoft/vscode-go/issues/168). [PR 1368](https://github.com/Microsoft/vscode-go/pull/1368)
* [Matt Brandt (@Matt007)](https://github.com/matt007)
    * Debug configuration snippet for remote debugging. [PR 1365](https://github.com/Microsoft/vscode-go/pull/1365)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Prompt to recompile dependent Go tools when GOROOT changes. [Feature Request 1286](https://github.com/Microsoft/vscode-go/issues/1286)
    * Support for `${workspaceFolder}` in the below settings
        - `go.gopath`
        - `go.toolsGopath`
        - `go.testEnvVars`
        - `go.testEnvFile`
    * The `Analysis Tools Missing` message has bee updated to only appear for the tools backing basic features of the extension
    * Skip showing linting/vetting errors on a line that has build errors. [Feature Request 600](https://github.com/Microsoft/vscode-go/issues/600)
    * Fix the issue of slow linters resulting in stale problem markers in updated file. [Bug 1404](https://github.com/Microsoft/vscode-go/issues/1404)
    * Deprecate `go.formatOnSave` setting in favor of `editor.formatOnSave`. To disable formatting on save, add the below setting:
        ```
        "[go]": {
            "editor.formatOnSave": false
        }
        ```
        This fixes the below issues
       - Cursor jumps unexpectedly when formatting on save. [Bug 1346](https://github.com/Microsoft/vscode-go/issues/1346)
       - Adopting the format on save feature of VS Code. [Debt 540](https://github.com/Microsoft/vscode-go/issues/540)
       - Format-on-save messes up undo/redo stack [Bug 678](https://github.com/Microsoft/vscode-go/issues/678)
       - FormatOnSave re-saves file [Bug 1037](https://github.com/Microsoft/vscode-go/issues/1037)
       - Save All doesnt format all files [Bug 279](https://github.com/Microsoft/vscode-go/issues/279)
       - Slow format on save affects tests [Bug 786](https://github.com/Microsoft/vscode-go/issues/786)


## 0.6.69 - 27th November, 2017

* New commands
    * [Frederik Ring (@m90)](https://github.com/m90)
        * `Go: Run on Go Playground` to run the current file (only if all its dependencies are from the std library) in the [Go Playground](https://play.golang.org/) using [goplay](https://github.com/haya14busa/goplay). [PR 1270](https://github.com/Microsoft/vscode-go/pull/1270). [Feature Request [#1211](https://github.com/golang/vscode-go/issues/1211)](https://github.com/Microsoft/vscode-go/issues/1211)
            * Use the setting `go.playground` to control whether to run and/or share a link to the playground and/or open the playground in the browser.
    * [Robin Bartholdson @buyology](https://github.com/buyology)
        * `Go: Benchmark Function At Cursor` and Codelens for running benchmarks in test files. [PR 1303](https://github.com/Microsoft/vscode-go/pull/1303). [Feature Request [#972](https://github.com/golang/vscode-go/issues/972)](https://github.com/Microsoft/vscode-go/issues/972)
    * [Andrew Nee (@ndrewnee)](https://github.com/ndrewnee)
        * `Go: Lint Current Package` and `Go: Lint Workpsace` to lint using the tool specified in the `go.lintTool` setting and the flags specified in the `go.lintFlags` setting. [PR 1258](https://github.com/Microsoft/vscode-go/pull/1258). [Feature Request [#1041](https://github.com/golang/vscode-go/issues/1041)](https://github.com/Microsoft/vscode-go/issues/1041)
    * [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
        * `Go: Vet Current Package` and `Go: Vet Workpsace` to vet using the flags specified in the `go.vetFlags` setting. [Feature Request [#1041](https://github.com/golang/vscode-go/issues/1041)](https://github.com/Microsoft/vscode-go/issues/1041)
        * `Go: Build Current Package` and `Go: Build Workpsace` to build using the flags specified in the `go.buildFlags` setting and build tags specified in the setting `go.buildTags`. [Feature Request [#287](https://github.com/golang/vscode-go/issues/287)](https://github.com/Microsoft/vscode-go/issues/287)
        * `Go: Install Current Package` to install the current package using the flags specified in the `go.buildFlags` setting and build tags specified in the setting `go.buildTags`. [Feature Request [#287](https://github.com/golang/vscode-go/issues/287)](https://github.com/Microsoft/vscode-go/issues/287)

* Completion Improvements
    * [wangkechun (@wangkechun)](https://github.com/wangkechun)
        * Completions for standard packages are now shown before custom packages when providing completions for unimported packages. [PR 1309](https://github.com/Microsoft/vscode-go/pull/1309)
    * [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
        * `gocode` can now use [gb](https://github.com/constabulary/gb) specific rules when providing completions. Set the new setting `go.gocodePackageLookupMode` to `gb` to use this feature. [Feature Request [#547](https://github.com/golang/vscode-go/issues/547)](https://github.com/Microsoft/vscode-go/issues/547)

* Performance improvements
    * [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
        * The `autobuild` feature of `gocode` which is known to slow completions is now disabled by default. Fixes [Bug 1323](https://github.com/Microsoft/vscode-go/issues/1323)
            * Since we use the `-i` flag when building, we do not rely on `autobuild` feature of `gocode` to ensure fresh results from dependencies.
            * If you have disabled the `buildOnSave` setting, then use the new `Go: Build Current Package` command once in a while to ensure the dependencies are up to date or enable the `go.gocodeAutoBuild` setting.
        * In Go 1.9 and higher, running the vet feature in the absence of vet flags will be faster due to the use of `go vet ./...` instead of `go tool vet -flags`. Fixes [Bug 1215](https://github.com/Microsoft/vscode-go/issues/1215)
        * Performance issues caused by a large number of lingering processes for vet/lint/hover features are now solved.
            * Measures are now in place to kill older processes before starting new ones for vet/lint feature. Fixes [Bug 1265](https://github.com/Microsoft/vscode-go/issues/1265)
            * For other features like hover/outline/definition etc. the cancellation token provided by the core is used to kill processes if the corresponding request from the core is cancelled. Fixes [Bug 667](https://github.com/Microsoft/vscode-go/issues/667)

* Others
    * [Phil Kates (@philk)](https://github.com/philk)
        * Fix the formatting issue due to stricter rules in the VS Code apis around configuration objects. [PR 1334](https://github.com/Microsoft/vscode-go/pull/1334). Fixes [Bug 1333](https://github.com/Microsoft/vscode-go/issues/1333).
    * [David Marby (@DMarby)](https://github.com/DMarby)
        * Fix delve connection issues when verbose build flag is set. [PR 1354](https://github.com/Microsoft/vscode-go/pull/1354)
    * [Jan Koehnlein @JanKoehnlein](https://github.com/JanKoehnlein)
        * Fix `Open Workspace Settings` action in the prompt to set GOPATH. [PR 1375](https://github.com/Microsoft/vscode-go/pull/1375). Fixes [Bug 1374](https://github.com/Microsoft/vscode-go/issues/1374)
    * [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
        * Apply/Clear coverage in active editors of all editor groups rather than just the first one. Fixes [Bug 1343](https://github.com/Microsoft/vscode-go/issues/1343)
        * Fix the issue of codelens for references showing "0 references" when `guru` fails to provide references. Fixes [Bug 1336](https://github.com/Microsoft/vscode-go/issues/1336)
        * Support multiple buildtags in the `go.buildTags` setting. Fixes [Bug 1355]https://github.com/Microsoft/vscode-go/issues/1355).

## 0.6.67 - 4th November, 2017

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Do not show suggestions from internal packages of other projects. Fixes [Bug 1256](https://github.com/Microsoft/vscode-go/issues/1256).

* [Alexander Kohler (@alexkohler)](https://github.com/alexkohler)
    * Fix issue with `go.useCodeSnippetsOnFunctionSuggestWithoutType` setting dropping parameters of same type. Fixes [Bug 1279](https://github.com/Microsoft/vscode-go/issues/1279) via [PR 1284](https://github.com/Microsoft/vscode-go/pull/1284)
    * Remove duplciate compilation errors that can show up when entire workspace is built. Fixes [Bug 1228](https://github.com/Microsoft/vscode-go/issues/1228) via [PR 1269](https://github.com/Microsoft/vscode-go/pull/1269)

* [Paweł Słomka @slomek](https://github.com/slomek)
    * Snippet for Example functions. [PR 1281](https://github.com/Microsoft/vscode-go/pull/1281)

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix suggestions to import vendored packages in Windows. Fixes [Bug 1147](https://github.com/Microsoft/vscode-go/issues/1147).
    * Fix extension activation issue in Windows when a Go file is opened without any folder open. Fixes [Bug 1306](https://github.com/Microsoft/vscode-go/issues/1306)
    * Use the newer debug APIs as the older ones will be deprecated in VS Code 1.18

## 0.6.66 - 2nd October, 2017

### [Multi Root support](https://code.visualstudio.com/updates/v1_15#_preview-multi-root-workspaces) when using [VS Code Insiders](https://code.visualstudio.com/insiders)

We now have [Multi Root support](https://code.visualstudio.com/updates/v1_15#_preview-multi-root-workspaces) for Go. [PR 1221](https://github.com/Microsoft/vscode-go/pull/1221) Please note:
* The settings at Folder level takes precedence over the ones at the Workspace level which in turn take precedence over the ones at the User level
* You can have the different roots in the multi-root mode use different GOPATHs. The experimental language server feature is not supported in such cases though.
* All current Go related features that refer to "workspace" will refer to the individual roots in the multi root mode. For example: Build/lint/vet/test workspace or `Go to Symbol in workspace`.
* Give it a try and log any issues that you find in the [vscode-go repo](https://github.com/Microsoft/vscode-go/issues)

### Auto-completion improvements

* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Auto-completion for unimported packages that are newly installed/built will now show up without the need for reloading VS Code.
    * Completions from sub vendor packages that were showing up are ignored now. Fixes [Bug 1251](https://github.com/Microsoft/vscode-go/issues/1251)
    * The `package` snippet completion is now smarter when suggesting package names. [PR 1220](https://github.com/Microsoft/vscode-go/pull/1220). It suggests
        * `main` when current file is `main.go` or there exists a `main.go` file in current folder
        * The folder name when the current file is `internal_test.go`
        * The folder name with `_test` when current file is a test file
        * If the folder name in above cases has `-` or `.`, then what appears after the `-` or `.` is suggested.
* [Alexander Kohler (@alexkohler)](https://github.com/alexkohler)
    * A new setting `go.useCodeSnippetsOnFunctionSuggestWithoutType` is introduced. This allows completions of functions with their parameter signature but without the parameter types. [Feature Request 1241](https://github.com/Microsoft/vscode-go/issues/1241)
* [Miklós @kmikiy](https://github.com/kmikiy)
    * 3 New snippets for the `Log` methods from the `testing` package

### Improvements around running and debugging tests

* [zhouhaibing089 (@zhouhaibing089)](https://github.com/zhouhaibing089)
    * Running and debugging tests for packages in symlinked folders is now possible. [PR 1164](https://github.com/Microsoft/vscode-go/pull/1164)
* [Katsuma Ito (@ka2n)](https://github.com/ka2n)
    * The Debug Test codelens now uses the buildTags and buildFlags correctly. [PR 1248](https://github.com/Microsoft/vscode-go/pull/1248)
* [Chase Adams (@chaseadamsio)](https://github.com/chaseadamsio)
    * You can now run tests from unsaved files. Fixes [Bug 1225](https://github.com/Microsoft/vscode-go/issues/1225)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Changes done to coverage options and decorators in settings now apply immediately without the need for moving to another file and back. Fixes [Bug 1171](https://github.com/Microsoft/vscode-go/issues/1171)
    * The Run Test and Debug Test codelens react to change in the codelens setting immediately without the need for moving to another file and back. Fixes [Bug 1172](https://github.com/Microsoft/vscode-go/issues/1172)
    * `$workspaceRoot` will now be resolved when part of `go.testEnvVars` and `go.toolsEnvVars` setting.


### Improvements around Packages
* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * `Go: Browse Packages` command will now include newly installed/built packages without the need for reloading VS Code.
* [Hugo (@juicemia)](https://github.com/juicemia)
    * A new command `Go: Get Package` is introduced to run `go get` on the package in the import statement under the cursor. [PR 1222](https://github.com/Microsoft/vscode-go/pull/1222)

## 0.6.65 - 6th September, 2017

[Seonggi Yang (@sgyang)](https://github.com/sgyang)
* [Bug [#1152](https://github.com/golang/vscode-go/issues/1152)](https://github.com/Microsoft/vscode-go/issues/1152): Auto completions for unimported packages do not work anymore on certain machines. [PR 1197](https://github.com/Microsoft/vscode-go/pull/1197)

[Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
* [Bug [#1194](https://github.com/golang/vscode-go/issues/1194)](https://github.com/Microsoft/vscode-go/issues/1194) and [Bug [#1196](https://github.com/golang/vscode-go/issues/1196)](https://github.com/Microsoft/vscode-go/issues/1196): Debugger doesnt use GOPATH from env in debug configuration
* Go to implementation cmd doesnt show up when using the language server.

## 0.6.64 - 5th September, 2017

* [Dan Mace (@ironcladlou)](https://github.com/ironcladlou), [Vincent Chinedu Okonkwo (@codmajik)](https://github.com/codmajik) & [Dima (@hummerd)](https://github.com/hummerd)
    * Support for the `Go To Implementation` command on interfaces. [Feature Request [#771](https://github.com/golang/vscode-go/issues/771)](https://github.com/Microsoft/vscode-go/issues/771).
* [Craig-Stone (@Craig-Stone)](https://github.com/Craig-Stone)
    * Normalize program path in Windows which otherwise prevented breakpoints from being set correctly when remote debugging. [PR 1131](https://github.com/Microsoft/vscode-go/pull/1131)
* [Marwan Sulaiman (@marwan-at-work)](https://github.com/marwan-at-work)
    * Refactor the code behind `Go: Browse Packages` to make browsing selected package faster. [PR 1136](https://github.com/Microsoft/vscode-go/pull/1136)
* [Thomas Darimont (@thomasdarimont)](https://github.com/thomasdarimont)
    * A new snippet called `helloweb` that generates a web app with an http endpoint returning a greeting and current time. [PR 1113](https://github.com/Microsoft/vscode-go/pull/1113)
* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Refactor the way test output is shown to show output of `log.Println`. Fixes [Issue [#1120](https://github.com/golang/vscode-go/issues/1120)](https://github.com/Microsoft/vscode-go/issues/1120) with [PR 1124](https://github.com/Microsoft/vscode-go/pull/1124)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Test Improvements
        * Show test coverage after the command `Go: Test Package` is run. You can disable this by setting `go.coverOnTestPackage` to `false`.
        * Show test coverage even if files are outside of GOPATH. Fixes [Issue [#1122](https://github.com/golang/vscode-go/issues/1122)](https://github.com/Microsoft/vscode-go/issues/1122)
        * Decouple running test coverage on save from running build/lint/test on save. Fixes the issue where the problems view was not getting updated until `go.coverOnSave` was disabled.
    * Debugging Improvements
        * No need to set GOPATH in debug configuration in the `launch.json` file anymore. When no GOPATH is provided this way, the debug adapter will now infer the GOPATH based on the path of the file/package being debugged. This fixes [Issue [#840](https://github.com/golang/vscode-go/issues/840)](https://github.com/Microsoft/vscode-go/issues/840).
        * The debug code lens will now honor the `go.buildFlags`, `go.buildTags` and `go.testFlags` settings. Fixes [Issue [#1117](https://github.com/golang/vscode-go/issues/1117)](https://github.com/Microsoft/vscode-go/issues/1117)
        * Fix issue with stepping over standard library code when remote debugging in Windows. Fixes [Issue [#1178](https://github.com/golang/vscode-go/issues/1178)](https://github.com/Microsoft/vscode-go/issues/1178)
    * Other Bug Fixes
        * Fix the extra text being selected at the end of formatting run on save. Fixes [Issue [#899](https://github.com/golang/vscode-go/issues/899)](https://github.com/Microsoft/vscode-go/issues/899) and [Issue [#1096](https://github.com/golang/vscode-go/issues/1096)](https://github.com/Microsoft/vscode-go/issues/1096).
        * `gometalinter` and `dlv` will honor the `go.toolsGopath` setting. Fixes [Issue [#1110](https://github.com/golang/vscode-go/issues/1110)](https://github.com/Microsoft/vscode-go/issues/1110)
        * Skip vendor folders from lint and vet results. Fixes [Issue [#1119](https://github.com/golang/vscode-go/issues/1119)](https://github.com/Microsoft/vscode-go/issues/1119) and [Issue [#1121](https://github.com/golang/vscode-go/issues/1121)](https://github.com/Microsoft/vscode-go/issues/1121)


## 0.6.63 - 26th July, 2017

### Features

* [Ian Chiles (@fortytw2)](https://github.com/fortytw2)
    * Option to use [megacheck](https://github.com/dominikh/go-tools/tree/master/cmd/megacheck) as a linting tool which
can have significantly better performance than `gometalinter`, while only supporting a subset of the tools. Use the setting `go.lintTool` to try this.
* [alexandrevez (@alexandrevez)](https://github.com/alexandrevez)
    * Option to highlight gutters rather than full text for code coverage. Use the new setting `go.coverageDecorator` to try this.
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a) & [Marwan Sulaiman (@marwan-at-work)](https://github.com/marwan-at-work)
    * Browse packages and go files with new command `Go: Browse Packages`. [Feature Request 330](https://github.com/Microsoft/vscode-go/issues/330)
         - If cursor is on an import statement, then files from the imported package will be shown in the quick pick control
         - Else, all packages are shown in the quick pick control. Select any and corresponding Go files will be shown next.
         - Selecting any of the Go files, will open the file in a new editor.
* [Saud Khan (@bidrohi)](https://github.com/bidrohi)
    * Print import paths of Go tools as they get installed. [PR 1032](https://github.com/Microsoft/vscode-go/pull/1032)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Prompt to update dependent Go tools when there is a change in the Go version. [Feature Request 797](https://github.com/Microsoft/vscode-go/issues/797)
    * Better user experience when dependent Go tools are missing. [Feature Request 998](https://github.com/Microsoft/vscode-go/issues/998)
         - Prompts will only show up for tools that are used for features that are explicitly executed by the user. Eg: Rename, Generate Unit Tests, Modify tags. And not for features that get triggered behind the scenes like linting, hover or format on save.
         - When the prompts do show up, closing them will ensure that they wont show up for the duration of the current session of VS Code.

### Bug Fixes

* [llife0915 (@llife0915)](https://github.com/llife0915)
    * Fix for issue when unverified breakpoints appeear when creating/deleting breakpoints once debugging starts in Windows.
* [Roman Peshkov (@rpeshkov)](https://github.com/rpeshkov)
    * Expand file names to file paths in test output for subtests. [Bug 1049](https://github.com/Microsoft/vscode-go/issues/1049)
* [Guilherme Oenning (@goenning)](https://github.com/goenning)
    * Pass GOPATH to debug adapter when debugging tests via codelens. [Bug 1057](https://github.com/Microsoft/vscode-go/issues/1057)
* [Nuruddin Ashr (@uudashr)](https://github.com/uudashr)
    * Skip testing vendor folders when using the command `Go: Test all Packages in Workspace`
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Start without debugging should fallback to debug mode when configured program is not a file. [Bug 1084](https://github.com/Microsoft/vscode-go/issues/1084)
    * Fix for incorrect package name during autocomplete of unimported packages when package name is not the same as the last part of the import path. [Bug 647](https://github.com/Microsoft/vscode-go/issues/647)
    * Skip building vendor folders when `go.buildOnSave` is set to `workspace`. [Bug 1060](https://github.com/Microsoft/vscode-go/issues/1060)
    * Honor `go.buildTags` when using `gogetdoc`. [Bug 1024](https://github.com/Microsoft/vscode-go/issues/1024)
    * Fix build failure when `-i` is passed as a build flag. [Bug 1064](https://github.com/Microsoft/vscode-go/issues/1064)
    * Fix vet failure when any flag is passed. [Bug 1073](https://github.com/Microsoft/vscode-go/issues/1073)
    * Better formatting in import blocks when imports get added during auto-completion or when `Go: Add Import` command is used. [Bug 1056](https://github.com/Microsoft/vscode-go/issues/1056)
    * `Go: Generate Interface Stubs` should work when interface is prefixed with package path


## 0.6.62 - 9th June, 2017

### Features
* [Jamie Stackhouse (@itsjamie)](https://github.com/itsjamie)
   * New command `Go: Generate interface stub` to generate stubs that implement given interface using [impl](https://github.com/josharian/impl). [PR 939](https://github.com/Microsoft/vscode-go/pull/939)
        - When the command is run, you are prompted to provide interface name. Eg: `f *File io.Closer`
        - The stubs are then generated where the cursor is in the editor.
* [Guilherme Oenning (@goenning)](https://github.com/goenning)
    * New setting `go.testEnvFile` to configure the location of a file that would have environment variables to use while running tests. [PR 971](https://github.com/Microsoft/vscode-go/pull/971)
        - File contents should be of the form `key=value`.
        - Values from the existing setting `go.test.EnvVars` will override the above
        - These environment variables will also be used by the "Debug Test" codelens
        - When debugging using the debug viewlet or pressing `F5`, the above will not be used. Continue to use the `env` and/or `envFile` property in the debug configurations in the `launch.json` file.
* [Ole (@vapourismo)](https://github.com/vapourismo)
    * You can now run build/lint/vet on the whole workspace instead of just the current package on file save. [PR 1023](https://github.com/Microsoft/vscode-go/pull/1023)
        - To enable this, the settings `go.buildOnSave`, `go.lintOnSave` and `go.vetOnSave` now take values `package`, `workspace` or `off` instead of the previous `true`/`false`.
        - These features are backward compatible and so if you are still using `true`/`false` for these settings, they will work as they did before, but you will get a warning in your settings file.
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Better build performance when working on main packages and test files by using the `-i` flag.
    * Better linting experience while running `gometalinter` by using the `--aggregate` flag which aggregates similar errors from multiple linters.

### Bug Fixes
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix for [Bug 968](https://github.com/Microsoft/vscode-go/issues/968) where rename fails if `---` is anywhere in the file
    * Fix for [Bug 981](https://github.com/Microsoft/vscode-go/issues/981) where `Go: Test Function At Cursor` fails.
    * Fix for [Bug 983](https://github.com/Microsoft/vscode-go/issues/983) where the Go binary is not found in MSYS2 as it is not located in GOROOT.
    * Fix for [Bug 1022](https://github.com/Microsoft/vscode-go/issues/1002) where snippets from function auto complete do not insert the placeholders
    * Fix for [Bug 962](https://github.com/Microsoft/vscode-go/issues/962) where references codelens wouldn't work for methods.
* [F0zi (@f0zi)](https://github.com/f0zi)
    * Fix for [Bug 1009](https://github.com/Microsoft/vscode-go/issues/1009) where remote debugging fails to verify breakpoint if GOPATH partially matches remote GOPATH
* [Anton Kryukov (@Emreu)](https://github.com/Emreu)
    * Use the `go.testEnvVars` while debugging tests using codelens

## 0.6.61 - 4th May, 2017
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix for [Bug 963](https://github.com/Microsoft/vscode-go/issues/963) Fix for perf issues when references codelens is enabled. [Commit 352435a](https://github.com/Microsoft/vscode-go/commit/352435ab0e6846b7483958a90f61fb94329dd0ae)
    * Fix for [Bug 964](https://github.com/Microsoft/vscode-go/issues/964) The setting `go.referencesCodeLens.enabled` is deprecated in favor of `go.enableCodeLens` to control multiple types of codelens.
        ```json
        "go.enableCodeLens": {
            "references": false,
            "runtest": true
        }
        ```

## 0.6.60 - 3rd May, 2017

### Codelens for references, to run and debug tests
* [theSoenke (@theSoenke)](https://github.com/theSoenke)
    * [Feature Request 726](https://github.com/Microsoft/vscode-go/issues/726): Display Reference count above functions using codelens. On clicking, the references are shown just like the `Find All References` command. [PR 933](https://github.com/Microsoft/vscode-go/pull/933) and [PR 938](https://github.com/Microsoft/vscode-go/pull/938). You can disable this by updating the setting `go.referencesCodeLens.enabled`.
* [Guilherme Oenning (@goenning)](https://github.com/goenning)
    * Use Codelens to run each test function, tests in the file and tests in the package. [PR 937](https://github.com/Microsoft/vscode-go/pull/937)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * [Feature Request 879](https://github.com/Microsoft/vscode-go/issues/879): Use Codelens to debug a test function. [Commit 5b1ced7](https://github.com/Microsoft/vscode-go/commit/5b1ced78cc06016d24539099aa164fe170fa7267)

### Test Coverage
* [Thomas Bradford (@kode4food)](https://github.com/kode4food)
    * New setting `go.coverageOptions` to control whether you want to highlight only covered code or only uncovered code or both when code coverage is run. [PR 945](https://github.com/Microsoft/vscode-go/pull/945)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * The command `Go: Test Coverage In Current Package` is renamed to `Go: Toggle Test Coverage In Current Package` and it does exactly what the name suggests. Toggles test coverage. [Commit cc661daf](https://github.com/Microsoft/vscode-go/commit/cc661dafd06770137459b72441e5f7cc877483f0)

### Bug Fixes
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix for [Bug 529](https://github.com/Microsoft/vscode-go/issues/529) Code completion for unimported packages now works on unsaved file after deleting imports.
    * Fix for [Bug 922](https://github.com/Microsoft/vscode-go/issues/922) Go to Symbol in File feature now includes symbols from unsaved file contents. [PR 929](https://github.com/Microsoft/vscode-go/pull/929)
    * Fix for [Bug 878](https://github.com/Microsoft/vscode-go/issues/878) Debugging now works on current file even when there is no folder/workspace open. [Commit 42646afc](https://github.com/Microsoft/vscode-go/commit/42646afc2d2442b5e962d3125a7cbf61b98b2a0a)
    * Fix for [Bug 947](https://github.com/Microsoft/vscode-go/issues/947) Mac users using the latest delve from master may see that all env variables are empty while debugging their code. This is due to delve using the `--backend=lldb` option in Mac by default. You can now change this default value by setting the `backend` property to `native` in the `launch.json` file. [Commit 4beecf1](https://github.com/Microsoft/vscode-go/commit/4beecf1db2aaa18b336be2ee64476b56202fc959). Root cause is expected to be fixed in delve itself and is being tracked in [derekparker/delve/818](https://github.com/derekparker/delve/issues/818)
* [Tyler Bunnell (@tylerb)](https://github.com/tylerb)
    * Fix for [Bug 943](https://github.com/Microsoft/vscode-go/issues/943) Live error reporting now works across multiple files in the current package, mapping errors to the correct files. [PR 923](https://github.com/Microsoft/vscode-go/pull/923)
* [Guilherme Oenning (@goenning)](https://github.com/goenning)
    * Fix for [Bug 934](https://github.com/Microsoft/vscode-go/issues/934) Environment variables from `envFile` attribute in the launch.json file is used while debugging and is overridden only by the ones in the `env` attribute. [PR 935](https://github.com/Microsoft/vscode-go/pull/935)

### Others
* [Luka Zakrajšek (@bancek)](https://github.com/bancek) and [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * New setting `go.toolsEnvVars` where you can specify env vars to be used by the Go tools that are used in the Go extension. [PR 932](https://github.com/Microsoft/vscode-go/pull/932) and [commit bca4dd5f](https://github.com/Microsoft/vscode-go/commit/bca4dd5f31f32ac49da79580c07b4000f06287a3). This fixes [Bug 632](https://github.com/Microsoft/vscode-go/issues/632) as well.
* [Paweł Słomka (@slomek)](https://github.com/slomek)
    * New snippet for writing table driven tests. [PR 952](https://github.com/Microsoft/vscode-go/pull/952)


## 0.6.59 - 4th April, 2017

* [Tyler Bunnell (@tylerb)](https://github.com/tylerb)
    * Add live error feedback using `gotype-live` which is `gotype` with support for unsaved file contents. [PR 903](https://github.com/Microsoft/vscode-go/pull/903)
        * New setting `go.liveErrors` controls this feature.
        * Set `"go.liveErrors": { "enabled": true }` to enable this feature
        * Edit the delay property in `"go.liveErrors": { "enabled": true, "delay": 500 }` to update the delay (in milliseconds) after which `gotype-live` would be run post a keystroke

* [Eon S. Jeon (@esjeon)](https://github.com/esjeon)
    * GOPATH from settings is now honored when users debug current file without having a `launch.json` file. [PR 904](https://github.com/Microsoft/vscode-go/pull/904)
        * Note: Once you have a `launch.json` file, GOPATH from settings wont be read. You will need to set it in the `env` property as before

* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * `--config` flag for `gometalinter` now supports the use of `${workspaceRoot}` and `~` that allows users to provide config file path relative to workspace or home directory respectively. [PR 909](https://github.com/Microsoft/vscode-go/pull/903)
    * New command `Go: Test All Packages in Workspace` to run tests from all packages in the workspace.

## 0.6.57 - 30th March, 2017
Fix for [Bug 892](https://github.com/Microsoft/vscode-go/issues/892) which breaks build when the user has multiple GOPATHs and the Go project being worked on is not the first one among the multiple GOPATHs. [Commit d417fd6](https://github.com/Microsoft/vscode-go/commit/d417fd6725077d1233fb1bcd3aa5d097d02715a9)

## 0.6.56 - 29th March, 2017

### Editing improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Use [gomodifytags](https://github.com/fatih/gomodifytags) to add/remove tags on selected struct fields. [PR 880](https://github.com/Microsoft/vscode-go/pull/880)
         * If there is no selection, then the whole struct under the cursor will be selected for the tag modification.
         * `Go: Add Tags` command adds tags configured in `go.addTags` setting to selected struct fields. By default, `json` tags are added. Examples:
             * To add `xml` tags, set `go.addTags` to `{"tags": "xml"}`
             * To add `xml` with `cdata` option, set `go.addTags` to `{"tags": "xml", "options": "xml=cdata"}`
             * To add both `json` and `xml` tags, set `go.addTags` to `{"tags": "json,xml"}`
         * `Go: Remove Tags` command removes tags configured in `go.removeTags` setting from selected struct fields.
             * By default, all tags are removed.
             * To remove only say `xml` tags, set `go.removeTags` to `{"tags": "xml"}`
         * To be prompted for tags instead of using the configured ones, set `go.addTags` and/or `go.removeTags` to `{"promptForTags": true}`
    * Fix rename issue when `diff` tool from Git or Cygwin are in the `PATH` in Windows. [PR 866](https://github.com/Microsoft/vscode-go/pull/866)
    * Keywords are now supported in completion suggestions. [PR 865](https://github.com/Microsoft/vscode-go/pull/865)
    * Suggestion items to import packages disabled in single line import statements and the line with package definition where they do not make sense. [PR 860](https://github.com/Microsoft/vscode-go/pull/860)

### Debugging improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support to build and run your Go file.  [PR 881](https://github.com/Microsoft/vscode-go/pull/881)
        * Press `Ctrl+F5` or run the command `Debug: Start Without Debugging` to run using the currently selected launch configuration.
        * If you don't have a `launch.json` file, then the current file will be run.
        * Supported only for launch configs with `type` as `debug` and `program` that points to a Go file and not package
    * New `envFile` attribute in `launch.json` where you can provide a file with env variables to use while debugging. [PR 849](https://github.com/Microsoft/vscode-go/pull/849)
    * Use current file's directory instead of folder opened in VS Code to debug in the default configurations. [Commit 0915e50a](https://github.com/Microsoft/vscode-go/commit/0915e50a1ada5c74742d9c4ce7f265b5e273ca31)

### Tooling improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * New Setting `go.languageServerFlags` that will be passed while running the Go language server. [PR 882](https://github.com/Microsoft/vscode-go/pull/882)
        * Set this to `["trace"]` to see the traces from the language server in the output pane under the channel "go-langserver"
        * Set this to `["trace", "logfile", "path to a text file to log the trace]` to log the traces and errors from the language server to a file.
    * `Go: Install Tools` command now installs delve as well in Linux and Windows, but not in Mac OSX. [Commit 30ea096](https://github.com/Microsoft/vscode-go/commit/30ea0960d6f773cc2e8e18ba5113960d1f5faf08) Fixes [Bug 874](https://github.com/Microsoft/vscode-go/issues/874)
* [netroby @netroby](https://github.com/netroby)
    * `Go: Install Tools` command now installs `godoc`. [PR 854](https://github.com/Microsoft/vscode-go/pull/854)

### Others
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Use `GOPATH` as defined by the `go env` output as default. Use `go` binary from default platform specific locations when GOROOT is not set as env variable. Fixes [Bug 873](https://github.com/Microsoft/vscode-go/issues/873)
    * Fix compiling errors for vendor packages in case of symlinks. [PR 864](https://github.com/Microsoft/vscode-go/pull/864)
    * Support links in the test output, which then navigates the user to the right line of the test file where tests are failing. [PR 885](https://github.com/Microsoft/vscode-go/pull/885)
    * Experimental new setting `go.editorContextMenuCommands` to control which commands show up in the editor context menu.
* [Albert Callarisa (@acroca)](https://github.com/acroca) and [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * New setting `go.gotoSymbol.ignoreFolders` that allows to ignore folders while using the "Go to Symbol in Workspace" feature. This takes in an array of folder names (not paths). Best used to ignore vendor folders while doing a workspace symbol search. [PR 795](https://github.com/Microsoft/vscode-go/pull/795)

## 0.6.55 - 3rd March, 2017
* Re-publishing the extension from a non Windows machine as the fix for [Bug 438](https://github.com/Microsoft/vscode-go/issues/438) worked only on Windows machines.
For details read the discussion in [PR 838](https://github.com/Microsoft/vscode-go/pull/838).

## 0.6.54 - 28th February, 2017

### Tooling improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a) and [Sourcegraph](https://github.com/sourcegraph/go-langserver)
    * A new setting `go.useLanguageServer` to use the Go language server from [Sourcegraph](https://github.com/sourcegraph/go-langserver) for features like Hover, Definition, Find All References, Signature Help, Go to Symbol in File and Workspace. [PR 750](https://github.com/Microsoft/vscode-go/pull/750)
        * This is an experimental feature and is not available in Windows yet.
        * If set to true, you will be prompted to install the Go language server. Once installed, you will have to reload VS Code window.
        The language server will then be run by the Go extension in the background to provide services needed for the above mentioned features.

### GOPATH improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix for [Bug 623](https://github.com/Microsoft/vscode-go/issues/623). `${workspaceRoot}` and `~` are now supported in `go.gopath` and `go.toolsGopath` settings. [PR 768](https://github.com/Microsoft/vscode-go/pull/768)
    * The default GOPATH used by Go 1.8 when none is set as environment variable is now supported by the extension as well. [PR 820](https://github.com/Microsoft/vscode-go/pull/820)
* [Vincent Chinedu Okonkwo (@codmajik)](https://github.com/codmajik)
    * Added new setting `go.inferGopath`. When `true` GOPATH will be inferred from the path of the folder opened in VS Code.
    This will override the value from `go.gopath` setting as well as the GOPATH environment variable. [PR 762](https://github.com/Microsoft/vscode-go/pull/762)

### Debugging improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Debug current file without a launch configuration file. Simply press `F5` to start the debug session.
    A `launch.json` is still required to debug tests or for advanced debug configurations. [PR 769](https://github.com/Microsoft/vscode-go/pull/769)
    * Launch configuration snippets are now available for common scenarios like debugging file/package or debugging a test package/function.
    These snippets can be used through IntelliSense when editing the `launch.json` file. [PR 794](https://github.com/Microsoft/vscode-go/pull/794)
    * Fix for [Bug 492](https://github.com/Microsoft/vscode-go/issues/492). Now when there are build errors, starting a debug session will display the error instead of hanging. [PR 774](https://github.com/Microsoft/vscode-go/pull/774)
* [Rob Lourens (@roblourens)](https://github.com/roblourens)
    * Fix for [Bug 438](https://github.com/Microsoft/vscode-go/issues/438). Now when you stop a debug session, all processes started by the session will be closed as well. [PR 765](https://github.com/Microsoft/vscode-go/pull/765)
* [Suraj Barkale (@surajbarkale-dolby)](https://github.com/surajbarkale-dolby)
    * Fix for [Bug 782](https://github.com/Microsoft/vscode-go/issues/782). Helpful error messages when the `program` attribute in `launch.json` file is invalid or not a full path. [PR 790](https://github.com/Microsoft/vscode-go/pull/790)
* [F0zi (@f0zi)](https://github.com/f0zi)
    * Fix for [Bug 689](https://github.com/Microsoft/vscode-go/issues/689). When debugging against a remote machine, paths anywhere under the GOPATH will be correctly mapped so you can set breakpoints in them.
    Previously only paths next to the program could be debugged. [PR 742](https://github.com/Microsoft/vscode-go/pull/742)

### Testing improvements
* [Oleg Bulatov (@dmage)](https://github.com/dmage)
    * Added new setting `go.testOnSave`. When `true`, all tests in the current package will be run on saving a Go file.
    The status of the tests will be shown in the status bar at the bottom of the VS Code window. It is not advised to have this on when you have Auto Save enabled. [PR 810](https://github.com/Microsoft/vscode-go/pull/810)
* [Jeff Willette (@deltaskelta)](https://github.com/deltaskelta)
    * Test output is no longer verbose by default. Add `-v` to the `go.testFlags` to get verbose output. [PR 817](https://github.com/Microsoft/vscode-go/pull/817)

### Other Bug Fixes
* [Richard Musiol (@neelance)](https://github.com/neelance)
    * Fix offset for files with multibyte characters so that features like Hover and Go To Definition work as expected. [PR 780](https://github.com/Microsoft/vscode-go/pull/780)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix for [Bug 777](https://github.com/Microsoft/vscode-go/issues/777) Less disruptive experience during test failures when `go.coveronSave` is `true`.
    * Fix for [Bug 680](https://github.com/Microsoft/vscode-go/issues/680) Reduce noise in Go to Symbol in File feature by removing the entries corresponding to import statements. [PR 775](https://github.com/Microsoft/vscode-go/pull/775)


## 0.6.53 - 30th January, 2017

### Installation improvements
* [Sam Herrmann (@samherrmann)](https://github.com/samherrmann), [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    *  A new setting `go.toolsGopath` for providing an alternate location to install all the Go tools that the extension depends on, if you don't want them cluttering your GOPATH. [PR 351](https://github.com/Microsoft/vscode-go/pull/351) and [PR 737](https://github.com/Microsoft/vscode-go/pull/737).
        * This is useful when you work on different GOPATHs.
        * Remember to run `Go: Install Tools` command to install the tools to the new location.
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * All the "Install tool" options (the pop ups you see) and the `Go: Install Tools` command now support `gometalinter` if it is your chosen linting tool. [PR 735](https://github.com/Microsoft/vscode-go/pull/735).
        * Since `gometalinter` internally installs linters and expects them to be in the user's GOPATH, `gometalinter` will get installed to your GOPATH and not the alternate location specified in `go.toolsGopath`

### Build improvements
* [Matt Aimonetti (@mattetti)](https://github.com/mattetti)
    * While building, we now use the `-i` flag (for non main packages) which installs dependent packages, which in turn get used in subsequent builds resulting in faster builds in bigger workspaces. [PR 718](https://github.com/Microsoft/vscode-go/pull/718)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Build errors with no line numbers (for eg. Import cycle) are now displayed in the output window and will be mapped to the first line of the file. [PR 740](https://github.com/Microsoft/vscode-go/pull/740)

### Test improvements
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * A new setting `go.testFlags` that can be used to run tests. If null, `go.buildFlags` will be used. [PR 482](https://github.com/Microsoft/vscode-go/pull/482)
    * Customize flags for each of the test command by using different keybindings. [PR 482](https://github.com/Microsoft/vscode-go/pull/482). In the below example, `ctrl+shift+t` is bound to run the tests in current file with `-short` flag. The commands here can be `go.test.package`, `go.test.file` or `go.test.cursor`.

        ```json
        {
            "key": "ctrl+shift+t",
            "command": "go.test.file",
            "args": {
                "flags": ["-short"]
            },
            "when": "editorTextFocus"
        }
        ```
    * New toggle command `Go: Toggle Test File` that lets you toggle between your Go file and the corresponding test file. Previous commands `Go: Open Test File` and `Go: Open Implementation For Test File` have been deprecated in favor of this new command. [PR 739](https://github.com/Microsoft/vscode-go/pull/739). You can add a keyboard binding to this as below:

        ```json
        {
            "key": "ctrl+shift+t",
            "command": "go.toggle.test.file",
            "when": "editorTextFocus && editorLangId == 'go'"
        }
        ```
    * If current file is not a test file, show error message while running test commands, instead of displaying success message. Fixes [#303](https://github.com/Microsoft/vscode-go/issues/303)
* [Marcel Voigt (@nochso)](https://github.com/nochso)
   * Show error message in output window when running test coverage fails. [PR 721](https://github.com/Microsoft/vscode-go/pull/721)

### Debugging improvements
* [Andreas Kuhn (@ankon)](https://github.com/ankon)
   * Honor the `cwd` launch configuration argument. [PR 714](https://github.com/Microsoft/vscode-go/pull/714)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
   * GOPATH set in the `env` property in `launch.json` will also be used to find `dlv` tool. [PR 725](https://github.com/Microsoft/vscode-go/pull/725).
* [Rob Lourens (@roblourens)](https://github.com/roblourens)
   * New property `trace` in `launch.json` to provide option to have verbose logging while debugging using vscode-debug-logger. [PR 753](https://github.com/Microsoft/vscode-go/pull/753). This will help in diagnosing issues with debugging in the Go extension.


## 0.6.52 - 5th January, 2017
* [Yuwei Ba (@ibigbug)](https://github.com/ibigbug)
    * Use `http.proxy` setting while installing Go tools. [PR 639](https://github.com/Microsoft/vscode-go/pull/639)
* [chronos (@bylevel)](https://github.com/bylevel)
    * Bug [#465](https://github.com/Microsoft/vscode-go/issues/465) Fix file outline when non English comments in file. [PR 699](https://github.com/Microsoft/vscode-go/pull/699)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Implement Step Out in debgging [Commit 6d0f440](https://github.com/Microsoft/vscode-go/commit/6d0f4405330efb789c16a01434cf096f0f9fb29c)
    * Improve performance by reducing number of calls to `godoc`, `godef`, `gogetdoc`. [PR 711](https://github.com/Microsoft/vscode-go/pull/711)
    * Default value for `go.autocompleteUnimportedPackages` is now false to reduce noise in the suggestion list. Members of unimported packages will still show up in suggestion list after typing dot after package name.

## 0.6.51 - 29th November, 2016
* [Jimmy Kuu (@jimmykuu)](https://github.com/jimmykuu)
    *  Remove blank space in the end of code snippet on function suggest. [PR 628](https://github.com/Microsoft/vscode-go/pull/628)
* [Ahmed W. (@OneofOne)](https://github.com/OneOfOne)
    *  Remove the multiple -d flags in formatting. [PR 644](https://github.com/Microsoft/vscode-go/pull/644)
* [Paweł Kowalak (@viru)](https://github.com/viru)
    *  Snippet for Benchmark Test function. [PR 648](https://github.com/Microsoft/vscode-go/pull/648)
* [Alberto García Hierro (@fiam)](https://github.com/fiam)
    *  Fix Go To Definition, Hover and Signature Help when using Go from tip. [PR 655](https://github.com/Microsoft/vscode-go/pull/655)
* [Cedric Lamoriniere (@cedriclam)](https://github.com/cedriclam)
    *  Fix Generate Test for Current function when the function is a method on a type. [PR 657](https://github.com/Microsoft/vscode-go/pull/657)
* [Potter Dai (@PotterDai)](https://github.com/PotterDai)
    *  Fix Find all References when using multiple GOPATH where one is the substring of the other. [PR 658](https://github.com/Microsoft/vscode-go/pull/658)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    *  Fix autocomplete of unimported versioned packages from gopkg.in [PR 659](https://github.com/Microsoft/vscode-go/pull/659)
    *  Use relative path for vendor packages when the vendor folder is right under $GOPATH/src as well. [PR 660](https://github.com/Microsoft/vscode-go/pull/660)
    *  Fix autocomplete when working with large data. [Bug 640](https://github.com/issues/640). [PR 661](https://github.com/Microsoft/vscode-go/pull/661)

## 0.6.50 - 21st November, 2016
* [lixiaohui (@leaxoy)](https://github.com/leaxoy), [Arnaud Barisain-Monrose (@abarisain)](https://github.com/abarisain), [Zac Bergquist (@zmb3)](https://github.com/zmb3) and [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Added option to use `gogetdoc` for Goto Definition , Hover and Signature Help features. [PR 622](https://github.com/Microsoft/vscode-go/pull/622) To use this, add a setting `"go.docstool": "gogetdoc"` to your settings and reload/restart VS Code. This fixes the below bugs
         * [#440](https://github.com/Microsoft/vscode-go/issues/440) Hover info does not show doc string for structs
         * [#442](https://github.com/Microsoft/vscode-go/issues/442) Goto Definition, Hover, Signature Help do not work for `net` package
         * [#496](https://github.com/Microsoft/vscode-go/issues/496) Goto Definition, Hover, Signature Help do not work for Dot imported functions
         * [#515](https://github.com/Microsoft/vscode-go/issues/515) Go to definition and type info doesn't work with mux.Vars or anything else from gorilla/mux
         * [#567](https://github.com/Microsoft/vscode-go/issues/567) Signature Help and Quick Info do not show function comments for unexported functions
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Revert changes done in the formatting area in 0.6.48 update. Fixes below bugs
         * [#613](https://github.com/Microsoft/vscode-go/issues/613) Format removes imports of vendored packages in use
         * [#630](https://github.com/Microsoft/vscode-go/issues/630) goreturns fails to consider global variables in package

## 0.6.49 - 10th November, 2016
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Revert the deprecation of `go.formatOnSave` due to popular demand.

## 0.6.48 - 9th November, 2016
* [Mark LaPerriere (@marklap)](https://github.com/marklap)
    * Snippets for method declaration, main and init functions [PR 602](https://github.com/Microsoft/vscode-go/pull/602)
* [Rob Lourens @roblourens](https://github.com/roblourens)
    * launch.json intellisense to include all "mode" values. Fixes [#574](https://github.com/Microsoft/vscode-go/issues/574)
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Support for `editor.formatOnSave` and deprecating `go.formatOnSave` [PR 578](https://github.com/Microsoft/vscode-go/pull/578)
    * Remove deprecated language configuration settings [PR 587](https://github.com/Microsoft/vscode-go/pull/587)
    * Feature Request [432](https://github.com/Microsoft/vscode-go/issues/432): Commands to switch to test file and back.  [PR 590](https://github.com/Microsoft/vscode-go/pull/590). You can add your own shortcuts for these commands.
         * `Go: Open Test File`
         * `Go: Open Implementation for Test File`
    * Navigate to test file after generating unit tests using the `Go: Generate unit tests ...` commands. [PR 610](https://github.com/Microsoft/vscode-go/pull/610)
    * Prompt to set GOPATH if not set already [PR 591](https://github.com/Microsoft/vscode-go/pull/591)
    * Improvements to auto complete
         * [#389](https://github.com/Microsoft/vscode-go/issues/389) Fix issue with autocomplete popping up at the end of a string [PR 586](https://github.com/Microsoft/vscode-go/pull/586)
         * [#598](https://github.com/Microsoft/vscode-go/issues/598) Importable packages in auto complete should appear after rest of the suggestions. [PR 603](https://github.com/Microsoft/vscode-go/pull/603)
         * [#598](https://github.com/Microsoft/vscode-go/issues/598) Importing vendored packages from other Go projects should not be allowed. [PR 605](https://github.com/Microsoft/vscode-go/pull/605)
         * [#598](https://github.com/Microsoft/vscode-go/issues/598) When there is an identifier with same name as an available package, do not show the package in the compeltion list [PR 608](https://github.com/Microsoft/vscode-go/pull/608)
    * Other Bug Fixes
         * [#592](https://github.com/Microsoft/vscode-go/issues/592) Use Go from GOROOT while installing tools [PR 594](https://github.com/Microsoft/vscode-go/pull/594)
         * [#585](https://github.com/Microsoft/vscode-go/issues/585) Use fs.stat instead of fs.exists to avoid mistaking "go" folder as "go" file [PR 595](https://github.com/Microsoft/vscode-go/pull/595)
         * [#563](https://github.com/Microsoft/vscode-go/issues/563) Dont run `gotests` on non Go files [PR 584](https://github.com/Microsoft/vscode-go/pull/584)

## 0.6.47 - 26th October 2016
* [Rob Lourens @roblourens](https://github.com/roblourens)
    * Fix the regression in debugging [PR [#576](https://github.com/golang/vscode-go/issues/576)](https://github.com/Microsoft/vscode-go/pull/576)
* [Ramya Rao(@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Preserve focus in editor when running tests [PR [#577](https://github.com/golang/vscode-go/issues/577)](https://github.com/Microsoft/vscode-go/pull/577)

## 0.6.46 - 26th October 2016
* [Ramya Rao(@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Fix issues due to missing version when Go is used from source without release tags [PR [#549](https://github.com/golang/vscode-go/issues/549)](https://github.com/Microsoft/vscode-go/pull/549)
    * Use -imports-only option in go-outline tool [PR [#550](https://github.com/golang/vscode-go/issues/550)](https://github.com/Microsoft/vscode-go/pull/550)
* [Rob Lourens @roblourens](https://github.com/roblourens)
    * Use random port number while debugging [PR [#553](https://github.com/golang/vscode-go/issues/553)](https://github.com/Microsoft/vscode-go/pull/553)

## 0.6.45 - 17th October 2016
* [Ramya Rao(@ramya-rao-a)](https://github.com/ramya-rao-a)
    * Better error message when Go is not found [PR [#536](https://github.com/golang/vscode-go/issues/536)](https://github.com/Microsoft/vscode-go/pull/536)
	* Add setting to control use of -d flag by the formatting tool [PR [#537](https://github.com/golang/vscode-go/issues/537)](https://github.com/Microsoft/vscode-go/pull/537)
	* Replace full path for vendor packages with relative path [PR [#491](https://github.com/golang/vscode-go/issues/491)](https://github.com/Microsoft/vscode-go/pull/491)

## 0.6.44 - 12th October 2016
* [Ludwig Valda Vasquez (@bredov)](https://github.com/bredov)
    * New configuration `go.formatFlags` to pass flags to the formatting tool [PR [#461](https://github.com/golang/vscode-go/issues/461)](https://github.com/Microsoft/vscode-go/pull/461)
* [Dan Mace (@ironcladlou](https://github.com/ironcladlou)
    * New command to execute the last run test. The command is `Go: Test Previous` [PR [#478](https://github.com/golang/vscode-go/issues/478)](https://github.com/Microsoft/vscode-go/pull/478)
    * Send test output to a distinct output channel [PR [#499](https://github.com/golang/vscode-go/issues/499)](https://github.com/Microsoft/vscode-go/pull/499)
* [Cedric Lamoriniere (@cedriclam)](https://github.com/cedriclam)
    * New commands to generate unit test skeletons using `gotests` tool. Needs Go 1.6 or higher. [PR [#489](https://github.com/golang/vscode-go/issues/489)](https://github.com/Microsoft/vscode-go/pull/489)
       * `Go: Generate unit tests for current file`
       * `Go: Generate unit tests for current function`
       * `Go: Generate unit tests for current package`
* [Ramya Rao (@ramya-rao-a)](https://github.com/ramya-rao-a)
    * New configuration `go.testEnVars` to pass environment variables to Go tests [PR [#498](https://github.com/golang/vscode-go/issues/498)](https://github.com/Microsoft/vscode-go/pull/498)
    * Changes made to GOROOT and GOPATH via settings now take effect immediately without requiring to reload/restart VS Code [PR [#458](https://github.com/golang/vscode-go/issues/458)](https://github.com/Microsoft/vscode-go/pull/458)
    * Go extension ready to use after installing tools without requiring to reload/restart VS Code [PR [#457](https://github.com/golang/vscode-go/issues/457)](https://github.com/Microsoft/vscode-go/pull/457)
    * Enable Undo after Rename. [PR [#477](https://github.com/golang/vscode-go/issues/477)](https://github.com/Microsoft/vscode-go/pull/477). Needs `diff` tool which is not available on Windows by default. You can install it from [DiffUtils for Windows](http://gnuwin32.sourceforge.net/packages/diffutils.htm)
    * Autocomplete for functions from unimported packages and for unimported packages themselves. To enable this set  `go.autocompleteUnimportedPackages` to true. [PR [#497](https://github.com/golang/vscode-go/issues/497)](https://github.com/Microsoft/vscode-go/pull/497)
    * Do not allow to import already imported packages via the `Go: Add Import` command. [PR [#508](https://github.com/golang/vscode-go/issues/508)](https://github.com/Microsoft/vscode-go/pull/508)
    * Suggest `gometalinter` to Go 1.5 users since `golint` dropped support for Go 1.5 [PR [#509](https://github.com/golang/vscode-go/issues/509)](https://github.com/Microsoft/vscode-go/pull/509)
    * Fix broken installation for `goimports`. [PR [#470](https://github.com/golang/vscode-go/issues/470)](https://github.com/Microsoft/vscode-go/pull/470) and [PR [#509](https://github.com/golang/vscode-go/issues/509)](https://github.com/Microsoft/vscode-go/pull/509)
* [Arnaud Barisain-Monrose (@abarisain)](https://github.com/abarisain)
    * Fix broken installation for `goreturns` in Windows. [PR [#463](https://github.com/golang/vscode-go/issues/463)](https://github.com/Microsoft/vscode-go/pull/463)

## 0.6.43 - August 2016
* [Matt Aimonetti (@mattetti)](https://github.com/mattetti)
    * New command to install/update all Go tools that the Go extension needs. The command is `Go: Install Tools` [PR [#428](https://github.com/golang/vscode-go/issues/428)](https://github.com/Microsoft/vscode-go/pull/428)
* [Ryan Veazey (@ryanz)](https://github.com/ryanvz)
    * Auto-generated launch.json to have `showLog:true`. [PR [#412](https://github.com/golang/vscode-go/issues/412)](https://github.com/Microsoft/vscode-go/pull/412)
* [Arnaud Barisain-Monrose (@abarisain)](https://github.com/abarisain)
    * Updates to Extra Info feature: Documentation from `godoc` now appears on hover [PR [#424](https://github.com/golang/vscode-go/issues/424)](https://github.com/Microsoft/vscode-go/pull/424)

## 0.6.40-42 - July 2016
* [Sajjad Hashemian (@sijad)](https://github.com/sijad)
    * Option to choose `gometalinter` as tool for linting [PR [#294](https://github.com/golang/vscode-go/issues/294)](https://github.com/Microsoft/vscode-go/pull/294)
* [Bartosz Wróblewski (@bawr)](https://github.com/bawr)
    * New configuration `showLog` to toggle the debugging output from `delve` [PR [#352](https://github.com/golang/vscode-go/issues/352)](https://github.com/Microsoft/vscode-go/pull/352)
* [benclarkwood (@benclarkwood)](https://github.com/benclarkwood)
    * Better logging while installing tools [PR [#375](https://github.com/golang/vscode-go/issues/375)](https://github.com/Microsoft/vscode-go/pull/375)
