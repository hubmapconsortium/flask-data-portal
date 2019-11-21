#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

IMAGE_NAME=hubmap:portal-ui
CONTAINER_NAME=hubmap-portal-ui
CONF_PATH=app/instance/app.conf
PORT=$1

[ -z "$PORT" ] && die "Usage: $0 PORT
Requires port number."
[ -e "$CONF_PATH" ] || die "No $CONF_PATH
Copy example-app.conf and fill in blanks."

docker rm -f $CONTAINER_NAME || echo "$CONTAINER_NAME is not yet running."

docker build --tag $IMAGE_NAME app
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  -e FLASK_ENV=development \
  --mount type=bind,source="$(pwd)"/"$CONF_PATH",target=/"$CONF_PATH" \
  $IMAGE_NAME

echo
echo "To visit:   http://localhost:$PORT/"
echo "To connect: docker exec -it $CONTAINER_NAME /bin/bash"
echo

docker logs --follow $CONTAINER_NAME
