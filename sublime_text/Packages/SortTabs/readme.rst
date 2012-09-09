============================
Sort Tabs for Sublime Text 2
============================

This plugin sort the tabs in Sublime Text 2 using one of these methods:

- Sort Tabs by file name
- Sort Tabs by file type
- Sort Tabs by modification date

Optionally, you can enable an automatic sort when loading or saving a file.

How it works
------------

The command is accessible via the Command Palette (Ctrl+Shift+P) under the name *Sort Tabs: Menu* or from the menu::
    
    View->Sort Tabs Menu

Installation
------------

Install via `Package Control <http://wbond.net/sublime_packages/package_control>`_

Settings
--------

To configure this plugin, look at the menu::

    Preferences->Package Settings->SortTabs->Settings - Default

If you want to change a settings don't touch this file, but put your settings in your user folder::

    Preferences->Package Settings->SortTabs->Settings - User


Add your own sorting method (Advanced)
--------------------------------------

To add your own sorting method, create a new plugin in your User directory that inherit from *sort_tabs.SortTabs*.

Example::

    import os.path
    import sort_tabs


    class SortTabsByFileExtCommand(sort_tabs.SortTabsByNameCommand):
        '''Sort Tabs by file extension'''
        sorting_indexes = (1, 3, 2)

        def fill_list_views(self, list_views):
            super(SortTabsByFileExtCommand, self).fill_list_views(list_views)
            # add file extension to each element of list_views
            for item in list_views:
                item.append(os.path.splitext(item[2])[1].lower())

*list_views* is a list containing a list with the view object and the group number.

You can add to them as many item you need to sort the *list_views* (here we add the file extension).

*sorting_indexes* is a tuple containing the index number of items in the list used to sort *list_views* (here we sort by group number, file extension, file name).

New commands are automaticaly added to the menu.