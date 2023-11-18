import os

from parso import file_io


class AbstractFolderIO(object):
    def __init__(self, path):
        self.path = path

    def list(self):
        raise NotImplementedError

    def get_file_io(self, name):
        raise NotImplementedError


class FolderIO(AbstractFolderIO):
    def list(self):
        return os.listdir(self.path)

    def get_file_io(self, name):
        return FileIO(os.path.join(self.path, name))


class FileIOFolderMixin(object):
    def get_parent_folder(self):
        return FolderIO(os.path.dirname(self.path))


class ZipFileIO(file_io.KnownContentFileIO, FileIOFolderMixin):
    """For .zip and .egg archives"""
    def __init__(self, path, code, zip_path):
        super(ZipFileIO, self).__init__(path, code)
        self._zip_path = zip_path

    def get_last_modified(self):
        try:
            return os.path.getmtime(self._zip_path)
        except OSError:  # Python 3 would probably only need FileNotFoundError
            return None


class FileIO(file_io.FileIO, FileIOFolderMixin):
    pass


class KnownContentFileIO(file_io.KnownContentFileIO, FileIOFolderMixin):
    pass
