# Tandygram




## Go HTTP Server

To fire up the Go server, some environment variables need to be set:

`TANDY_PUBLIC_ROOT` must be an absolute path to the public/ folder containing the Tandygram assets.

`TANDY_TIEDOT_DIR` must be an absolute path to a directory where the Tiedot database will be created. The directory specified will be created if it doesn't exist.

`TANDY_HTTP_PORT` is optional, and allows specification of port to serve from. If not specified or not parsable it defaults to 8080.