const assert = require('assert')
const PouchDB = require('pouchdb')
const connect = require('../bundle/index.js')

const dbName = 'temp'
const _id = 'my book'

const counts = {
  getData: 0,
  onChangeShouldUpdate: 0,
  isInsert: 0,
  isAffected: 0,
  docs: 0
}

const expectedCounts = {
  getData: 3,
  onChangeShouldUpdate: 3,
  isInsert: 2,
  isAffected: 2,
  docs: 2
}

async function test() {
  await new PouchDB(dbName).destroy()
  const db = new PouchDB(dbName)

  class Book { 
    async getData() {
      counts.getData++
      return db.get(_id).catch(console.log)
    }
    
    async onChangeShouldUpdate(change) {
      counts.onChangeShouldUpdate++
      if (change.isInsert) counts.isInsert++
      const isAffected = change.affects({ _id })
      if (isAffected) counts.isAffected++
      return isAffected
    }
  
    render() {
      return this.data.title
    }
  
    setState() {}
  }

  const ConnectedBook = connect(db)(Book)
  const book = new ConnectedBook()
  
  const data = await db.put({ _id })
  await db.put({ _id, title: 'hello', _rev: data.rev })
  await db.put({ _id: 'another book' })

  const docs = await db.allDocs()
  counts.docs += docs.total_rows
  
  setTimeout(() => {
    console.log(counts)
    assert.deepEqual(counts, expectedCounts)
    console.log('\x1b[36m', 'Tests Passed!' ,'\x1b[0m');
  }, 100)
  
}

test().catch(console.log)


