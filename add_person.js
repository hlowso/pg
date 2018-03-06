const settings = require("./settings"); // settings.json
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: settings.hostname,
    user: settings.user,
    password: settings.password,
    database: settings.database
  }
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

const knexLookup = (query) => {
  console.log('Searching...');
  knex.select()
  .from('famous_people')
  .where({
    last_name: query
  })
  .then((result) => {
    knex.destroy();
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
};

const knexInsert = (first, last, date) => {
  console.log('Adding new person...');
  knex('famous_people').insert({
    first_name: first,
    last_name: last,
    birthdate: date
  })
  .then(() => {
    knex.destroy();
    console.log('Insert complete.');
  });
};
  
knexInsert('Randy', 'Marsh', new Date());
// knexLookup('Marsh');


