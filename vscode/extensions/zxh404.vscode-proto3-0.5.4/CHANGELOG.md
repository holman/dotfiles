## Release Notes

### 0.5.4
- Fix snippets tabstop (pr#109)
- Add underscore as legal first char of message names (pr#105)
- Add basic symbol provider for message/rpc (pr#104)
- Make extension mutli-root aware (pr#99)

### 0.5.3
- Add syntax highlighting for markdown fenced code block (pr#95)
- Little improvements so it works for multi folder workspace (pr#94)
- Add assume filename flag to clang-format arguments (pr#93)

### 0.5.2
- Fixed highlighting issues regarding custom options.

### 0.5.0
- Fixed some highlighting issues (issue#45 and issue#91)
- doc(clang-format): add documentation on multiple formatting options (pr#81)
- Update format to respect pwd so formatting files are used properly (pr#82)
- Include instructions for fixing "spawnsync clang-format enoent" on MacOS. (pr#83)
- Fixed issue#84 (pr#85)
- Add configuration option for compile all action (pr#89)

### 0.4.2
- Fixed issue#74

### 0.4.1
- Fixed issue#72

### 0.4.0
- Updated README.md.
- Added [`compile_on_save` option](https://github.com/zxh0/vscode-proto3#fields).
- Updated Icon.
- Configuration changes no longer require restart.
- Additional examples.

### 0.3.0
- Support "Go to Definition" (issue#34).
- Fixed string highlighting issues (issue#42).

### 0.2.2
- Support clang-format style.
- Fixed issue#32

### 0.2.1
- Fixed issue#26

### 0.2.0
- Default to look protoc in path (issue#24).
- Support "Format Document" if clang-format is in path (issue#13).

### 0.1.3
- Fixed some syntax highlighting issues (issue#2, issue#21, issue#22).

### 0.1.2
- Fixed some syntax highlighting issues.

### 0.1.1
- Fixed some syntax highlighting issues.
- Skip the protoc invocation when it's not configured. 

### 0.1.0
- Fixed some syntax highlighting issues.
- Use user and workspace settings instead of a custom settings.json file. 
- (NOTE: Old users should move the settings.json file into .vscode folder!)

### 0.0.7
- Fixed syntax highlighting bug of keyword `stream`.

### 0.0.6
- Fixed some syntax highlighting problems.

### 0.0.5
- Fixed some bugs.

### 0.0.4
- Initial release.