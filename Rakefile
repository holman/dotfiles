require 'rake'

desc "Let's hook this motherfucker into your system"
task :install do
  linkables = Dir.glob('*/**{.symlink}')
  
  linkables.each do |linkable|
    file = linkable.split('/').last.split('.').first
    `ln -s "$PWD/#{linkable}" "$HOME/.#{file}"`
  end
end