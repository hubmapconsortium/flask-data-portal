#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

server_up() {
  TRIES=0
  MAX_TRIES=150
  URL=http://localhost:$1
  until curl --silent --fail $URL; do
    [ ${TRIES} -gt ${MAX_TRIES} ] && die "Server not running at $URL"
    printf '.'
    sleep 1
    TRIES=$(($TRIES+1))
  done
  echo "Server starts up, and $URL returns 200."
}

start changelog
if [ "$TRAVIS_BRANCH" != 'master' ]; then
  git remote set-branches --add origin master
  git fetch
  git diff --summary origin/master \
    | grep '^ create' | grep 'CHANGELOG-' \
    || die 'Add a CHANGELOG-something.md'
fi
end changelog

start quick-start
if [ ! -z "$TRAVIS" ]; then
  ./quick-start.sh || sed -i 's/TODO/FAKE/' context/instance/app.conf
fi
./quick-start.sh &
server_up 5000
end quick-start

start flake8
# Unit tests require dev dependencies beyond what quick-start provides.
pip install -r context/requirements-dev.txt > /dev/null
EXCLUDE=node_modules,ingest-validation-tools,search-schema
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8

start doctests
python -m doctest context/app/doc_utils.py
# TODO: Get doctests working more generally.
# find context/app | grep '\.py$' | xargs python -m doctest
end doctests

start pytest
pytest -vv --ignore=context/node_modules/
end pytest

start docker
./docker.sh 5001
server_up 5001
cd context && npm run cypress:run && cd -
end docker
