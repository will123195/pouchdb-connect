# pouchdb-connect

PouchDB Connect for React

## Features

- Global state for your React app stored in PouchDB
- Listens for database changes and re-renders "connected" components
- Not Redux: no reducers, no immutable store, no dispatching actions, no middleware
- No dependencies

## Install

```
npm i pouchdb-connect
```

## Usage

```js
import React, { Component } from 'react'
import PouchDB from 'pouchdb'
import connect from 'pouchdb-connect'

const db = new PouchDB('books')

class Book extends Component { 
  // get the lastest revision of the book
  getData = async () => db.get(this.props.id)
  
  // re-render when the book is modified
  onChangeShouldUpdate = async change => {
    const { _id } = this.data
    return !!change.affects({ _id }))
  }

  render() {
    return <div>{this.data.title}</div>
  }
}

// make this a "connected" component
export default connect(db)(Book)
```

```jsx
<Book id={123} />
```

## API

### `getData()`

This async function's return value is assigned to `this.data`. 

### `onChangeShouldUpdate( change )`

This async function is called after every change to the db. If the function returns `true`, then the component will call `getData()` then `render()`.

- `change` {object} - the db change event

    - `change.isInsert` {boolean} indicates if a new document was just created
    - `change.affects(selector)` {boolean} indicates if the db change would affect the results of the specified [mango query selector](https://pouchdb.com/guides/mango-queries.html#query-language)