package main

import (
	"github.com/castiron/tandygram-backend/server"
	"github.com/castiron/tandygram-backend/datastore"
)

func main() {
	datastore.Initialize()
	server.Serve()
}
