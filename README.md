# pouchdb-connect

PouchDB Connect for React

### Install

```
npm i pouchdb-connect
```

### Usage

```js
import React, { Component } from 'react'
import PouchDB from 'pouchdb'
import connect from 'pouchdb-connect'

const db = new PouchDB('books')

class Book extends Component { 
  // get the lastest revision of the book
  getData = async () => db.get(this.props.id)
  
  // re-render when the book is modified
  onChangeShouldUpdate = async event => {
    const { _id } = this.data
    return !!event.affects({ _id }))
  }

  render() {
    return <div>{this.data.title}</div>
  }
}

export default connect(db)(Book)
```

```jsx
<Book id={123} />
```
