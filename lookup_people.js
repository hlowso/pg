const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

const dblookup = (query) => {
  return (resolve, reject) => {
    client.connect((err) => {
      if (err) {
        return console.error("Connection Error", err);
      }
      client.query("SELECT * FROM famous_people WHERE last_name=$1", [query], (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        const rows = result.rows;
        client.end();
        resolve(rows); //output: 1
      });
    });
  };

};

function lookup() {
  console.log('Searching...');
  const query = process.argv[2];
  const p = new Promise(dblookup(query))
  .then((result) => {
    if(!result) {
      console.log('No results found.');
    }
    else {
      const row_count = result.length;
      console.log(`Found ${row_count} person(s) by the name ${query}`);
      for(let i = 0; i < row_count; i ++) {
        console.log('-', i + 1, result[i].first_name, result[i].last_name, ', born', formatDate(result[i].birthdate));
      }
    }
  });
}

lookup();