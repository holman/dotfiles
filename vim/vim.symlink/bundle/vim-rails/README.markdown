rails.vim
=========

Remember when everybody and their mother was using TextMate for Ruby on
Rails development?  Well if it wasn't for rails.vim, we'd still be in
that era.  So shut up and pay some respect.  And check out these
features:

* Easy navigation of the Rails directory structure.  `gf` considers
  context and knows about partials, fixtures, and much more.  There are
  two commands, `:A` (alternate) and `:R` (related) for easy jumping
  between files, including favorites like model to migration, template
  to helper, and controller to functional test.  For more advanced
  usage, `:Rmodel`, `:Rview`, `:Rcontroller`, and several other commands
  are provided.  `:help rails-navigation`

* Enhanced syntax highlighting.  From `has_and_belongs_to_many` to
  `distance_of_time_in_words`, it's here.  For easy completion of these
  long method names, `'completefunc'` is set to enable syntax based
  completion on CTRL-X CTRL-U.

* Interface to rake.  Use `:Rake` to run the current test, spec, or
  feature.  Use `:.Rake` to do a focused run of just the method,
  example, or scenario on the current line.  `:Rake` can also run
  arbitrary migrations, load individual fixtures, and more.
  `:help rails-rake`

* Interface to `script/*`.  Generally, use `:Rscript about` to call
  `script/about` or `script/rails about`.  Most commands have wrappers
  with additional features: `:Rgenerate controller Blog` generates a
  blog controller and edits `app/controllers/blog_controller.rb`.
  `:help rails-scripts`

* Partial extraction and migration inversion.  `:Rextract {file}`
  replaces the desired range (ideally selected in visual line mode) with
  `render :partial => '{file}'`, which is automatically created with
  your content.  The `@{file}` instance variable is replaced with the
  `{file}` local variable.  `:Rinvert` takes a `self.up` migration and
  writes a `self.down`.  `:help rails-refactoring`

* Integration with other plugins.  `:Rtree` spawns
  [NERDTree.vim](https://github.com/scrooloose/nerdtree).  If
  [dbext.vim](http://www.vim.org/scripts/script.php?script_id=356) is
  installed, it will be transparently configured to reflect
  `database.yml`.  Users of
  [abolish.vim](https://github.com/tpope/vim-abolish) get pluralize and
  tableize coercions, and users of
  [bundler.vim](https://github.com/tpope/vim-bundler) get `bundle exec
  rake`.  `:help rails-integration`

Installation
------------

If you don't have a preferred installation method, I recommend
installing [pathogen.vim](https://github.com/tpope/vim-pathogen), and
then simply copy and paste:

    cd ~/.vim/bundle
    git clone git://github.com/tpope/vim-rails.git

Once help tags have been generated, you can view the manual with
`:help rails`.

FAQ
---

> I installed the plugin and started Vim.  Why does only the :Rails
> command exist?

This plugin cares about the current file, not the current working
directory.  Edit a file from a Rails application.

> I opened a new tab.  Why does only the :Rails command exist?

This plugin cares about the current file, not the current working
directory.  Edit a file from a Rails application.  You can use the `:RT`
family of commands to open a new tab and edit a file at the same time.

> Can I use rails.vim to edit Rails engines?

It's not supported, but if you `touch config/environment.rb` in the root
of the engine, things should mostly work.

> Can I use rails.vim to edit other Ruby projects?

I wrote [rake.vim](https://github.com/tpope/vim-rake) for exactly that
purpose.  It activates for any project with a `Rakefile` that's not a
Rails application.

> Is Rails 3 supported yet?

Of course.

> Is Rails 2 still supported?

Baby, you can go all the way back to Rails 1 if you like (give or take
some syntax highlighting).

> Can I use rails.vim with engines?

Not officially, but if you create `config/environment.rb` in the root of
the engine, it will mostly work.

> Rake is slow.  How about making `:Rake` run
> `testrb`/`rspec`/`cucumber` directly instead of `rake`?

Well then it wouldn't make sense to call it `:Rake`, now, would it?
Maybe one day I'll add a separate `:Run` command or something.  In the
meantime, here's how you can set up `:make` to run the current test:

    autocmd FileType cucumber compiler cucumber | setl makeprg=cucumber\ \"%:p\"
    autocmd FileType ruby
          \ if expand('%') =~# '_test\.rb$' |
          \   compiler rubyunit | setl makeprg=testrb\ \"%:p\" |
          \ elseif expand('%') =~# '_spec\.rb$' |
          \   compiler rspec | setl makeprg=rspec\ \"%:p\" |
          \ else |
          \   compiler ruby | setl makeprg=ruby\ -wc\ \"%:p\" |
          \ endif
    autocmd User Bundler
          \ if &makeprg !~# 'bundle' | setl makeprg^=bundle\ exec\  | endif

Contributing
------------

If your [commit message sucks](http://stopwritingramblingcommitmessages.com/),
I'm not going to accept your pull request.  I've explained very politely
dozens of times that
[my general guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
are absolute rules on my own repositories, so I may lack the energy to
explain it to you yet another time.  And please, if I ask you to change
something, `git commit --amend`.

Beyond that, don't be shy about asking before patching.  What takes you
hours might take me minutes simply because I have both domain knowledge
and a perverse knowledge of VimScript so vast that many would consider
it a symptom of mental illness.  On the flip side, some ideas I'll
reject no matter how good the implementation is.  "Send a patch" is an
edge case answer in my book.

Self-Promotion
--------------

Like rails.vim? Follow the repository on
[GitHub](https://github.com/tpope/vim-rails) and vote for it on
[vim.org](http://www.vim.org/scripts/script.php?script_id=1567).  And if
you're feeling especially charitable, follow [tpope](http://tpo.pe/) on
[Twitter](http://twitter.com/tpope) and
[GitHub](https://github.com/tpope).

License
-------

Copyright (c) Tim Pope.  Distributed under the same terms as Vim itself.
See `:help license`.
