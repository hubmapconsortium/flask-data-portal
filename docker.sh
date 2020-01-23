#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

IMAGE_NAME=hubmap/portal-ui
CONTAINER_NAME=hubmap-portal-ui
CONTEXT=context
CONF_PATH=example-app.conf
PORT=$1
FOLLOW=$2

[ "$PORT" = 5000 ] || [ "$PORT" = 5001 ] || die "Usage: $0 PORT [--follow]
Requires port; On localhost must be 5000 or 5001 to match Globus whitelist."
[ -e "$CONF_PATH" ] || die "No $CONF_PATH
Copy example-app.conf and fill in blanks."

docker rm -f $CONTAINER_NAME || echo "$CONTAINER_NAME is not yet running."

docker build --tag $IMAGE_NAME $CONTEXT
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  -e FLASK_ENV=development \
  --mount type=bind,source="$(pwd)"/"$CONF_PATH",target=/app/instance/app.conf \
  $IMAGE_NAME

green=`tput setaf 2`
reset=`tput sgr0`

echo $green
echo "To visit:   http://localhost:$PORT/"
echo "To connect: docker exec -it $CONTAINER_NAME /bin/bash"
echo $reset

if [ "$FOLLOW" == "--follow" ]; then
  docker logs --follow $CONTAINER_NAME
  # This continues to run.
fi
