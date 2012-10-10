import sublime, sublime_plugin
import os
from operator import itemgetter
from itertools import groupby


class SortTabs(object):
	sorting_indexes = (1,)

	def __init__(self, *args, **kwargs):
		super(SortTabs, self).__init__(*args, **kwargs)
		# register command in the menu
		SortTabsMenuCommand.register(self.name(), self.description())

	def run(self):
		# save active view to restore it latter
		curr_view = self.window.active_view()
		list_views = []
		# init, fill and sort list_views
		self.init_file_views(list_views)
		self.fill_list_views(list_views)
		self.sort_list_views(list_views)
		# sort views according to list_views
		for group, groupviews in groupby(list_views, itemgetter(1)):
			for index, view in enumerate(v[0] for v in groupviews):
				self.window.set_view_index(view, group, index)
				# remove flag for auto sorting
				view.settings().erase('sorttabs_tosort')
		# restore active view
		self.window.focus_view(curr_view)

	def init_file_views(self, list_views):
		for view in self.window.views():
			group, _ = self.window.get_view_index(view)
			list_views.append([view, group])

	def fill_list_views(self, list_views):
		pass

	def sort_list_views(self, list_views):
		# sort list_views using sorting_indexes
		list_views.sort(key=itemgetter(*self.sorting_indexes))

	def description(self, *args):
		# use class __doc__ for description
		return self.__doc__


class SortTabsByNameCommand(SortTabs, sublime_plugin.WindowCommand):
	'''Sort Tabs by file name'''
	sorting_indexes = (1, 2)

	def fill_list_views(self, list_views):
		super(SortTabsByNameCommand, self).fill_list_views(list_views)
		for item in list_views:
			filename = os.path.basename(item[0].file_name() if item[0].file_name() else '')
			item.append(filename.lower())


class SortTabsByTypeCommand(SortTabsByNameCommand):
	'''Sort Tabs by file type'''
	sorting_indexes = (1, 3, 2)

	def fill_list_views(self, list_views):
		super(SortTabsByTypeCommand, self).fill_list_views(list_views)
		# add syntax to each element of list_views
		for item in list_views:
			item.append(item[0].settings().get('syntax', ''))


class SortTabsByDateCommand(SortTabsByNameCommand):
	'''Sort Tabs by modification date'''
	sorting_indexes = (1, 3, 4, 2)

	def fill_list_views(self, list_views):
		super(SortTabsByDateCommand, self).fill_list_views(list_views)
		# add modifcation date and dirty flag to each element of list_views
		for item in list_views:
			modified = 0
			dirty = item[0].is_dirty()
			if not dirty:
				dirty = True
				filepath = item[0].file_name()
				if filepath is not None:
					try:
						modified = os.path.getmtime(filepath)
						dirty = False
					except WindowsError:
						pass
			item.extend([not dirty, -modified])


class SortTabsMenuCommand(sublime_plugin.WindowCommand):
	registered_sort_commands = []

	def run(self):
		listcommands = [c[0] for c in self.registered_sort_commands]
		self.window.show_quick_panel(listcommands, self._callback)

	def _callback(self, index):
		if index != -1:
			self.window.run_command(self.registered_sort_commands[index][1])

	@classmethod
	def register(cls, cmd, description):
		# add cmd to the available commands and sort them
		commands = set(cls.registered_sort_commands)
		commands.add((description, cmd))
		cls.registered_sort_commands = list(commands)
		cls.registered_sort_commands.sort()
