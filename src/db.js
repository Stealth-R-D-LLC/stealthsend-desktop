import Datastore from 'nedb';

const db = new Datastore({ filename: 'records.json', autoload: true });

export default db;