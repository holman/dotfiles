# Changelog

## 2019.10.1 (22 October 2019)

### Enhancements

1. Support other variables for notebookFileRoot besides ${workspaceRoot}. Specifically allow things like ${fileDirName} so that the dir of the first file run in the interactive window is used for the current directory.
   ([#4441](https://github.com/Microsoft/vscode-python/issues/4441))
1. Add command palette commands for native editor (run all cells, run selected cell, add new cell). And remove interactive window commands from contexts where they don't apply.
   ([#7800](https://github.com/Microsoft/vscode-python/issues/7800))
1. Added ability to auto-save chagnes made to the notebook.
   ([#7831](https://github.com/Microsoft/vscode-python/issues/7831))

### Fixes

1. Fix regression to allow connection to servers with no token and no password and add functional test for this scenario
   ([#7137](https://github.com/Microsoft/vscode-python/issues/7137))
1. Perf improvements for opening notebooks with more than 100 cells.
   ([#7483](https://github.com/Microsoft/vscode-python/issues/7483))
1. Fix jupyter server startup hang when xeus-cling kernel is installed.
   ([#7569](https://github.com/Microsoft/vscode-python/issues/7569))
1. Make interactive window and native take their fontSize and fontFamily from the settings in VS Code.
   ([#7624](https://github.com/Microsoft/vscode-python/issues/7624))
1. Fix a hang in the Interactive window when connecting guest to host after the host has already started the interactive window.
   ([#7638](https://github.com/Microsoft/vscode-python/issues/7638))
1. Change the default cell marker to '# %%' instead of '#%%' to prevent linter errors in python files with markers.
   Also added a new setting to change this - 'python.dataScience.defaultCellMarker'.
   ([#7674](https://github.com/Microsoft/vscode-python/issues/7674))
1. When there's no workspace open, use the directory of the opened file as the root directory for a jupyter session.
   ([#7688](https://github.com/Microsoft/vscode-python/issues/7688))
1. Fix selection and focus not updating when clicking around in a notebook editor.
   ([#7802](https://github.com/Microsoft/vscode-python/issues/7802))
1. Fix add new cell buttons in the notebook editor to give the new cell focus.
   ([#7820](https://github.com/Microsoft/vscode-python/issues/7820))
1. Do not use the PTVSD package version in the folder name for the wheel experiment.
   ([#7836](https://github.com/Microsoft/vscode-python/issues/7836))
1. Prevent updates to the cell text when cell execution of the same cell has commenced or completed.
   ([#7844](https://github.com/Microsoft/vscode-python/issues/7844))
1. Hide the parameters intellisense widget in the `Notebook Editor` when it is not longer required.
   ([#7851](https://github.com/Microsoft/vscode-python/issues/7851))
1. Allow the "Create New Blank Jupyter Notebook" command to be run when the python extension is not loaded yet.
   ([#7888](https://github.com/Microsoft/vscode-python/issues/7888))
1. Ensure the `*.trie` files related to `font kit` npm module are copied into the output directory as part of the `Webpack` bundling operation.
   ([#7899](https://github.com/Microsoft/vscode-python/issues/7899))
1. CTRL+S is not saving a Notebook file.
   ([#7904](https://github.com/Microsoft/vscode-python/issues/7904))
1. When automatically opening the `Notebook Editor`, then ignore uris that do not have a `file` scheme
   ([#7905](https://github.com/Microsoft/vscode-python/issues/7905))
1. Minimize the changes to an ipynb file when saving - preserve metadata and spacing.
   ([#7960](https://github.com/Microsoft/vscode-python/issues/7960))
1. Fix intellisense popping up in the wrong spot when first typing in a cell.
   ([#8009](https://github.com/Microsoft/vscode-python/issues/8009))
1. Fix python.dataScience.maxOutputSize to be honored again.
   ([#8010](https://github.com/Microsoft/vscode-python/issues/8010))
1. Fix markdown disappearing after editing and hitting the escape key.
   ([#8045](https://github.com/Microsoft/vscode-python/issues/8045))

### Code Health

1. Add functional tests for notebook editor's use of the variable list.
   ([#7369](https://github.com/Microsoft/vscode-python/issues/7369))
1. More functional tests for the notebook editor.
   ([#7372](https://github.com/Microsoft/vscode-python/issues/7372))
1. Update version of `@types/vscode`.
   ([#7832](https://github.com/Microsoft/vscode-python/issues/7832))
1. Use `Webview.asWebviewUri` to generate a URI for use in the `Webview Panel` instead of hardcoding the resource `vscode-resource`.
   ([#7834](https://github.com/Microsoft/vscode-python/issues/7834))


## 2019.10.0 (8 October 2019)

### Enhancements

1. Experimental version of a native editor for ipynb files.
   ([#5959](https://github.com/Microsoft/vscode-python/issues/5959))
1. Added A/A testing.
   ([#6793](https://github.com/Microsoft/vscode-python/issues/6793))
1. Opt insiders users into beta language server by default.
   ([#7108](https://github.com/Microsoft/vscode-python/issues/7108))
1. Add basic liveshare support for native.
   ([#7235](https://github.com/Microsoft/vscode-python/issues/7235))
1. Change main toolbar to match design spec.
   ([#7240](https://github.com/Microsoft/vscode-python/issues/7240))
1. Telemetry for native editor support.
   ([#7252](https://github.com/Microsoft/vscode-python/issues/7252))
1. Change Variable Explorer to use a sticky button on the main toolbar.
   ([#7354](https://github.com/Microsoft/vscode-python/issues/7354))
1. Add left side navigation bar to native editor.
   ([#7377](https://github.com/Microsoft/vscode-python/issues/7377))
1. Add middle toolbar to a native editor cell.
   ([#7378](https://github.com/Microsoft/vscode-python/issues/7378))
1. Indented the status bar for outputs and changed the background color in the native editor.
   ([#7379](https://github.com/Microsoft/vscode-python/issues/7379))
1. Added a setting `python.experiments.enabled` to enable/disable A/B tests within the extension.
   ([#7410](https://github.com/Microsoft/vscode-python/issues/7410))
1. Add a play button for all users.
   ([#7423](https://github.com/Microsoft/vscode-python/issues/7423))
1. Add a command to show the `Language Server` output panel.
   ([#7459](https://github.com/Microsoft/vscode-python/issues/7459))
1. Make empty notebooks (from File | New File) contain at least one cell.
   ([#7516](https://github.com/Microsoft/vscode-python/issues/7516))
1. Add "clear all output" button to native editor.
   ([#7517](https://github.com/Microsoft/vscode-python/issues/7517))
1. Add support for ptvsd and debug adapter experiments in remote debugging API.
   ([#7549](https://github.com/Microsoft/vscode-python/issues/7549))
1. Support other variables for `notebookFileRoot` besides `${workspaceRoot}`. Specifically allow things like `${fileDirName}` so that the directory of the first file run in the interactive window is used for the current directory.
   ([#4441](https://github.com/Microsoft/vscode-python/issues/4441))

### Fixes

1. Replaced occurrences of `pep8` with `pycodestyle.`
   All mentions of pep8 have been replaced with pycodestyle.
   Add script to replace outdated settings with the new ones in user settings.json
   * python.linting.pep8Args -> python.linting.pycodestyleArgs
   * python.linting.pep8CategorySeverity.E -> python.linting.pycodestyleCategorySeverity.E
   * python.linting.pep8CategorySeverity.W -> python.linting.pycodestyleCategorySeverity.W
   * python.linting.pep8Enabled -> python.linting.pycodestyleEnabled
   * python.linting.pep8Path -> python.linting.pycodestylePath
   * (thanks [Marsfan](https://github.com/Marsfan))
   ([#410](https://github.com/Microsoft/vscode-python/issues/410))
1. Do not change `foreground` colors in test statusbar.
   ([#4387](https://github.com/Microsoft/vscode-python/issues/4387))
1. Set the `__file__` variable whenever running code so that `__file__` usage works in the interactive window.
   ([#5459](https://github.com/Microsoft/vscode-python/issues/5459))
1. Ensure Windows Store install of Python is displayed in the statusbar.
   ([#5926](https://github.com/Microsoft/vscode-python/issues/5926))
1. Fix loging for determining python path from workspace of active text editor (thanks [Eric Bajumpaa (@SteelPhase)](https://github.com/SteelPhase)).
   ([#6282](https://github.com/Microsoft/vscode-python/issues/6282))
1. Changed the way scrolling is treated. Now we only check for the position of the scroll, the size of the cell won't matter.
   Still the interactive window will snap to the bottom if you already are at the bottom, and will stay in place if you are not. Like a chat window.
   Tested to work with:
   - regular code
   - dataframes
   - big and regular plots
   Turned the check of the scroll at the bottom from checking equal to checking a range to make it work with fractions.
   ([#6580](https://github.com/Microsoft/vscode-python/issues/6580))
1. Changed the name of the setting 'Run Magic Commands' to 'Run Startup Commands' to avoid confusion.
   ([#6842](https://github.com/Microsoft/vscode-python/issues/6842))
1. Fix the debugger being installed even when available from the VSCode install.
   ([#6907](https://github.com/Microsoft/vscode-python/issues/6907))
1. Fixes to detection of shell.
   ([#6928](https://github.com/Microsoft/vscode-python/issues/6928))
1. Delete the old session immediately after session restart instead of on close.
   ([#6975](https://github.com/Microsoft/vscode-python/issues/6975))
1. Add support for the new JUnit XML format used by pytest 5.1+.
   ([#6990](https://github.com/Microsoft/vscode-python/issues/6990))
1. Set a content security policy on webviews.
   ([#7007](https://github.com/Microsoft/vscode-python/issues/7007))
1. Fix regression to allow connection to servers with no token and no password and add functional test for this scenario.
   ([#7137](https://github.com/Microsoft/vscode-python/issues/7137))
1. Resolve variables such as `${workspaceFolder}` in the `envFile` setting of `launch.json`.
   ([#7210](https://github.com/Microsoft/vscode-python/issues/7210))
1. Fixed A/B testing sampling.
   ([#7218](https://github.com/Microsoft/vscode-python/issues/7218))
1. Added commands for 'dd', 'ctrl + enter', 'alt + enter', 'a', 'b', 'j', 'k' in the native Editor to behave just like JupyterLabs.
   ([#7229](https://github.com/Microsoft/vscode-python/issues/7229))
1. Add support for CTRL+S when the native editor has input focus (best we can do without true editor support)
   Also fix issue with opening two or more not gaining focus correctly.
   ([#7238](https://github.com/Microsoft/vscode-python/issues/7238))
1. Fix monaco editor layout perf.
   ([#7241](https://github.com/Microsoft/vscode-python/issues/7241))
1. Fix 'history' in the input box for the interactive window to work again. Up arrow and down arrow should now scroll through the things already typed in.
   ([#7253](https://github.com/Microsoft/vscode-python/issues/7253))
1. Fix plot viewer to allow exporting again.
   ([#7257](https://github.com/Microsoft/vscode-python/issues/7257))
1. Make ipynb files auto save on shutting down VS code as our least bad option at the moment.
   ([#7258](https://github.com/Microsoft/vscode-python/issues/7258))
1. Update icons to newer look.
   ([#7261](https://github.com/Microsoft/vscode-python/issues/7261))
1. The native editor will now wrap all its content instead of showing a horizontal scrollbar.
   ([#7272](https://github.com/Microsoft/vscode-python/issues/7272))
1. Deprecate the 'runMagicCommands' datascience setting.
   ([#7294](https://github.com/Microsoft/vscode-python/issues/7294))
1. Fix white icon background and finish update all icons to new style.
   ([#7302](https://github.com/Microsoft/vscode-python/issues/7302))
1. Fixes to display `Python` specific debug configurations in `launch.json`.
   ([#7304](https://github.com/Microsoft/vscode-python/issues/7304))
1. Fixed intellisense support on the native editor.
   ([#7316](https://github.com/Microsoft/vscode-python/issues/7316))
1. Fix double opening an ipynb file to still use the native editor.
   ([#7318](https://github.com/Microsoft/vscode-python/issues/7318))
1. 'j' and 'k' were reversed for navigating through the native editor.
   ([#7330](https://github.com/Microsoft/vscode-python/issues/7330))
1. 'a' keyboard shortcut doesn't add a cell above if current cell is the first.
   ([#7334](https://github.com/Microsoft/vscode-python/issues/7334))
1. Add the 'add cell' line between cells, on cells, and at the bottom and top.
   ([#7362](https://github.com/Microsoft/vscode-python/issues/7362))
1. Runtime errors cause the run button to disappear.
   ([#7370](https://github.com/Microsoft/vscode-python/issues/7370))
1. Surface jupyter notebook search errors to the user.
   ([#7392](https://github.com/Microsoft/vscode-python/issues/7392))
1. Allow cells to be re-executed on second open of an ipynb file.
   ([#7417](https://github.com/Microsoft/vscode-python/issues/7417))
1. Implement dirty file tracking for notebooks so that on reopening of VS code they are shown in the dirty state.
   Canceling the save will get them back to their on disk state.
   ([#7418](https://github.com/Microsoft/vscode-python/issues/7418))
1. Make ipynb files change to dirty when moving/deleting/changing cells.
   ([#7439](https://github.com/Microsoft/vscode-python/issues/7439))
1. Initial collapse / expand state broken by native liveshare work / gather.
   ([#7445](https://github.com/Microsoft/vscode-python/issues/7445))
1. Converting a native markdown cell to code removes the markdown source.
   ([#7446](https://github.com/Microsoft/vscode-python/issues/7446))
1. Text is cut off on the right hand side of a notebook editor.
   ([#7472](https://github.com/Microsoft/vscode-python/issues/7472))
1. Added a prompt asking users to enroll back in the insiders program.
   ([#7473](https://github.com/Microsoft/vscode-python/issues/7473))
1. Fix collapse bar and add new line spacing for the native editor.
   ([#7489](https://github.com/Microsoft/vscode-python/issues/7489))
1. Add new cell top most toolbar button should take selection into account when adding a cell.
   ([#7490](https://github.com/Microsoft/vscode-python/issues/7490))
1. Move up and move down arrows in native editor are different sizes.
   ([#7494](https://github.com/Microsoft/vscode-python/issues/7494))
1. Fix jedi intellisense in the notebook editor to be performant.
   ([#7497](https://github.com/Microsoft/vscode-python/issues/7497))
1. The add cell line should have a hover cursor.
   ([#7508](https://github.com/Microsoft/vscode-python/issues/7508))
1. Toolbar in the middle of a notebook cell should show up on hover.
   ([#7515](https://github.com/Microsoft/vscode-python/issues/7515))
1. 'z' key will now undo cell deletes/adds/moves.
   ([#7518](https://github.com/Microsoft/vscode-python/issues/7518))
1. Rename and restyle the save as python file button.
   ([#7519](https://github.com/Microsoft/vscode-python/issues/7519))
1. Fix for changing a file in the status bar to a notebook/jupyter file to open the new native notebook editor.
   ([#7521](https://github.com/Microsoft/vscode-python/issues/7521))
1. Running a cell by clicking the mouse should behave like shift+enter and move to the next cell (or add one to the bottom).
   ([#7522](https://github.com/Microsoft/vscode-python/issues/7522))
1. Output color makes a text only notebook with a lot of cells hard to read. Change output color to be the same as the background like Jupyter does.
   ([#7526](https://github.com/Microsoft/vscode-python/issues/7526))
1. Fix data viewer sometimes showing no data at all (especially on small datasets).
   ([#7530](https://github.com/Microsoft/vscode-python/issues/7530))
1. First run of run all cells doesn't run the first cell first.
   ([#7558](https://github.com/Microsoft/vscode-python/issues/7558))
1. Saving an untitled notebook editor doesn't change the tab to have the new file name.
   ([#7561](https://github.com/Microsoft/vscode-python/issues/7561))
1. Closing and reopening a notebook doesn't reset the execution count.
   ([#7565](https://github.com/Microsoft/vscode-python/issues/7565))
1. After restarting kernel, variables don't reset in the notebook editor.
   ([#7573](https://github.com/Microsoft/vscode-python/issues/7573))
1. CTRL+1/CTRL+2 had stopped working in the interactive window.
   ([#7597](https://github.com/Microsoft/vscode-python/issues/7597))
1. Ensure the insiders prompt only shows once.
   ([#7606](https://github.com/Microsoft/vscode-python/issues/7606))
1. Added prompt to flip "inheritEnv" setting to false to fix conda activation issue.
   ([#7607](https://github.com/Microsoft/vscode-python/issues/7607))
1. Toggling line numbers and output was not possible in the notebook editor.
   ([#7610](https://github.com/Microsoft/vscode-python/issues/7610))
1. Align execution count with first line of a cell.
   ([#7611](https://github.com/Microsoft/vscode-python/issues/7611))
1. Fix debugging cells to work when the python executable has spaces in the path.
   ([#7627](https://github.com/Microsoft/vscode-python/issues/7627))
1. Add switch channel commands into activationEvents to fix `command 'Python.swichToDailyChannel' not found`.
   ([#7636](https://github.com/Microsoft/vscode-python/issues/7636))
1. Goto cell code lens was not scrolling.
   ([#7639](https://github.com/Microsoft/vscode-python/issues/7639))
1. Make interactive window and native take their `fontSize` and `fontFamily` from the settings in VS Code.
   ([#7624](https://github.com/Microsoft/vscode-python/issues/7624))
1. Fix a hang in the Interactive window when connecting guest to host after the host has already started the interactive window.
   ([#7638](https://github.com/Microsoft/vscode-python/issues/7638))
1. When there's no workspace open, use the directory of the opened file as the root directory for a Jupyter session.
   ([#7688](https://github.com/Microsoft/vscode-python/issues/7688))
1. Allow the language server to pick a default caching mode.
   ([#7821](https://github.com/Microsoft/vscode-python/issues/7821))

### Code Health

1. Use jsonc-parser instead of strip-json-comments.
   (thanks [Mikhail Bulash](https://github.com/mikeroll/))
   ([#4819](https://github.com/Microsoft/vscode-python/issues/4819))
1. Remove `donjamayanne.jupyter` integration.
   (thanks [Mikhail Bulash](https://github.com/mikeroll/))
   ([#6052](https://github.com/Microsoft/vscode-python/issues/6052))
1. Drop `python.updateSparkLibrary` command.
   (thanks [Mikhail Bulash](https://github.com/mikeroll/))
   ([#6091](https://github.com/Microsoft/vscode-python/issues/6091))
1. Re-enabled smoke tests (refactored in `node.js` with [puppeteer](https://github.com/GoogleChrome/puppeteer)).
   ([#6511](https://github.com/Microsoft/vscode-python/issues/6511))
1. Handle situations where language client is disposed earlier than expected.
   ([#6865](https://github.com/Microsoft/vscode-python/issues/6865))
1. Put Data science functional tests that use real jupyter into their own test pipeline.
   ([#7066](https://github.com/Microsoft/vscode-python/issues/7066))
1. Send telemetry for what language server is chosen.
   ([#7109](https://github.com/Microsoft/vscode-python/issues/7109))
1. Add telemetry to measure debugger start up performance.
   ([#7332](https://github.com/Microsoft/vscode-python/issues/7332))
1. Decouple the DS location tracker from the debug session telemetry.
   ([#7352](https://github.com/Microsoft/vscode-python/issues/7352))
1. Test scaffolding for notebook editor.
   ([#7367](https://github.com/Microsoft/vscode-python/issues/7367))
1. Add functional tests for notebook editor's use of the variable list.
   ([#7369](https://github.com/Microsoft/vscode-python/issues/7369))
1. Tests for the notebook editor for different mime types.
   ([#7371](https://github.com/Microsoft/vscode-python/issues/7371))
1. Split Cell class for different views.
   ([#7376](https://github.com/Microsoft/vscode-python/issues/7376))
1. Refactor Azure Pipelines to use stages.
   ([#7431](https://github.com/Microsoft/vscode-python/issues/7431))
1. Add unit tests to guarantee that the extension version in the master branch has the '-dev' suffix.
   ([#7471](https://github.com/Microsoft/vscode-python/issues/7471))
1. Add a smoke test for the `Interactive Window`.
   ([#7653](https://github.com/Microsoft/vscode-python/issues/7653))
1. Download PTVSD wheels (for the new PTVSD) as part of CI.
   ([#7028](https://github.com/Microsoft/vscode-python/issues/7028))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort](https://pypi.org/project/isort/)
- [jedi](https://pypi.org/project/jedi/)
  and [parso](https://pypi.org/project/parso/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.9.1 (6 September 2019)

### Fixes

1. Fixes to automatic scrolling on the interactive window.
   ([#6580](https://github.com/Microsoft/vscode-python/issues/6580))

## 2019.9.0 (3 September 2019)

### Enhancements

1. Get "select virtual environment for the workspace" prompt to show up regardless of pythonpath setting.
   ([#5499](https://github.com/Microsoft/vscode-python/issues/5499))
1. Changes to telemetry with regards to discovery of python environments.
   ([#5593](https://github.com/Microsoft/vscode-python/issues/5593))
1. Update Jedi to 0.15.1 and parso to 0.5.1.
   ([#6294](https://github.com/Microsoft/vscode-python/issues/6294))
1. Moved Language Server logging to its own output channel.
   ([#6559](https://github.com/Microsoft/vscode-python/issues/6559))
1. Interactive window will only snap to the bottom if the user is already in the bottom, like a chat window.
   ([#6580](https://github.com/Microsoft/vscode-python/issues/6580))
1. Add debug command code lenses when in debug mode.
   ([#6672](https://github.com/Microsoft/vscode-python/issues/6672))
1. Implemented prompt for survey.
   ([#6752](https://github.com/Microsoft/vscode-python/issues/6752))
1. Add code gathering tools.
   ([#6810](https://github.com/Microsoft/vscode-python/issues/6810))
1. Added a setting called 'Run Magic Commands'. The input should be python code to be executed when the interactive window is loading.
   ([#6842](https://github.com/Microsoft/vscode-python/issues/6842))
1. Added a setting so the user can decide if they want the debugger to debug only their code, or also debug external libraries.
   ([#6870](https://github.com/Microsoft/vscode-python/issues/6870))
1. Implemented prompt for survey using A/B test framework.
   ([#6957](https://github.com/Microsoft/vscode-python/issues/6957))

### Fixes

1. Delete the old session immediatly after session restart instead of on close
   ([#6975](https://github.com/Microsoft/vscode-python/issues/6975))
1. Add support for the "pathMappings" setting in "launch" debug configs.
   ([#3568](https://github.com/Microsoft/vscode-python/issues/3568))
1. Supports error codes like ABC123 as used in plugins.
   ([#4074](https://github.com/Microsoft/vscode-python/issues/4074))
1. Fixes to insertion of commas when inserting generated debug configurations in `launch.json`.
   ([#5531](https://github.com/Microsoft/vscode-python/issues/5531))
1. Fix code lenses shown for pytest.
   ([#6303](https://github.com/Microsoft/vscode-python/issues/6303))
1. Make data viewer change row height according to font size in settings.
   ([#6614](https://github.com/Microsoft/vscode-python/issues/6614))
1. Fix miniconda environments to work.
   ([#6802](https://github.com/Microsoft/vscode-python/issues/6802))
1. Drop dedent-on-enter for "return" statements. It will be addressed in https://github.com/microsoft/vscode-python/issues/6564.
   ([#6813](https://github.com/Microsoft/vscode-python/issues/6813))
1. Show PTVSD exceptions to the user.
   ([#6818](https://github.com/Microsoft/vscode-python/issues/6818))
1. Tweaked message for restarting VS Code to use a Python Extension insider build
   (thanks [Marsfan](https://github.com/Marsfan)).
   ([#6838](https://github.com/Microsoft/vscode-python/issues/6838))
1. Do not execute empty code cells or render them in the interactive window when sent from the editor or input box.
   ([#6839](https://github.com/Microsoft/vscode-python/issues/6839))
1. Fix failing functional tests (for pytest) in the extension.
   ([#6940](https://github.com/Microsoft/vscode-python/issues/6940))
1. Fix ptvsd typo in descriptions.
   ([#7097](https://github.com/Microsoft/vscode-python/issues/7097))

### Code Health

1. Update the message and the link displayed when `Language Server` isn't supported.
   ([#5969](https://github.com/Microsoft/vscode-python/issues/5969))
1. Normalize path separators in stack traces.
   ([#6460](https://github.com/Microsoft/vscode-python/issues/6460))
1. Update `package.json` to define supported languages for breakpoints.
   Update telemetry code to hardcode Telemetry Key in code (removed from `package.json`).
   ([#6469](https://github.com/Microsoft/vscode-python/issues/6469))
1. Functional tests for DataScience Error Handler.
   ([#6697](https://github.com/Microsoft/vscode-python/issues/6697))
1. Move .env file handling into the extension. This is in preparation to switch to the out-of-proc debug adapter from ptvsd.
   ([#6770](https://github.com/Microsoft/vscode-python/issues/6770))
1. Track enablement of a test framework.
   ([#6783](https://github.com/Microsoft/vscode-python/issues/6783))
1. Track how code was sent to the terminal (via `command` or `UI`).
   ([#6801](https://github.com/Microsoft/vscode-python/issues/6801))
1. Upload coverage reports to [codecov](https://codecov.io/gh/microsoft/vscode-python).
   ([#6938](https://github.com/Microsoft/vscode-python/issues/6938))
1. Bump version of [PTVSD](https://pypi.org/project/ptvsd/) to `4.3.2`.

    * Fix an issue with Jump to cursor command. [#1667](https://github.com/microsoft/ptvsd/issues/1667)
    * Fix "Unable to find threadStateIndex for the current thread" message in terminal. [#1587](https://github.com/microsoft/ptvsd/issues/1587)
    * Fixes crash when using python 3.7.4. [#1688](https://github.com/microsoft/ptvsd/issues/1688)
   ([#6961](https://github.com/Microsoft/vscode-python/issues/6961))
1. Move nightly functional tests to use mock jupyter and create a new pipeline for flakey tests which use real jupyter.
   ([#7066](https://github.com/Microsoft/vscode-python/issues/7066))
1. Corrected spelling of name for method to be `hasConfigurationFileInWorkspace`.
   ([#7072](https://github.com/Microsoft/vscode-python/issues/7072))
1. Fix functional test failures due to new WindowsStoreInterpreter addition.
   ([#7081](https://github.com/Microsoft/vscode-python/issues/7081))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort](https://pypi.org/project/isort/)
- [jedi](https://pypi.org/project/jedi/)
  and [parso](https://pypi.org/project/parso/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.8.0 (6 August 2019)

### Enhancements

1. Added ability to auto update Insiders build of extension.
   ([#2772](https://github.com/Microsoft/vscode-python/issues/2772))
1. Add an icon for the "Run Python File in Terminal" command.
   ([#5321](https://github.com/Microsoft/vscode-python/issues/5321))
1. Hook up ptvsd debugger to Jupyter UI.
   ([#5900](https://github.com/Microsoft/vscode-python/issues/5900))
1. Improved keyboard and screen reader support for the data explorer.
   ([#6019](https://github.com/Microsoft/vscode-python/issues/6019))
1. Provide code mapping service for debugging cells.
   ([#6318](https://github.com/Microsoft/vscode-python/issues/6318))
1. Change copy back to code button in the interactive window to insert wherever the current selection is.
   ([#6350](https://github.com/Microsoft/vscode-python/issues/6350))
1. Add new 'goto cell' code lens on every cell that is run from a file.
   ([#6359](https://github.com/Microsoft/vscode-python/issues/6359))
1. Allow for cancelling all cells when an error occurs. Backed by 'stopOnError' setting.
   ([#6366](https://github.com/Microsoft/vscode-python/issues/6366))
1. Added Code Lens and Snippet to add new cell.
   ([#6367](https://github.com/Microsoft/vscode-python/issues/6367))
1. Support hitting breakpoints in actual source code for interactive window debugging.
   ([#6376](https://github.com/Microsoft/vscode-python/issues/6376))
1. Give the option to install ptvsd if user is missing it and tries to debug.
   ([#6378](https://github.com/Microsoft/vscode-python/issues/6378))
1. Add support for remote debugging of Jupyter cells.
   ([#6379](https://github.com/Microsoft/vscode-python/issues/6379))
1. Make the input box more visible to new users.
   ([#6381](https://github.com/Microsoft/vscode-python/issues/6381))
1. Add feature flag `python.dataScience.magicCommandsAsComments` so linters and other tools can work with them.
   (thanks [Janosh Riebesell](https://github.com/janosh))
   ([#6408](https://github.com/Microsoft/vscode-python/issues/6408))
1. Support break on enter for debugging a cell.
   ([#6449](https://github.com/Microsoft/vscode-python/issues/6449))
1. instead of asking the user to select an installer, we now autodetect the environment being used, and use that installer.
   ([#6569](https://github.com/Microsoft/vscode-python/issues/6569))
1. Remove "Debug cell" action from data science code lenses for markdown cells.
   (thanks [Janosh Riebesell](https://github.com/janosh))
   ([#6588](https://github.com/Microsoft/vscode-python/issues/6588))
1. Add debug command code lenses when in debug mode
   ([#6672](https://github.com/Microsoft/vscode-python/issues/6672))

### Fixes

1. Fix `executeInFileDir` for when a file is not in a workspace.
   (thanks [Bet4](https://github.com/bet4it/))
   ([#1062](https://github.com/Microsoft/vscode-python/issues/1062))
1. Fix indentation after string literals containing escaped characters.
   ([#4241](https://github.com/Microsoft/vscode-python/issues/4241))
1. The extension will now prompt to auto install jupyter in case its not found.
   ([#5682](https://github.com/Microsoft/vscode-python/issues/5682))
1. Append `--allow-prereleases` to black installation command so pipenv can properly resolve it.
   ([#5756](https://github.com/Microsoft/vscode-python/issues/5756))
1. Remove existing positional arguments when running single pytest tests.
   ([#5757](https://github.com/Microsoft/vscode-python/issues/5757))
1. Fix shift+enter to work when code lens are turned off.
   ([#5879](https://github.com/Microsoft/vscode-python/issues/5879))
1. Prompt to insall test framework only if test frame is not already installed.
   ([#5919](https://github.com/Microsoft/vscode-python/issues/5919))
1. Trim stream text output at the server to prevent sending massive strings of overwritten data.
   ([#6001](https://github.com/Microsoft/vscode-python/issues/6001))
1. Detect `shell` in Visual Studio Code using the Visual Studio Code API.
   ([#6050](https://github.com/Microsoft/vscode-python/issues/6050))
1. Make long running output not crash the extension host. Also improve perf of streaming.
   ([#6222](https://github.com/Microsoft/vscode-python/issues/6222))
1. Opting out of telemetry correctly opts out of A/B testing.
   ([#6270](https://github.com/Microsoft/vscode-python/issues/6270))
1. Add error messages if data_rate_limit is exceeded on remote (or local) connection.
   ([#6273](https://github.com/Microsoft/vscode-python/issues/6273))
1. Add pytest-xdist's -n option to the list of supported pytest options.
   ([#6293](https://github.com/Microsoft/vscode-python/issues/6293))
1. Simplify the import regex to minimize performance overhead.
   ([#6319](https://github.com/Microsoft/vscode-python/issues/6319))
1. Clarify regexes used for decreasing indentation.
   ([#6333](https://github.com/Microsoft/vscode-python/issues/6333))
1. Add new plot viewer button images and fix button colors in different themes.
   ([#6336](https://github.com/Microsoft/vscode-python/issues/6336))
1. Update telemetry property name for Jedi memory usage.
   ([#6339](https://github.com/Microsoft/vscode-python/issues/6339))
1. Fix png scaling on non standard DPI. Add 'enablePlotViewer' setting to allow user to render PNGs instead of SVG files.
   ([#6344](https://github.com/Microsoft/vscode-python/issues/6344))
1. Do best effort to download the experiments and use it in the very first session only.
   ([#6348](https://github.com/Microsoft/vscode-python/issues/6348))
1. Linux can pick the wrong kernel to use when starting the interactive window.
   ([#6375](https://github.com/Microsoft/vscode-python/issues/6375))
1. Add missing keys for data science interactive window button tooltips in `package.nls.json`.
   ([#6386](https://github.com/Microsoft/vscode-python/issues/6386))
1. Fix overwriting of cwd in the path list when discovering tests.
   ([#6417](https://github.com/Microsoft/vscode-python/issues/6417))
1. Fixes a bug in pytest test discovery.
    (thanks Rainer Dreyer)
   ([#6463](https://github.com/Microsoft/vscode-python/issues/6463))
1. Fix debugging to work on restarting the jupyter kernel.
   ([#6502](https://github.com/Microsoft/vscode-python/issues/6502))
1. Escape key in the interactive window moves to the delete button when auto complete is open. Escape should only move when no autocomplete is open.
   ([#6507](https://github.com/Microsoft/vscode-python/issues/6507))
1. Render plots as png, but save an svg for exporting/image viewing. Speeds up plot rendering.
   ([#6526](https://github.com/Microsoft/vscode-python/issues/6526))
1. Import get_ipython at the start of each imported jupyter notebook if there are line magics in the file
   ([#6574](https://github.com/Microsoft/vscode-python/issues/6574))
1. Fix a problem where we retrieved and rendered old codelenses for multiple imports of jupyter notebooks if cells in the resultant import file were executed without saving the file to disk.
   ([#6582](https://github.com/Microsoft/vscode-python/issues/6582))
1. PTVSD install for jupyter debugging should check version without actually importing into the jupyter kernel.
   ([#6592](https://github.com/Microsoft/vscode-python/issues/6592))
1. Fix pandas version parsing to handle strings.
   ([#6595](https://github.com/Microsoft/vscode-python/issues/6595))
1. Unpin the version of ptvsd in the install and add `-U`.
   ([#6718](https://github.com/Microsoft/vscode-python/issues/6718))
1. Fix stepping when more than one blank line at the end of a cell.
   ([#6719](https://github.com/Microsoft/vscode-python/issues/6719))
1. Render plots as png, but save an svg for exporting/image viewing. Speeds up plot rendering.
   ([#6724](https://github.com/Microsoft/vscode-python/issues/6724))
1. Fix random occurrences of output not concatenating correctly in the interactive window.
   ([#6728](https://github.com/Microsoft/vscode-python/issues/6728))
1. In order to debug without '#%%' defined in a file, support a Debug Entire File.
   ([#6730](https://github.com/Microsoft/vscode-python/issues/6730))
1. Add support for "Run Below" back.
   ([#6737](https://github.com/Microsoft/vscode-python/issues/6737))
1. Fix the 'Variables not available while debugging' message to be more descriptive.
   ([#6740](https://github.com/Microsoft/vscode-python/issues/6740))
1. Make breakpoints on enter always be the case unless 'stopOnFirstLineWhileDebugging' is set.
   ([#6743](https://github.com/Microsoft/vscode-python/issues/6743))
1. Remove Debug Cell and Run Cell from the command palette. They should both be 'Debug Current Cell' and 'Run Current Cell'
   ([#6754](https://github.com/Microsoft/vscode-python/issues/6754))
1. Make the dataviewer open a window much faster. Total load time is the same, but initial response is much faster.
   ([#6729](https://github.com/Microsoft/vscode-python/issues/6729))
1. Debugging an untitled file causes an error 'Untitled-1 cannot be opened'.
   ([#6738](https://github.com/Microsoft/vscode-python/issues/6738))
1. Eliminate 'History_\<guid\>' from the problems list when using the interactive panel.
   ([#6748](https://github.com/Microsoft/vscode-python/issues/6748))

### Code Health

1. Log processes executed behind the scenes in the extension output panel.
   ([#1131](https://github.com/Microsoft/vscode-python/issues/1131))
1. Specify `pyramid.scripts.pserve` when creating a debug configuration for Pyramid
   apps instead of trying to calculate the location of the `pserve` command.
   ([#2427](https://github.com/Microsoft/vscode-python/issues/2427))
1. UI Tests using [selenium](https://selenium-python.readthedocs.io/index.html) & [behave](https://behave.readthedocs.io/en/latest/).
   ([#4692](https://github.com/Microsoft/vscode-python/issues/4692))
1. Upload coverage reports to [coveralls](https://coveralls.io/github/microsoft/vscode-python).
   ([#5999](https://github.com/Microsoft/vscode-python/issues/5999))
1. Upgrade Jedi to version 0.13.3.
   ([#6013](https://github.com/Microsoft/vscode-python/issues/6013))
1. Add unit tests for `client/activation/serviceRegistry.ts`.
   ([#6163](https://github.com/Microsoft/vscode-python/issues/6163))
1. Remove `test.ipynb` from the root folder.
   ([#6212](https://github.com/Microsoft/vscode-python/issues/6212))
1. Fail the `smoke tests` CI job when the smoke tests fail.
   ([#6253](https://github.com/Microsoft/vscode-python/issues/6253))
1. Add a bunch of perf measurements to telemetry.
   ([#6283](https://github.com/Microsoft/vscode-python/issues/6283))
1. Retry failing debugger test (retry due to intermittent issues on `Azure Pipelines`).
   ([#6322](https://github.com/Microsoft/vscode-python/issues/6322))
1. Update version of `isort` to `4.3.21`.
   ([#6369](https://github.com/Microsoft/vscode-python/issues/6369))
1. Functional test for debugging jupyter cells.
   ([#6377](https://github.com/Microsoft/vscode-python/issues/6377))
1. Consolidate telemetry.
   ([#6451](https://github.com/Microsoft/vscode-python/issues/6451))
1. Removed npm package `vscode`, and added to use `vscode-test` and `@types/vscode` (see [here](https://code.visualstudio.com/updates/v1_36#_splitting-vscode-package-into-typesvscode-and-vscodetest) for more info).
   ([#6456](https://github.com/Microsoft/vscode-python/issues/6456))
1. Fix the variable explorer exclude test to be less strict.
   ([#6525](https://github.com/Microsoft/vscode-python/issues/6525))
1. Merge ArgumentsHelper unit tests into one file.
   ([#6583](https://github.com/Microsoft/vscode-python/issues/6583))
1. Fix jupyter remote tests to respect new notebook 6.0 output format.
   ([#6625](https://github.com/Microsoft/vscode-python/issues/6625))
1. Unit Tests for DataScience Error Handler.
   ([#6670](https://github.com/Microsoft/vscode-python/issues/6670))
1. Fix DataExplorer tests after accessibility fixes.
   ([#6711](https://github.com/Microsoft/vscode-python/issues/6711))
1. Bump version of [PTVSD](https://pypi.org/project/ptvsd/) to 4.3.0.
   ([#6771](https://github.com/Microsoft/vscode-python/issues/6771))
    * Support for Jupyter debugging
    * Support for ipython cells
    * API to enable and disable tracing via ptvsd.tracing
    * ptvsd.enable_attach accepts address=('localhost', 0) and returns server port
    * Known issue: Unable to find threadStateIndex for the current thread. curPyThread ([#11587](https://github.com/microsoft/ptvsd/issues/1587))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort](https://pypi.org/project/isort/)
- [jedi](https://pypi.org/project/jedi/)
  and [parso](https://pypi.org/project/parso/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.6.1 (9 July 2019)

### Fixes

1. Fixes to A/B testing.
   ([#6400](https://github.com/microsoft/vscode-python/issues/6400))

## 2019.6.0 (25 June 2019)

### Enhancements

1. Dedent selected code before sending it to the terminal.
   ([#2837](https://github.com/Microsoft/vscode-python/issues/2837))
1. Allow password for remote authentication.
   ([#3624](https://github.com/Microsoft/vscode-python/issues/3624))
1. Add support for sub process debugging, when debugging tests.
   ([#4525](https://github.com/Microsoft/vscode-python/issues/4525))
1. Change title of `Discover Tests` to `Discovering` when discovering tests.
   ([#4562](https://github.com/Microsoft/vscode-python/issues/4562))
1. Add an extra viewer for plots in the interactive window.
   ([#4967](https://github.com/Microsoft/vscode-python/issues/4967))
1. Allow for self signed certificates for jupyter connections.
   ([#4987](https://github.com/Microsoft/vscode-python/issues/4987))
1. Add support for A/B testing and staged rollouts of new functionality.
   ([#5042](https://github.com/Microsoft/vscode-python/issues/5042))
1. Removed `--nothreading` flag from the `Django` debug configuration.
   ([#5116](https://github.com/Microsoft/vscode-python/issues/5116))
1. Test Explorer : Remove time from all nodes except the tests.
   ([#5120](https://github.com/Microsoft/vscode-python/issues/5120))
1. Add support for a copy back to source.
   ([#5286](https://github.com/Microsoft/vscode-python/issues/5286))
1. Add visual separation between the variable explorer and the rest of the Interactive Window content.
   ([#5389](https://github.com/Microsoft/vscode-python/issues/5389))
1. Changes placeholder label in testConfigurationManager.ts from 'Select the directory containing the unit tests' to 'Select the directory containing the tests'.
   (thanks [James Flynn](https://github.com/james-flynn-ie/))
   ([#5602](https://github.com/Microsoft/vscode-python/issues/5602))
1. Updated labels in File > Preferences > Settings. It now states 'Pytest' where it stated 'Py Test'.
   (thanks [James Flynn](https://github.com/james-flynn-ie/))
   ([#5603](https://github.com/Microsoft/vscode-python/issues/5603))
1. Updated label for "Enable unit testing for Pytest" to remove the word "unit".
   (thanks [James Flynn](https://github.com/james-flynn-ie/))
   ([#5604](https://github.com/Microsoft/vscode-python/issues/5604))
1. Importing a notebook should show the output of the notebook in the Python Interactive window. This feature can be turned off with the 'previewImportedNotebooksInInteractivePane' setting.
   ([#5675](https://github.com/Microsoft/vscode-python/issues/5675))
1. Add flag to auto preview an ipynb file when opened.
   ([#5790](https://github.com/Microsoft/vscode-python/issues/5790))
1. Change pytest description from configuration menu.
   ([#5832](https://github.com/Microsoft/vscode-python/issues/5832))
1. Support faster restart of the kernel by creating two kernels (two python processes running under the covers).
   ([#5876](https://github.com/Microsoft/vscode-python/issues/5876))
1. Allow a 'Dont ask me again' option for restarting the kernel.
   ([#5951](https://github.com/Microsoft/vscode-python/issues/5951))
1. Added experiment to always display the test explorer.
   ([#6211](https://github.com/Microsoft/vscode-python/issues/6211))

### Fixes

1. Added support for activation of conda environments in `powershell`.
   ([#668](https://github.com/Microsoft/vscode-python/issues/668))
1. Provide `pathMappings` to debugger when attaching to child processes.
   ([#3568](https://github.com/Microsoft/vscode-python/issues/3568))
1. Add virtualenvwrapper default virtual environment location to the `python.venvFolders` config setting.
   ([#4642](https://github.com/Microsoft/vscode-python/issues/4642))
1. Advance to the next cell if cursor is in the current cell and user clicks 'Run Cell'.
   ([#5067](https://github.com/Microsoft/vscode-python/issues/5067))
1. Fix localhost path mappings to lowercase the drive letter on Windows.
   ([#5362](https://github.com/Microsoft/vscode-python/issues/5362))
1. Fix import/export paths to be escaped on windows.
   ([#5386](https://github.com/Microsoft/vscode-python/issues/5386))
1. Support loading larger dataframes in the dataviewer (anything more than 1000 columns will still be slow, but won't crash).
   ([#5469](https://github.com/Microsoft/vscode-python/issues/5469))
1. Fix magics running from a python file.
   ([#5537](https://github.com/Microsoft/vscode-python/issues/5537))
1. Change scrolling to not animate to workaround async updates breaking the animation.
   ([#5560](https://github.com/Microsoft/vscode-python/issues/5560))
1. Add support for opening hyperlinks from the interactive window.
   ([#5630](https://github.com/Microsoft/vscode-python/issues/5630))
1. Remove extra padding in the dataviewer.
   ([#5653](https://github.com/Microsoft/vscode-python/issues/5653))
1. Add 'Add empty cell to file' command. Shortcut for having to type '#%%'.
   ([#5667](https://github.com/Microsoft/vscode-python/issues/5667))
1. Add 'ctrl+enter' as a keyboard shortcut for run current cell (runs without advancing)
   ([#5673](https://github.com/Microsoft/vscode-python/issues/5673))
1. Adjust input box prompt to look more an IPython console prompt.
   ([#5729](https://github.com/Microsoft/vscode-python/issues/5729))
1. Jupyter-notebook exists after shutdown.
   ([#5731](https://github.com/Microsoft/vscode-python/issues/5731))
1. Fix horizontal scrolling in the Interactive Window.
   ([#5734](https://github.com/Microsoft/vscode-python/issues/5734))
1. Fix problem with using up/down arrows in autocomplete.
   ([#5774](https://github.com/Microsoft/vscode-python/issues/5774))
1. Fix latex and markdown scrolling.
   ([#5775](https://github.com/Microsoft/vscode-python/issues/5775))
1. Add support for jupyter controls that clear.
   ([#5801](https://github.com/Microsoft/vscode-python/issues/5801))
1. Fix up arrow on signature help closing the help.
   ([#5813](https://github.com/Microsoft/vscode-python/issues/5813))
1. Make the interactive window respect editor cursor and blink style.
   ([#5814](https://github.com/Microsoft/vscode-python/issues/5814))
1. Remove extra overlay on editor when matching parentheses.
   ([#5815](https://github.com/Microsoft/vscode-python/issues/5815))
1. Fix theme color missing errors inside interactive window.
   ([#5827](https://github.com/Microsoft/vscode-python/issues/5827))
1. Fix problem with shift+enter not working after using goto source.
   ([#5829](https://github.com/Microsoft/vscode-python/issues/5829))
1. Fix CI failures related to history import changes.
   ([#5844](https://github.com/Microsoft/vscode-python/issues/5844))
1. Disable quoting of paths sent to the debugger as arguments.
   ([#5861](https://github.com/Microsoft/vscode-python/issues/5861))
1. Fix shift+enter to work in newly created files with cells.
   ([#5879](https://github.com/Microsoft/vscode-python/issues/5879))
1. Fix nightly failures caused by new jupyter command line.
   ([#5883](https://github.com/Microsoft/vscode-python/issues/5883))
1. Improve accessibility of the 'Python Interactive' window.
   ([#5884](https://github.com/Microsoft/vscode-python/issues/5884))
1. Auto preview notebooks on import.
   ([#5891](https://github.com/Microsoft/vscode-python/issues/5891))
1. Fix liveloss test to not have so many dependencies.
   ([#5909](https://github.com/Microsoft/vscode-python/issues/5909))
1. Fixes to detection of the shell.
   ([#5916](https://github.com/Microsoft/vscode-python/issues/5916))
1. Fixes to activation of Conda environments.
   ([#5929](https://github.com/Microsoft/vscode-python/issues/5929))
1. Fix themes in the interactive window that use 3 color hex values (like Cobalt2).
   ([#5950](https://github.com/Microsoft/vscode-python/issues/5950))
1. Fix jupyter services node-fetch connection issue.
   ([#5956](https://github.com/Microsoft/vscode-python/issues/5956))
1. Allow selection and running of indented code in the python interactive window.
   ([#5983](https://github.com/Microsoft/vscode-python/issues/5983))
1. Account for files being opened in Visual Studio Code that do not belong to a workspace.
   ([#6624](https://github.com/Microsoft/vscode-python/issues/6624))
1. Accessibility pass on plot viewer
   ([#6020](https://github.com/Microsoft/vscode-python/issues/6020))
1. Allow for both password and self cert server to work together
   ([#6265](https://github.com/Microsoft/vscode-python/issues/6265))
1. Fix pdf export in release bits.
   ([#6277](https://github.com/Microsoft/vscode-python/issues/6277))

### Code Health

1. Add code coverage reporting.
   ([#4472](https://github.com/Microsoft/vscode-python/issues/4472))
1. Minimize data sent as part of the `ERROR` telemetry event.
   ([#4602](https://github.com/Microsoft/vscode-python/issues/4602))
1. Fixes to decorator tests.
   ([#5085](https://github.com/Microsoft/vscode-python/issues/5085))
1. Add sorting test for DataViewer.
   ([#5415](https://github.com/Microsoft/vscode-python/issues/5415))
1. Rename "unit test" to "tests" from drop menu when clicking on "Run Tests" on the status bar.
   ([#5605](https://github.com/Microsoft/vscode-python/issues/5605))
1. Added telemetry to track memory usage of the `Jedi Language Server` process.
   ([#5726](https://github.com/Microsoft/vscode-python/issues/5726))
1. Fix nightly functional tests from timing out during process cleanup.
   ([#5870](https://github.com/Microsoft/vscode-python/issues/5870))
1. Change how telemetry is sent for the 'shift+enter' banner.
   ([#5887](https://github.com/Microsoft/vscode-python/issues/5887))
1. Fixes to gulp script used to bundle the extension with `WebPack`.
   ([#5932](https://github.com/Microsoft/vscode-python/issues/5932))
1. Tighten up the import-matching regex to minimize false-positives.
   ([#5988](https://github.com/Microsoft/vscode-python/issues/5988))
1. Merge multiple coverage reports into one.
   ([#6000](https://github.com/Microsoft/vscode-python/issues/6000))
1. Fix DataScience nightly tests.
   ([#6032](https://github.com/Microsoft/vscode-python/issues/6032))
1. Update version of TypeScript to 3.5.
   ([#6033](https://github.com/Microsoft/vscode-python/issues/6033))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.20](https://pypi.org/project/isort/4.3.20/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.5.18875 (6 June 2019)

### Fixes

1. Disable quoting of paths sent to the debugger as arguments.
   ([#5861](https://github.com/microsoft/vscode-python/issues/5861))
1. Fixes to activation of Conda environments.
   ([#5929](https://github.com/microsoft/vscode-python/issues/5929))

## 2019.5.18678 (5 June 2019)

### Fixes

1. Fixes to detection of the shell.
   ([#5916](https://github.com/microsoft/vscode-python/issues/5916))


## 2019.5.18875 (6 June 2019)

### Fixes

1. Disable quoting of paths sent to the debugger as arguments.
   ([#5861](https://github.com/microsoft/vscode-python/issues/5861))
1. Fixes to activation of Conda environments.
   ([#5929](https://github.com/microsoft/vscode-python/issues/5929))

## 2019.5.18678 (5 June 2019)

### Fixes

1. Fixes to detection of the shell.
   ([#5916](https://github.com/microsoft/vscode-python/issues/5916))

## 2019.5.18426 (4 June 2019)

### Fixes

1. Changes to identification of `shell` for the activation of environments in the terminal.
   ([#5743](https://github.com/microsoft/vscode-python/issues/5743))

## 2019.5.17517 (30 May 2019)

### Fixes

1. Revert changes related to pathMappings in `launch.json` for `debugging` [#3568](https://github.com/Microsoft/vscode-python/issues/3568)
   ([#5833](https://github.com/microsoft/vscode-python/issues/5833))


## 2019.5.17059 (28 May 2019)

### Enhancements

1. Add visual separation between the variable explorer and the rest of the Interactive Window content
   ([#5389](https://github.com/Microsoft/vscode-python/issues/5389))
1. Show a message when no variables are defined
   ([#5228](https://github.com/Microsoft/vscode-python/issues/5228))
1. Variable explorer UI fixes via PM / designer
   ([#5274](https://github.com/Microsoft/vscode-python/issues/5274))
1. Allow column sorting in variable explorer
   ([#5281](https://github.com/Microsoft/vscode-python/issues/5281))
1. Provide basic intellisense in Interactive Windows, using the language server.
   ([#5342](https://github.com/Microsoft/vscode-python/issues/5342))
1. Add support for Jupyter autocomplete data in Interactive Window.
   ([#5346](https://github.com/Microsoft/vscode-python/issues/5346))
1. Swap getsizeof size value for something more sensible in the variable explorer
   ([#5368](https://github.com/Microsoft/vscode-python/issues/5368))
1. Pass parent debug session to child debug sessions using new DA API
   ([#5464](https://github.com/Microsoft/vscode-python/issues/5464))

### Fixes

1. Advance to the next cell if cursor is in the current cell and user clicks 'Run Cell'
   ([#5067](https://github.com/Microsoft/vscode-python/issues/5067))
1. Fix import/export paths to be escaped on windows.
   ([#5386](https://github.com/Microsoft/vscode-python/issues/5386))
1. Fix magics running from a python file.
   ([#5537](https://github.com/Microsoft/vscode-python/issues/5537))
1. Change scrolling to not animate to workaround async updates breaking the animation.
   ([#5560](https://github.com/Microsoft/vscode-python/issues/5560))
1. Add support for opening hyperlinks from the interactive window.
   ([#5630](https://github.com/Microsoft/vscode-python/issues/5630))
1. Add 'Add empty cell to file' command. Shortcut for having to type '#%%'
   ([#5667](https://github.com/Microsoft/vscode-python/issues/5667))
1. Add 'ctrl+enter' as a keyboard shortcut for run current cell (runs without advancing)
   ([#5673](https://github.com/Microsoft/vscode-python/issues/5673))
1. Adjust input box prompt to look more an IPython console prompt.
   ([#5729](https://github.com/Microsoft/vscode-python/issues/5729))
1. Fix horizontal scrolling in the Interactive Window
   ([#5734](https://github.com/Microsoft/vscode-python/issues/5734))
1. Fix problem with using up/down arrows in autocomplete.
   ([#5774](https://github.com/Microsoft/vscode-python/issues/5774))
1. Fix latex and markdown scrolling.
   ([#5775](https://github.com/Microsoft/vscode-python/issues/5775))
1. Use the correct activation script for conda environments
   ([#4402](https://github.com/Microsoft/vscode-python/issues/4402))
1. Improve pipenv error messages (thanks [David Lechner](https://github.com/dlech))
   ([#4866](https://github.com/Microsoft/vscode-python/issues/4866))
1. Quote paths returned by debugger API
   ([#4966](https://github.com/Microsoft/vscode-python/issues/4966))
1. Reliably end test tasks in Azure Pipelines.
   ([#5129](https://github.com/Microsoft/vscode-python/issues/5129))
1. Append `--pre` to black installation command so pipenv can properly resolve it.
   (thanks [Erin O'Connell](https://github.com/erinxocon))
   ([#5171](https://github.com/Microsoft/vscode-python/issues/5171))
1. Make background cell color useable in all themes.
   ([#5236](https://github.com/Microsoft/vscode-python/issues/5236))
1. Filtered rows shows 'fetching' instead of No rows.
   ([#5278](https://github.com/Microsoft/vscode-python/issues/5278))
1. Always show pytest's output when it fails.
   ([#5313](https://github.com/Microsoft/vscode-python/issues/5313))
1. Value 'None' sometimes shows up in the Count column of the variable explorer
   ([#5387](https://github.com/Microsoft/vscode-python/issues/5387))
1. Multi-dimensional arrays don't open in the data viewer.
   ([#5395](https://github.com/Microsoft/vscode-python/issues/5395))
1. Fix sorting of lists with numbers and missing entries.
   ([#5414](https://github.com/Microsoft/vscode-python/issues/5414))
1. Fix error with bad len() values in variable explorer
   ([#5420](https://github.com/Microsoft/vscode-python/issues/5420))
1. Remove trailing commas from JSON files.
   (thanks [Romain](https://github.com/quarthex))
   ([#5437](https://github.com/Microsoft/vscode-python/issues/5437))
1. Handle missing index columns and non trivial data types for columns.
   ([#5452](https://github.com/Microsoft/vscode-python/issues/5452))
1. Fix ignoreVscodeTheme to play along with dynamic theme updates. Also support setting in the variable explorer.
   ([#5480](https://github.com/Microsoft/vscode-python/issues/5480))
1. Fix matplotlib updating for dark theme after restarting
   ([#5486](https://github.com/Microsoft/vscode-python/issues/5486))
1. Add dev flag to poetry installer.
   (thanks [Yan Pashkovsky](https://github.com/Yanpas))
   ([#5496](https://github.com/Microsoft/vscode-python/issues/5496))
1. Default `PYTHONPATH` to an empty string if the environment variable is not defined.
   ([#5579](https://github.com/Microsoft/vscode-python/issues/5579))
1. Fix problems if other language kernels are installed that are using python under the covers (bash is one such example).
   ([#5586](https://github.com/Microsoft/vscode-python/issues/5586))
1. Allow collapsed code to affect intellisense.
   ([#5631](https://github.com/Microsoft/vscode-python/issues/5631))
1. Eliminate search support in the mini-editors in the Python Interactive window.
   ([#5637](https://github.com/Microsoft/vscode-python/issues/5637))
1. Fix perf problem with intellisense in the Interactive Window.
   ([#5697](https://github.com/Microsoft/vscode-python/issues/5697))
1. Using "request": "launch" item in launch.json for debugging sends pathMappings
   ([#3568](https://github.com/Microsoft/vscode-python/issues/3568))
1. Fix perf issues with long collections and variable explorer
   ([#5511](https://github.com/Microsoft/vscode-python/issues/5511))
1. Changed synchronous file system operation into async
   ([#4895](https://github.com/Microsoft/vscode-python/issues/4895))
1. Update ptvsd to [4.2.10](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.10).
    * No longer switch off getpass on import.
    * Fixes a crash on evaluate request.
    * Fix a issue with running no-debug.
    * Fixes issue with forwarding sys.stdin.read().
    * Remove sys.prefix form library roots.

### Code Health

1. Deprecate [travis](https://travis-ci.org/) in favor of [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/).
   ([#4024](https://github.com/Microsoft/vscode-python/issues/4024))
1. Smoke Tests must be run on nightly and CI on Azdo
   ([#5090](https://github.com/Microsoft/vscode-python/issues/5090))
1. Increase timeout and retries in Jupyter wait for idle
   ([#5430](https://github.com/Microsoft/vscode-python/issues/5430))
1. Update manual test plan for Variable Explorer and Data Viewer
   ([#5476](https://github.com/Microsoft/vscode-python/issues/5476))
1. Auto-update version number in `CHANGELOG.md` in the CI pipeline.
   ([#5523](https://github.com/Microsoft/vscode-python/issues/5523))
1. Fix security issues.
   ([#5538](https://github.com/Microsoft/vscode-python/issues/5538))
1. Send logging output into a text file on CI server.
   ([#5651](https://github.com/Microsoft/vscode-python/issues/5651))
1. Fix python 2.7 and 3.5 variable explorer nightly tests
   ([#5433](https://github.com/Microsoft/vscode-python/issues/5433))
1. Update isort to version 4.3.20.
   (Thanks [Andrew Blakey](https://github.com/ablakey))
   ([#5642](https://github.com/Microsoft/vscode-python/issues/5642))


### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.20](https://pypi.org/project/isort/4.3.20/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.4.1 (24 April 2019)

### Fixes

1. Remove trailing commas in JSON files.
   (thanks [Romain](https://github.com/quarthex))
   ([#5437](https://github.com/Microsoft/vscode-python/issues/5437))

## 2019.4.0 (23 April 2019)

### Enhancements

1. Download the language server using HTTP if `http.proxyStrictSSL` is set to `true`.
   ([#2849](https://github.com/Microsoft/vscode-python/issues/2849))
1. Launch the `Python` debug configuration UI when manually adding entries into the `launch.json` file.
   ([#3321](https://github.com/Microsoft/vscode-python/issues/3321))
1. Add tracking of 'current' cell in the editor. Also add cell boundaries for non active cell.
   ([#3542](https://github.com/Microsoft/vscode-python/issues/3542))
1. Change default behavior of debugger to display return values.
   ([#3754](https://github.com/Microsoft/vscode-python/issues/3754))
1. Replace setting `debugStdLib` with `justMyCode`
   ([#4032](https://github.com/Microsoft/vscode-python/issues/4032))
1. Change "Unit Test" phrasing to "Test" or "Testing".
   ([#4384](https://github.com/Microsoft/vscode-python/issues/4384))
1. Auto expand tree view in `Test Explorer` to display failed tests.
   ([#4386](https://github.com/Microsoft/vscode-python/issues/4386))
1. Add a data grid control and web view panel.
   ([#4675](https://github.com/Microsoft/vscode-python/issues/4675))
1. Add support for viewing dataframes, lists, dicts, nparrays.
   ([#4677](https://github.com/Microsoft/vscode-python/issues/4677))
1. Auto-expand the first level of the test explorer tree view.
   ([#4767](https://github.com/Microsoft/vscode-python/issues/4767))
1. Use `Python` code for discovery of tests when using `pytest`.
   ([#4795](https://github.com/Microsoft/vscode-python/issues/4795))
1. Intergrate the variable explorer into the header better and refactor HTML and CSS.
   ([#4800](https://github.com/Microsoft/vscode-python/issues/4800))
1. Integrate the variable viewer with the IJupyterVariable interface.
   ([#4802](https://github.com/Microsoft/vscode-python/issues/4802))
1. Include number of skipped tests in Test Data item tooltip.
   ([#4849](https://github.com/Microsoft/vscode-python/issues/4849))
1. Add prompt to select virtual environment for the worskpace.
   ([#4908](https://github.com/Microsoft/vscode-python/issues/4908))
1. Prompt to turn on Pylint if a `pylintrc` or `.pylintrc` file is found.
   ([#4941](https://github.com/Microsoft/vscode-python/issues/4941))
1. Variable explorer handles new cell submissions.
   ([#4948](https://github.com/Microsoft/vscode-python/issues/4948))
1. Pass one at getting our data grid styled correctly to match vscode styles and the spec.
   ([#4998](https://github.com/Microsoft/vscode-python/issues/4998))
1. Ensure `Language Server` can start without [ICU](http://site.icu-project.org/home).
   ([#5043](https://github.com/Microsoft/vscode-python/issues/5043))
1. Support running under docker.
   ([#5047](https://github.com/Microsoft/vscode-python/issues/5047))
1. Add exclude list to variable viewer.
   ([#5104](https://github.com/Microsoft/vscode-python/issues/5104))
1. Display a tip to the user informing them of the ability to change the interpreter from the statusbar.
   ([#5180](https://github.com/Microsoft/vscode-python/issues/5180))
1. Hook up the variable explorer to the data frame explorer.
   ([#5187](https://github.com/Microsoft/vscode-python/issues/5187))
1. Remove the debug config snippets (rely on handler instead).
   ([#5189](https://github.com/Microsoft/vscode-python/issues/5189))
1. Add setting to just enable/disable the data science codelens.
   ([#5211](https://github.com/Microsoft/vscode-python/issues/5211))
1. Change settings from `python.unitTest.*` to `python.testing.*`.
   ([#5219](https://github.com/Microsoft/vscode-python/issues/5219))
1. Add telemetry for variable explorer and turn on by default.
   ([#5337](https://github.com/Microsoft/vscode-python/issues/5337))
1. Show a message when no variables are defined
   ([#5228](https://github.com/Microsoft/vscode-python/issues/5228))
1. Variable explorer UI fixes via PM / designer
   ([#5274](https://github.com/Microsoft/vscode-python/issues/5274))
1. Allow column sorting in variable explorer
   ([#5281](https://github.com/Microsoft/vscode-python/issues/5281))
1. Swap getsizeof size value for something more sensible in the variable explorer
   ([#5368](https://github.com/Microsoft/vscode-python/issues/5368))

### Fixes

1. Ignore the extension's Python files when debugging.
   ([#3201](https://github.com/Microsoft/vscode-python/issues/3201))
1. Dispose processes started within the extension during.
   ([#3331](https://github.com/Microsoft/vscode-python/issues/3331))
1. Fix problem with errors not showing up for import when no jupyter installed.
   ([#3958](https://github.com/Microsoft/vscode-python/issues/3958))
1. Fix tabs in comments to come out in cells.
   ([#4029](https://github.com/Microsoft/vscode-python/issues/4029))
1. Use configuration API and provide Resource when retrieving settings.
   ([#4486](https://github.com/Microsoft/vscode-python/issues/4486))
1. When debugging, the extension correctly uses custom `.env` files.
   ([#4537](https://github.com/Microsoft/vscode-python/issues/4537))
1. Accomadate trailing commands in the JSON contents of `launch.json` file.
   ([#4543](https://github.com/Microsoft/vscode-python/issues/4543))
1. Kill liveshare sessions if a guest connects without the python extension installed.
   ([#4947](https://github.com/Microsoft/vscode-python/issues/4947))
1. Shutting down a session should not cause the host to stop working.
   ([#4949](https://github.com/Microsoft/vscode-python/issues/4949))
1. Fix cell spacing issues.
   ([#4979](https://github.com/Microsoft/vscode-python/issues/4979))
1. Fix hangs in functional tests.
   ([#4992](https://github.com/Microsoft/vscode-python/issues/4992))
1. Fix triple quoted comments in cells to not affect anything.
   ([#5012](https://github.com/Microsoft/vscode-python/issues/5012))
1. Restarting the kernel will eventually force Jupyter server to shutdown if it doesn't come back.
   ([#5025](https://github.com/Microsoft/vscode-python/issues/5025))
1. Adjust styling for data viewer.
   ([#5058](https://github.com/Microsoft/vscode-python/issues/5058))
1. Fix MimeTypes test after we stopped stripping comments.
   ([#5086](https://github.com/Microsoft/vscode-python/issues/5086))
1. No prompt displayed to install pylint.
   ([#5087](https://github.com/Microsoft/vscode-python/issues/5087))
1. Fix scrolling in the interactive window.
   ([#5131](https://github.com/Microsoft/vscode-python/issues/5131))
1. Default colors when theme.json cannot be found.
   Fix Python interactive window to update when theme changes.
   ([#5136](https://github.com/Microsoft/vscode-python/issues/5136))
1. Replace 'Run Above' and 'Run Below' in the palette with 'Run Cells Above Cursor' and 'Run Current Cell and Below'.
   ([#5143](https://github.com/Microsoft/vscode-python/issues/5143))
1. Variables not cleared after a kernel restart.
   ([#5244](https://github.com/Microsoft/vscode-python/issues/5244))
1. Fix variable explorer to work in Live Share.
   ([#5277](https://github.com/Microsoft/vscode-python/issues/5277))
1. Update matplotlib based on theme changes.
   ([#5294](https://github.com/Microsoft/vscode-python/issues/5294))
1. Restrict files from being processed by `Language Server` only when in a mult-root workspace.
   ([#5333](https://github.com/Microsoft/vscode-python/issues/5333))
1. Fix dataviewer header column alignment.
   ([#5351](https://github.com/Microsoft/vscode-python/issues/5351))
1. Make background cell color useable in all themes.
   ([#5236](https://github.com/Microsoft/vscode-python/issues/5236))
1. Filtered rows shows 'fetching' instead of No rows.
   ([#5278](https://github.com/Microsoft/vscode-python/issues/5278))
1. Multi-dimensional arrays don't open in the data viewer.
   ([#5395](https://github.com/Microsoft/vscode-python/issues/5395))
1. Fix sorting of lists with numbers and missing entries.
   ([#5414](https://github.com/Microsoft/vscode-python/issues/5414))
1. Fix error with bad len() values in variable explorer
   ([#5420](https://github.com/Microsoft/vscode-python/issues/5420))
1. Update ptvsd to [4.2.8](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.8).
    * Path mapping bug fixes.
    * Fix for hang when using debug console.
    * Fix for set next statement.
    * Fix for multi-threading.

### Code Health

1. Enable typescript's strict mode.
   ([#611](https://github.com/Microsoft/vscode-python/issues/611))
1. Update to use `Node` version `10.5.0`.
   ([#1138](https://github.com/Microsoft/vscode-python/issues/1138))
1. Update `launch.json` to use `internalConsole` instead of none.
   ([#4321](https://github.com/Microsoft/vscode-python/issues/4321))
1. Change flaky tests (relying on File System Watchers) into unit tests.
   ([#4468](https://github.com/Microsoft/vscode-python/issues/4468))
1. Corrected Smoke test failure for 'Run Python File In Terminal'.
   ([#4515](https://github.com/Microsoft/vscode-python/issues/4515))
1. Drop (official) support for Python 3.4.
   ([#4528](https://github.com/Microsoft/vscode-python/issues/4528))
1. Support debouncing decorated async methods.
   ([#4641](https://github.com/Microsoft/vscode-python/issues/4641))
1. Add functional tests for pytest adapter script.
   ([#4739](https://github.com/Microsoft/vscode-python/issues/4739))
1. Remove the use of timers in unittest code. Simulate the passing of time instead.
   ([#4776](https://github.com/Microsoft/vscode-python/issues/4776))
1. Add functional testing for variable explorer.
   ([#4803](https://github.com/Microsoft/vscode-python/issues/4803))
1. Add tests for variable explorer Python files.
   ([#4804](https://github.com/Microsoft/vscode-python/issues/4804))
1. Add real environment variables provider on to get functional tests to pass on macOS.
   ([#4820](https://github.com/Microsoft/vscode-python/issues/4820))
1. Handle done on all jupyter requests to make sure an unhandle exception isn't passed on shutdown.
   ([#4827](https://github.com/Microsoft/vscode-python/issues/4827))
1. Clean up language server initialization and configuration.
   ([#4832](https://github.com/Microsoft/vscode-python/issues/4832))
1. Hash imports of top-level packages to see what users need supported.
   ([#4852](https://github.com/Microsoft/vscode-python/issues/4852))
1. Have `tpn` clearly state why a project's license entry in the configuration file is considered stale.
   ([#4865](https://github.com/Microsoft/vscode-python/issues/4865))
1. Kill the test process on CI, 10s after the tests have completed.
   ([#4905](https://github.com/Microsoft/vscode-python/issues/4905))
1. Remove hardcoded Azdo Pipeline of 30m, leaving it to the default of 60m.
   ([#4914](https://github.com/Microsoft/vscode-python/issues/4914))
1. Use the `Python` interpreter prescribed by CI instead of trying to locate the best possible one.
   ([#4920](https://github.com/Microsoft/vscode-python/issues/4920))
1. Skip linter tests correctly.
   ([#4923](https://github.com/Microsoft/vscode-python/issues/4923))
1. Remove redundant compilation step on CI.
   ([#4926](https://github.com/Microsoft/vscode-python/issues/4926))
1. Dispose handles to timers created from using `setTimeout`.
   ([#4930](https://github.com/Microsoft/vscode-python/issues/4930))
1. Ensure sockets get disposed along with other resources.
   ([#4935](https://github.com/Microsoft/vscode-python/issues/4935))
1. Fix intermittent test failure with listeners.
   ([#4936](https://github.com/Microsoft/vscode-python/issues/4936))
1. Update `mocha` to the latest version.
   ([#4937](https://github.com/Microsoft/vscode-python/issues/4937))
1. Remove redundant mult-root tests.
   ([#4943](https://github.com/Microsoft/vscode-python/issues/4943))
1. Fix intermittent test failure with kernel shutdown.
   ([#4951](https://github.com/Microsoft/vscode-python/issues/4951))
1. Update version of [isort](https://pypi.org/project/isort/) to `4.3.17`
   ([#5059](https://github.com/Microsoft/vscode-python/issues/5059))
1. Fix typo and use constants instead of hardcoded command names.
   (thanks [Allan Wang](https://github.com/AllanWang))
   ([#5204](https://github.com/Microsoft/vscode-python/issues/5204))
1. Add datascience specific settings to telemetry gathered. Make sure to scrape any strings of PII.
   ([#5212](https://github.com/Microsoft/vscode-python/issues/5212))
1. Add telemetry around people hitting 'no' on the enable interactive shift enter.
   Reword the message to be more descriptive.
   ([#5213](https://github.com/Microsoft/vscode-python/issues/5213))
1. Fix failing variable explorer test.
   ([#5348](https://github.com/Microsoft/vscode-python/issues/5348))
1. Reliably end test tasks in Azure Pipelines.
   ([#5129](https://github.com/Microsoft/vscode-python/issues/5129))
1. Deprecate [travis](https://travis-ci.org/) in favor of [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/).
   ([#4024](https://github.com/Microsoft/vscode-python/issues/4024))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!


## 2019.3.3 (8 April 2019)

### Fixes

1. Update ptvsd to [4.2.7](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.7).
    * Fix issues related to debugging Django templates.
1. Update the Python language server to 0.2.47.

### Code Health

1. Capture telemetry to track switching to and from the Language Server.
   ([#5162](https://github.com/Microsoft/vscode-python/issues/5162))


## 2019.3.2 (2 April 2019)

### Fixes

1. Fix regression preventing the expansion of variables in the watch window and the debug console.
   ([#5035](https://github.com/Microsoft/vscode-python/issues/5035))
1. Display survey banner (again) for Language Server when using current Language Server.
   ([#5064](https://github.com/Microsoft/vscode-python/issues/5064))
1. Update ptvsd to [4.2.6](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.6).
   ([#5083](https://github.com/Microsoft/vscode-python/issues/5083))
    * Fix issue with expanding variables in watch window and hover.
    * Fix issue with launching a sub-module.

### Code Health

1. Capture telemetry to track which installer was used when installing packages via the extension.
   ([#5063](https://github.com/Microsoft/vscode-python/issues/5063))


## 2019.3.1 (28 March 2019)

### Enhancements

1. Use the download same logic for `stable` channel of the `Language Server` as that in `beta`.
   ([#4960](https://github.com/Microsoft/vscode-python/issues/4960))

### Code Health

1. Capture telemetry when tests are disabled..
   ([#4801](https://github.com/Microsoft/vscode-python/issues/4801))

## 2019.3.6139 (26 March 2019)

### Enhancements

1. Add support for poetry to install packages.
   ([#1871](https://github.com/Microsoft/vscode-python/issues/1871))
1. Disabled opening the output pane when sorting imports via isort fails.
   (thanks [chrised](https://github.com/chrised/))
   ([#2522](https://github.com/Microsoft/vscode-python/issues/2522))
1. Remove run all cells codelens and replace with run above and run below commands
   Add run to and from line commands in context menu
   ([#4259](https://github.com/Microsoft/vscode-python/issues/4259))
1. Support multi-root workspaces in test explorer.
   ([#4268](https://github.com/Microsoft/vscode-python/issues/4268))
1. Added support for fetching variable values from the jupyter server
   ([#4291](https://github.com/Microsoft/vscode-python/issues/4291))
1. Added commands translation for polish locale.
   (thanks [pypros](https://github.com/pypros/))
   ([#4435](https://github.com/Microsoft/vscode-python/issues/4435))
1. Show sub-tests in a subtree in the test explorer.
   ([#4503](https://github.com/Microsoft/vscode-python/issues/4503))
1. Add support for palette commands for Live Share scenarios.
   ([#4520](https://github.com/Microsoft/vscode-python/issues/4520))
1. Retain state of tests when auto discovering tests.
   ([#4576](https://github.com/Microsoft/vscode-python/issues/4576))
1. Update icons and tooltip in test explorer indicating status of test files/suites
   ([#4583](https://github.com/Microsoft/vscode-python/issues/4583))
1. Add 'ignoreVscodeTheme' setting to allow a user to skip using the theme for VS Code in the Python Interactive Window.
   ([#4640](https://github.com/Microsoft/vscode-python/issues/4640))
1. Add telemetry around imports.
   ([#4718](https://github.com/Microsoft/vscode-python/issues/4718))
1. Update status of test suite when all tests pass
   ([#4727](https://github.com/Microsoft/vscode-python/issues/4727))
1. Add button to ignore the message warning about the use of the macOS system install of Python.
   (thanks [Alina Lobastova](https://github.com/alina7091))
   ([#4448](https://github.com/Microsoft/vscode-python/issues/4448))
1. Add "Run In Interactive" command to run the contents of a file not cell by cell. Group data science context commands in one group. Add run file command to explorer context menu.
   ([#4855](https://github.com/Microsoft/vscode-python/issues/4855))

### Fixes

1. Add 'errorBackgroundColor' (defaults to white/#FFFFFF) for errors in the Interactive Window. Computes foreground based on background.
   ([#3175](https://github.com/Microsoft/vscode-python/issues/3175))
1. If selection is being sent to the Interactive Windows still allow for context menu commands to run selection in terminal or run file in terminal
   ([#4207](https://github.com/Microsoft/vscode-python/issues/4207))
1. Support multiline comments for markdown cells
   ([#4215](https://github.com/Microsoft/vscode-python/issues/4215))
1. Conda activation fails when there is a space in the env name
   ([#4243](https://github.com/Microsoft/vscode-python/issues/4243))
1. Fixes to ensure tests work in multi-root workspaces.
   ([#4268](https://github.com/Microsoft/vscode-python/issues/4268))
1. Allow Interactive Window to run commands as both `-m jupyter command` and as `-m command`
   ([#4306](https://github.com/Microsoft/vscode-python/issues/4306))
1. Fix shift enter to send selection when cells are defined.
   ([#4413](https://github.com/Microsoft/vscode-python/issues/4413))
1. Test explorer icon should be hidden when tests are disabled
   ([#4494](https://github.com/Microsoft/vscode-python/issues/4494))
1. Fix double running of cells with the context menu
   ([#4532](https://github.com/Microsoft/vscode-python/issues/4532))
1. Show an "unknown" icon when test status is unknown.
   ([#4578](https://github.com/Microsoft/vscode-python/issues/4578))
1. Add sys info when switching interpreters
   ([#4588](https://github.com/Microsoft/vscode-python/issues/4588))
1. Display test explorer when discovery has been run.
   ([#4590](https://github.com/Microsoft/vscode-python/issues/4590))
1. Resolve `pythonPath` before comparing it to shebang
   ([#4601](https://github.com/Microsoft/vscode-python/issues/4601))
1. When sending selection to the Interactive Window nothing selected should send the entire line
   ([#4604](https://github.com/Microsoft/vscode-python/issues/4604))
1. Provide telemetry for when we show the shift+enter banner and if the user clicks yes
   ([#4636](https://github.com/Microsoft/vscode-python/issues/4636))
1. Better error message when connecting to remote server
   ([#4666](https://github.com/Microsoft/vscode-python/issues/4666))
1. Fix problem with restart never finishing
   ([#4691](https://github.com/Microsoft/vscode-python/issues/4691))
1. Fixes to ensure we invoke the right command when running a parameterized test function.
   ([#4713](https://github.com/Microsoft/vscode-python/issues/4713))
1. Handle view state changes for the Python Interactive window so that it gains focus when appropriate. (CTRL+1/2/3 etc should give focus to the interactive window)
   ([#4733](https://github.com/Microsoft/vscode-python/issues/4733))
1. Don't have "run all above" on first cell and don't start history for empty code runs
   ([#4743](https://github.com/Microsoft/vscode-python/issues/4743))
1. Perform case insensitive comparison of Python Environment paths
   ([#4797](https://github.com/Microsoft/vscode-python/issues/4797))
1. Ensure `Jedi` uses the currently selected interpreter.
   (thanks [Selim Belhaouane](https://github.com/selimb))
   ([#4687](https://github.com/Microsoft/vscode-python/issues/4687))
1. Multiline comments with text on the first line break Python Interactive window execution.
   ([#4791](https://github.com/Microsoft/vscode-python/issues/4791))
1. Fix status bar when using Live Share or just starting the Python Interactive window.
   ([#4853](https://github.com/Microsoft/vscode-python/issues/4853))
1. Change the names of our "Run All Cells Above" and "Run Cell and All Below" commands to be more concise
   ([#4876](https://github.com/Microsoft/vscode-python/issues/4876))
1. Ensure the `Python` output panel does not steal focus when there errors in the `Language Server`.
   ([#4868](https://github.com/Microsoft/vscode-python/issues/4868))
1. Update ptvsd to [4.2.5](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.5).
   ([#4932](https://github.com/Microsoft/vscode-python/issues/4932))
    * Fix issues with django and jinja2 exceptions.
    * Detaching sometimes throws ValueError.
    * StackTrace request respecting just-my-code.
    * Don't give error redirecting output with pythonw.
    * Fix for stop on entry issue.
1. Update the Python language server to 0.2.31.

### Code Health

1. Add a Python script to run PyTest correctly for discovery.
   ([#4033](https://github.com/Microsoft/vscode-python/issues/4033))
1. Ensure post npm install scripts do not fail when run more than once.
   ([#4109](https://github.com/Microsoft/vscode-python/issues/4109))
1. Improve Azure DevOps pipeline for PR validation. Added speed improvements, documented the process better, and simplified what happens in PR validation.
   ([#4123](https://github.com/Microsoft/vscode-python/issues/4123))
1. Move to new Azure DevOps instance and bring the Nightly CI build closer to running cleanly by skipping tests and improving reporting transparency.
   ([#4336](https://github.com/Microsoft/vscode-python/issues/4336))
1. Add more logging to diagnose issues getting the Python Interactive window to show up.
   Add checks for Conda activation never finishing.
   ([#4424](https://github.com/Microsoft/vscode-python/issues/4424))
1. Update `nyc` and remove `gulp-watch` and `gulp-debounced-watch`.
   ([#4490](https://github.com/Microsoft/vscode-python/issues/4490))
1. Force WS to at least 3.3.1 to alleviate security concerns.
   ([#4497](https://github.com/Microsoft/vscode-python/issues/4497))
1. Add tests for Live Share support.
   ([#4521](https://github.com/Microsoft/vscode-python/issues/4521))
1. Fix running Live Share support in a release build.
   ([#4529](https://github.com/Microsoft/vscode-python/issues/4529))
1. Delete the `pvsc-dev-ext.py` file as it was not being properly maintained.
   ([#4530](https://github.com/Microsoft/vscode-python/issues/4530))
1. Increase timeouts for loading of extension when preparing to run tests.
   ([#4540](https://github.com/Microsoft/vscode-python/issues/4540))
1. Exclude files `travis*.log`, `pythonFiles/tests/**`, `types/**` from the extension.
   ([#4554](https://github.com/Microsoft/vscode-python/issues/4554))
1. Exclude `*.vsix` from source control.
   ([#4556](https://github.com/Microsoft/vscode-python/issues/4556))
1. Add more logging for ECONNREFUSED errors and Jupyter server crashes
   ([#4573](https://github.com/Microsoft/vscode-python/issues/4573))
1. Add travis task to verify bundle can be created.
   ([#4711](https://github.com/Microsoft/vscode-python/issues/4711))
1. Add manual test plan for data science
   ([#4716](https://github.com/Microsoft/vscode-python/issues/4716))
1. Fix Live Share nightly functional tests
   ([#4757](https://github.com/Microsoft/vscode-python/issues/4757))
1. Make cancel test and server cache test more robust
   ([#4818](https://github.com/Microsoft/vscode-python/issues/4818))
1. Generalize code used to parse Test results service
   ([#4796](https://github.com/Microsoft/vscode-python/issues/4796))

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

## 2019.2.2 (6 March 2019)

### Fixes

1. If selection is being sent to the Interactive Windows still allow for context menu commands to run selection in terminal or run file in terminal
   ([#4207](https://github.com/Microsoft/vscode-python/issues/4207))
1. When sending selection to the Interactive Window nothing selected should send the entire line
   ([#4604](https://github.com/Microsoft/vscode-python/issues/4604))
1. Provide telemetry for when we show the shift-enter banner and if the user clicks yes
   ([#4636](https://github.com/Microsoft/vscode-python/issues/4636))

## 2019.2.5433 (27 Feb 2019)

### Fixes


1. Exclude files `travis*.log`, `pythonFiles/tests/**`, `types/**` from the extension.
   ([#4554](https://github.com/Microsoft/vscode-python/issues/4554))
   ([#4566](https://github.com/Microsoft/vscode-python/issues/4566))

## 2019.2.0 (26 Feb 2019)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Support launch configs for debugging tests.
   ([#332](https://github.com/Microsoft/vscode-python/issues/332))
1. Add way to send code to the Python Interactive window without having to put `#%%` into a file.
   ([#3171](https://github.com/Microsoft/vscode-python/issues/3171))
1. Support simple variable substitution in `.env` files.
   ([#3275](https://github.com/Microsoft/vscode-python/issues/3275))
1. Support live share in Python interactive window (experimental).
   ([#3581](https://github.com/Microsoft/vscode-python/issues/3581))
1. Strip comments before sending so shell command and multiline jupyter magics work correctly.
   ([#4064](https://github.com/Microsoft/vscode-python/issues/4064))
1. Add a build number to our released builds.
   ([#4183](https://github.com/Microsoft/vscode-python/issues/4183))
1. Prompt the user to send shift-enter to the interactive window.
   ([#4184](https://github.com/Microsoft/vscode-python/issues/4184))
1. Added Dutch translation.
   (thanks [Robin Martijn](https://github.com/Bowero) with the feedback of [Michael van Tellingen](https://github.com/mvantellingen))
   ([#4186](https://github.com/Microsoft/vscode-python/issues/4186))
1. Add the Test Activity view.
   ([#4272](https://github.com/Microsoft/vscode-python/issues/4272))
1. Added action buttons to top of Test Explorer.
   ([#4275](https://github.com/Microsoft/vscode-python/issues/4275))
1. Navigation to test output from Test Explorer.
   ([#4279](https://github.com/Microsoft/vscode-python/issues/4279))
1. Add the command 'Configure Unit Tests'.
   ([#4286](https://github.com/Microsoft/vscode-python/issues/4286))
1. Do not update unit test settings if configuration is cancelled.
   ([#4287](https://github.com/Microsoft/vscode-python/issues/4287))
1. Keep testing configuration alive when losing UI focus.
   ([#4288](https://github.com/Microsoft/vscode-python/issues/4288))
1. Display test activity only when tests have been discovered.
   ([#4317](https://github.com/Microsoft/vscode-python/issues/4317))
1. Added a button to configure unit tests when prompting users that tests weren't discovered.
   ([#4318](https://github.com/Microsoft/vscode-python/issues/4318))
1. Use VSC API to open browser window
   ([#4322](https://github.com/Microsoft/vscode-python/issues/4322))
1. Don't shut down the notebook server on window close.
   ([#4348](https://github.com/Microsoft/vscode-python/issues/4348))
1. Added command `Show Output` to display the `Python` output panel.
   ([#4362](https://github.com/Microsoft/vscode-python/issues/4362))
1. Fix order of icons in test explorer and items.
   ([#4364](https://github.com/Microsoft/vscode-python/issues/4364))
1. Run failed tests icon should only appear if and when a test has failed.
   ([#4371](https://github.com/Microsoft/vscode-python/issues/4371))
1. Update ptvsd to [4.2.4](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.4).
   ([#4457](https://github.com/Microsoft/vscode-python/issues/4457))
   * Validate breakpoint targets.
   * Properly exclude certain files from showing up in the debugger.

### Fixes

1. Add support for multi root workspaces with the new language server server.
   ([#3008](https://github.com/Microsoft/vscode-python/issues/3008))
1. Move linting tests to unit-testing for better reliability.
   ([#3914](https://github.com/Microsoft/vscode-python/issues/3914))
1. Allow "Run Cell" code lenses on non-local files.
   ([#3995](https://github.com/Microsoft/vscode-python/issues/3995))
1. Functional test for the input portion of the python interactive window.
   ([#4057](https://github.com/Microsoft/vscode-python/issues/4057))
1. Fix hitting the up arrow on the input prompt for the Python Interactive window to behave like the terminal window when only 1 item in the history.
   ([#4145](https://github.com/Microsoft/vscode-python/issues/4145))
1. Fix problem with webview panel not being dockable anywhere but view column 2.
   ([#4237](https://github.com/Microsoft/vscode-python/issues/4237))
1. More fixes for history in the Python Interactive window input prompt.
   ([#4255](https://github.com/Microsoft/vscode-python/issues/4255))
1. Fix precedence in `parsePyTestModuleCollectionResult`.
   (thanks [Tammo Ippen](https://github.com/tammoippen))
   ([#4360](https://github.com/Microsoft/vscode-python/issues/4360))
1. Revert pipenv activation to not use `pipenv` shell.`
   ([#4394](https://github.com/Microsoft/vscode-python/issues/4394))
1. Fix shift enter to send selection when cells are defined.
   ([#4413](https://github.com/Microsoft/vscode-python/issues/4413))
1. Icons should display only in test explorer.
   ([#4418](https://github.com/Microsoft/vscode-python/issues/4418))
1. Update ptvsd to [4.2.4](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.4).
   ([#4457](https://github.com/Microsoft/vscode-python/issues/4457))
   * `BreakOnSystemExitZero` now respected.
   * Fix a bug causing breakpoints not to be hit when attached to a remote target.
1. Fix double running of cells with the context menu
   ([#4532](https://github.com/Microsoft/vscode-python/issues/4532))
1. Update the Python language server to 0.1.80.

### Code Health

1. Fix all typescript errors when compiled in strict mode.
   ([#611](https://github.com/Microsoft/vscode-python/issues/611))
1. Get functional tests running nightly again.
   ([#3973](https://github.com/Microsoft/vscode-python/issues/3973))
1. Turn on strict type checking (typescript compiling) for Datascience code.
   ([#4058](https://github.com/Microsoft/vscode-python/issues/4058))
1. Turn on strict typescript compile for the data science react code.
   ([#4091](https://github.com/Microsoft/vscode-python/issues/4091))
1. Fix issue causing debugger tests to timeout on CI servers.
   ([#4148](https://github.com/Microsoft/vscode-python/issues/4148))
1. Don't register language server onTelemetry when downloadLanguageServer is false.
   ([#4199](https://github.com/Microsoft/vscode-python/issues/4199))
1. Fixes to smoke tests on CI.
   ([#4201](https://github.com/Microsoft/vscode-python/issues/4201))



## 2019.1.0 (29 Jan 2019)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Add the capability to have custom regex's for cell/markdown matching
   ([#4065](https://github.com/Microsoft/vscode-python/issues/4065))
1. Perform all validation checks in the background
   ([#3019](https://github.com/Microsoft/vscode-python/issues/3019))
1. Watermark for Python Interactive input prompt
   ([#4111](https://github.com/Microsoft/vscode-python/issues/4111))
1. Create diagnostics for failed/skipped tests that were run with pytest.
   (thanks [Chris NeJame](https://github.com/SalmonMode/))
   ([#120](https://github.com/Microsoft/vscode-python/issues/120))
1. Add the python.pipenvPath config setting.
   ([#978](https://github.com/Microsoft/vscode-python/issues/978))
1. Add localRoot and remoteRoot defaults for Remote Debugging configuration in `launch.json`.
   ([#1385](https://github.com/Microsoft/vscode-python/issues/1385))
1. Activate `pipenv` environments in the shell using the command `pipenv shell`.
   ([#2855](https://github.com/Microsoft/vscode-python/issues/2855))
1. Use Pylint message names instead of codes
   (thanks to [Roman Kornev](https://github.com/RomanKornev/))
   ([#2906](https://github.com/Microsoft/vscode-python/issues/2906))
1. Add ability to enter Python code directly into the Python Interactive window
   ([#3101](https://github.com/Microsoft/vscode-python/issues/3101))
1. Allow interactive window inputs to either be collapsed by default or totally hidden
   ([#3266](https://github.com/Microsoft/vscode-python/issues/3266))
1. Notify the user when language server extraction fails
   ([#3268](https://github.com/Microsoft/vscode-python/issues/3268))
1. Indent on enter after line continuations.
   ([#3284](https://github.com/Microsoft/vscode-python/issues/3284))
1. Improvements to automatic selection of the Python interpreter.
   ([#3369](https://github.com/Microsoft/vscode-python/issues/3369))
1. Add support for column numbers for problems returned by `mypy`.
   (thanks [Eric Traut](https://github.com/erictraut))
   ([#3597](https://github.com/Microsoft/vscode-python/issues/3597))
1. Display actionable message when language server is not supported
   ([#3634](https://github.com/Microsoft/vscode-python/issues/3634))
1. Make sure we are looking for conda in all the right places
   ([#3641](https://github.com/Microsoft/vscode-python/issues/3641))
1. Improvements to message displayed when linter is not installed
   ([#3659](https://github.com/Microsoft/vscode-python/issues/3659))
1. Improvements to message displayed when Python path is invalid (in launch.json)
   ([#3661](https://github.com/Microsoft/vscode-python/issues/3661))
1. Add the Jupyter Server URI to the Interactive Window info cell
   ([#3668](https://github.com/Microsoft/vscode-python/issues/3668))
1. Handle errors happening during extension activation.
   ([#3740](https://github.com/Microsoft/vscode-python/issues/3740))
1. Validate Mac Interpreters in the background.
   ([#3908](https://github.com/Microsoft/vscode-python/issues/3908))
1. When cell inputs to Python Interactive are hidden, don't show cells without any output
   ([#3981](https://github.com/Microsoft/vscode-python/issues/3981))

### Fixes

1. Have the new export commands use our directory change code
   ([#4140](https://github.com/Microsoft/vscode-python/issues/4140))
1. Theme should not be exported without output when doing an export.
   ([#4141](https://github.com/Microsoft/vscode-python/issues/4141))
1. Deleting all cells should not remove the input prompt
   ([#4152](https://github.com/Microsoft/vscode-python/issues/4152))
1. Fix ctrl+c to work in code that has already been entered
   ([#4168](https://github.com/Microsoft/vscode-python/issues/4168))
1. Auto-select virtual environment in multi-root workspaces
   ([#3501](https://github.com/Microsoft/vscode-python/issues/3501))
1. Validate interpreter in multi-root workspaces
   ([#3502](https://github.com/Microsoft/vscode-python/issues/3502))
1. Allow clicking anywhere in an input cell to give focus to the input box for the Python Interactive window
   ([#4076](https://github.com/Microsoft/vscode-python/issues/4076))
1. Cursor in Interactive Windows now appears on whitespace
   ([#4081](https://github.com/Microsoft/vscode-python/issues/4081))
1. Fix problem with double scrollbars when typing in the input window. Make code wrap instead.
   ([#4084](https://github.com/Microsoft/vscode-python/issues/4084))
1. Remove execution count from the prompt cell.
   ([#4086](https://github.com/Microsoft/vscode-python/issues/4086))
1. Make sure showing a plain Python Interactive window lists out the sys info
   ([#4088](https://github.com/Microsoft/vscode-python/issues/4088))
1. Fix Python interactive window up/down arrows in the input prompt to behave like a terminal.
   ([#4092](https://github.com/Microsoft/vscode-python/issues/4092))
1. Handle stdout changes with updates to pytest 4.1.x series (without breaking 4.0.x series parsing).
   ([#4099](https://github.com/Microsoft/vscode-python/issues/4099))
1. Fix bug affecting multiple linters used in a workspace.
   (thanks [Ilia Novoselov](https://github.com/nullie))
   ([#2571](https://github.com/Microsoft/vscode-python/issues/2571))
1. Activate any selected Python Environment when running unit tests.
   ([#3330](https://github.com/Microsoft/vscode-python/issues/3330))
1. Ensure extension does not start multiple language servers.
   ([#3346](https://github.com/Microsoft/vscode-python/issues/3346))
1. Add support for running an entire file in the Python Interactive window
   ([#3362](https://github.com/Microsoft/vscode-python/issues/3362))
1. When in multi-root workspace, store selected python path in the `settings.json` file of the workspace folder.
   ([#3419](https://github.com/Microsoft/vscode-python/issues/3419))
1. Fix console wrapping in output so that console based status bars and spinners work.
   ([#3529](https://github.com/Microsoft/vscode-python/issues/3529))
1. Support other virtual environments besides conda
   ([#3537](https://github.com/Microsoft/vscode-python/issues/3537))
1. Fixed tests related to the `onEnter` format provider.
   ([#3674](https://github.com/Microsoft/vscode-python/issues/3674))
1. Lowering threshold for Language Server support on a platform.
   ([#3693](https://github.com/Microsoft/vscode-python/issues/3693))
1. Survive missing kernelspecs as a default will be created.
   ([#3699](https://github.com/Microsoft/vscode-python/issues/3699))
1. Activate the extension when loading ipynb files
   ([#3734](https://github.com/Microsoft/vscode-python/issues/3734))
1. Don't restart the Jupyter server on any settings change. Also don't throw interpreter changed events on unrelated settings changes.
   ([#3749](https://github.com/Microsoft/vscode-python/issues/3749))
1. Support whitespace (tabs and spaces) in output
   ([#3757](https://github.com/Microsoft/vscode-python/issues/3757))
1. Ensure file names are not captured when sending telemetry for unit tests.
   ([#3767](https://github.com/Microsoft/vscode-python/issues/3767))
1. Address problem with Python Interactive icons not working in insider's build. VS Code is more restrictive on what files can load in a webview.
   ([#3775](https://github.com/Microsoft/vscode-python/issues/3775))
1. Fix output so that it wraps '<' entries in &lt;xmp&gt; to allow html like tags to be output.
   ([#3824](https://github.com/Microsoft/vscode-python/issues/3824))
1. Keep the Jupyter remote server URI input box open so you can copy and paste into it easier
   ([#3856](https://github.com/Microsoft/vscode-python/issues/3856))
1. Changes to how source maps are enabled and disabled in the extension.
   ([#3905](https://github.com/Microsoft/vscode-python/issues/3905))
1. Clean up command names for data science
   ([#3925](https://github.com/Microsoft/vscode-python/issues/3925))
1. Add more data when we get an unknown mime type
   ([#3945](https://github.com/Microsoft/vscode-python/issues/3945))
1. Match dots in ignorePatterns globs; fixes .venv not being ignored
   (thanks to [Russell Davis](https://github.com/russelldavis))
   ([#3947](https://github.com/Microsoft/vscode-python/issues/3947))
1. Remove duplicates from interpreters listed in the interpreter selection list.
   ([#3953](https://github.com/Microsoft/vscode-python/issues/3953))
1. Add telemetry for local versus remote connect
   ([#3985](https://github.com/Microsoft/vscode-python/issues/3985))
1. Add new maxOutputSize setting for text output in the Python Interactive window. -1 means infinite, otherwise the number of pixels.
   ([#4010](https://github.com/Microsoft/vscode-python/issues/4010))
1. fix `pythonPath` typo (thanks [David Lechner](https://github.com/dlech))
   ([#4047](https://github.com/Microsoft/vscode-python/issues/4047))
1. Fix a type in generated header comment when importing a notebook: `DataSciece` --> `DataScience`.
   (thanks [sunt05](https://github.com/sunt05))
   ([#4048](https://github.com/Microsoft/vscode-python/issues/4048))
1. Allow clicking anywhere in an input cell to give focus to the input box for the Python Interactive window
   ([#4076](https://github.com/Microsoft/vscode-python/issues/4076))
1. Fix problem with double scrollbars when typing in the input window. Make code wrap instead.
   ([#4084](https://github.com/Microsoft/vscode-python/issues/4084))
1. Remove execution count from the prompt cell.
   ([#4086](https://github.com/Microsoft/vscode-python/issues/4086))
1. Make sure showing a plain Python Interactive window lists out the sys info
   ([#4088](https://github.com/Microsoft/vscode-python/issues/4088))

### Code Health

1. Fix build issue with code.tsx
   ([#4156](https://github.com/Microsoft/vscode-python/issues/4156))
1. Expose an event to notify changes to settings instead of casting settings to concrete class.
   ([#642](https://github.com/Microsoft/vscode-python/issues/642))
1. Created system test to ensure terminal gets activated with anaconda environment
   ([#1521](https://github.com/Microsoft/vscode-python/issues/1521))
1. Added system tests to ensure terminal gets activated with virtualenv environment
   ([#1522](https://github.com/Microsoft/vscode-python/issues/1522))
1. Added system test to ensure terminal gets activated with pipenv
   ([#1523](https://github.com/Microsoft/vscode-python/issues/1523))
1. Fix flaky tests related to auto selection of virtual environments.
   ([#2339](https://github.com/Microsoft/vscode-python/issues/2339))
1. Use enums for event names instead of constants.
   ([#2904](https://github.com/Microsoft/vscode-python/issues/2904))
1. Add tests for clicking buttons in history pane
   ([#3084](https://github.com/Microsoft/vscode-python/issues/3084))
1. Add tests for clear and delete buttons in the history pane
   ([#3087](https://github.com/Microsoft/vscode-python/issues/3087))
1. Add tests for clicking buttons on individual cells
   ([#3092](https://github.com/Microsoft/vscode-python/issues/3092))
1. Handle a 404 when trying to download the language server
   ([#3267](https://github.com/Microsoft/vscode-python/issues/3267))
1. Ensure new warnings are not ignored when bundling the extension with WebPack.
   ([#3468](https://github.com/Microsoft/vscode-python/issues/3468))
1. Update our CI/nightly full build to a YAML definition build in Azure DevOps.
   ([#3555](https://github.com/Microsoft/vscode-python/issues/3555))
1. Add mock of Jupyter API to allow functional tests to run more quickly and more consistently.
   ([#3556](https://github.com/Microsoft/vscode-python/issues/3556))
1. Use Jedi if Language Server fails to activate
   ([#3633](https://github.com/Microsoft/vscode-python/issues/3633))
1. Fix the timeout for DataScience functional tests
   ([#3682](https://github.com/Microsoft/vscode-python/issues/3682))
1. Fixed language server smoke tests.
   ([#3684](https://github.com/Microsoft/vscode-python/issues/3684))
1. Add a functional test for interactive window remote connect scenario
   ([#3714](https://github.com/Microsoft/vscode-python/issues/3714))
1. Detect usage of `xonsh` shells (this does **not** add support for `xonsh` itself)
   ([#3746](https://github.com/Microsoft/vscode-python/issues/3746))
1. Remove `src/server` folder, as this is no longer required.
   ([#3781](https://github.com/Microsoft/vscode-python/issues/3781))
1. Bugfix to `pvsc-dev-ext.py` where arguments to git would not be passed on POSIX-based environments. Extended `pvsc-dev-ext.py setup` command with 2
   optional flags-- `--repo` and `--branch` to override the default git repository URL and the branch used to clone and install the extension.
   (thanks [Anthony Shaw](https://github.com/tonybaloney/))
   ([#3837](https://github.com/Microsoft/vscode-python/issues/3837))
1. Improvements to execution times of CI on Travis.
   ([#3899](https://github.com/Microsoft/vscode-python/issues/3899))
1. Add telemetry to check if global interpreter is used in workspace.
   ([#3901](https://github.com/Microsoft/vscode-python/issues/3901))
1. Make sure to search for the best Python when launching the non default interpreter.
   ([#3916](https://github.com/Microsoft/vscode-python/issues/3916))
1. Add tests for expand / collapse and hiding of cell inputs mid run
   ([#3982](https://github.com/Microsoft/vscode-python/issues/3982))
1. Move `splitParent` from `string.ts` into tests folder.
   ([#3988](https://github.com/Microsoft/vscode-python/issues/3988))
1. Ensure `debounce` decorator cannot be applied to async functions.
   ([#4055](https://github.com/Microsoft/vscode-python/issues/4055))

## 2018.12.1 (14 Dec 2018)

### Fixes


1. Lowering threshold for Language Server support on a platform.
   ([#3693](https://github.com/Microsoft/vscode-python/issues/3693))
1. Fix bug affecting multiple linters used in a workspace.
   (thanks [Ilia Novoselov](https://github.com/nullie))
   ([#3700](https://github.com/Microsoft/vscode-python/issues/3700))

## 2018.12.0 (13 Dec 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Load the configured language server in the background during extension activation.
   ([#3020](https://github.com/Microsoft/vscode-python/issues/3020))
1. Display progress indicator when activating the language server and validating user setup.
   ([#3082](https://github.com/Microsoft/vscode-python/issues/3082))
1. Allow for connection to a remote `Jupyter` server.
   ([#3316](https://github.com/Microsoft/vscode-python/issues/3316))
1. Allow users to request the 'Install missing Linter' prompt to not show again for `pylint`.
   ([#3349](https://github.com/Microsoft/vscode-python/issues/3349))
1. Add the `Jupyter` server URI to the interactive window info cell.
   ([#3668](https://github.com/Microsoft/vscode-python/issues/3668))

### Fixes

1. Updated logic used to determine whether the Microsoft Python Language Server is supported.
   ([#2729](https://github.com/Microsoft/vscode-python/issues/2729))
1. Add export from the Python interactive window as a notebook file.
   ([#3109](https://github.com/Microsoft/vscode-python/issues/3109))
1. Fix issue with the `unittest` runner where test suite/module initialization methods were not for a single test method.
   (thanks [Alex Yu](https://github.com/alexander-yu))
   ([#3295](https://github.com/Microsoft/vscode-python/issues/3295))
1. Activate `conda` prior to running `jupyter` for the Python interactive window.
   ([#3341](https://github.com/Microsoft/vscode-python/issues/3341))
1. Respect value defined for `pylintEnabled` in user `settings.json`.
   ([#3388](https://github.com/Microsoft/vscode-python/issues/3388))
1. Expand variables in `pythonPath` before validating it.
   ([#3392](https://github.com/Microsoft/vscode-python/issues/3392))
1. Clear cached display name of Python if interpreter changes.
   ([#3406](https://github.com/Microsoft/vscode-python/issues/3406))
1. Run in the workspace directory by default for the interactive window.
   ([#3407](https://github.com/Microsoft/vscode-python/issues/3407))
1. Create a default config when starting a local `Jupyter` server to resolve potential conflicts with user's custom configuration.
   ([#3475](https://github.com/Microsoft/vscode-python/issues/3475))
1. Add support for running Python interactive commands from the command palette.
   ([#3476](https://github.com/Microsoft/vscode-python/issues/3476))
1. Handle interrupts crashing the kernel.
   ([#3511](https://github.com/Microsoft/vscode-python/issues/3511))
1. Revert `ctags` argument from `--extras` to `--extra`.
   ([#3517](https://github.com/Microsoft/vscode-python/issues/3517))
1. Fix problems with `jupyter` startup related to custom configurations.
   ([#3533](https://github.com/Microsoft/vscode-python/issues/3533))
1. Fix crash when `kernelspec` is missing path or language.
   ([#3561](https://github.com/Microsoft/vscode-python/issues/3561))
1. Update the Microsoft Python Language Server to 0.1.72/[2018.12.1](https://github.com/Microsoft/python-language-server/releases/tag/2018.12.1) ([#3657](https://github.com/Microsoft/vscode-python/issues/3657)):
   * Properly resolve namespace packages and relative imports.
   * `Go to Definition` now supports namespace packages.
   * Fixed `null` reference exceptions.
   * Fixed erroneously reporting `None`, `True`, and `False` as undefined.


### Code Health

1. Pin python dependencies bundled with the extension in a `requirements.txt` file.
   ([#2965](https://github.com/Microsoft/vscode-python/issues/2965))
1. Remove scripts that bundled the extension using the old way, without webpack.
   ([#3479](https://github.com/Microsoft/vscode-python/issues/3479))
1. Fix environment variable token in Azure DevOps YAML.
   ([#3630](https://github.com/Microsoft/vscode-python/issues/3630))
1. Add missing imports and enable functional tests.
   ([#3649](https://github.com/Microsoft/vscode-python/issues/3649))
1. Enable code coverage for unit tests and functional tests.
   ([#3650](https://github.com/Microsoft/vscode-python/issues/3650))
1. Add logging for improved diagnostics.
   ([#3460](https://github.com/Microsoft/vscode-python/issues/3460))

## 2018.11.0 (29 Nov 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.13.1](https://pypi.org/project/jedi/0.13.1/)
  and [parso 0.3.1](https://pypi.org/project/parso/0.3.1/)
- [Microsoft Python Language Server](https://github.com/microsoft/python-language-server)
- [ptvsd](https://pypi.org/project/ptvsd/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Update Jedi to 0.13.1 and parso 0.3.1.
   ([#2667](https://github.com/Microsoft/vscode-python/issues/2667))
1. Make diagnostic message actionable when opening a workspace with no currently selected Python interpreter.
   ([#2983](https://github.com/Microsoft/vscode-python/issues/2983))
1. Expose an API that can be used by other extensions to interact with the Python Extension.
   ([#3121](https://github.com/Microsoft/vscode-python/issues/3121))
1. Updated the language server to [0.1.65](https://github.com/Microsoft/python-language-server/releases/tag/2018.11.1):
   - Improved `formatOnType` so it handles mismatched braces better
   ([#3482](https://github.com/Microsoft/vscode-python/issues/3482))

### Fixes

1. Have `ctags` use the `--extras` option instead of `--extra`.
   (thanks to [Brandy Sandrowicz](https://github.com/bsandrow))
   ([#793](https://github.com/Microsoft/vscode-python/issues/793))
1. Always use bundled version of [`ptvsd`](https://github.com/microsoft/ptvsd), unless specified.
   To use a custom version of `ptvsd` in the debugger, add `customDebugger` into your `launch.json` configuration as follows:
   ```json
       "type": "python",
       "request": "launch",
       "customDebugger": true
   ```
   ([#3283](https://github.com/Microsoft/vscode-python/issues/3283))
1. Fix problems with virtual environments not matching the loaded python when running cells.
   ([#3294](https://github.com/Microsoft/vscode-python/issues/3294))
1. Add button for interrupting the jupyter kernel
   ([#3314](https://github.com/Microsoft/vscode-python/issues/3314))
1. Auto select `Python Interpreter` prior to validation of interpreters and changes to messages displayed.
   ([#3326](https://github.com/Microsoft/vscode-python/issues/3326))
1. Fix Jupyter server connection issues involving IP addresses, base_url, and missing tokens
   ([#3332](https://github.com/Microsoft/vscode-python/issues/3332))
1. Make `nbconvert` in a installation not prevent notebooks from starting.
   ([#3343](https://github.com/Microsoft/vscode-python/issues/3343))
1. Re-run Jupyter notebook setup when the kernel is restarted. This correctly picks up dark color themes for matplotlib.
   ([#3418](https://github.com/Microsoft/vscode-python/issues/3418))
1. Update the language server to [0.1.65](https://github.com/Microsoft/python-language-server/releases/tag/2018.11.1):
   - Fixed `null` reference exception when executing "Find symbol in workspace"
   - Fixed `null` argument exception that could happen when a function used tuples
   - Fixed issue when variables in nested list comprehensions were marked as undefined
   - Fixed exception that could be thrown with certain generic syntax
   ([#3482](https://github.com/Microsoft/vscode-python/issues/3482))

### Code Health

1. Added basic integration tests for the new Language Server.
   ([#2041](https://github.com/Microsoft/vscode-python/issues/2041))
1. Add smoke tests for the extension.
   ([#3021](https://github.com/Microsoft/vscode-python/issues/3021))
1. Improvements to the `webpack configuration` file used to build the Data Science UI components.
   Added pre-build validations to ensure all npm modules used by Data Science UI components are registered.
   ([#3122](https://github.com/Microsoft/vscode-python/issues/3122))
1. Removed `IsTestExecution` guard from around data science banner calls
   ([#3246](https://github.com/Microsoft/vscode-python/issues/3246))
1. Unit tests for `CodeLensProvider` and `CodeWatcher`
   ([#3264](https://github.com/Microsoft/vscode-python/issues/3264))
1. Use `EXTENSION_ROOT_DIR` instead of `__dirname` in preparation for bundling of extension.
   ([#3317](https://github.com/Microsoft/vscode-python/issues/3317))
1. Add YAML file specification for CI builds
   ([#3350](https://github.com/Microsoft/vscode-python/issues/3350))
1. Stop running CI tests against the `master` branch of ptvsd.
   ([#3414](https://github.com/Microsoft/vscode-python/issues/3414))
1. Be more aggressive in searching for a Python environment that can run Jupyter
   (make sure to cleanup any kernelspecs that are created during this process).
   ([#3433](https://github.com/Microsoft/vscode-python/issues/3433))


## 2018.10.1 (09 Nov 2018)

### Fixes

1. When attempting to 'Run Cell', get error - Cannot read property 'length' of null
   ([#3286](https://github.com/Microsoft/vscode-python/issues/3286))

## 2018.10.0 (08 Nov 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- Microsoft Python Language Server
- ptvsd
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Add support for code completion in the debug console window.
   ([#1076](https://github.com/Microsoft/vscode-python/issues/1076))
1. Add a new simple snippet for `if __name__ == '__main__':` block. The snippet can be accessed by typing `__main__`
   (thanks [R S Nikhil Krishna](https://github.com/rsnk96/))
   ([#2242](https://github.com/Microsoft/vscode-python/issues/2242))
1. Add Python Interactive mode for data science.
   ([#2302](https://github.com/Microsoft/vscode-python/issues/2302))
1. Added a debugger setting to show return values of functions while stepping.
   ([#2463](https://github.com/Microsoft/vscode-python/issues/2463))
1. Enable on-type formatting from language server
   ([#2690](https://github.com/Microsoft/vscode-python/issues/2690))
1. Add [bandit](https://pypi.org/project/bandit/) to supported linters.
   (thanks [Steven Demurjian Jr.](https://github.com/demus/))
   ([#2775](https://github.com/Microsoft/vscode-python/issues/2775))
1. Ensure `python.condaPath` supports paths relative to `Home`. E.g. `"python.condaPath":"~/anaconda3/bin/conda"`.
   ([#2781](https://github.com/Microsoft/vscode-python/issues/2781))
1. Updated the [language server](https://github.com/Microsoft/python-language-server) to [0.1.57/2018.11.0](https://github.com/Microsoft/python-language-server/releases/tag/2018.11.0) (from 2018.10.0)
   and the [debugger](https://pypi.org/project/ptvsd/) to
   [4.2.0](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.0) (from 4.1.3). Highlights include:
   * Language server
     - Completion support for [`collections.namedtuple`](https://docs.python.org/3/library/collections.html#collections.namedtuple).
     - Support [`typing.NewType`](https://docs.python.org/3/library/typing.html#typing.NewType)
       and [`typing.TypeVar`](https://docs.python.org/3/library/typing.html#typing.TypeVar).
   * Debugger
     - Add support for sub-process debugging (set `"subProcess": true` in your `launch.json` to use).
     - Add support for [pyside2](https://pypi.org/project/PySide2/).
1. Add localization of strings. Localized versions are specified in the package.nls.\<locale\>.json files.
   ([#463](https://github.com/Microsoft/vscode-python/issues/463))
1. Clear cached list of interpreters when an interpeter is created in the workspace folder (this allows for virtual environments created in one's workspace folder to be detectable immediately).
   ([#656](https://github.com/Microsoft/vscode-python/issues/656))
1. Pylint is no longer enabled by default when using the language server. Users that have not configured pylint but who have installed it in their workspace will be asked if they'd like to enable it.
   ([#974](https://github.com/Microsoft/vscode-python/issues/974))

### Fixes

1. Support "conda activate" after 4.4.0.
   ([#1882](https://github.com/Microsoft/vscode-python/issues/1882))
1. Fix installation of codna packages when conda environment contains spaces.
   ([#2015](https://github.com/Microsoft/vscode-python/issues/2015))
1. Ensure `python.formatting.blackPath` supports paths relative to `Home`. E.g. `"python.formatting.blackPath":"~/venv/bin/black"`.
   ([#2274](https://github.com/Microsoft/vscode-python/issues/2274))
1. Correct errors with timing, resetting, and exceptions, related to unittest during discovery and execution of tests. Re-enable `unittest.test` suite.
   ([#2692](https://github.com/Microsoft/vscode-python/issues/2692))
1. Fix colon-triggered block formatting.
   ([#2714](https://github.com/Microsoft/vscode-python/issues/2714))
1. Ensure relative paths to python interpreters in `python.pythonPath` of `settings.json` are prefixed with `./` or `.\\` (depending on the OS).
   ([#2744](https://github.com/Microsoft/vscode-python/issues/2744))
1. Give preference to PTSVD in current path.
   ([#2818](https://github.com/Microsoft/vscode-python/issues/2818))
1. Fixed a typo in the Python interpreter selection balloon for macOS.
   (thanks [Joe Graham](https://github.com/joe-graham))
   ([#2868](https://github.com/Microsoft/vscode-python/issues/2868))
1. Updated the [language server](https://github.com/Microsoft/python-language-server) to [0.1.57/2018.11.0](https://github.com/Microsoft/python-language-server/releases/tag/2018.11.0) (from 2018.10.0)
   and the [debugger](https://pypi.org/project/ptvsd/) to
   [4.2.0](https://github.com/Microsoft/ptvsd/releases/tag/v4.2.0) (from 4.1.3). Highlights include:
   * Language server
     - Completions on generic containers work (e.g. `x: List[T]` now have completions for `x`, not just `x[]`).
     - Fixed issues relating to `Go to Definition` for `from ... import` statements.
     - `None` is no longer flagged as undefined.
     - `BadSourceException` should no longer be raised.
     - Fixed a null reference exception when handling certain function overloads.
   * Debugger
     - Properly deal with handled or unhandled exception in top level frames.
     - Any folder ending with `site-packages` is considered a library.
     - Treat any code not in `site-packages` as user code.
     - Handle case where no completions are provided by the debugger.

### Code Health

1. Remove test-specific code from `configSettings.ts` class.
   ([#2678](https://github.com/Microsoft/vscode-python/issues/2678))
1. Add a unit test for the MyPy output regex.
   ([#2696](https://github.com/Microsoft/vscode-python/issues/2696))
1. Update all npm dependencies to use the caret operator.
   ([#2746](https://github.com/Microsoft/vscode-python/issues/2746))
1. Move contents of the folder `src/utils` into `src/client/common/utils`.
   ([#2748](https://github.com/Microsoft/vscode-python/issues/2748))
1. Moved languageServer-related files to a languageServer folder.
   ([#2756](https://github.com/Microsoft/vscode-python/issues/2756))
1. Skip known failing tests for specific OS and Python version combinations to get CI running cleanly.
   ([#2795](https://github.com/Microsoft/vscode-python/issues/2795))
1. Move the linting error code out of the linting message and let [VS Code manage it in the Problems panel](https://code.visualstudio.com/updates/v1_28#_problems-panel)
   (Thanks [Nafly Mohammed](https://github.com/naflymim)).
   ([#2815](https://github.com/Microsoft/vscode-python/issues/2815))
1. Remove code related to the old debugger.
   ([#2828](https://github.com/Microsoft/vscode-python/issues/2828))
1. Upgrade Gulp to 4.0.0.
   ([#2909](https://github.com/Microsoft/vscode-python/issues/2909))
1. Remove pre-commit hooks.
   ([#2963](https://github.com/Microsoft/vscode-python/issues/2963))
1. Only perform Black-related formatting tests when the current Python-version supports it.
   ([#2999](https://github.com/Microsoft/vscode-python/issues/2999))
1. Move language server downloads to the CDN.
   ([#3000](https://github.com/Microsoft/vscode-python/issues/3000))
1. Pin extension to a minimum version of the language server.
   ([#3125](https://github.com/Microsoft/vscode-python/issues/3125))





## 2018.9.2 (29 Oct 2018)

### Fixes

1. Update version of `vscode-extension-telemetry` to resolve issue with regards to spawning of numerous `powershell` processes.
   ([#2996](https://github.com/Microsoft/vscode-python/issues/2996))

### Code Health

1. Forward telemetry from the language server.
   ([#2940](https://github.com/Microsoft/vscode-python/issues/2940))


## 2018.9.1 (18 Oct 2018)

### Fixes

1. Disable activation of conda environments in PowerShell.
   ([#2732](https://github.com/Microsoft/vscode-python/issues/2732))
1. Add logging along with some some improvements to the load times of the extension.
   ([#2827](https://github.com/Microsoft/vscode-python/issues/2827))
1. Stop `normalizationForInterpreter.py` script from returning CRCRLF line-endings.
   ([#2857](https://github.com/Microsoft/vscode-python/issues/2857))

### Code Health

1. Add ability to publish extension builds from `release` branches into the blob store.
   ([#2874](https://github.com/Microsoft/vscode-python/issues/2874))


## 2018.9.0 (9 Oct 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [Microsoft Python Language Server 2018.9.0](https://github.com/Microsoft/python-language-server/releases/tag/2018.9.0)
- [ptvsd 4.1.3](https://github.com/Microsoft/ptvsd/releases/tag/v4.1.3)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [bandit](https://pypi.org/project/bandit/),
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Adds support for code completion in the debug console window.
   ([#1076](https://github.com/Microsoft/vscode-python/issues/1076))
1. Auto activate Python Environment in terminals (disable with `"python.terminal.activateEnvironment": false`).
   ([#1387](https://github.com/Microsoft/vscode-python/issues/1387))
1. Add support for activation of `pyenv` environments in the Terminal.
   ([#1526](https://github.com/Microsoft/vscode-python/issues/1526))
1. Display a message with options when user selects the default macOS Python interpreter.
   ([#1689](https://github.com/Microsoft/vscode-python/issues/1689))
1. Add debug configuration snippet for modules for the debugger.
   ([#2175](https://github.com/Microsoft/vscode-python/issues/2175))
1. Search for python interpreters in all paths found in the `PATH`/`Path` environment variable.
   ([#2398](https://github.com/Microsoft/vscode-python/issues/2398))
1. Add telemetry to download, extract, and analyze, phases of the Python Language Server.
   ([#2461](https://github.com/Microsoft/vscode-python/issues/2461))
1. The `pvsc-dev-ext.py` script now captures `stderr` for more informative exceptions
   when execution fails.
   ([#2483](https://github.com/Microsoft/vscode-python/issues/2483))
1. Display notification when attempting to debug without selecting a python interpreter.
   ([#2494](https://github.com/Microsoft/vscode-python/issues/2494))
1. Add support for out of band updates to the language server.
   ([#2580](https://github.com/Microsoft/vscode-python/issues/2580))
1. Ensure status bar with interpreter information takes priority over other items.
   ([#2617](https://github.com/Microsoft/vscode-python/issues/2617))
1. Add Python Language Server version to the survey banner URL presented to some users.
   ([#2630](https://github.com/Microsoft/vscode-python/issues/2630))
1. Language server now provides rename functionality.
   ([#2650](https://github.com/Microsoft/vscode-python/issues/2650))
1. Search for default known paths for conda environments on windows.
   ([#2794](https://github.com/Microsoft/vscode-python/issues/2794)
1. Add [bandit](https://pypi.org/project/bandit/) to supported linters.
   (thanks [Steven Demurjian](https://github.com/demus))
   ([#2775](https://github.com/Microsoft/vscode-python/issues/2775))

### Fixes

1. Improvements to the display format of interpreter information in the list of interpreters.
   ([#1352](https://github.com/Microsoft/vscode-python/issues/1352))
1. Deprecate the use of the setting `python.autoComplete.preloadModules`. Recommendation is to utilize the new language server (change the setting `"python.jediEnabled": false`).
   ([#1704](https://github.com/Microsoft/vscode-python/issues/1704))
1. Add a new `python.condaPath` setting to use if conda is not found on `PATH`.
   ([#1944](https://github.com/Microsoft/vscode-python/issues/1944))
1. Ensure code is executed when the last line of selected code is indented.
   ([#2167](https://github.com/Microsoft/vscode-python/issues/2167))
1. Stop duplicate initializations of the Python Language Server's progress reporter.
   ([#2297](https://github.com/Microsoft/vscode-python/issues/2297))
1. Fix the regex expression to match MyPy linter messages that expects the file name to have a `.py` extension, that isn't always the case, to catch any filename.
   E.g., .pyi files that describes interfaces wouldn't get the linter messages to Problems tab.
   ([#2380](https://github.com/Microsoft/vscode-python/issues/2380))
1. Do not use variable substitution when updating `python.pythonPath`.  This matters
   because VS Code does not do variable substitution in settings values.
   ([#2459](https://github.com/Microsoft/vscode-python/issues/2459))
1. Use a python script to launch the debugger, instead of using `-m` which requires changes to the `PYTHONPATH` variable.
   ([#2509](https://github.com/Microsoft/vscode-python/issues/2509))
1. Provide paths from `PYTHONPATH` environment variable to the language server, as additional search locations of Python modules.
   ([#2518](https://github.com/Microsoft/vscode-python/issues/2518))
1. Fix issue preventing debugger user survey banner from opening.
   ([#2557](https://github.com/Microsoft/vscode-python/issues/2557))
1. Use folder name of the Python interpreter as the name of the virtual environment.
   ([#2562](https://github.com/Microsoft/vscode-python/issues/2562))
1. Give preference to bitness information retrieved from the Python interpreter over what's been retrieved from Windows Registry.
   ([#2563](https://github.com/Microsoft/vscode-python/issues/2563))
1. Use the environment folder name for environments without environment names in the Conda Environments list file.
   ([#2577](https://github.com/Microsoft/vscode-python/issues/2577))
1. Update environment variable naming convention for `SPARK_HOME`, when stored in `settings.json`.
   ([#2628](https://github.com/Microsoft/vscode-python/issues/2628))
1. Fix debug adapter `Attach` test.
   ([#2655](https://github.com/Microsoft/vscode-python/issues/2655))
1. Fix colon-triggered block formatting.
   ([#2714](https://github.com/Microsoft/vscode-python/issues/2714))
1. Use full path to activate command in conda environments on windows when python.condaPath is set.
   ([#2753](https://github.com/Microsoft/vscode-python/issues/2753))

### Code Health

1. Fix broken CI on Azure DevOps.
   ([#2549](https://github.com/Microsoft/vscode-python/issues/2549))
1. Upgraded our version of `request` to `2.87.0`.
   ([#2621](https://github.com/Microsoft/vscode-python/issues/2621))
1. Include the version of language server in telemetry.
   ([#2702](https://github.com/Microsoft/vscode-python/issues/2702))
1. Update `vscode-extension-telemetry` to `0.0.22`.
   ([#2745](https://github.com/Microsoft/vscode-python/issues/2745))


## 2018.8.0 (04 September 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [4.1.1](https://pypi.org/project/ptvsd/4.1.1/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Improved language server startup time by 40%.
   ([#1865](https://github.com/Microsoft/vscode-python/issues/1865))
1. Add pip dependency support to the conda `environment.yml` YAML schema support
   (thanks [Mark Edwards](https://github.com/markedwards)).
   ([#2119](https://github.com/Microsoft/vscode-python/issues/2119))
1. Added a German translation. (thanks to [bschley](https://github.com/bschley) and by means of [berndverst](https://github.com/berndverst) and [croth1](https://github.com/croth1) for the reviews)
   ([#2203](https://github.com/Microsoft/vscode-python/issues/2203))
1. The new setting `python.analysis.diagnosticPublishDelay` allows you to control
   when language server publishes diagnostics. Default is 1 second after the user
   activity, such a typing, ceases. If diagnostic is clear (i.e. errors got fixed),
   the publishing is immediate.
   ([#2270](https://github.com/Microsoft/vscode-python/issues/2270))
1. Language server now supports hierarchical document outline per language server protocol 4.4+ and VS Code 1.26+.
   ([#2384](https://github.com/Microsoft/vscode-python/issues/2384))
1. Make use of the `http.proxy` field in `settings.json` when downloading the Python Language Server.
   ([#2385](https://github.com/Microsoft/vscode-python/issues/2385))

### Fixes

1. Fix debugger issue that prevented users from copying the value of a variable from the Variables debugger window.
   ([#1398](https://github.com/Microsoft/vscode-python/issues/1398))
1. Enable code lenses for tests when using the new language server.
   ([#1948](https://github.com/Microsoft/vscode-python/issues/1948))
1. Fix null reference exception in the language server causing server initialization to fail. The exception happened when search paths contained a folder that did not exist.
   ([#2017](https://github.com/Microsoft/vscode-python/issues/2017))
1. Language server now populates document outline with all symbols instead of just top-level ones.
   ([#2050](https://github.com/Microsoft/vscode-python/issues/2050))
1. Ensure test count values in the status bar represent the correct number of tests that were discovered and run.
   ([#2143](https://github.com/Microsoft/vscode-python/issues/2143))
1. Fixed issue in the language server when documentation for a function always produced "Documentation is still being calculated, please try again soon".
   ([#2179](https://github.com/Microsoft/vscode-python/issues/2179))
1. Change linter message parsing so it respects `python.linting.maxNumberOfProblems`.
   (thanks [Scott Saponas](https://github.com/saponas/))
   ([#2198](https://github.com/Microsoft/vscode-python/issues/2198))
1. Fixed language server issue when it could enter infinite loop reloading modules.
   ([#2207](https://github.com/Microsoft/vscode-python/issues/2207))
1. Ensure workspace `pipenv` environment is not labeled as a `virtual env`.
   ([#2223](https://github.com/Microsoft/vscode-python/issues/2223))
1. Improve reliability of document outline population with language server.
   ([#2224](https://github.com/Microsoft/vscode-python/issues/2224))
1. Language server now correctly handles `with` statement when `__enter__` is
   declared in a base class.
   ([#2240](https://github.com/Microsoft/vscode-python/issues/2240))
1. Fix `visualstudio_py_testLauncher` to stop breaking out of test discovery too soon.
   ([#2241](https://github.com/Microsoft/vscode-python/issues/2241))
1. Notify the user when the language server does not support their platform.
   ([#2245](https://github.com/Microsoft/vscode-python/issues/2245))
1. Fix issue with survey not opening in a browser for Windows users.
   ([#2252](https://github.com/Microsoft/vscode-python/issues/2252))
1. Correct banner survey question text to reference the Python Language Server.
   ([#2253](https://github.com/Microsoft/vscode-python/issues/2253))
1. Fixed issue in the language server when typing dot under certain conditions produced null reference exception.
   ([#2262](https://github.com/Microsoft/vscode-python/issues/2262))
1. Fix error when switching from new language server to the old `Jedi` language server.
   ([#2281](https://github.com/Microsoft/vscode-python/issues/2281))
1. Unpin Pylint from < 2.0 (prospector was upgraded and isn't stuck on that any longer)
   ([#2284](https://github.com/Microsoft/vscode-python/issues/2284))
1. Add support for breaking into the first line of code in the new debugger.
   ([#2299](https://github.com/Microsoft/vscode-python/issues/2299))
1. Show the debugger survey banner for only a subset of users.
   ([#2300](https://github.com/Microsoft/vscode-python/issues/2300))
1. Ensure Flask debug configuration launches flask in a debug environment with the Flask debug mode disabled.
   This is necessary to ensure the custom debugger takes precedence over the interactive debugger, and live reloading is disabled.
   http://flask.pocoo.org/docs/1.0/api/#flask.Flask.debug
   ([#2309](https://github.com/Microsoft/vscode-python/issues/2309))
1. Language server now correctly merges data from typeshed and the Python library.
   ([#2345](https://github.com/Microsoft/vscode-python/issues/2345))
1. Fix pytest >= 3.7 test discovery.
   ([#2347](https://github.com/Microsoft/vscode-python/issues/2347))
1. Update the downloaded Python language server nuget package filename to
   `Python-Language-Server-{OSType}.beta.nupkg`.
   ([#2362](https://github.com/Microsoft/vscode-python/issues/2362))
1. Added setting to control language server log output. Default is now 'error' so there should be much less noise in the output.
   ([#2405](https://github.com/Microsoft/vscode-python/issues/2405))
1. Fix `experimental` debugger when debugging Python files with Unicode characters in the file path.
   ([#688](https://github.com/Microsoft/vscode-python/issues/688))
1. Ensure stepping out of debugged code does not take user into `PTVSD` debugger code.
   ([#767](https://github.com/Microsoft/vscode-python/issues/767))
1. Upgrade `pythonExperimental` to `python` in `launch.json`.
   ([#2478](https://github.com/Microsoft/vscode-python/issues/2478))

### Code Health

1. Revert change that moved IExperimentalDebuggerBanner into a common location.
   ([#2195](https://github.com/Microsoft/vscode-python/issues/2195))
1. Decorate `EventEmitter` within a `try..catch` to play nice with other extensions performing the same operation.
   ([#2196](https://github.com/Microsoft/vscode-python/issues/2196))
1. Change the default interpreter to favor Python 3 over Python 2.
   ([#2266](https://github.com/Microsoft/vscode-python/issues/2266))
1. Deprecate command `Python: Build Workspace Symbols` when using the language server.
   ([#2267](https://github.com/Microsoft/vscode-python/issues/2267))
1. Pin version of `pylint` to `3.6.3` to allow ensure `pylint` gets installed on Travis with Python2.7.
   ([#2305](https://github.com/Microsoft/vscode-python/issues/2305))
1. Remove some of the debugger tests and fix some minor debugger issues.
   ([#2307](https://github.com/Microsoft/vscode-python/issues/2307))
1. Only use the current stable version of PTVSD in CI builds/releases.
   ([#2432](https://github.com/Microsoft/vscode-python/issues/2432))


## 2018.7.1 (23 July 2018)

### Fixes

1. Update the language server to code as of
   [651468731500ec1cc644029c3666c57b82f77d76](https://github.com/Microsoft/PTVS/commit/651468731500ec1cc644029c3666c57b82f77d76).
   ([#2233](https://github.com/Microsoft/vscode-python/issues/2233))


## 2018.7.0 (18 July 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [ptvsd 3.0.0](https://pypi.org/project/ptvsd/3.0.0/) and [4.1.11a5](https://pypi.org/project/ptvsd/4.1.11a5/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Language server now reports code analysis progress in the status bar.
   ([#1591](https://github.com/Microsoft/vscode-python/issues/1591))
1. Only report Language Server download progress once.
   ([#2000](https://github.com/Microsoft/vscode-python/issues/2000))
1. Messages changes to reflect name of the language server: 'Microsoft Python Language Server';
   folder name changed from `analysis` to `languageServer`.
   ([#2107](https://github.com/Microsoft/vscode-python/issues/2107))
1. Set default analysis for language server to open files only.
   ([#2113](https://github.com/Microsoft/vscode-python/issues/2113))
1. Add two popups to the extension: one to ask users to move to the new language server, the other to request feedback from users of that language server.
   ([#2127](https://github.com/Microsoft/vscode-python/issues/2127))

### Fixes

1. Ensure dunder variables are always displayed in code completion when using the new language server.
   ([#2013](https://github.com/Microsoft/vscode-python/issues/2013))
1. Store testId for files & suites during unittest discovery.
   ([#2044](https://github.com/Microsoft/vscode-python/issues/2044))
1. `editor.formatOnType` no longer adds space after `*` in multi-line arguments.
   ([#2048](https://github.com/Microsoft/vscode-python/issues/2048))
1. Fix bug where tooltips would popup whenever a comma is typed within a string.
   ([#2057](https://github.com/Microsoft/vscode-python/issues/2057))
1. Change keyboard shortcut for `Run Selection/Line in Python Terminal` to not
   interfere with the Find/Replace dialog box.
   ([#2068](https://github.com/Microsoft/vscode-python/issues/2068))
1. Relax validation of the environment `Path` variable.
   ([#2076](https://github.com/Microsoft/vscode-python/issues/2076))
1. `editor.formatOnType` is more reliable handling floating point numbers.
   ([#2079](https://github.com/Microsoft/vscode-python/issues/2079))
1. Change the default port used in remote debugging using `Experimental` debugger to `5678`.
   ([#2146](https://github.com/Microsoft/vscode-python/issues/2146))
1. Register test manager when using the new language server.
   ([#2186](https://github.com/Microsoft/vscode-python/issues/2186))

### Code Health

1. Removed pre-commit hook that ran unit tests.
   ([#1986](https://github.com/Microsoft/vscode-python/issues/1986))
1. Pass OS type to the debugger.
   ([#2128](https://github.com/Microsoft/vscode-python/issues/2128))
1. Ensure 'languageServer' directory is excluded from the build output.
   ([#2150](https://github.com/Microsoft/vscode-python/issues/2150))
1. Change the download links of the language server files.
   ([#2180](https://github.com/Microsoft/vscode-python/issues/2180))



## 2018.6.0 (20 June 2018)

### Thanks

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.3.4](https://pypi.org/project/isort/4.3.4/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.1](https://pypi.org/project/parso/0.2.1/)
- [ptvsd 3.0.0](https://pypi.org/project/ptvsd/3.0.0/) and [4.1.11a5](https://pypi.org/project/ptvsd/4.1.11a5/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

Also thanks to the various projects we provide integrations with which help
make this extension useful:
- Debugging support:
  [Django](https://pypi.org/project/Django/),
  [Flask](https://pypi.org/project/Flask/),
  [gevent](https://pypi.org/project/gevent/),
  [Jinja](https://pypi.org/project/Jinja/),
  [Pyramid](https://pypi.org/project/pyramid/),
  [PySpark](https://pypi.org/project/pyspark/),
  [Scrapy](https://pypi.org/project/Scrapy/),
  [Watson](https://pypi.org/project/Watson/)
- Formatting:
  [autopep8](https://pypi.org/project/autopep8/),
  [black](https://pypi.org/project/black/),
  [yapf](https://pypi.org/project/yapf/)
- Interpreter support:
  [conda](https://conda.io/),
  [direnv](https://direnv.net/),
  [pipenv](https://pypi.org/project/pipenv/),
  [pyenv](https://github.com/pyenv/pyenv),
  [venv](https://docs.python.org/3/library/venv.html#module-venv),
  [virtualenv](https://pypi.org/project/virtualenv/)
- Linting:
  [flake8](https://pypi.org/project/flake8/),
  [mypy](https://pypi.org/project/mypy/),
  [prospector](https://pypi.org/project/prospector/),
  [pylint](https://pypi.org/project/pylint/),
  [pydocstyle](https://pypi.org/project/pydocstyle/),
  [pylama](https://pypi.org/project/pylama/)
- Testing:
  [nose](https://pypi.org/project/nose/),
  [pytest](https://pypi.org/project/pytest/),
  [unittest](https://docs.python.org/3/library/unittest.html#module-unittest)

And finally thanks to the [Python](https://www.python.org/) development team and
community for creating a fantastic programming language and community to be a
part of!

### Enhancements

1. Add setting to control automatic test discovery on save, `python.unitTest.autoTestDiscoverOnSaveEnabled`.
   (thanks [Lingyu Li](http://github.com/lingyv-li/))
   ([#1037](https://github.com/Microsoft/vscode-python/issues/1037))
1. Add `gevent` launch configuration option to enable debugging of gevent monkey patched code.
   (thanks [Bence Nagy](https://github.com/underyx))
   ([#127](https://github.com/Microsoft/vscode-python/issues/127))
1. Add support for the `"source.organizeImports"` setting for `"editor.codeActionsOnSave"` (thanks [Nathan Gaberel](https://github.com/n6g7)); you can turn this on just for Python using:
   ```json
   "[python]": {
       "editor.codeActionsOnSave": {
           "source.organizeImports": true
       }
   }
   ```
   ([#156](https://github.com/Microsoft/vscode-python/issues/156))
1. Added Spanish translation.
   (thanks [Mario Rubio](https://github.com/mario-mra/))
   ([#1902](https://github.com/Microsoft/vscode-python/issues/1902))
1. Add a French translation (thanks to [Jérémy](https://github.com/PixiBixi) for
   the initial patch, and thanks to [Nathan Gaberel](https://github.com/n6g7),
   [Bruno Alla](https://github.com/browniebroke), and
   [Tarek Ziade](https://github.com/tarekziade) for reviews).
   ([#1959](https://github.com/Microsoft/vscode-python/issues/1959))
1. Add syntax highlighting for [Pipenv](http://pipenv.readthedocs.io/en/latest/)-related
   files (thanks [Nathan Gaberel](https://github.com/n6g7)).
   ([#995](https://github.com/Microsoft/vscode-python/issues/995))

### Fixes

1. Modified to change error message displayed when path to a tool (`linter`, `formatter`, etc) is invalid.
   ([#1064](https://github.com/Microsoft/vscode-python/issues/1064))
1. Improvements to the logic used to parse the arguments passed into the test frameworks.
   ([#1070](https://github.com/Microsoft/vscode-python/issues/1070))
1. Ensure navigation to definitions follows imports and is transparent to decoration.
   (thanks [Peter Law](https://github.com/PeterJCLaw))
   ([#1638](https://github.com/Microsoft/vscode-python/issues/1638))
1. Fix for intellisense failing when using the new `Outline` feature.
   ([#1721](https://github.com/Microsoft/vscode-python/issues/1721))
1. When debugging unit tests, use the `env` file configured in `settings.json` under `python.envFile`.
   ([#1759](https://github.com/Microsoft/vscode-python/issues/1759))
1. Fix to display all interpreters in the interpreter list when a workspace contains a `Pipfile`.
   ([#1800](https://github.com/Microsoft/vscode-python/issues/1800))
1. Use file system API to perform file path comparisons when performing code navigation.
   (thanks to [bstaint](https://github.com/bstaint) for the problem diagnosis)
   ([#1811](https://github.com/Microsoft/vscode-python/issues/1811))
1. Automatically add path mappings for remote debugging when attaching to the localhost.
   ([#1829](https://github.com/Microsoft/vscode-python/issues/1829))
1. Change keyboard shortcut for `Run Selection/Line in Python Terminal` to `Shift+Enter`.
   ([#1875](https://github.com/Microsoft/vscode-python/issues/1875))
1. Fix unhandled rejected promises in unit tests.
   ([#1919](https://github.com/Microsoft/vscode-python/issues/1919))
1. Fix debugger issue that causes the debugger to hang and silently exit stepping over a line of code instantiating an ITK vector object.
   ([#459](https://github.com/Microsoft/vscode-python/issues/459))

### Code Health

1. Add telemetry to capture type of python interpreter used in workspace.
   ([#1237](https://github.com/Microsoft/vscode-python/issues/1237))
1. Enabled multi-thrreaded debugger tests for the `experimental` debugger.
   ([#1250](https://github.com/Microsoft/vscode-python/issues/1250))
1. Log relevant environment information when the existence of `pipenv` cannot be determined.
   ([#1338](https://github.com/Microsoft/vscode-python/issues/1338))
1. Use [dotenv](https://www.npmjs.com/package/dotenv) package to parse [environment variables definition files](https://code.visualstudio.com/docs/python/environments#_environment-variable-definitions-file).
   ([#1376](https://github.com/Microsoft/vscode-python/issues/1376))
1. Move from yarn to npm.
   ([#1402](https://github.com/Microsoft/vscode-python/issues/1402))
1. Fix django and flask debugger tests when using the experimental debugger.
   ([#1407](https://github.com/Microsoft/vscode-python/issues/1407))
1. Capture telemetry for the usage of the `Create Terminal` command along with other instances when a terminal is created implicitly.
   ([#1542](https://github.com/Microsoft/vscode-python/issues/1542))
1. Add telemetry to capture availability of Python 3, version of Python used in workspace and the number of workspace folders.
   ([#1545](https://github.com/Microsoft/vscode-python/issues/1545))
1. Ensure all CI tests (except for debugger) are no longer allowed to fail.
   ([#1614](https://github.com/Microsoft/vscode-python/issues/1614))
1. Capture telemetry for the usage of the feature that formats a line as you type (`editor.formatOnType`).
   ([#1766](https://github.com/Microsoft/vscode-python/issues/1766))
1. Capture telemetry for the new debugger.
   ([#1767](https://github.com/Microsoft/vscode-python/issues/1767))
1. Capture telemetry for usage of the setting `python.autocomplete.addBrackets`
   ([#1770](https://github.com/Microsoft/vscode-python/issues/1770))
1. Speed up githook by skipping commits not containing any `.ts` files.
   ([#1803](https://github.com/Microsoft/vscode-python/issues/1803))
1. Update typescript package to 2.9.1.
   ([#1815](https://github.com/Microsoft/vscode-python/issues/1815))
1. Log Conda not existing message as an information instead of an error.
   ([#1817](https://github.com/Microsoft/vscode-python/issues/1817))
1. Make use of `ILogger` to log messages instead of using `console.error`.
   ([#1821](https://github.com/Microsoft/vscode-python/issues/1821))
1. Update `parso` package to 0.2.1.
   ([#1833](https://github.com/Microsoft/vscode-python/issues/1833))
1. Update `isort` package to 4.3.4.
   ([#1842](https://github.com/Microsoft/vscode-python/issues/1842))
1. Add better exception handling when parsing responses received from the Jedi language service.
   ([#1867](https://github.com/Microsoft/vscode-python/issues/1867))
1. Resolve warnings in CI Tests and fix some broken CI tests.
   ([#1885](https://github.com/Microsoft/vscode-python/issues/1885))
1. Reduce sample count used to capture performance metrics in order to reduce time taken to complete the tests.
   ([#1887](https://github.com/Microsoft/vscode-python/issues/1887))
1. Ensure workspace information is passed into installer when determining whether a product/tool is installed.
   ([#1893](https://github.com/Microsoft/vscode-python/issues/1893))
1. Add JUnit file output to enable CI integration with VSTS.
   ([#1897](https://github.com/Microsoft/vscode-python/issues/1897))
1. Log unhandled rejected promises when running unit tests.
   ([#1918](https://github.com/Microsoft/vscode-python/issues/1918))
1. Add ability to run tests without having to launch VS Code.
   ([#1922](https://github.com/Microsoft/vscode-python/issues/1922))
1. Fix rename refactoring unit tests.
   ([#1953](https://github.com/Microsoft/vscode-python/issues/1953))
1. Fix failing test on Mac when validating the path of a python interperter.
   ([#1957](https://github.com/Microsoft/vscode-python/issues/1957))
1. Display banner prompting user to complete a survey for the use of the `Experimental Debugger`.
   ([#1968](https://github.com/Microsoft/vscode-python/issues/1968))
1. Use a glob pattern to look for `conda` executables.
   ([#256](https://github.com/Microsoft/vscode-python/issues/256))
1. Create tests to measure activation times for the extension.
   ([#932](https://github.com/Microsoft/vscode-python/issues/932))





## 2018.5.0 (05 Jun 2018)

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.2.15](https://pypi.org/project/isort/4.2.15/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.0](https://pypi.org/project/parso/0.2.0/)
- [ptvsd 3.0.0](https://pypi.org/project/ptvsd/3.0.0/) and [4.1.1a5](https://pypi.org/project/ptvsd/4.1.1a5/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

And thanks to the many other projects which users can optionally choose from
and install to work with the extension. Without them the extension would not be
nearly as feature-rich and useful as it is.

### Enhancements

1. Add support for the [Black formatter](https://pypi.org/project/black/)
   (thanks to [Josh Smeaton](https://github.com/jarshwah) for the initial patch)
   ([#1153](https://github.com/Microsoft/vscode-python/issues/1153))
1. Add the command `Discover Unit Tests`.
   ([#1474](https://github.com/Microsoft/vscode-python/issues/1474))
1. Auto detect `*.jinja2` and `*.j2` extensions as Jinja templates, to enable debugging of Jinja templates.
   ([#1484](https://github.com/Microsoft/vscode-python/issues/1484))

### Fixes

1. Ensure debugger breaks on `assert` failures.
   ([#1194](https://github.com/Microsoft/vscode-python/issues/1194))
1. Ensure debugged program is terminated when `Stop` debugging button is clicked.
   ([#1345](https://github.com/Microsoft/vscode-python/issues/1345))
1. Fix indentation when function contains type hints.
   ([#1461](https://github.com/Microsoft/vscode-python/issues/1461))
1. Ensure python environment activation works as expected within a multi-root workspace.
   ([#1476](https://github.com/Microsoft/vscode-python/issues/1476))
1. Close communication channel before exiting the test runner.
   ([#1529](https://github.com/Microsoft/vscode-python/issues/1529))
1. Allow for negative column numbers in messages returned by `pylint`.
   ([#1628](https://github.com/Microsoft/vscode-python/issues/1628))
1. Modify the `FLASK_APP` environment variable in the flask debug configuration to include just the name of the application file.
   ([#1634](https://github.com/Microsoft/vscode-python/issues/1634))
1. Ensure the display name of an interpreter does not get prefixed twice with the words `Python`.
   ([#1651](https://github.com/Microsoft/vscode-python/issues/1651))
1. Enable code refactoring when using the new Analysis Engine.
   ([#1774](https://github.com/Microsoft/vscode-python/issues/1774))
1. `editor.formatOnType` no longer breaks numbers formatted with underscores.
   ([#1779](https://github.com/Microsoft/vscode-python/issues/1779))
1. `editor.formatOnType` now better handles multiline function arguments
   ([#1796](https://github.com/Microsoft/vscode-python/issues/1796))
1. `Go to Definition` now works for functions which have numbers that use `_` as a separator (as part of our Jedi 0.12.0 upgrade).
   ([#180](https://github.com/Microsoft/vscode-python/issues/180))
1. Display documentation for auto completion items when the feature to automatically insert of brackets for selected item is turned on.
   ([#452](https://github.com/Microsoft/vscode-python/issues/452))
1. Ensure empty paths do not get added into `sys.path` by the Jedi language server. (this was fixed in the previous release in [#1471](https://github.com/Microsoft/vscode-python/pull/1471))
   ([#677](https://github.com/Microsoft/vscode-python/issues/677))
1. Resolves rename refactor issue that removes the last line of the source file when the line is being refactored and source does not end with an EOL.
   ([#695](https://github.com/Microsoft/vscode-python/issues/695))
1. Ensure the prompt to install missing packages is not displayed more than once.
   ([#980](https://github.com/Microsoft/vscode-python/issues/980))

### Code Health

1. Add syntax highlighting to `constraints.txt` files to match that of `requirements.txt` files.
   (thanks [Waleed Sehgal](https://github.com/waleedsehgal))
   ([#1053](https://github.com/Microsoft/vscode-python/issues/1053))
1. Refactor unit testing functionality to improve testability of individual components.
   ([#1068](https://github.com/Microsoft/vscode-python/issues/1068))
1. Add unit tests for evaluating expressions in the experimental debugger.
   ([#1109](https://github.com/Microsoft/vscode-python/issues/1109))
1. Add tests to ensure custom arguments get passed into python program when using the experimental debugger.
   ([#1280](https://github.com/Microsoft/vscode-python/issues/1280))
1. Ensure custom environment variables are always used when spawning any process from within the extension.
   ([#1339](https://github.com/Microsoft/vscode-python/issues/1339))
1. Add tests for hit count breakpoints for the experimental debugger.
   ([#1410](https://github.com/Microsoft/vscode-python/issues/1410))
1. Ensure none of the npm packages (used by the extension) rely on native dependencies.
   ([#1416](https://github.com/Microsoft/vscode-python/issues/1416))
1. Remove explicit initialization of `PYTHONPATH` with the current workspace path in unit testing of modules with the experimental debugger.
   ([#1465](https://github.com/Microsoft/vscode-python/issues/1465))
1. Flag `program` in `launch.json` configuration items as an optional attribute.
   ([#1503](https://github.com/Microsoft/vscode-python/issues/1503))
1. Remove unused setting `disablePromptForFeatures`.
   ([#1551](https://github.com/Microsoft/vscode-python/issues/1551))
1. Remove unused Unit Test setting `debugHost`.
   ([#1552](https://github.com/Microsoft/vscode-python/issues/1552))
1. Create a new API to retrieve interpreter details with the ability to cache the details.
   ([#1569](https://github.com/Microsoft/vscode-python/issues/1569))
1. Add tests for log points in the experimental debugger.
   ([#1582](https://github.com/Microsoft/vscode-python/issues/1582))
1. Update typescript package to 2.8.3.
   ([#1604](https://github.com/Microsoft/vscode-python/issues/1604))
1. Fix typescript compilation error.
   ([#1623](https://github.com/Microsoft/vscode-python/issues/1623))
1. Fix unit tests used to test flask template debugging on AppVeyor for the experimental debugger.
   ([#1640](https://github.com/Microsoft/vscode-python/issues/1640))
1. Change yarn install script to include the keyword `--lock-file`.
   (thanks [Lingyu Li](https://github.com/lingyv-li/))
   ([#1682](https://github.com/Microsoft/vscode-python/issues/1682))
1. Run unit tests as a pre-commit hook.
   ([#1703](https://github.com/Microsoft/vscode-python/issues/1703))
1. Update debug capabilities to add support for the setting `supportTerminateDebuggee` due to an upstream update from [PTVSD](https://github.com/Microsoft/ptvsd/issues).
   ([#1719](https://github.com/Microsoft/vscode-python/issues/1719))
1. Build and upload development build of the extension to the Azure blob store even if CI tests fail on the `master` branch.
   ([#1730](https://github.com/Microsoft/vscode-python/issues/1730))
1. Changes to the script used to upload the extension to the Azure blob store.
   ([#1732](https://github.com/Microsoft/vscode-python/issues/1732))
1. Prompt user to reload Visual Studio Code when toggling between the analysis engines.
   ([#1747](https://github.com/Microsoft/vscode-python/issues/1747))
1. Fix typo in unit test.
   ([#1794](https://github.com/Microsoft/vscode-python/issues/1794))
1. Fix failing Prospector unit tests and add more tests for linters (with and without workspaces).
   ([#1836](https://github.com/Microsoft/vscode-python/issues/1836))
1. Ensure `Outline` view doesn't overload the language server with too many requests, while user is editing text in the editor.
   ([#1856](https://github.com/Microsoft/vscode-python/issues/1856))





## 2018.4.0 (2 May 2018)

Thanks to the following projects which we fully rely on to provide some of
our features:
- [isort 4.2.15](https://pypi.org/project/isort/4.2.15/)
- [jedi 0.12.0](https://pypi.org/project/jedi/0.12.0/)
  and [parso 0.2.0](https://pypi.org/project/parso/0.2.0/)
- [ptvsd 3.0.0](https://pypi.org/project/ptvsd/3.0.0/) and [4.1.1a1](https://pypi.org/project/ptvsd/4.1.1a1/)
- [exuberant ctags](http://ctags.sourceforge.net/) (user-installed)
- [rope](https://pypi.org/project/rope/) (user-installed)

And a special thanks to [Patryk Zawadzki](https://github.com/patrys) for all of
his help on [our issue tracker](https://github.com/Microsoft/vscode-python)!

### Enhancements

1. Enable debugging of Jinja templates in the experimental debugger.
   This is made possible with the addition of the `jinja` setting in the `launch.json` file as follows:
   ```json
   "request": "launch or attach",
   ...
   "jinja": true
   ```
   ([#1206](https://github.com/Microsoft/vscode-python/issues/1206))
1. Remove empty spaces from the selected text of the active editor when executing in a terminal.
   ([#1207](https://github.com/Microsoft/vscode-python/issues/1207))
1. Add prelimnary support for remote debugging using the experimental debugger.
   Attach to a Python program started using the command `python -m ptvsd --server --port 9091 --file pythonFile.py`
   ([#1229](https://github.com/Microsoft/vscode-python/issues/1229))
1. Add support for [logpoints](https://code.visualstudio.com/docs/editor/debugging#_logpoints) in the experimental debugger.
   ([#1306](https://github.com/Microsoft/vscode-python/issues/1306))
1. Set focus to the terminal upon creation of a terminal using the `Python: Create Terminal` command.
   ([#1315](https://github.com/Microsoft/vscode-python/issues/1315))
1. Save the python file before running it in the terminal using the command/menu `Run Python File in Terminal`.
   ([#1316](https://github.com/Microsoft/vscode-python/issues/1316))
1. Added support for source references (remote debugging without having the source code locally) in the experimental debugger.
   ([#1333](https://github.com/Microsoft/vscode-python/issues/1333))
1. Add `Ctrl+Enter` keyboard shortcut for `Run Selection/Line in Python Terminal`.
   ([#1349](https://github.com/Microsoft/vscode-python/issues/1349))
1. Settings configured within the `debugOptions` property of `launch.json` for the old debugger are now defined as individual (boolean) properties in the new experimental debugger (e.g. `"debugOptions": ["RedirectOutput"]` becomes `"redirectOutput": true`).
   ([#1395](https://github.com/Microsoft/vscode-python/issues/1395))
1. Intergrate Jedi 0.12. See https://github.com/davidhalter/jedi/issues/1063#issuecomment-381417297 for details.
   ([#1400](https://github.com/Microsoft/vscode-python/issues/1400))
1. Enable Jinja template debugging as a default behaviour when using the Watson debug configuration for debugging of Watson applications.
   ([#1480](https://github.com/Microsoft/vscode-python/issues/1480))
1. Enable Jinja template debugging as a default behavior when debugging Pyramid applications.
   ([#1492](https://github.com/Microsoft/vscode-python/issues/1492))
1. Add prelimnary support for remote debugging using the experimental debugger.
   Attach to a Python program after having imported `ptvsd` and enabling the debugger to attach as follows:
   ```python
   import ptvsd
   ptvsd.enable_attach(('0.0.0.0', 5678))
   ```
   Additional capabilities:
   * `ptvsd.break_into_debugger()` to break into the attached debugger.
   * `ptvsd.wait_for_attach(timeout)` to cause the program to wait until a debugger attaches.
   * `ptvsd.is_attached()` to determine whether a debugger is attached to the program.
   ([#907](https://github.com/Microsoft/vscode-python/issues/907))

### Fixes

1. Use an existing method to identify the active interpreter.
   ([#1015](https://github.com/Microsoft/vscode-python/issues/1015))
1. Fix `go to definition` functionality across files.
   ([#1033](https://github.com/Microsoft/vscode-python/issues/1033))
1. IntelliSense under Python 2 for inherited attributes works again (thanks to an upgraded Jedi).
   ([#1072](https://github.com/Microsoft/vscode-python/issues/1072))
1. Reverted change that ended up considering symlinked interpreters as duplicate interpreter.
   ([#1192](https://github.com/Microsoft/vscode-python/issues/1192))
1. Display errors returned by the PipEnv command when identifying the corresponding environment.
   ([#1254](https://github.com/Microsoft/vscode-python/issues/1254))
1. When `editor.formatOnType` is on, don't add a space for `*args` or `**kwargs`
   ([#1257](https://github.com/Microsoft/vscode-python/issues/1257))
1. When `editor.formatOnType` is on, don't add a space between a string type specifier and the string literal
   ([#1257](https://github.com/Microsoft/vscode-python/issues/1257))
1. Reduce the frequency within which the memory usage of the language server is checked, also ensure memory usage is not checked unless language server functionality is used.
   ([#1277](https://github.com/Microsoft/vscode-python/issues/1277))
1. Ensure interpreter file exists on the file system before including into list of interpreters.
   ([#1305](https://github.com/Microsoft/vscode-python/issues/1305))
1. Do not have the formatter consider single-quoted string multiline even if it is not terminated.
   ([#1364](https://github.com/Microsoft/vscode-python/issues/1364))
1. IntelliSense works in module-level `if` statements (thanks to Jedi 0.12.0 upgrade).
   ([#142](https://github.com/Microsoft/vscode-python/issues/142))
1. Clicking the codelens `Run Test` on a test class should run that specific test class instead of all tests in the file.
   ([#1472](https://github.com/Microsoft/vscode-python/issues/1472))
1. Clicking the codelens `Run Test` on a test class or method should run that specific test instead of all tests in the file.
   ([#1473](https://github.com/Microsoft/vscode-python/issues/1473))
1. Check whether the selected python interpreter is valid before starting the language server. Failing to do so could result in the extension failing to load.
   ([#1487](https://github.com/Microsoft/vscode-python/issues/1487))
1. Fixes the issue where Conda environments created using the latest version of Anaconda are not activated in Powershell.
   ([#1520](https://github.com/Microsoft/vscode-python/issues/1520))
1. Increase the delay for the activation of environments in Powershell terminals.
   ([#1533](https://github.com/Microsoft/vscode-python/issues/1533))
1. Fix activation of environments with spaces in the python path when using Powershell.
   ([#1534](https://github.com/Microsoft/vscode-python/issues/1534))
1. Ensure Flask application is launched with multi-threading disabled, when run in the CI tests.
   ([#1535](https://github.com/Microsoft/vscode-python/issues/1535))
1. IntelliSense works appropriately when a project contains multiple files with the same name (thanks to Jedi 0.12.0 update).
   ([#178](https://github.com/Microsoft/vscode-python/issues/178))
1. Add blank lines to separate blocks of indented code (function defs, classes, and the like) so as to ensure the code can be run within a Python interactive prompt.
   ([#259](https://github.com/Microsoft/vscode-python/issues/259))
1. Provide type details appropriate for the iterable in a `for` loop when the line has a `# type` comment.
   ([#338](https://github.com/Microsoft/vscode-python/issues/338))
1. Parameter hints following an f-string work again.
   ([#344](https://github.com/Microsoft/vscode-python/issues/344))
1. When `editor.formatOnType` is on, don't indent after a single-line statement block
   ([#726](https://github.com/Microsoft/vscode-python/issues/726))
1. Fix debugging of Pyramid applications on Windows.
   ([#737](https://github.com/Microsoft/vscode-python/issues/737))

### Code Health

1. Improved developer experience of the Python Extension on Windows.
   ([#1216](https://github.com/Microsoft/vscode-python/issues/1216))
1. Parallelize jobs (unit tests) on CI server.
   ([#1247](https://github.com/Microsoft/vscode-python/issues/1247))
1. Run CI tests against the release version and master branch of PTVSD (experimental debugger), allowing tests to fail against the master branch of PTVSD.
   ([#1253](https://github.com/Microsoft/vscode-python/issues/1253))
1. Only trigger the extension for `file` and `untitled` in preparation for
   [Visual Studio Live Share](https://aka.ms/vsls)
   (thanks to [Jonathan Carter](https://github.com/lostintangent))
   ([#1298](https://github.com/Microsoft/vscode-python/issues/1298))
1. Ensure all unit tests run on Travis use the right Python interpreter.
   ([#1318](https://github.com/Microsoft/vscode-python/issues/1318))
1. Pin all production dependencies.
   ([#1374](https://github.com/Microsoft/vscode-python/issues/1374))
1. Add support for [hit count breakpoints](https://code.visualstudio.com/docs/editor/debugging#_advanced-breakpoint-topics) in the experimental debugger.
   ([#1409](https://github.com/Microsoft/vscode-python/issues/1409))
1. Ensure custom environment variables defined in `.env` file are passed onto the `pipenv` command.
   ([#1428](https://github.com/Microsoft/vscode-python/issues/1428))
1. Remove unwanted python packages no longer used in unit tests.
   ([#1494](https://github.com/Microsoft/vscode-python/issues/1494))
1. Register language server functionality in the extension against specific resource types supporting the python language.
   ([#1530](https://github.com/Microsoft/vscode-python/issues/1530))


## 2018.3.1 (29 Mar 2018)

### Fixes

1. Fixes issue that causes linter to fail when file path contains spaces.
([#1239](https://github.com/Microsoft/vscode-python/issues/1239))

## 2018.3.0 (28 Mar 2018)

### Enhancements

1. Add a PySpark debug configuration for the experimental debugger.
 ([#1029](https://github.com/Microsoft/vscode-python/issues/1029))
1. Add a Pyramid debug configuration for the experimental debugger.
 ([#1030](https://github.com/Microsoft/vscode-python/issues/1030))
1. Add a Watson debug configuration for the experimental debugger.
 ([#1031](https://github.com/Microsoft/vscode-python/issues/1031))
1. Add a Scrapy debug configuration for the experimental debugger.
 ([#1032](https://github.com/Microsoft/vscode-python/issues/1032))
1. When using pipenv, install packages (such as linters, test frameworks) in dev-packages.
 ([#1110](https://github.com/Microsoft/vscode-python/issues/1110))
1. Added commands translation for italian locale.
(thanks [Dotpys](https://github.com/Dotpys/)) ([#1152](https://github.com/Microsoft/vscode-python/issues/1152))
1. Add support for Django Template debugging in experimental debugger.
 ([#1189](https://github.com/Microsoft/vscode-python/issues/1189))
1. Add support for Flask Template debugging in experimental debugger.
 ([#1190](https://github.com/Microsoft/vscode-python/issues/1190))
1. Add support for Jinja template debugging. ([#1210](https://github.com/Microsoft/vscode-python/issues/1210))
1. When debugging, use `Integrated Terminal` as the default console.
 ([#526](https://github.com/Microsoft/vscode-python/issues/526))
1. Disable the display of errors messages when rediscovering of tests fail in response to changes to files, e.g. don't show a message if there's a syntax error in the test code.
 ([#704](https://github.com/Microsoft/vscode-python/issues/704))
1. Bundle python dependencies (PTVSD package) in the extension for the experimental debugger.
 ([#741](https://github.com/Microsoft/vscode-python/issues/741))
1. Add support for experimental  debugger when debugging Python Unit Tests.
 ([#906](https://github.com/Microsoft/vscode-python/issues/906))
1. Support `Debug Console` as a `console` option for the Experimental Debugger.
 ([#950](https://github.com/Microsoft/vscode-python/issues/950))
1. Enable syntax highlighting for `requirements.in` files as used by
e.g. [pip-tools](https://github.com/jazzband/pip-tools)
(thanks [Lorenzo Villani](https://github.com/lvillani))
 ([#961](https://github.com/Microsoft/vscode-python/issues/961))
1. Add support to read name of Pipfile from environment variable.
 ([#999](https://github.com/Microsoft/vscode-python/issues/999))

### Fixes

1. Fixes issue that causes debugging of unit tests to hang indefinitely. ([#1009](https://github.com/Microsoft/vscode-python/issues/1009))
1. Add ability to disable the check on memory usage of language server (Jedi) process.
To turn off this check, add `"python.jediMemoryLimit": -1` to your user or workspace settings (`settings.json`) file.
 ([#1036](https://github.com/Microsoft/vscode-python/issues/1036))
1. Ignore test results when debugging unit tests.
 ([#1043](https://github.com/Microsoft/vscode-python/issues/1043))
1. Fixes auto formatting of conditional statements containing expressions with `<=` symbols.
 ([#1096](https://github.com/Microsoft/vscode-python/issues/1096))
1. Resolve debug configuration information in `launch.json` when debugging without opening a python file.
 ([#1098](https://github.com/Microsoft/vscode-python/issues/1098))
1. Disables auto completion when editing text at the end of a comment string.
 ([#1123](https://github.com/Microsoft/vscode-python/issues/1123))
1. Ensures file paths are properly encoded when passing them as arguments to linters.
 ([#199](https://github.com/Microsoft/vscode-python/issues/199))
1. Fix occasionally having unverified breakpoints
 ([#87](https://github.com/Microsoft/vscode-python/issues/87))
1. Ensure conda installer is not used for non-conda environments.
 ([#969](https://github.com/Microsoft/vscode-python/issues/969))
1. Fixes issue that display incorrect interpreter briefly before updating it to the right value.
 ([#981](https://github.com/Microsoft/vscode-python/issues/981))

### Code Health

1. Exclude 'news' folder from getting packaged into the extension.
 ([#1020](https://github.com/Microsoft/vscode-python/issues/1020))
1. Remove Jupyter commands.
(thanks [Yu Zhang](https://github.com/neilsustc))
 ([#1034](https://github.com/Microsoft/vscode-python/issues/1034))
1. Trigger incremental build compilation only when typescript files are modified.
 ([#1040](https://github.com/Microsoft/vscode-python/issues/1040))
1. Updated npm dependencies in devDependencies and fix TypeScript compilation issues.
 ([#1042](https://github.com/Microsoft/vscode-python/issues/1042))
1. Enable unit testing of stdout and stderr redirection for the experimental debugger.
 ([#1048](https://github.com/Microsoft/vscode-python/issues/1048))
1. Update npm package `vscode-extension-telemetry` to fix the warning 'os.tmpDir() deprecation'.
(thanks [osya](https://github.com/osya))
 ([#1066](https://github.com/Microsoft/vscode-python/issues/1066))
1. Prevent the debugger stepping into JS code while developing the extension when debugging async TypeScript code.
 ([#1090](https://github.com/Microsoft/vscode-python/issues/1090))
1. Increase timeouts for the debugger unit tests.
 ([#1094](https://github.com/Microsoft/vscode-python/issues/1094))
1. Change the command used to install pip on AppVeyor to avoid installation errors.
 ([#1107](https://github.com/Microsoft/vscode-python/issues/1107))
1. Check whether a document is active when detecthing changes in the active document.
 ([#1114](https://github.com/Microsoft/vscode-python/issues/1114))
1. Remove SIGINT handler in debugger adapter, thereby preventing it from shutting down the debugger.
 ([#1122](https://github.com/Microsoft/vscode-python/issues/1122))
1. Improve compilation speed of the extension's TypeScript code.
 ([#1146](https://github.com/Microsoft/vscode-python/issues/1146))
1. Changes to how debug options are passed into the experimental version of PTVSD (debugger).
 ([#1168](https://github.com/Microsoft/vscode-python/issues/1168))
1. Ensure file paths are not sent in telemetry when running unit tests.
 ([#1180](https://github.com/Microsoft/vscode-python/issues/1180))
1. Change `DjangoDebugging` to `Django` in `debugOptions` of launch.json.
 ([#1198](https://github.com/Microsoft/vscode-python/issues/1198))
1. Changed property name used to capture the trigger source of Unit Tests. ([#1213](https://github.com/Microsoft/vscode-python/issues/1213))
1. Enable unit testing of the experimental debugger on CI servers
 ([#742](https://github.com/Microsoft/vscode-python/issues/742))
1. Generate code coverage for debug adapter unit tests.
 ([#778](https://github.com/Microsoft/vscode-python/issues/778))
1. Execute prospector as a module (using -m).
 ([#982](https://github.com/Microsoft/vscode-python/issues/982))
1. Launch unit tests in debug mode as opposed to running and attaching the debugger to the already-running interpreter.
 ([#983](https://github.com/Microsoft/vscode-python/issues/983))

## 2018.2.1 (09 Mar 2018)

### Fixes

1. Check for `Pipfile` and not `pipfile` when looking for pipenv usage
   (thanks to [Will Thompson for the fix](https://github.com/wjt))

## 2018.2.0 (08 Mar 2018)

[Release pushed by one week]

### Thanks

We appreciate everyone who contributed to this release (including
those who reported bugs or provided feedback)!

A special thanks goes out to the following external contributors who
contributed code in this release:

* [Andrea D'Amore](https://github.com/Microsoft/vscode-python/commits?author=anddam)
* [Tzu-ping Chung](https://github.com/Microsoft/vscode-python/commits?author=uranusjr)
* [Elliott Beach](https://github.com/Microsoft/vscode-python/commits?author=elliott-beach)
* [Manuja Jay](https://github.com/Microsoft/vscode-python/commits?author=manujadev)
* [philipwasserman](https://github.com/Microsoft/vscode-python/commits?author=philipwasserman)

### Enhancements

1. Experimental support for PTVSD 4.0.0-alpha (too many issues to list)
1. Speed increases in interpreter selection ([#952](https://github.com/Microsoft/vscode-python/issues/952))
1. Support for [direnv](https://direnv.net/)
   ([#36](https://github.com/Microsoft/vscode-python/issues/36))
1. Support for pipenv virtual environments; do note that using pipenv
   automatically drops all other interpreters from the list of
   possible interpreters as pipenv prefers to "own" your virtual
   environment
   ([#404](https://github.com/Microsoft/vscode-python/issues/404))
1. Support for pyenv installs of Python
   ([#847](https://github.com/Microsoft/vscode-python/issues/847))
1. Support `editor.formatOnType` ([#640](https://github.com/Microsoft/vscode-python/issues/640))
1. Added a `zh-tw` translation ([#](https://github.com/Microsoft/vscode-python/pull/841))
1. Prompting to install a linter now allows for disabling that specific
   linter as well as linters globally
   ([#971](https://github.com/Microsoft/vscode-python/issues/971))

### Fixes

1. Work around a bug in Pylint when the default linter rules are
   enabled and running Python 2.7 which triggered `--py3k` checks
   to be activated, e.g. all `print` statements to be flagged as
   errors
   ([#722](https://github.com/Microsoft/vscode-python/issues/722))
1. Better detection of when a virtual environment is selected, leading
   to the extension accurately leaving off `--user` when installing
   Pylint ([#808](https://github.com/Microsoft/vscode-python/issues/808))
1. Better detection of a `pylintrc` is available to automatically disable our
   default Pylint checks
   ([#728](https://github.com/Microsoft/vscode-python/issues/728),
    [#788](https://github.com/Microsoft/vscode-python/issues/788),
    [#838](https://github.com/Microsoft/vscode-python/issues/838),
    [#442](https://github.com/Microsoft/vscode-python/issues/442))
1. Fix `Got to Python object` ([#403](https://github.com/Microsoft/vscode-python/issues/403))
1. When reformatting a file, put the temporary file in the workspace
   folder so e.g. yapf detect their configuration files appropriately
   ([#730](https://github.com/Microsoft/vscode-python/issues/730))
1. The banner to suggest someone installs Python now says `Download`
   instead of `Close` ([#844](https://github.com/Microsoft/vscode-python/issues/844))
1. Formatting while typing now treats `.` and `@` as operators,
   preventing the incorrect insertion of whitespace
   ([#840](https://github.com/Microsoft/vscode-python/issues/840))
1. Debugging from a virtual environment named `env` now works
   ([#691](https://github.com/Microsoft/vscode-python/issues/691))
1. Disabling linting in a single folder of a mult-root workspace no
   longer disables it for all folders ([#862](https://github.com/Microsoft/vscode-python/issues/862))
1. Fix the default debugger settings for Flask apps
   ([#573](https://github.com/Microsoft/vscode-python/issues/573))
1. Format paths correctly when sending commands through WSL and git-bash;
   this does not lead to official support for either terminal
   ([#895](https://github.com/Microsoft/vscode-python/issues/895))
1. Prevent run-away Jedi processes from consuming too much memory by
   automatically killing the process; reload VS Code to start the
   process again if desired
   ([#926](https://github.com/Microsoft/vscode-python/issues/926),
    [#263](https://github.com/Microsoft/vscode-python/issues/263))
1. Support multiple linters again
   ([#913](https://github.com/Microsoft/vscode-python/issues/913))
1. Don't over-escape markup found in docstrings
   ([#911](https://github.com/Microsoft/vscode-python/issues/911),
    [#716](https://github.com/Microsoft/vscode-python/issues/716),
    [#627](https://github.com/Microsoft/vscode-python/issues/627),
    [#692](https://github.com/Microsoft/vscode-python/issues/692))
1. Fix when the `Problems` pane lists file paths prefixed with `git:`
   ([#916](https://github.com/Microsoft/vscode-python/issues/916))
1. Fix inline documentation when an odd number of quotes exists
   ([#786](https://github.com/Microsoft/vscode-python/issues/786))
1. Don't erroneously warn macOS users about using the system install
   of Python when a virtual environment is already selected
   ([#804](https://github.com/Microsoft/vscode-python/issues/804))
1. Fix activating multiple linters without requiring a reload of
   VS Code
   ([#971](https://github.com/Microsoft/vscode-python/issues/971))

### Code Health

1. Upgrade to Jedi 0.11.1
   ([#674](https://github.com/Microsoft/vscode-python/issues/674),
    [#607](https://github.com/Microsoft/vscode-python/issues/607),
    [#99](https://github.com/Microsoft/vscode-python/issues/99))
1. Removed the banner announcing the extension moving over to
   Microsoft ([#830](https://github.com/Microsoft/vscode-python/issues/830))
1. Renamed the default debugger configurations ([#412](https://github.com/Microsoft/vscode-python/issues/412))
1. Remove some error logging about not finding conda
   ([#864](https://github.com/Microsoft/vscode-python/issues/864))

## 2018.1.0 (01 Feb 2018)

### Thanks

Thanks to everyone who contributed to this release, including
the following people who contributed code:

* [jpfarias](https://github.com/jpfarias)
* [Hongbo He](https://github.com/graycarl)
* [JohnstonCode](https://github.com/JohnstonCode)
* [Yuichi Nukiyama](https://github.com/YuichiNukiyama)
* [MichaelSuen](https://github.com/MichaelSuen-thePointer)

### Fixed issues

* Support cached interpreter locations for faster interpreter selection ([#666](https://github.com/Microsoft/vscode-python/issues/259))
* Sending a block of code with multiple global-level scopes now works ([#259](https://github.com/Microsoft/vscode-python/issues/259))
* Automatic activation of virtual or conda environment in terminal when executing Python code/file ([#383](https://github.com/Microsoft/vscode-python/issues/383))
* Introduce a `Python: Create Terminal` to create a terminal that activates the selected virtual/conda environment ([#622](https://github.com/Microsoft/vscode-python/issues/622))
* Add a `ko-kr` translation ([#540](https://github.com/Microsoft/vscode-python/pull/540))
* Add a `ru` translation ([#411](https://github.com/Microsoft/vscode-python/pull/411))
* Performance improvements to detection of virtual environments in current workspace ([#372](https://github.com/Microsoft/vscode-python/issues/372))
* Correctly detect 64-bit python ([#414](https://github.com/Microsoft/vscode-python/issues/414))
* Display parameter information while typing ([#70](https://github.com/Microsoft/vscode-python/issues/70))
* Use `localhost` instead of `0.0.0.0` when starting debug servers ([#205](https://github.com/Microsoft/vscode-python/issues/205))
* Ability to configure host name of debug server ([#227](https://github.com/Microsoft/vscode-python/issues/227))
* Use environment variable PYTHONPATH defined in `.env` for intellisense and code navigation ([#316](https://github.com/Microsoft/vscode-python/issues/316))
* Support path variable when debugging ([#436](https://github.com/Microsoft/vscode-python/issues/436))
* Ensure virtual environments can be created in `.env` directory ([#435](https://github.com/Microsoft/vscode-python/issues/435), [#482](https://github.com/Microsoft/vscode-python/issues/482), [#486](https://github.com/Microsoft/vscode-python/issues/486))
* Reload environment variables from `.env` without having to restart VS Code ([#183](https://github.com/Microsoft/vscode-python/issues/183))
* Support debugging of Pyramid framework on Windows ([#519](https://github.com/Microsoft/vscode-python/issues/519))
* Code snippet for `pubd` ([#545](https://github.com/Microsoft/vscode-python/issues/545))
* Code clean up ([#353](https://github.com/Microsoft/vscode-python/issues/353), [#352](https://github.com/Microsoft/vscode-python/issues/352), [#354](https://github.com/Microsoft/vscode-python/issues/354), [#456](https://github.com/Microsoft/vscode-python/issues/456), [#491](https://github.com/Microsoft/vscode-python/issues/491), [#228](https://github.com/Microsoft/vscode-python/issues/228), [#549](https://github.com/Microsoft/vscode-python/issues/545), [#594](https://github.com/Microsoft/vscode-python/issues/594), [#617](https://github.com/Microsoft/vscode-python/issues/617), [#556](https://github.com/Microsoft/vscode-python/issues/556))
* Move to `yarn` from `npm` ([#421](https://github.com/Microsoft/vscode-python/issues/421))
* Add code coverage for extension itself ([#464](https://github.com/Microsoft/vscode-python/issues/464))
* Releasing [insiders build](https://pvsc.blob.core.windows.net/extension-builds/ms-python-insiders.vsix) of the extension and uploading to cloud storage ([#429](https://github.com/Microsoft/vscode-python/issues/429))
* Japanese translation ([#434](https://github.com/Microsoft/vscode-python/pull/434))
* Russian translation ([#411](https://github.com/Microsoft/vscode-python/pull/411))
* Support paths with spaces when generating tags with `Build Workspace Symbols` ([#44](https://github.com/Microsoft/vscode-python/issues/44))
* Add ability to configure the linters ([#572](https://github.com/Microsoft/vscode-python/issues/572))
* Add default set of rules for Pylint ([#554](https://github.com/Microsoft/vscode-python/issues/554))
* Prompt to install formatter if not available ([#524](https://github.com/Microsoft/vscode-python/issues/524))
* work around `editor.formatOnSave` failing when taking more then 750ms ([#124](https://github.com/Microsoft/vscode-python/issues/124), [#590](https://github.com/Microsoft/vscode-python/issues/590), [#624](https://github.com/Microsoft/vscode-python/issues/624), [#427](https://github.com/Microsoft/vscode-python/issues/427), [#492](https://github.com/Microsoft/vscode-python/issues/492))
* Function argument completion no longer automatically includes the default argument ([#522](https://github.com/Microsoft/vscode-python/issues/522))
* When sending a selection to the terminal, keep the focus in the editor window ([#60](https://github.com/Microsoft/vscode-python/issues/60))
* Install packages for non-environment Pythons as `--user` installs ([#527](https://github.com/Microsoft/vscode-python/issues/527))
* No longer suggest the system Python install on macOS when running `Select Interpreter` as it's too outdated (e.g. lacks `pip`) ([#440](https://github.com/Microsoft/vscode-python/issues/440))
* Fix potential hang from Intellisense ([#423](https://github.com/Microsoft/vscode-python/issues/423))

## Version 0.9.1 (19 December 2017)

* Fixes the compatibility issue with the [Visual Studio Code Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vscode-ai) [#432](https://github.com/Microsoft/vscode-python/issues/432)
* Display runtime errors encountered when running a python program without debugging [#454](https://github.com/Microsoft/vscode-python/issues/454)

## Version 0.9.0 (14 December 2017)

* Translated the commands to simplified Chinese [#240](https://github.com/Microsoft/vscode-python/pull/240) (thanks [Wai Sui kei](https://github.com/WaiSiuKei))
* Change all links to point to their Python 3 equivalents instead of Python 2[#203](https://github.com/Microsoft/vscode-python/issues/203)
* Respect `{workspaceFolder}` [#258](https://github.com/Microsoft/vscode-python/issues/258)
* Running a program using Ctrl-F5 will work more than once [#25](https://github.com/Microsoft/vscode-python/issues/25)
* Removed the feedback service to rely on VS Code's own support (which fixed an issue of document reformatting failing) [#245](https://github.com/Microsoft/vscode-python/issues/245), [#303](https://github.com/Microsoft/vscode-python/issues/303), [#363](https://github.com/Microsoft/vscode-python/issues/365)
* Do not create empty '.vscode' directory [#253](https://github.com/Microsoft/vscode-python/issues/253), [#277](https://github.com/Microsoft/vscode-python/issues/277)
* Ensure python execution environment handles unicode characters [#393](https://github.com/Microsoft/vscode-python/issues/393)
* Remove Jupyter support in favour of the [Jupyter extension](https://marketplace.visualstudio.com/items?itemName=donjayamanne.jupyter) [#223](https://github.com/microsoft/vscode-python/issues/223)

### `conda`

* Support installing Pylint using conda or pip when an Anaconda installation of Python is selected as the active interpreter [#301](https://github.com/Microsoft/vscode-python/issues/301)
* Add JSON schema support for conda's meta.yaml [#281](https://github.com/Microsoft/vscode-python/issues/281)
* Add JSON schema support for conda's environment.yml  [#280](https://github.com/Microsoft/vscode-python/issues/280)
* Add JSON schema support for .condarc [#189](https://github.com/Microsoft/vscode-python/issues/280)
* Ensure company name 'Continuum Analytics' is replaced with 'Ananconda Inc' in the list of interpreters [#390](https://github.com/Microsoft/vscode-python/issues/390)
* Display the version of the interpreter instead of conda [#378](https://github.com/Microsoft/vscode-python/issues/378)
* Detect Anaconda on Linux even if it is not in the current path [#22](https://github.com/Microsoft/vscode-python/issues/22)

### Interpreter selection

* Fixes in the discovery and display of interpreters, including virtual environments [#56](https://github.com/Microsoft/vscode-python/issues/56)
* Retrieve the right value from the registry when determining the version of an interpreter on Windows [#389](https://github.com/Microsoft/vscode-python/issues/389)

### Intellisense

* Fetch intellisense details on-demand instead of for all possible completions [#152](https://github.com/Microsoft/vscode-python/issues/152)
* Disable auto completion in comments and strings [#110](https://github.com/Microsoft/vscode-python/issues/110), [#921](https://github.com/Microsoft/vscode-python/issues/921), [#34](https://github.com/Microsoft/vscode-python/issues/34)

### Linting

* Deprecate `python.linting.lintOnTextChange` [#313](https://github.com/Microsoft/vscode-python/issues/313), [#297](https://github.com/Microsoft/vscode-python/issues/297), [#28](https://github.com/Microsoft/vscode-python/issues/28), [#272](https://github.com/Microsoft/vscode-python/issues/272)
* Refactor code for executing linters (fixes running the proper linter under the selected interpreter) [#351](https://github.com/Microsoft/vscode-python/issues/351), [#397](https://github.com/Microsoft/vscode-python/issues/397)
* Don't attempt to install linters when not in a workspace [#42](https://github.com/Microsoft/vscode-python/issues/42)
* Honour `python.linting.enabled` [#26](https://github.com/Microsoft/vscode-python/issues/26)
* Don't display message 'Linter pylint is not installed' when changing settings [#260](https://github.com/Microsoft/vscode-python/issues/260)
* Display a meaningful message if pip is unavailable to install necessary module such as 'pylint-starlark' [#266](https://github.com/Microsoft/vscode-python/issues/266)
* Improvement environment variable parsing in the debugging (allows for embedded `=`) [#149](https://github.com/Microsoft/vscode-python/issues/149), [#361](https://github.com/Microsoft/vscode-python/issues/361)

### Debugging

* Improve selecting the port used when debugging [#304](https://github.com/Microsoft/vscode-python/pull/304)
* Don't block debugging in other extensions [#58](https://github.com/Microsoft/vscode-python/issues/58)
* Don't trigger an error to the Console Window when trying to debug an invalid Python file [#157](https://github.com/Microsoft/vscode-python/issues/157)
* No longer prompt to `Press any key to continue . . .` once debugging finishes [#239](https://github.com/Microsoft/vscode-python/issues/239)
* Do not start the extension when debugging non-Python projects [#57](https://github.com/Microsoft/vscode-python/issues/57)
* Support custom external terminals in debugger [#250](https://github.com/Microsoft/vscode-python/issues/250), [#114](https://github.com/Microsoft/vscode-python/issues/114)
* Debugging a python program should not display the message 'Cannot read property …' [#247](https://github.com/Microsoft/vscode-python/issues/247)

### Testing

* Refactor unit test library execution code [#350](https://github.com/Microsoft/vscode-python/issues/350)

### Formatting

* Deprecate the setting `python.formatting.formatOnSave` with an appropriate message [#285](https://github.com/Microsoft/vscode-python/issues/285), [#309](https://github.com/Microsoft/vscode-python/issues/309)

## Version 0.8.0 (9 November 2017)
* Add support for multi-root workspaces [#1228](https://github.com/DonJayamanne/pythonVSCode/issues/1228), [#1302](https://github.com/DonJayamanne/pythonVSCode/pull/1302), [#1328](https://github.com/DonJayamanne/pythonVSCode/issues/1328), [#1357](https://github.com/DonJayamanne/pythonVSCode/pull/1357)
* Add code snippet for ```ipdb``` [#1141](https://github.com/DonJayamanne/pythonVSCode/pull/1141)
* Add ability to resolving environment variables in path to ```mypy``` [#1195](https://github.com/DonJayamanne/pythonVSCode/issues/1195)
* Add ability to disable a linter globally and disable prompts to install linters [#1207](https://github.com/DonJayamanne/pythonVSCode/issues/1207)
* Auto-selecting an interpreter from a virtual environment if only one is found in the root directory of the project [#1216](https://github.com/DonJayamanne/pythonVSCode/issues/1216)
* Add support for specifying the working directory for unit tests [#1155](https://github.com/DonJayamanne/pythonVSCode/issues/1155), [#1185](https://github.com/DonJayamanne/pythonVSCode/issues/1185)
* Add syntax highlighting of pip requirements files [#1247](https://github.com/DonJayamanne/pythonVSCode/pull/1247)
* Add ability to select an interpreter even when a workspace is not open [#1260](https://github.com/DonJayamanne/pythonVSCode/issues/1260), [#1263](https://github.com/DonJayamanne/pythonVSCode/pull/1263)
* Display a code lens to change the selected interpreter to the one specified in the shebang line [#1257](https://github.com/DonJayamanne/pythonVSCode/pull/1257), [#1263](https://github.com/DonJayamanne/pythonVSCode/pull/1263), [#1267](https://github.com/DonJayamanne/pythonVSCode/pull/1267), [#1280](https://github.com/DonJayamanne/pythonVSCode/issues/1280), [#1261](https://github.com/DonJayamanne/pythonVSCode/issues/1261), [#1290](https://github.com/DonJayamanne/pythonVSCode/pull/1290)
* Expand list of interpreters displayed for selection [#1147](https://github.com/DonJayamanne/pythonVSCode/issues/1147),  [#1148](https://github.com/DonJayamanne/pythonVSCode/issues/1148), [#1224](https://github.com/DonJayamanne/pythonVSCode/pull/1224), [#1240](https://github.com/DonJayamanne/pythonVSCode/pull/1240)
* Display details of current or selected interpreter in statusbar [#1147](https://github.com/DonJayamanne/pythonVSCode/issues/1147), [#1217](https://github.com/DonJayamanne/pythonVSCode/issues/1217)
* Ensure paths in workspace symbols are not prefixed with ```.vscode``` [#816](https://github.com/DonJayamanne/pythonVSCode/issues/816), [#1066](https://github.com/DonJayamanne/pythonVSCode/pull/1066), [#829](https://github.com/DonJayamanne/pythonVSCode/issues/829)
* Ensure paths in ```PYTHONPATH``` environment variable are delimited using the OS-specific path delimiter [#832](https://github.com/DonJayamanne/pythonVSCode/issues/832)
* Ensure ```Rope``` is not packaged with the extension [#1208](https://github.com/DonJayamanne/pythonVSCode/issues/1208), [#1207](https://github.com/DonJayamanne/pythonVSCode/issues/1207), [#1243](https://github.com/DonJayamanne/pythonVSCode/pull/1243), [#1229](https://github.com/DonJayamanne/pythonVSCode/issues/1229)
* Ensure ctags are rebuilt as expected upon file save [#624](https://github.com/DonJayamanne/pythonVSCode/issues/1212)
* Ensure right test method is executed when two test methods exist with the same name in different classes [#1203](https://github.com/DonJayamanne/pythonVSCode/issues/1203)
* Ensure unit tests run successfully on Travis for both Python 2.7 and 3.6 [#1255](https://github.com/DonJayamanne/pythonVSCode/pull/1255), [#1241](https://github.com/DonJayamanne/pythonVSCode/issues/1241), [#1315](https://github.com/DonJayamanne/pythonVSCode/issues/1315)
* Fix building of ctags when a path contains a space [#1064](https://github.com/DonJayamanne/pythonVSCode/issues/1064), [#1144](https://github.com/DonJayamanne/pythonVSCode/issues/1144),, [#1213](https://github.com/DonJayamanne/pythonVSCode/pull/1213)
* Fix autocompletion in unsaved Python files [#1194](https://github.com/DonJayamanne/pythonVSCode/issues/1194)
* Fix running of test methods in nose [#597](https://github.com/DonJayamanne/pythonVSCode/issues/597), [#1225](https://github.com/DonJayamanne/pythonVSCode/pull/1225)
* Fix to disable linting of diff windows [#1221](https://github.com/DonJayamanne/pythonVSCode/issues/1221), [#1244](https://github.com/DonJayamanne/pythonVSCode/pull/1244)
* Fix docstring formatting [#1188](https://github.com/DonJayamanne/pythonVSCode/issues/1188)
* Fix to ensure language features can run in parallel without interference with one another [#1314](https://github.com/DonJayamanne/pythonVSCode/issues/1314), [#1318](https://github.com/DonJayamanne/pythonVSCode/pull/1318)
* Fix to ensure unit tests can be debugged more than once per run [#948](https://github.com/DonJayamanne/pythonVSCode/issues/948), [#1353](https://github.com/DonJayamanne/pythonVSCode/pull/1353)
* Fix to ensure parameterized unit tests can be debugged [#1284](https://github.com/DonJayamanne/pythonVSCode/issues/1284), [#1299](https://github.com/DonJayamanne/pythonVSCode/pull/1299)
* Fix issue that causes debugger to freeze/hang [#1041](https://github.com/DonJayamanne/pythonVSCode/issues/1041), [#1354](https://github.com/DonJayamanne/pythonVSCode/pull/1354)
* Fix to support unicode characters in Python tests [#1282](https://github.com/DonJayamanne/pythonVSCode/issues/1282), [#1291](https://github.com/DonJayamanne/pythonVSCode/pull/1291)
* Changes as a result of VS Code API changes [#1270](https://github.com/DonJayamanne/pythonVSCode/issues/1270), [#1288](https://github.com/DonJayamanne/pythonVSCode/pull/1288), [#1372](https://github.com/DonJayamanne/pythonVSCode/issues/1372), [#1300](https://github.com/DonJayamanne/pythonVSCode/pull/1300), [#1298](https://github.com/DonJayamanne/pythonVSCode/issues/1298)
* Updates to Readme [#1212](https://github.com/DonJayamanne/pythonVSCode/issues/1212), [#1222](https://github.com/DonJayamanne/pythonVSCode/issues/1222)
* Fix executing a command under PowerShell [#1098](https://github.com/DonJayamanne/pythonVSCode/issues/1098)


## Version 0.7.0 (3 August 2017)
* Displaying internal documentation [#1008](https://github.com/DonJayamanne/pythonVSCode/issues/1008), [#10860](https://github.com/DonJayamanne/pythonVSCode/issues/10860)
* Fixes to 'async with' snippet [#1108](https://github.com/DonJayamanne/pythonVSCode/pull/1108), [#996](https://github.com/DonJayamanne/pythonVSCode/issues/996)
* Add support for environment variable in unit tests [#1074](https://github.com/DonJayamanne/pythonVSCode/issues/1074)
* Fixes to unit test code lenses not being displayed [#1115](https://github.com/DonJayamanne/pythonVSCode/issues/1115)
* Fix to empty brackets being added [#1110](https://github.com/DonJayamanne/pythonVSCode/issues/1110), [#1031](https://github.com/DonJayamanne/pythonVSCode/issues/1031)
* Fix debugging of Django applications [#819](https://github.com/DonJayamanne/pythonVSCode/issues/819), [#999](https://github.com/DonJayamanne/pythonVSCode/issues/999)
* Update isort to the latest version [#1134](https://github.com/DonJayamanne/pythonVSCode/issues/1134), [#1135](https://github.com/DonJayamanne/pythonVSCode/pull/1135)
* Fix issue causing intellisense and similar functionality to stop working [#1072](https://github.com/DonJayamanne/pythonVSCode/issues/1072), [#1118](https://github.com/DonJayamanne/pythonVSCode/pull/1118), [#1089](https://github.com/DonJayamanne/pythonVSCode/issues/1089)
* Bunch of unit tests and code cleanup
* Resolve issue where navigation to decorated function goes to decorator [#742](https://github.com/DonJayamanne/pythonVSCode/issues/742)
* Go to symbol in workspace leads to nonexisting files [#816](https://github.com/DonJayamanne/pythonVSCode/issues/816), [#829](https://github.com/DonJayamanne/pythonVSCode/issues/829)

## Version 0.6.9 (22 July 2017)
* Fix to enure custom linter paths are respected [#1106](https://github.com/DonJayamanne/pythonVSCode/issues/1106)

## Version 0.6.8 (20 July 2017)
* Add new editor menu 'Run Current Unit Test File' [#1061](https://github.com/DonJayamanne/pythonVSCode/issues/1061)
* Changed 'mypy-lang' to mypy [#930](https://github.com/DonJayamanne/pythonVSCode/issues/930), [#998](https://github.com/DonJayamanne/pythonVSCode/issues/998), [#505](https://github.com/DonJayamanne/pythonVSCode/issues/505)
* Using "Python -m" to launch linters [#716](https://github.com/DonJayamanne/pythonVSCode/issues/716), [#923](https://github.com/DonJayamanne/pythonVSCode/issues/923), [#1059](https://github.com/DonJayamanne/pythonVSCode/issues/1059)
* Add PEP 526 AutoCompletion [#1102](https://github.com/DonJayamanne/pythonVSCode/pull/1102), [#1101](https://github.com/DonJayamanne/pythonVSCode/issues/1101)
* Resolved issues in Go To and Peek Definitions [#1085](https://github.com/DonJayamanne/pythonVSCode/pull/1085), [#961](https://github.com/DonJayamanne/pythonVSCode/issues/961), [#870](https://github.com/DonJayamanne/pythonVSCode/issues/870)

## Version 0.6.7 (02 July 2017)
* Updated icon from jpg to png (transparent background)

## Version 0.6.6 (02 July 2017)
* Provide details of error with solution for changes to syntax in launch.json [#1047](https://github.com/DonJayamanne/pythonVSCode/issues/1047), [#1025](https://github.com/DonJayamanne/pythonVSCode/issues/1025)
* Provide a warning about known issues with having pyenv.cfg whilst debugging [#913](https://github.com/DonJayamanne/pythonVSCode/issues/913)
* Create .vscode directory if not found [#1043](https://github.com/DonJayamanne/pythonVSCode/issues/1043)
* Highlighted text due to linter errors is off by one column [#965](https://github.com/DonJayamanne/pythonVSCode/issues/965), [#970](https://github.com/DonJayamanne/pythonVSCode/pull/970)
* Added preliminary support for WSL Bash and Cygwin [#1049](https://github.com/DonJayamanne/pythonVSCode/pull/1049)
* Ability to configure the linter severity levels [#941](https://github.com/DonJayamanne/pythonVSCode/pull/941), [#895](https://github.com/DonJayamanne/pythonVSCode/issues/895)
* Fixes to unit tests [#1051](https://github.com/DonJayamanne/pythonVSCode/pull/1051), [#1050](https://github.com/DonJayamanne/pythonVSCode/pull/1050)
* Outdent lines following `continue`, `break` and `return` [#1050](https://github.com/DonJayamanne/pythonVSCode/pull/1050)
* Change location of cache for Jedi files [#1035](https://github.com/DonJayamanne/pythonVSCode/pull/1035)
* Fixes to the way directories are searched for Python interpreters [#569](https://github.com/DonJayamanne/pythonVSCode/issues/569), [#1040](https://github.com/DonJayamanne/pythonVSCode/pull/1040)
* Handle outputs from Python packages that interfere with the way autocompletion is handled [#602](https://github.com/DonJayamanne/pythonVSCode/issues/602)

## Version 0.6.5 (13 June 2017)
* Fix error in launch.json [#1006](https://github.com/DonJayamanne/pythonVSCode/issues/1006)
* Detect current workspace interpreter when selecting interpreter [#1006](https://github.com/DonJayamanne/pythonVSCode/issues/979)
* Disable output buffering when debugging [#1005](https://github.com/DonJayamanne/pythonVSCode/issues/1005)
* Updated snippets to use correct placeholder syntax [#976](https://github.com/DonJayamanne/pythonVSCode/pull/976)
* Fix hover and auto complete unit tests [#1012](https://github.com/DonJayamanne/pythonVSCode/pull/1012)
* Fix hover definition variable test for Python 3.5 [#1013](https://github.com/DonJayamanne/pythonVSCode/pull/1013)
* Better formatting of docstring [#821](https://github.com/DonJayamanne/pythonVSCode/pull/821), [#919](https://github.com/DonJayamanne/pythonVSCode/pull/919)
* Supporting more paths when searching for Python interpreters [#569](https://github.com/DonJayamanne/pythonVSCode/issues/569)
* Increase buffer output (to support detection large number of tests) [#927](https://github.com/DonJayamanne/pythonVSCode/issues/927)

## Version 0.6.4 (4 May 2017)
* Fix dates in changelog [#899](https://github.com/DonJayamanne/pythonVSCode/pull/899)
* Using charriage return or line feeds to split a document into multiple lines [#917](https://github.com/DonJayamanne/pythonVSCode/pull/917), [#821](https://github.com/DonJayamanne/pythonVSCode/issues/821)
* Doc string not being displayed [#888](https://github.com/DonJayamanne/pythonVSCode/issues/888)
* Supporting paths that begin with the ~/ [#909](https://github.com/DonJayamanne/pythonVSCode/issues/909)
* Supporting more paths when searching for Python interpreters [#569](https://github.com/DonJayamanne/pythonVSCode/issues/569)
* Supporting ~/ paths when providing the path to ctag file [#910](https://github.com/DonJayamanne/pythonVSCode/issues/910)
* Disable linting of python files opened in diff viewer [#896](https://github.com/DonJayamanne/pythonVSCode/issues/896)
* Added a new command ```Go to Python Object``` [#928](https://github.com/DonJayamanne/pythonVSCode/issues/928)
* Restored the menu item to rediscover tests [#863](https://github.com/DonJayamanne/pythonVSCode/issues/863)
* Changes to rediscover tests when test files are altered and saved [#863](https://github.com/DonJayamanne/pythonVSCode/issues/863)

## Version 0.6.3 (19 April 2017)
* Fix debugger issue [#893](https://github.com/DonJayamanne/pythonVSCode/issues/893)
* Improvements to debugging unit tests (check if string starts with, instead of comparing equality) [#797](https://github.com/DonJayamanne/pythonVSCode/issues/797)

## Version 0.6.2 (13 April 2017)
* Fix incorrect indenting [#880](https://github.com/DonJayamanne/pythonVSCode/issues/880)

### Thanks
* [Yuwei Ba](https://github.com/ibigbug)

## Version 0.6.1 (10 April 2017)
* Add support for new variable syntax in upcoming VS Code release [#774](https://github.com/DonJayamanne/pythonVSCode/issues/774), [#855](https://github.com/DonJayamanne/pythonVSCode/issues/855), [#873](https://github.com/DonJayamanne/pythonVSCode/issues/873), [#823](https://github.com/DonJayamanne/pythonVSCode/issues/823)
* Resolve issues in code refactoring [#802](https://github.com/DonJayamanne/pythonVSCode/issues/802), [#824](https://github.com/DonJayamanne/pythonVSCode/issues/824), [#825](https://github.com/DonJayamanne/pythonVSCode/pull/825)
* Changes to labels in Python Interpreter lookup [#815](https://github.com/DonJayamanne/pythonVSCode/pull/815)
* Resolve Typos [#852](https://github.com/DonJayamanne/pythonVSCode/issues/852)
* Use fully qualitified Python Path when installing dependencies [#866](https://github.com/DonJayamanne/pythonVSCode/issues/866)
* Commands for running tests from a file [#502](https://github.com/DonJayamanne/pythonVSCode/pull/502)
* Fix Sorting of imports when path contains spaces [#811](https://github.com/DonJayamanne/pythonVSCode/issues/811)
* Fixing occasional failure of linters [#793](https://github.com/DonJayamanne/pythonVSCode/issues/793), [#833](https://github.com/DonJayamanne/pythonVSCode/issues/838), [#860](https://github.com/DonJayamanne/pythonVSCode/issues/860)
* Added ability to pre-load some modules to improve autocompletion [#581](https://github.com/DonJayamanne/pythonVSCode/issues/581)

### Thanks
* [Ashwin Mathews](https://github.com/ajmathews)
* [Alexander Ioannidis](https://github.com/slint)
* [Andreas Schlapsi](https://github.com/aschlapsi)

## Version 0.6.0 (10 March 2017)
* Moved Jupyter functionality into a separate extension [Jupyter]()
* Updated readme [#779](https://github.com/DonJayamanne/pythonVSCode/issues/779)
* Changing default arguments of ```mypy``` [#658](https://github.com/DonJayamanne/pythonVSCode/issues/658)
* Added ability to disable formatting [#559](https://github.com/DonJayamanne/pythonVSCode/issues/559)
* Fixing ability to run a Python file in a terminal [#784](https://github.com/DonJayamanne/pythonVSCode/issues/784)
* Added support for Proxy settings when installing Python packages using Pip [#778](https://github.com/DonJayamanne/pythonVSCode/issues/778)

## Version 0.5.9 (3 March 2017)
* Fixed navigating to definitions [#711](https://github.com/DonJayamanne/pythonVSCode/issues/711)
* Support auto detecting binaries from Python Path [#716](https://github.com/DonJayamanne/pythonVSCode/issues/716)
* Setting PYTHONPATH environment variable [#686](https://github.com/DonJayamanne/pythonVSCode/issues/686)
* Improving Linter performance, killing redundant processes [4a8319e](https://github.com/DonJayamanne/pythonVSCode/commit/4a8319e0859f2d49165c9a08fe147a647d03ece9)
* Changed default path of the CATAS file to `.vscode/tags` [#722](https://github.com/DonJayamanne/pythonVSCode/issues/722)
* Add parsing severity level for flake8 and pep8 linters [#709](https://github.com/DonJayamanne/pythonVSCode/pull/709)
* Fix to restore function descriptions (intellisense) [#727](https://github.com/DonJayamanne/pythonVSCode/issues/727)
* Added default configuration for debugging Pyramid [#287](https://github.com/DonJayamanne/pythonVSCode/pull/287)
* Feature request: Run current line in Terminal [#738](https://github.com/DonJayamanne/pythonVSCode/issues/738)
* Miscellaneous improvements to hover provider [6a7a3f3](https://github.com/DonJayamanne/pythonVSCode/commit/6a7a3f32ab8add830d13399fec6f0cdd14cd66fc), [6268306](https://github.com/DonJayamanne/pythonVSCode/commit/62683064d01cfc2b76d9be45587280798a96460b)
* Fixes to rename refactor (due to 'LF' EOL in Windows) [#748](https://github.com/DonJayamanne/pythonVSCode/pull/748)
* Fixes to ctag file being generated in home folder when no workspace is opened [#753](https://github.com/DonJayamanne/pythonVSCode/issues/753)
* Fixes to ctag file being generated in home folder when no workspace is opened [#753](https://github.com/DonJayamanne/pythonVSCode/issues/753)
* Disabling auto-completion in single line comments [#74](https://github.com/DonJayamanne/pythonVSCode/issues/74)
* Fixes to debugging of modules [#518](https://github.com/DonJayamanne/pythonVSCode/issues/518)
* Displaying unit test status icons against unit test code lenses [#678](https://github.com/DonJayamanne/pythonVSCode/issues/678)
* Fix issue where causing 'python.python-debug.startSession' not found message to be displayed when debugging single file [#708](https://github.com/DonJayamanne/pythonVSCode/issues/708)
* Ability to include packages directory when generating tags file [#735](https://github.com/DonJayamanne/pythonVSCode/issues/735)
* Fix issue where running selected text in terminal does not work [#758](https://github.com/DonJayamanne/pythonVSCode/issues/758)
* Fix issue where disabling linter doesn't disable it (when no workspace is open) [#763](https://github.com/DonJayamanne/pythonVSCode/issues/763)
* Search additional directories for Python Interpreters (~/.virtualenvs, ~/Envs, ~/.pyenv) [#569](https://github.com/DonJayamanne/pythonVSCode/issues/569)
* Added ability to pre-load some modules to improve autocompletion [#581](https://github.com/DonJayamanne/pythonVSCode/issues/581)
* Removed invalid default value in launch.json file [#586](https://github.com/DonJayamanne/pythonVSCode/issues/586)
* Added ability to configure the pylint executable path [#766](https://github.com/DonJayamanne/pythonVSCode/issues/766)
* Fixed single file debugger to ensure the Python interpreter configured in python.PythonPath is being used [#769](https://github.com/DonJayamanne/pythonVSCode/issues/769)

## Version 0.5.8 (3 February 2017)
* Fixed a bug in [debugging single files without a launch configuration](https://code.visualstudio.com/updates/v1_9#_debugging-without-a-launch-configuration) [#700](https://github.com/DonJayamanne/pythonVSCode/issues/700)
* Fixed error when starting REPL [#692](https://github.com/DonJayamanne/pythonVSCode/issues/692)

## Version 0.5.7 (3 February 2017)
* Added support for [debugging single files without a launch configuration](https://code.visualstudio.com/updates/v1_9#_debugging-without-a-launch-configuration)
* Adding support for debug snippets [#660](https://github.com/DonJayamanne/pythonVSCode/issues/660)
* Ability to run a selected text in a Django shell [#652](https://github.com/DonJayamanne/pythonVSCode/issues/652)
* Adding support for the use of a customized 'isort' for sorting of imports [#632](https://github.com/DonJayamanne/pythonVSCode/pull/632)
* Debugger auto-detecting python interpreter from the path provided [#688](https://github.com/DonJayamanne/pythonVSCode/issues/688)
* Showing symbol type on hover [#657](https://github.com/DonJayamanne/pythonVSCode/pull/657)
* Fixes to running Python file when terminal uses Powershell [#651](https://github.com/DonJayamanne/pythonVSCode/issues/651)
* Fixes to linter issues when displaying Git diff view for Python files [#665](https://github.com/DonJayamanne/pythonVSCode/issues/665)
* Fixes to 'Go to definition' functionality [#662](https://github.com/DonJayamanne/pythonVSCode/issues/662)
* Fixes to Jupyter cells numbered larger than '10' [#681](https://github.com/DonJayamanne/pythonVSCode/issues/681)

## Version 0.5.6 (16 January 2017)
* Added support for Python 3.6 [#646](https://github.com/DonJayamanne/pythonVSCode/issues/646), [#631](https://github.com/DonJayamanne/pythonVSCode/issues/631), [#619](https://github.com/DonJayamanne/pythonVSCode/issues/619), [#613](https://github.com/DonJayamanne/pythonVSCode/issues/613)
* Autodetect in python path in virtual environments [#353](https://github.com/DonJayamanne/pythonVSCode/issues/353)
* Add syntax highlighting of code samples in hover defintion [#555](https://github.com/DonJayamanne/pythonVSCode/issues/555)
* Launch REPL for currently selected interpreter [#560](https://github.com/DonJayamanne/pythonVSCode/issues/560)
* Fixes to debugging of modules [#589](https://github.com/DonJayamanne/pythonVSCode/issues/589)
* Reminder to install jedi and ctags in Quick Start [#642](https://github.com/DonJayamanne/pythonVSCode/pull/642)
* Improvements to Symbol Provider [#622](https://github.com/DonJayamanne/pythonVSCode/pull/622)
* Changes to disable unit test prompts for workspace [#559](https://github.com/DonJayamanne/pythonVSCode/issues/559)
* Minor fixes [#627](https://github.com/DonJayamanne/pythonVSCode/pull/627)

## Version 0.5.5 (25 November 2016)
* Fixes to debugging of unittests (nose and pytest) [#543](https://github.com/DonJayamanne/pythonVSCode/issues/543)
* Fixes to debugging of Django [#546](https://github.com/DonJayamanne/pythonVSCode/issues/546)

## Version 0.5.4 (24 November 2016)
* Fixes to installing missing packages [#544](https://github.com/DonJayamanne/pythonVSCode/issues/544)
* Fixes to indentation of blocks of code [#432](https://github.com/DonJayamanne/pythonVSCode/issues/432)
* Fixes to debugging of unittests [#543](https://github.com/DonJayamanne/pythonVSCode/issues/543)
* Fixes to extension when a workspace (folder) isn't open [#542](https://github.com/DonJayamanne/pythonVSCode/issues/542)

## Version 0.5.3 (23 November 2016)
* Added support for [PySpark](http://spark.apache.org/docs/0.9.0/python-programming-guide.html) [#539](https://github.com/DonJayamanne/pythonVSCode/pull/539), [#540](https://github.com/DonJayamanne/pythonVSCode/pull/540)
* Debugging unittests (UnitTest, pytest, nose) [#333](https://github.com/DonJayamanne/pythonVSCode/issues/333)
* Displaying progress for formatting [#327](https://github.com/DonJayamanne/pythonVSCode/issues/327)
* Auto indenting ```else:``` inside ```if``` and similar code blocks [#432](https://github.com/DonJayamanne/pythonVSCode/issues/432)
* Prefixing new lines with '#' when new lines are added in the middle of a comment string [#365](https://github.com/DonJayamanne/pythonVSCode/issues/365)
* Debugging python modules [#518](https://github.com/DonJayamanne/pythonVSCode/issues/518), [#354](https://github.com/DonJayamanne/pythonVSCode/issues/354)
    + Use new debug configuration ```Python Module```
* Added support for workspace symbols using Exuberant CTags [#138](https://github.com/DonJayamanne/pythonVSCode/issues/138)
    + New command ```Python: Build Workspace Symbols```
* Added ability for linter to ignore paths or files [#501](https://github.com/DonJayamanne/pythonVSCode/issues/501)
    + Add the following setting in ```settings.json```
```python
        "python.linting.ignorePatterns":  [
            ".vscode/*.py",
            "**/site-packages/**/*.py"
          ],
```
* Automatically adding brackets when autocompleting functions/methods [#425](https://github.com/DonJayamanne/pythonVSCode/issues/425)
    + To enable this feature, turn on the setting ```"python.autoComplete.addBrackets": true```
* Running nose tests with the arguments '--with-xunit' and '--xunit-file' [#517](https://github.com/DonJayamanne/pythonVSCode/issues/517)
* Added support for workspaceRootFolderName in settings.json [#525](https://github.com/DonJayamanne/pythonVSCode/pull/525), [#522](https://github.com/DonJayamanne/pythonVSCode/issues/522)
* Added support for workspaceRootFolderName in settings.json [#525](https://github.com/DonJayamanne/pythonVSCode/pull/525), [#522](https://github.com/DonJayamanne/pythonVSCode/issues/522)
* Fixes to running code in terminal [#515](https://github.com/DonJayamanne/pythonVSCode/issues/515)

## Version 0.5.2
* Fix issue with mypy linter [#505](https://github.com/DonJayamanne/pythonVSCode/issues/505)
* Fix auto completion for files with different encodings [#496](https://github.com/DonJayamanne/pythonVSCode/issues/496)
* Disable warnings when debugging Django version prior to 1.8 [#479](https://github.com/DonJayamanne/pythonVSCode/issues/479)
* Prompt to save changes when refactoring without saving any changes [#441](https://github.com/DonJayamanne/pythonVSCode/issues/441)
* Prompt to save changes when renaminv without saving any changes [#443](https://github.com/DonJayamanne/pythonVSCode/issues/443)
* Use editor indentation size when refactoring code [#442](https://github.com/DonJayamanne/pythonVSCode/issues/442)
* Add support for custom jedi paths [#500](https://github.com/DonJayamanne/pythonVSCode/issues/500)

## Version 0.5.1
* Prompt to install linter if not installed [#255](https://github.com/DonJayamanne/pythonVSCode/issues/255)
* Prompt to configure and install test framework
* Added support for pylama [#495](https://github.com/DonJayamanne/pythonVSCode/pull/495)
* Partial support for PEP484
* Linting python files when they are opened [#462](https://github.com/DonJayamanne/pythonVSCode/issues/462)
* Fixes to unit tests discovery [#307](https://github.com/DonJayamanne/pythonVSCode/issues/307),
[#459](https://github.com/DonJayamanne/pythonVSCode/issues/459)
* Fixes to intellisense [#438](https://github.com/DonJayamanne/pythonVSCode/issues/438),
[#433](https://github.com/DonJayamanne/pythonVSCode/issues/433),
[#457](https://github.com/DonJayamanne/pythonVSCode/issues/457),
[#436](https://github.com/DonJayamanne/pythonVSCode/issues/436),
[#434](https://github.com/DonJayamanne/pythonVSCode/issues/434),
[#447](https://github.com/DonJayamanne/pythonVSCode/issues/447),
[#448](https://github.com/DonJayamanne/pythonVSCode/issues/448),
[#293](https://github.com/DonJayamanne/pythonVSCode/issues/293),
[#381](https://github.com/DonJayamanne/pythonVSCode/pull/381)
* Supporting additional search paths for interpreters on windows [#446](https://github.com/DonJayamanne/pythonVSCode/issues/446)
* Fixes to code refactoring [#440](https://github.com/DonJayamanne/pythonVSCode/issues/440),
[#467](https://github.com/DonJayamanne/pythonVSCode/issues/467),
[#468](https://github.com/DonJayamanne/pythonVSCode/issues/468),
[#445](https://github.com/DonJayamanne/pythonVSCode/issues/445)
* Fixes to linters [#463](https://github.com/DonJayamanne/pythonVSCode/issues/463)
[#439](https://github.com/DonJayamanne/pythonVSCode/issues/439),
* Bug fix in handling nosetest arguments [#407](https://github.com/DonJayamanne/pythonVSCode/issues/407)
* Better error handling when linter fails [#402](https://github.com/DonJayamanne/pythonVSCode/issues/402)
* Restoring extension specific formatting [#421](https://github.com/DonJayamanne/pythonVSCode/issues/421)
* Fixes to debugger (unwanted breakpoints) [#392](https://github.com/DonJayamanne/pythonVSCode/issues/392), [#379](https://github.com/DonJayamanne/pythonVSCode/issues/379)
* Support spaces in python path when executing in terminal [#428](https://github.com/DonJayamanne/pythonVSCode/pull/428)
* Changes to snippets [#429](https://github.com/DonJayamanne/pythonVSCode/pull/429)
* Marketplace changes [#430](https://github.com/DonJayamanne/pythonVSCode/pull/430)
* Cleanup and miscellaneous fixes (typos, keyboard bindings and the liks)

## Version 0.5.0
* Remove dependency on zmq when using Jupyter or IPython (pure python solution)
* Added a default keybinding for ```Jupyter:Run Selection/Line``` of ```ctrl+alt+enter```
* Changes to update settings.json with path to python using [native API](https://github.com/DonJayamanne/pythonVSCode/commit/bce22a2b4af87eaf40669c6360eff3675280cdad)
* Changes to use [native API](https://github.com/DonJayamanne/pythonVSCode/commit/bce22a2b4af87eaf40669c6360eff3675280cdad) for formatting when saving documents
* Reusing existing terminal instead of creating new terminals
* Limiting linter messages to opened documents (hide messages if document is closed) [#375](https://github.com/DonJayamanne/pythonVSCode/issues/375)
* Resolving extension load errors when  [#375](https://github.com/DonJayamanne/pythonVSCode/issues/375)
* Fixes to discovering unittests [#386](https://github.com/DonJayamanne/pythonVSCode/issues/386)
* Fixes to sending code to terminal on Windows [#387](https://github.com/DonJayamanne/pythonVSCode/issues/387)
* Fixes to executing python file in terminal on Windows [#385](https://github.com/DonJayamanne/pythonVSCode/issues/385)
* Fixes to launching local help (documentation) on Linux
* Fixes to typo in configuration documentation [#391](https://github.com/DonJayamanne/pythonVSCode/pull/391)
* Fixes to use ```python.pythonPath``` when sorting imports  [#393](https://github.com/DonJayamanne/pythonVSCode/pull/393)
* Fixes to linters to handle situations when line numbers aren't returned [#399](https://github.com/DonJayamanne/pythonVSCode/pull/399)
* Fixes to signature tooltips when docstring is very long [#368](https://github.com/DonJayamanne/pythonVSCode/issues/368), [#113](https://github.com/DonJayamanne/pythonVSCode/issues/113)

## Version 0.4.2
* Fix for autocompletion and code navigation with unicode characters [#372](https://github.com/DonJayamanne/pythonVSCode/issues/372), [#364](https://github.com/DonJayamanne/pythonVSCode/issues/364)

## Version 0.4.1
* Debugging of [Django templates](https://github.com/DonJayamanne/pythonVSCode/wiki/Debugging-Django#templates)
* Linting with [mypy](https://github.com/DonJayamanne/pythonVSCode/wiki/Linting#mypy)
* Improved error handling when loading [Jupyter/IPython](https://github.com/DonJayamanne/pythonVSCode/wiki/Jupyter-(IPython))
* Fixes to unittests

## Version 0.4.0
* Added support for [Jupyter/IPython](https://github.com/DonJayamanne/pythonVSCode/wiki/Jupyter-(IPython))
* Added local help (offline documentation)
* Added ability to pass in extra arguments to interpreter when executing scripts ([#316](https://github.com/DonJayamanne/pythonVSCode/issues/316))
* Added ability set current working directory as the script file directory, when to executing a Python script
* Rendering intellisense icons correctly ([#322](https://github.com/DonJayamanne/pythonVSCode/issues/322))
* Changes to capitalization of context menu text ([#320](https://github.com/DonJayamanne/pythonVSCode/issues/320))
* Bug fix to running pydocstyle linter on windows ([#317](https://github.com/DonJayamanne/pythonVSCode/issues/317))
* Fixed performance issues with regards to code navigation, displaying code Symbols and the like ([#324](https://github.com/DonJayamanne/pythonVSCode/issues/324))
* Fixed code renaming issue when renaming imports ([#325](https://github.com/DonJayamanne/pythonVSCode/issues/325))
* Fixed issue with the execution of the command ```python.execInTerminal``` via a shortcut ([#340](https://github.com/DonJayamanne/pythonVSCode/issues/340))
* Fixed issue with code refactoring ([#363](https://github.com/DonJayamanne/pythonVSCode/issues/363))

## Version 0.3.24
* Added support for clearing cached tests [#307](https://github.com/DonJayamanne/pythonVSCode/issues/307)
* Added support for executing files in terminal with spaces in paths [#308](https://github.com/DonJayamanne/pythonVSCode/issues/308)
* Fix issue related to running unittests on Windows [#309](https://github.com/DonJayamanne/pythonVSCode/issues/309)
* Support custom environment variables when launching external terminal [#311](https://github.com/DonJayamanne/pythonVSCode/issues/311)

## Version 0.3.23
* Added support for the attribute supportsRunInTerminal attribute in debugger [#304](https://github.com/DonJayamanne/pythonVSCode/issues/304)
* Changes to ensure remote debugging resolves remote paths correctly [#302](https://github.com/DonJayamanne/pythonVSCode/issues/302)
* Added support for custom pytest and nosetest paths [#301](https://github.com/DonJayamanne/pythonVSCode/issues/301)
* Resolved issue in ```Watch``` window displaying ```<error:previous evaluation...``` [#301](https://github.com/DonJayamanne/pythonVSCode/issues/301)
* Reduce extension size by removing unwanted files [#296](https://github.com/DonJayamanne/pythonVSCode/issues/296)
* Updated code snippets

## Version 0.3.22
* Added few new snippets
* Integrated [Unit Tests](https://github.com/DonJayamanne/pythonVSCode/wiki/UnitTests)
* Selecting interpreter and updating ```settings.json```[Documentation]](https://github.com/DonJayamanne/pythonVSCode/wiki/Miscellaneous#select-an-interpreter), [#257](https://github.com/DonJayamanne/pythonVSCode/issues/257)
* Running a file or selection in terminal [Documentation](https://github.com/DonJayamanne/pythonVSCode/wiki/Miscellaneous#execute-in-python-terminal), [#261](https://github.com/DonJayamanne/pythonVSCode/wiki/Miscellaneous#execute-in-python-terminal) (new to [Visual Studio Code 1.5](https://code.visualstudio.com/Updates#_extension-authoring))
* Debugging an application using the integrated terminal window (new to [Visual Studio Code 1.5](https://code.visualstudio.com/Updates#_node-debugging))
* Running a python script without debugging [#118](https://github.com/DonJayamanne/pythonVSCode/issues/118)
* Displaying errors in variable explorer when debugging [#271](https://github.com/DonJayamanne/pythonVSCode/issues/271)
* Ability to debug applications as sudo [#224](https://github.com/DonJayamanne/pythonVSCode/issues/224)
* Fixed debugger crashes [#263](https://github.com/DonJayamanne/pythonVSCode/issues/263)
* Asynchronous display of unit tests [#190](https://github.com/DonJayamanne/pythonVSCode/issues/190)
* Fixed issues when using relative paths in ```settings.json``` [#276](https://github.com/DonJayamanne/pythonVSCode/issues/276)
* Fixes issue of hardcoding interpreter command arguments [#256](https://github.com/DonJayamanne/pythonVSCode/issues/256)
* Fixes resolving of remote paths when debugging remote applications [#252](https://github.com/DonJayamanne/pythonVSCode/issues/252)

## Version 0.3.20
* Sharing python.pythonPath value with debug configuration [#214](https://github.com/DonJayamanne/pythonVSCode/issues/214) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support extract variable and method refactoring [#220](https://github.com/DonJayamanne/pythonVSCode/issues/220)
* Support environment variables in settings [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Support formatting of selected text [#197](https://github.com/DonJayamanne/pythonVSCode/issues/197) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support autocompletion of parameters [#71](https://github.com/DonJayamanne/pythonVSCode/issues/71)
* Display name of linter along with diagnostic messages [#199](https://github.com/DonJayamanne/pythonVSCode/issues/199)
* Auto indenting of except and async functions [#205](https://github.com/DonJayamanne/pythonVSCode/issues/205) and [#215](https://github.com/DonJayamanne/pythonVSCode/issues/215)
* Support changes to pythonPath without having to restart VS Code [#216](https://github.com/DonJayamanne/pythonVSCode/issues/216)
* Resolved issue to support large debug outputs [#52](https://github.com/DonJayamanne/pythonVSCode/issues/52) and  [#52](https://github.com/DonJayamanne/pythonVSCode/issues/203)
* Handling instances when debugging with invalid paths to the python interpreter [#229](https://github.com/DonJayamanne/pythonVSCode/issues/229)
* Fixed refactoring on Python 3.5 [#244](https://github.com/DonJayamanne/pythonVSCode/issues/229)
* Fixed parsing errors when refactoring [#244](https://github.com/DonJayamanne/pythonVSCode/issues/229)

## Version 0.3.21
* Sharing python.pythonPath value with debug configuration [#214](https://github.com/DonJayamanne/pythonVSCode/issues/214) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support extract variable and method refactoring [#220](https://github.com/DonJayamanne/pythonVSCode/issues/220)
* Support environment variables in settings [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Support formatting of selected text [#197](https://github.com/DonJayamanne/pythonVSCode/issues/197) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support autocompletion of parameters [#71](https://github.com/DonJayamanne/pythonVSCode/issues/71)
* Display name of linter along with diagnostic messages [#199](https://github.com/DonJayamanne/pythonVSCode/issues/199)
* Auto indenting of except and async functions [#205](https://github.com/DonJayamanne/pythonVSCode/issues/205) and [#215](https://github.com/DonJayamanne/pythonVSCode/issues/215)
* Support changes to pythonPath without having to restart VS Code [#216](https://github.com/DonJayamanne/pythonVSCode/issues/216)
* Resolved issue to support large debug outputs [#52](https://github.com/DonJayamanne/pythonVSCode/issues/52) and  [#52](https://github.com/DonJayamanne/pythonVSCode/issues/203)
* Handling instances when debugging with invalid paths to the python interpreter [#229](https://github.com/DonJayamanne/pythonVSCode/issues/229)
* Fixed refactoring on Python 3.5 [#244](https://github.com/DonJayamanne/pythonVSCode/issues/229)

## Version 0.3.19
* Sharing python.pythonPath value with debug configuration [#214](https://github.com/DonJayamanne/pythonVSCode/issues/214) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support extract variable and method refactoring [#220](https://github.com/DonJayamanne/pythonVSCode/issues/220)
* Support environment variables in settings [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Support formatting of selected text [#197](https://github.com/DonJayamanne/pythonVSCode/issues/197) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Support autocompletion of parameters [#71](https://github.com/DonJayamanne/pythonVSCode/issues/71)
* Display name of linter along with diagnostic messages [#199](https://github.com/DonJayamanne/pythonVSCode/issues/199)
* Auto indenting of except and async functions [#205](https://github.com/DonJayamanne/pythonVSCode/issues/205) and [#215](https://github.com/DonJayamanne/pythonVSCode/issues/215)
* Support changes to pythonPath without having to restart VS Code [#216](https://github.com/DonJayamanne/pythonVSCode/issues/216)
* Resolved issue to support large debug outputs [#52](https://github.com/DonJayamanne/pythonVSCode/issues/52) and  [#52](https://github.com/DonJayamanne/pythonVSCode/issues/203)
* Handling instances when debugging with invalid paths to the python interpreter [#229](https://github.com/DonJayamanne/pythonVSCode/issues/229)

## Version 0.3.18
* Modifications to support environment variables in settings [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Modifications to support formatting of selected text [#197](https://github.com/DonJayamanne/pythonVSCode/issues/197) and [#183](https://github.com/DonJayamanne/pythonVSCode/issues/183)
* Added support to intellisense for parameters [#71](https://github.com/DonJayamanne/pythonVSCode/issues/71)
* Display name of linter along with diagnostic messages [#199](https://github.com/DonJayamanne/pythonVSCode/issues/199)

## Version 0.3.15
* Modifications to handle errors in linters [#185](https://github.com/DonJayamanne/pythonVSCode/issues/185)
* Fixes to formatting and handling of not having empty lines at end of file [#181](https://github.com/DonJayamanne/pythonVSCode/issues/185)
* Modifications to infer paths of packages on windows [#178](https://github.com/DonJayamanne/pythonVSCode/issues/178)
* Fix for debugger crashes [#45](https://github.com/DonJayamanne/pythonVSCode/issues/45)
* Changes to App Insights key [#156](https://github.com/DonJayamanne/pythonVSCode/issues/156)
* Updated Jedi library to latest version [#173](https://github.com/DonJayamanne/pythonVSCode/issues/173)
* Updated iSort library to latest version [#174](https://github.com/DonJayamanne/pythonVSCode/issues/174)

## Version 0.3.14
* Modifications to handle errors in linters when the linter isn't installed.

## Version 0.3.13
* Fixed error message being displayed by linters and formatters

## Version 0.3.12
* Changes to how linters and formatters are executed (optimizations and changes to settings to separate out the command line arguments) [#178](https://github.com/DonJayamanne/pythonVSCode/issues/178), [#163](https://github.com/DonJayamanne/pythonVSCode/issues/163)
* Fix to support Unicode characters in debugger [#102](https://github.com/DonJayamanne/pythonVSCode/issues/102)
* Added support for {workspaceRoot} in Path settings defined in settings.js [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Resolving path of linters and formatters based on python path defined in settings.json [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Better handling of Paths to python executable and related tools (linters, formatters) in virtual environments [#148](https://github.com/DonJayamanne/pythonVSCode/issues/148)
* Added support for configurationDone event in debug adapter [#168](https://github.com/DonJayamanne/pythonVSCode/issues/168), [#145](https://github.com/DonJayamanne/pythonVSCode/issues/145)

## Version 0.3.11
* Added support for telemetry [#156](https://github.com/phgn0/vscode-starklark/issues/156)
* Optimized code formatting and sorting of imports [#150](https://github.com/phgn0/vscode-starklark/issues/150), [#151](https://github.com/phgn0/vscode-starklark/issues/151), [#157](https://github.com/phgn0/vscode-starklark/issues/157)
* Fixed issues in code formatting [#171](https://github.com/phgn0/vscode-starklark/issues/171)
* Modifications to display errors returned by debugger [#111](https://github.com/phgn0/vscode-starklark/issues/111)
* Fixed the prospector linter [#142](https://github.com/phgn0/vscode-starklark/issues/142)
* Modified to resolve issues where debugger wasn't handling code exceptions correctly [#159](https://github.com/phgn0/vscode-starklark/issues/159)
* Added support for unit tests using pytest [#164](https://github.com/phgn0/vscode-starklark/issues/164)
* General code cleanup

## Version 0.3.10
* Fixed issue with duplicate output channels being created
* Fixed issues in the LICENSE file
* Fixed issue where current directory was incorrect [#68](https://github.com/DonJayamanne/pythonVSCode/issues/68)
* General cleanup of code

## Version 0.3.9
* Fixed auto indenting issues [#137](https://github.com/DonJayamanne/pythonVSCode/issues/137)

## Version 0.3.8
* Added support for linting using prospector [#130](https://github.com/DonJayamanne/pythonVSCode/pull/130)
* Fixed issue where environment variables weren't being inherited by the debugger [#109](https://github.com/DonJayamanne/pythonVSCode/issues/109) and [#77](https://github.com/DonJayamanne/pythonVSCode/issues/77)

## Version 0.3.7
* Added support for auto indenting of some keywords [#83](https://github.com/DonJayamanne/pythonVSCode/issues/83)
* Added support for launching console apps for Mac [#128](https://github.com/DonJayamanne/pythonVSCode/issues/128)
* Fixed issue where configuration files for pylint, pep8 and flake8 commands weren't being read correctly [#117](https://github.com/DonJayamanne/pythonVSCode/issues/117)

## Version 0.3.6
* Added support for linting using pydocstyle [#56](https://github.com/DonJayamanne/pythonVSCode/issues/56)
* Added support for auto-formatting documents upon saving (turned off by default) [#27](https://github.com/DonJayamanne/pythonVSCode/issues/27)
* Added support to configure the output window for linting, formatting and unit test messages [#112](https://github.com/DonJayamanne/pythonVSCode/issues/112)

## Version 0.3.5
* Fixed printing of unicode characters when evaluating expressions [#73](https://github.com/DonJayamanne/pythonVSCode/issues/73)

## Version 0.3.4
* Updated snippets
* Fixes to remote debugging [#65](https://github.com/DonJayamanne/pythonVSCode/issues/65)
* Fixes related to code navigation [#58](https://github.com/DonJayamanne/pythonVSCode/issues/58) and [#78](https://github.com/DonJayamanne/pythonVSCode/pull/78)
* Changes to allow code navigation for methods

## Version 0.3.0
* Remote debugging (attaching to local and remote processes)
* Debugging with support for shebang
* Support for passing environment variables to debug program
* Improved error handling in the extension

## Version 0.2.9
* Added support for debugging django applications
 + Debugging templates is not supported at this stage

## Version 0.2.8
* Added support for conditional break points
* Added ability to optionally display the shell window (Windows Only, Mac is coming soon)
  +  Allowing an interactive shell window, which isn't supported in VSCode.
* Added support for optionally breaking into python code as soon as debugger starts
* Fixed debugging when current thread is busy processing.
* Updated documentation with samples and instructions

## Version 0.2.4
* Fixed issue where debugger would break into all exceptions
* Added support for breaking on all and uncaught exceptions
* Added support for pausing (breaking) into a running program while debugging.

## Version 0.2.3
* Fixed termination of debugger

## Version 0.2.2
* Improved debugger for Mac, with support for Multi threading, Web Applications, expanding properties, etc
* (Debugging now works on both Windows and Mac)
* Debugging no longer uses PDB

## Version 0.2.1
* Improved debugger for Windows, with support for Multi threading, debugging Multi-threaded apps, Web Applications, expanding properties, etc
* Added support for relative paths for extra paths in additional libraries for Auto Complete
* Fixed a bug where paths to custom Python versions weren't respected by the previous (PDB) debugger
* NOTE: PDB Debugger is still supported

## Version 0.1.3
* Fixed linting when using pylint

## Version 0.1.2
* Fixed autoformatting of code (falling over when using yapf8)

## Version 0.1.1
* Fixed linting of files on Mac
* Added support for linting using pep8
* Added configuration support for pep8 and pylint
* Added support for configuring paths for pep8, pylint and autopep8
* Added snippets
* Added support for formatting using yapf
* Added a number of configuration settings

## Version 0.0.4
* Added support for linting using Pylint (configuring pylint is coming soon)
* Added support for sorting Imports (Using the command "Pythong: Sort Imports")
* Added support for code formatting using Autopep8 (configuring autopep8 is coming soon)
* Added ability to view global variables, arguments, add and remove break points

## Version 0.0.3
* Added support for debugging using PDB
