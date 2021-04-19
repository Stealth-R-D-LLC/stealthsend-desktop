import Datastore from 'nedb-promise';

const db = new Datastore({ filename: 'records.json', autoload: true });

export default db;
