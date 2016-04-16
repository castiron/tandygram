set :stage, :staging
server 'tandygram.cic-stg.com', user: 'tandygram', roles: %w{app}
set :branch, ENV["REVISION"] || ENV["BRANCH_NAME"] || "master"
