# pouchdb-connect

PouchDB Connect for React

### Install

```
npm i pouchdb-connect
```

### Usage

```js
import React, { Component } from 'react'
import connect from 'pouchdb-connect'
import Book from './Book'
import { getBook } from './bookService'

class BookContainer extends Component { 
  
  // getData() sets this.data if onChangeShouldUpdate returns true
  getData = async () => ({
    book: await getCount()
  })
  
  // determines if the change requires a re-render
  onChangeShouldUpdate = async change => {
    if (change.isInsert) return true
    if (change.affects({ type: 'book' })) return true
    return false
  }

  render() {
    return <Book book={this.data.book} />
  }
}

export default connect(BookContainer)
```

