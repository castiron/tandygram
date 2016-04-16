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

namespace :tandygram do
  task :reset do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      bak_dir = "/home/#{fetch(:application)}/tiedot-bak"

      execute :mkdir, '-p', bak_dir
      execute :sudo, :service, :tandygram, :stop
      execute :mv, '/tmp/tandy-tiedot', "#{bak_dir}/bak-#{Time.now.to_i}"
      execute :sudo, :service, :tandygram, :start
    end
  end
end

after 'deploy:publishing', 'deploy:restart'
