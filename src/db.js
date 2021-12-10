import * as localforage from 'localforage';

const db = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: 'records',
});

export default db;
