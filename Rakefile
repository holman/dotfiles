require 'rake'

desc "Let's hook this motherfucker into your system"
task :install do
  linkables = %w(
    git/gitconfig
    git/gitignore
    ruby/gemrc
    ruby/irbrc
    zsh/zshrc
  )
  
  linkables.each do |linkable|
    file = linkable.split('/').last
    `ln -s "$PWD/#{linkable}" "$HOME/.#{file}"`
  end
end