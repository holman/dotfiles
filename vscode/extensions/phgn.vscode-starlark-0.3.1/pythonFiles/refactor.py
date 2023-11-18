# Arguments are:
# 1. Working directory.
# 2. Rope folder

import difflib
import io
import json
import os
import sys
import traceback

try:
    import rope
    from rope.base import libutils
    from rope.refactor.rename import Rename
    from rope.refactor.extract import ExtractMethod, ExtractVariable
    import rope.base.project
    import rope.base.taskhandle
except:
    jsonMessage = {'error': True, 'message': 'Rope not installed', 'traceback': '', 'type': 'ModuleNotFoundError'}
    sys.stderr.write(json.dumps(jsonMessage))
    sys.stderr.flush()

WORKSPACE_ROOT = sys.argv[1]
ROPE_PROJECT_FOLDER = '.vscode/.ropeproject'


class RefactorProgress():
    """
    Refactor progress information
    """

    def __init__(self, name='Task Name', message=None, percent=0):
        self.name = name
        self.message = message
        self.percent = percent


class ChangeType():
    """
    Change Type Enum
    """
    EDIT = 0
    NEW = 1
    DELETE = 2


class Change():
    """
    """
    EDIT = 0
    NEW = 1
    DELETE = 2

    def __init__(self, filePath, fileMode=ChangeType.EDIT, diff=""):
        self.filePath = filePath
        self.diff = diff
        self.fileMode = fileMode

def get_diff(changeset):
    """This is a copy of the code form the ChangeSet.get_description method found in Rope."""
    new = changeset.new_contents
    old = changeset.old_contents
    if old is None:
        if changeset.resource.exists():
            old = changeset.resource.read()
        else:
            old = ''

    # Ensure code has a trailing empty lines, before generating a diff.
    # https://github.com/Microsoft/vscode-python/issues/695.
    old_lines = old.splitlines(True)
    if not old_lines[-1].endswith('\n'):
        old_lines[-1] = old_lines[-1] + os.linesep
        new = new + os.linesep
    
    result = difflib.unified_diff(
        old_lines, new.splitlines(True),
        'a/' + changeset.resource.path, 'b/' + changeset.resource.path)
    return ''.join(list(result))

class BaseRefactoring(object):
    """
    Base class for refactorings
    """

    def __init__(self, project, resource, name="Refactor", progressCallback=None):
        self._progressCallback = progressCallback
        self._handle = rope.base.taskhandle.TaskHandle(name)
        self._handle.add_observer(self._update_progress)
        self.project = project
        self.resource = resource
        self.changes = []

    def _update_progress(self):
        jobset = self._handle.current_jobset()
        if jobset and not self._progressCallback is None:
            progress = RefactorProgress()
            # getting current job set name
            if jobset.get_name() is not None:
                progress.name = jobset.get_name()
            # getting active job name
            if jobset.get_active_job_name() is not None:
                progress.message = jobset.get_active_job_name()
            # adding done percent
            percent = jobset.get_percent_done()
            if percent is not None:
                progress.percent = percent
            if not self._progressCallback is None:
                self._progressCallback(progress)

    def stop(self):
        self._handle.stop()

    def refactor(self):
        try:
            self.onRefactor()
        except rope.base.exceptions.InterruptedTaskError:
            # we can ignore this exception, as user has cancelled refactoring
            pass

    def onRefactor(self):
        """
        To be implemented by each base class
        """
        pass


class RenameRefactor(BaseRefactoring):

    def __init__(self, project, resource, name="Rename", progressCallback=None, startOffset=None, newName="new_Name"):
        BaseRefactoring.__init__(self, project, resource,
                                 name, progressCallback)
        self._newName = newName
        self.startOffset = startOffset

    def onRefactor(self):
        renamed = Rename(self.project, self.resource, self.startOffset)
        changes = renamed.get_changes(self._newName, task_handle=self._handle)
        for item in changes.changes:
            if isinstance(item, rope.base.change.ChangeContents):
                self.changes.append(
                    Change(item.resource.real_path, ChangeType.EDIT, get_diff(item)))
            else:
                raise Exception('Unknown Change')


class ExtractVariableRefactor(BaseRefactoring):

    def __init__(self, project, resource, name="Extract Variable", progressCallback=None, startOffset=None, endOffset=None, newName="new_Name", similar=False, global_=False):
        BaseRefactoring.__init__(self, project, resource,
                                 name, progressCallback)
        self._newName = newName
        self._startOffset = startOffset
        self._endOffset = endOffset
        self._similar = similar
        self._global = global_

    def onRefactor(self):
        renamed = ExtractVariable(
            self.project, self.resource, self._startOffset, self._endOffset)
        changes = renamed.get_changes(
            self._newName, self._similar, self._global)
        for item in changes.changes:
            if isinstance(item, rope.base.change.ChangeContents):
                self.changes.append(
                    Change(item.resource.real_path, ChangeType.EDIT, get_diff(item)))
            else:
                raise Exception('Unknown Change')


class ExtractMethodRefactor(ExtractVariableRefactor):

    def __init__(self, project, resource, name="Extract Method", progressCallback=None, startOffset=None, endOffset=None, newName="new_Name", similar=False, global_=False):
        ExtractVariableRefactor.__init__(self, project, resource,
                                         name, progressCallback, startOffset=startOffset, endOffset=endOffset, newName=newName, similar=similar, global_=global_)

    def onRefactor(self):
        renamed = ExtractMethod(
            self.project, self.resource, self._startOffset, self._endOffset)
        changes = renamed.get_changes(
            self._newName, self._similar, self._global)
        for item in changes.changes:
            if isinstance(item, rope.base.change.ChangeContents):
                self.changes.append(
                    Change(item.resource.real_path, ChangeType.EDIT, get_diff(item)))
            else:
                raise Exception('Unknown Change')


class RopeRefactoring(object):

    def __init__(self):
        self.default_sys_path = sys.path
        self._input = io.open(sys.stdin.fileno(), encoding='utf-8')

    def _rename(self, filePath, start, newName, indent_size):
        """
        Renames a variable
        """
        project = rope.base.project.Project(
            WORKSPACE_ROOT, ropefolder=ROPE_PROJECT_FOLDER, save_history=False, indent_size=indent_size)
        resourceToRefactor = libutils.path_to_resource(project, filePath)
        refactor = RenameRefactor(
            project, resourceToRefactor, startOffset=start, newName=newName)
        refactor.refactor()
        changes = refactor.changes
        project.close()
        valueToReturn = []
        for change in changes:
            valueToReturn.append({'diff': change.diff})
        return valueToReturn

    def _extractVariable(self, filePath, start, end, newName, indent_size):
        """
        Extracts a variable
        """
        project = rope.base.project.Project(
            WORKSPACE_ROOT, ropefolder=ROPE_PROJECT_FOLDER, save_history=False, indent_size=indent_size)
        resourceToRefactor = libutils.path_to_resource(project, filePath)
        refactor = ExtractVariableRefactor(
            project, resourceToRefactor, startOffset=start, endOffset=end, newName=newName, similar=True)
        refactor.refactor()
        changes = refactor.changes
        project.close()
        valueToReturn = []
        for change in changes:
            valueToReturn.append({'diff': change.diff})
        return valueToReturn

    def _extractMethod(self, filePath, start, end, newName, indent_size):
        """
        Extracts a method
        """
        project = rope.base.project.Project(
            WORKSPACE_ROOT, ropefolder=ROPE_PROJECT_FOLDER, save_history=False, indent_size=indent_size)
        resourceToRefactor = libutils.path_to_resource(project, filePath)
        refactor = ExtractMethodRefactor(
            project, resourceToRefactor, startOffset=start, endOffset=end, newName=newName, similar=True)
        refactor.refactor()
        changes = refactor.changes
        project.close()
        valueToReturn = []
        for change in changes:
            valueToReturn.append({'diff': change.diff})
        return valueToReturn

    def _serialize(self, identifier, results):
        """
        Serializes the refactor results
        """
        return json.dumps({'id': identifier, 'results': results})

    def _deserialize(self, request):
        """Deserialize request from VSCode.

        Args:
            request: String with raw request from VSCode.

        Returns:
            Python dictionary with request data.
        """
        return json.loads(request)

    def _process_request(self, request):
        """Accept serialized request from VSCode and write response.
        """
        request = self._deserialize(request)
        lookup = request.get('lookup', '')

        if lookup == '':
            pass
        elif lookup == 'rename':
            changes = self._rename(request['file'], int(
                request['start']), request['name'], int(request['indent_size']))
            return self._write_response(self._serialize(request['id'], changes))
        elif lookup == 'extract_variable':
            changes = self._extractVariable(request['file'], int(
                request['start']), int(request['end']), request['name'], int(request['indent_size']))
            return self._write_response(self._serialize(request['id'], changes))
        elif lookup == 'extract_method':
            changes = self._extractMethod(request['file'], int(
                request['start']), int(request['end']), request['name'], int(request['indent_size']))
            return self._write_response(self._serialize(request['id'], changes))

    def _write_response(self, response):
        sys.stdout.write(response + '\n')
        sys.stdout.flush()

    def watch(self):
        self._write_response("STARTED")
        while True:
            try:
                self._process_request(self._input.readline())
            except:
                exc_type, exc_value, exc_tb = sys.exc_info()
                tb_info = traceback.extract_tb(exc_tb)
                jsonMessage = {'error': True, 'message': str(exc_value), 'traceback': str(tb_info), 'type': str(exc_type)}
                sys.stderr.write(json.dumps(jsonMessage))
                sys.stderr.flush()

if __name__ == '__main__':
    RopeRefactoring().watch()
