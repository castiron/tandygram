# config valid only for current version of Capistrano
lock '3.4.1'

set :application, 'tandygram'
set :repo_url, 'git@github.com:castiron/tandygram.git'
set :deploy_to, -> { "/home/#{fetch(:application)}/deploy/" }
set :log_level, :info

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
	execute :sudo, :service, :tandygram, :restart
    end
  end

end

after 'deploy:publishing', 'deploy:restart'
