package datastore

import (
	"github.com/HouzuoGuo/tiedot/db"
	"time"
	"log"
	"io"
	"encoding/json"
	"github.com/fatih/structs"
	"os"
)

type Member struct {
	Id int `json:"id"`
	Type string `json:"type"`
	Degrees float64 `json:"degrees"`
	Size float64 `json:"size"`
	Color string `json:"color"`
	E float64 `json:"e"`
	F float64 `json:"f"`
}

type Composite struct {
	Id int
	CreatedAt time.Time `json:omitempty`
	Members []Member `json:"members"`
	Name string `json:"name"`
	Layers []int `json:"layers"`
}

func (composite Composite) toMap() map[string]interface{} {
	return structs.Map(composite)
}

func DecodeComposite(r io.ReadCloser) (composite *Composite, err error) {
	composite = new(Composite)
	err = json.NewDecoder(r).Decode(composite)
	return
}

func CreateComposite(r io.ReadCloser) (composite *Composite, err error) {
	composite, err = DecodeComposite(r)
	if err != nil {
		return 
	}
	composites := dbConn.Use("Composites")
	composite.CreatedAt = time.Now()
	
	id, err := composites.Insert(composite.toMap())
	if err != nil {
		panic(err)
	}
	composite.Id = id

	return
}

func GetAllComposites() []Composite {
	collection := dbConn.Use("Composites")
	var composites []Composite
	
	collection.ForEachDoc(func(id int, docContent []byte) bool {
		composite := new(Composite)
		json.Unmarshal(docContent, &composite)
		composite.Id = id
		composites = append(composites, *composite)
		return true
	})

	return composites
}

func DeleteComposite(id int) error {
	collection := dbConn.Use("Composites")
	return collection.Delete(id)
}

var dbConn *db.DB
var err error

func init() {
	dbDir := os.Getenv("TANDY_TIEDOT_DIR")
	if dbDir == "" {
		log.Fatal("Please specify location of database in TANDY_TIEDOT_DIR environment variable")
	}
	log.Println("Spinning up tiedot database at", dbDir)

	dbConn, err = db.OpenDB(dbDir)
	if err != nil {
		panic(err)
	}

	setupCollections := []string{"Composites"}

	// Create collections that don't exist yet
	existingCollections := dbConn.AllCols()

	for _, collection := range (setupCollections) {
		log.Println("Checking for collection", collection, "...")
		if stringInSlice(collection, existingCollections) {
			log.Println("...exists")
		} else {
			log.Println("...creating it")
			if err := dbConn.Create(collection); err != nil {
				panic(err)
			}
		}
	}
	// TODO: could provide some statup stats -- number of records in table, or something
}

// stringInSlice checks for presence of a string in a slice
func stringInSlice(str string, list []string) bool {
 	for _, v := range list {
 		if v == str {
 			return true
 		}
 	}
 	return false
}
