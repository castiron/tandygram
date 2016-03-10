package server

import (
	"net/http"
	"log"
	"github.com/castiron/tandygram-backend/datastore"
	"encoding/json"
	"strconv"
"strings"
)

func Serve() {
	http.HandleFunc("/api/composites/", handleComposites)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleComposites(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)

	if origin := r.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	switch r.Method {
	case "GET":
		handleIndex(w, r)
	case "POST":
		handleCreate(w, r)
	case "DELETE":
		handleDelete(w, r)
	case "OPTIONS":
		return
	default:
		handleError(w, r)
	}
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
    	json, err := json.Marshal(datastore.GetAllComposites())
    	if err != nil {
    		handleError(w, r)
        	return
    	}
    	w.Write(json)
}

func handleCreate(w http.ResponseWriter, r *http.Request) {
	composite, err := datastore.CreateComposite(r.Body)
	if err != nil {
		handleError(w, r)
	}
	json, err := json.Marshal(composite)
    	if err != nil {
		handleError(w, r)
        	return
    	}
    	w.Write(json)
}

func handleDelete(w http.ResponseWriter, r *http.Request) {
	// Cheaply find the id
	up := strings.Split(r.RequestURI, "/")
	id, err := strconv.Atoi(up[len(up) - 1])
	if err != nil {
		handleError(w, r)
	}
	err = datastore.DeleteComposite(id)
	if err != nil {
		handleError(w, r)
	}
}

func handleError(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(422)
}
