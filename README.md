numcap-regions
==============
Phone numbers of all operators in Russian Federation with regions codes

CLI tool for make JSON data file from npm **numcap** and **russian-codes**

Install
=======
> npm install numcap-regions -g


Usage
=====

### Prepare JSON file

> nrcli -m

### Load JSON file to MongoDB

> nrcli -j   // use default settings

> nrcli -j [--host] [--port] [--database] [--collection]

### Help

> nrcli --help

Data
====

### Sample data

`````
[ 
 .... 
  {
    "code": "301",
    "begin": "2100000",
    "end": "2109999",
    "capacity": "10000",
    "operator": "АСВТ(Москва)",
    "region": {
      "title": "Республика Бурятия",
      "code": "03",
      "county": "5"
    }
  },
 ....
]

`````


### import to mongo

> mongoimport -h host:port -d number-archer -c regions --file capacityregions.json --jsonArray

