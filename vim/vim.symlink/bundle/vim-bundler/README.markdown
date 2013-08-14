# bundler.vim

This is a lightweight bag of Vim goodies for
[Bundler](http://gembundler.com), best accompanied by
[rake.vim](https://github.com/tpope/vim-rake) and/or
[rails.vim](https://github.com/tpope/vim-rails).  Features:

* `:Bundle`, which wraps `bundle`.
* An internalized version of `bundle open`: `:Bopen` (and `:Bsplit`,
  `:Btabedit`, etc.).
* `'path'` and `'tags'` are automatically altered to include all gems
  from your bundle.  (Generate those tags with
  [gem-ctags](https://github.com/tpope/gem-ctags)!)
* Highlight Bundler keywords in `Gemfile`.
* Support for `gf` in `Gemfile.lock`, plus syntax highlighting that
  distinguishes between installed and missing gems.

## Installation

If you don't have a preferred installation method, I recommend
installing [pathogen.vim](https://github.com/tpope/vim-pathogen), and
then simply copy and paste:

    cd ~/.vim/bundle
    git clone git://github.com/tpope/vim-bundler.git

Once help tags have been generated, you can view the manual with
`:help bundler`.

## FAQ

> I installed the plugin and started Vim.  Why don't any of the commands
> exist?

This plugin cares about the current file, not the current working
directory.  Edit a file that's covered by a `Gemfile`.

> I opened a new tab.  Why don't any of the commands exist?

This plugin cares about the current file, not the current working
directory.  Edit a file that's covered by a `Gemfile`.

## Self-Promotion

Like bundler.vim? Follow the repository on
[GitHub](https://github.com/tpope/vim-bundler) and vote for it on
[vim.org](http://www.vim.org/scripts/script.php?script_id=4280).  And if
you're feeling especially charitable, follow [tpope](http://tpo.pe/) on
[Twitter](http://twitter.com/tpope) and
[GitHub](https://github.com/tpope).

## License

Copyright (c) Tim Pope.  Distributed under the same terms as Vim itself.
See `:help license`.
