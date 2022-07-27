FROM us-docker.pkg.dev/ql-community-tools-staging/container-images/ql_discourse-base:latest

ENV RAILS_ENV=

# Give discourse user no-passwd sudo permissions (for bundle install)
ADD discourse_dev/sudoers.discourse /etc/sudoers.d/discourse

# get redis going
ADD discourse_dev/redis.template.yml /pups/redis.yml
RUN /pups/bin/pups /pups/redis.yml

RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# get postgres going
ADD discourse_dev/postgres.template.yml /pups/postgres.yml
RUN LANG=en_US.UTF-8 /pups/bin/pups /pups/postgres.yml

# Pull code
COPY . /var/www/discourse

RUN cd /var/www/discourse &&\
    chmod -R 777 /var/www/discourse &&\
    sudo -u discourse bundle config --delete without &&\
    sudo -u discourse bundle config --local deployment true &&\
    sudo -u discourse bundle config --local path ./vendor/bundle &&\ 
    # sudo -u discourse bundle config --local without test development &&\
    sudo -u discourse bundle install --jobs 4 
    
RUN cd /var/www/discourse &&\
    sudo -u discourse yarn install --production --frozen-lockfile &&\
    sudo -u discourse yarn cache clean &&\
    bundle exec rake maxminddb:get &&\
    find /var/www/discourse/vendor/bundle -name tmp -type d -exec rm -rf {} + &&\
    chmod -R 777 /var/www/discourse/tmp

# add dev databases
ADD discourse_dev/postgres_dev.template.yml /pups/postgres_dev.yml
RUN /pups/bin/pups /pups/postgres_dev.yml

ADD discourse_dev/ensure-database /etc/runit/1.d/ensure-database
COPY docker_add/sbin/ /sbin

RUN sed -i 's/peer/trust/g' /etc/postgresql/13/main/pg_hba.conf
