package server

import (
	"net/http"
	"log"
	"github.com/castiron/tandygram-backend/datastore"
	"encoding/json"
)

func Serve() {
	http.HandleFunc("/api/composites", handleComposites)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleComposites(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	// Stop here if its Preflighted OPTIONS request
	if r.Method == "OPTIONS" {
		return
	}

	if(r.Method == "GET") {
		handleIndex(w, r)
	} else if(r.Method == "POST") {
		handleCreate(w, r)
	} else {
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

func handleError(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(422)
}
