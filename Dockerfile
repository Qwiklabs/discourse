# GCP project to get images from
ARG PROJECT_ID

FROM us-docker.pkg.dev/ql-community-tools-staging/container-images/ql_discourse-base:latest

COPY . /var/www/discourse

# TODO: Make configure work
RUN cd /var/www/discourse &&\
    chmod -R 777 /var/www/discourse &&\
    sudo -u discourse bundle config --local deployment true &&\
    sudo -u discourse bundle config --local path ./vendor/bundle &&\ 
    sudo -u discourse bundle config --local without test development &&\
    sudo -u discourse bundle install --jobs 4 
RUN cd /var/www/discourse &&\
    sudo -u discourse yarn install --production --frozen-lockfile &&\
    sudo -u discourse yarn cache clean &&\
    bundle exec rake maxminddb:get &&\
    find /var/www/discourse/vendor/bundle -name tmp -type d -exec rm -rf {} +
