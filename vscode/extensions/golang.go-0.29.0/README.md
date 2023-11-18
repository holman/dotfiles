# Go for Visual Studio Code

[![Slack](https://img.shields.io/badge/slack-gophers-green.svg?style=flat)](https://gophers.slack.com/messages/vscode/)

<!--TODO: We should add a badge for the build status or link to the build dashboard.-->

[The VS Code Go extension](https://marketplace.visualstudio.com/items?itemName=golang.go)
provides rich language support for the
[Go programming language](https://golang.org/).


## Quick Start

Welcome! 👋🏻<br/>
Whether you are new to Go or an experienced Go developer, we hope this
extension fits your needs and enhances your development experience.

* **Step 1.** If you haven't done so already, install [Go](https://golang.org)
  and the [VS Code Go extension].
  * [Go installation guide]. This extension works best with Go 1.14+.
  * [Managing extensions in VS Code].
* **Step 2.** To activate the extension, open any directory or workspace
  containing Go code. Once activated, the [Go status bar](https://github.com/golang/vscode-go/blob/HEAD/docs/ui.md) will
  appear in the bottom left corner of the window and show the recognized Go
  version.
* **Step 3.** The extension depends on [a set of extra command-line tools](#tools).
  If they are missing, the extension will show the "⚠️ Analysis Tools Missing"
  warning. Click the notification to complete the installation.

<p align="center">
<img src="https://github.com/golang/vscode-go/raw/HEAD/docs/images/installtools.gif" width=75%>
<br/>
<em>(Install Missing Tools)</em>
</p>

You are ready to Go :-) &nbsp;&nbsp; 🎉🎉🎉

Please be sure to learn more about the many [features](#features) of this
extension, as well as how to [customize](#customization) them. Take a look at
[Troubleshooting](https://github.com/golang/vscode-go/blob/HEAD/docs/troubleshooting.md) and [Help](#ask-for-help) for further
guidance.

If you are new to Go, [this article](https://golang.org/doc/code.html) provides
the overview on Go code organization and basic `go` commands. Watch ["Getting
started with VS Code Go"] for an explanation of how to build your first Go
application using VS Code Go.

## Features

This extension provides many features, including [IntelliSense],
[code navigation], and [code editing] support. It also shows [diagnostics] as
you work and provides enhanced support for [testing] and [debugging] your
programs. See the [full feature breakdown] for more details and to learn how to
tune its behavior.

<p align=center>
<img src="https://github.com/golang/vscode-go/raw/HEAD/docs/images/completion-signature-help.gif" width=75%>
<br/>
<em>(Code completion and Signature Help)</em>
</p>

In addition to integrated editing features, the extension provides several
commands for working with Go files. You can access any of these by opening the
Command Palette (`Ctrl+Shift+P` on Linux/Windows and `Cmd+Shift+P` on Mac), and
then typing in the command name. See the
[full list of commands](https://github.com/golang/vscode-go/blob/HEAD/docs/commands.md#detailed-list) provided by this
extension.

<p align=center>
<img src="https://github.com/golang/vscode-go/raw/HEAD/docs/images/toggletestfile.gif" width=75%>
<br/><em>(Toggle Test File)</em></p>

**⚠️ Note**: the default syntax highlighting for Go files is provided by a
[TextMate rule](https://github.com/jeff-hykin/better-go-syntax) embedded in VS
Code, not by this extension.

## Tools

The extension uses a few command-line tools developed by the Go community. In
particular, `go`, `gopls`, and `dlv` **must** be installed for this extension
to work correctly. See the [tools documentation](https://github.com/golang/vscode-go/blob/HEAD/docs/tools.md) for a complete
list of tools the extension depends on.

In order to locate these command-line tools, the extension searches
`GOPATH/bin` and directories specified in the `PATH` environment variable (or
`Path` on Windows) with which the VS Code process has started. If the tools are
not found, the extension will prompt you to install the missing tools and show
the "⚠️ Analysis Tools Missing" warning in the bottom right corner. Please
install them by responding to the warning notification, or by manually running
the [`Go: Install/Update Tools` command].

## Setting up your workspace

[Go modules](https://golang.org/ref/mod) are how Go manages dependencies in
recent versions of Go. Modules replace the `GOPATH`-based approach to specifying
which source files are used in a given build, and they are the default build
mode in go1.16+. While this extension continues to support both Go modules and
`GOPATH` modes, we highly recommend Go development in module mode. If you are
working on existing projects, please consider migrating to modules.

Unlike the traditional `GOPATH` mode, module mode does not require the workspace
to be located under `GOPATH` nor to use a specific structure. A module is
defined by a directory tree of Go source files with a `go.mod` file in the
tree's root directory.

Your project may involve one or more modules. If you are working with multiple
modules or uncommon project layouts, you will need to configure your workspace
by using [Workspace Folders]. Please see this [documentation about supported
workspace layouts].

## Customization

The extension needs no configuration and should work out of the box. However,
you may wish to adjust settings to customize its behavior. Please see the
[settings documentation](https://github.com/golang/vscode-go/blob/HEAD/docs/settings.md) for a comprehensive list of settings.
See [advanced topics](https://github.com/golang/vscode-go/blob/HEAD/docs/advanced.md) for further customizations and unique
use cases.

## Troubleshooting

If the extension isn't working as you expect, you can take a look at our
troubleshooting guides. There is one for [general
troubleshooting](https://github.com/golang/vscode-go/blob/HEAD/docs/troubleshooting.md), and another specifically for
[troubleshooting the debugging feature](https://github.com/golang/vscode-go/blob/HEAD/docs/debugging.md#troubleshooting).

## Ask for help

If the troubleshooting guides did not resolve the issue, please reach out to us
by [filing an issue](https://github.com/golang/vscode-go/issues/new/choose),
[starting a GitHub discussion](https://github.com/golang/vscode-go/discussions),
or by asking a question on [Stack Overflow].

Also, you can take a look at [go.dev/learn](https://go.dev/learn) and
[golang.org/help](https://golang.org/help) for more general guidance on using
Go.

## Preview version

If you'd like to get early access to new features and bug fixes, you can use the
nightly build of this extension. Learn how to install it in by reading the
[Go Nightly documentation](https://github.com/golang/vscode-go/blob/HEAD/docs/nightly.md).

## Contributing

We welcome your contributions and thank you for working to improve the Go
development experience in VS Code. If you would like to help work on the VS Code
Go extension, please see our [contribution guide](https://github.com/golang/vscode-go/blob/HEAD/docs/contributing.md). It
explains how to build and run the extension locally, and describes the process
of sending a contribution.

## Code of Conduct

This project follows the
[Go Community Code of Conduct](https://golang.org/conduct). If you encounter a
conduct-related issue, please mail conduct@golang.org.

## License

[MIT](https://github.com/golang/vscode-go/blob/HEAD/LICENSE)

[Stack Overflow]: https://stackoverflow.com/questions/tagged/go+visual-studio-code
[`gopls`]: https://golang.org/s/gopls
[`go`]: https://golang.org/cmd/go
[Managing extensions in VS Code]: https://code.visualstudio.com/docs/editor/extension-gallery
[VS Code Go extension]: https://marketplace.visualstudio.com/items?itemName=golang.go
[Go installation guide]: https://golang.org/doc/install
["Getting started with VS Code Go"]: https://youtu.be/1MXIGYrMk80
[IntelliSense]: https://github.com/golang/vscode-go/blob/master/docs/features.md#intellisense
[code navigation]: https://github.com/golang/vscode-go/blob/master/docs/features.md#code-navigation
[code editing]: https://github.com/golang/vscode-go/blob/master/docs/features.md#code-editing
[diagnostics]: https://github.com/golang/vscode-go/blob/master/docs/features.md#diagnostics
[testing]: https://github.com/golang/vscode-go/blob/master/docs/features.md##run-and-test-in-the-editor
[debugging]: #debugging
[full feature breakdown]: https://github.com/golang/vscode-go/blob/master/docs/features.md
[workspace documentation]: https://github.com/golang/tools/blob/master/gopls/doc/workspace.md
[`Go: Install/Update Tools` command]: https://github.com/golang/vscode-go/blob/master/docs/commands.md#go-installupdate-tools
[documentation about supported workspace layouts]: https://github.com/golang/tools/blob/master/gopls/doc/workspace.md
[Workspace Folders]: https://code.visualstudio.com/docs/editor/multi-root-workspaces
