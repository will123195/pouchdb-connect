# pouchdb-connect

PouchDB Connect for React

[![Build Status](https://travis-ci.org/will123195/pouchdb-connect.svg?branch=master)](https://travis-ci.org/will123195/pouchdb-connect)

## Features

- Global state for your React app stored in PouchDB
- No dependencies
- Not Redux! No provider, no reducers, no immutable store, no dispatching actions, no middleware, async-friendly

## Install

```
npm i pouchdb-connect
```

## Usage

```js
import React from 'react'
import PouchDB from 'pouchdb'
import connect from 'pouchdb-connect'

const db = new PouchDB('books')
const withDb = connect(db)

function Book({ id, title, price }) { 
  return <div>{title} {price}</div>
}

// get the book from the db
async function getData({ id }) {
  return db.get(id).catch(console.log)
}

// re-render only when this specific book has been modified
function shouldUpdate(changeEvent, { id }) {
  return changeEvent.affects({ _id: id })
}

export default withDb(getData, shouldUpdate)(Book)
```

```jsx
<Book id='1' />
```

## API

## `connect( db )( getData, shouldUpdate )( MyComponent )`

Creates a [higher-order component](https://reactjs.org/docs/higher-order-components.html) that subscribes your component to db changes and conditionally re-renders the component.

### `db`

The PouchDB object

### `getData( props )`

This async function must return an object which will be assigned into the component's `props` to re-render the component. 

- `props` {object} - the current `props` of the component

### `shouldUpdate( changeEvent, props )`

This function is called after every change to the db. If the function returns `true`, then the component will call `getData()`, assign the data to `props`, then re-render.

- `changeEvent` {object} - the PouchDB change event which is decorated with a few helpful properties:

    - `changeEvent.isInsert` {boolean} indicates if a new document was just created
    - `changeEvent.affects( selector )` {function} returns a boolean to indicate if the db change has affected the results of the given selector 
        - `selector` {object} see [mango query selectors](https://pouchdb.com/guides/mango-queries.html#query-language)

- `props` {object} - the current `props` of the component

### `MyComponent`

Any React Component


## You may also like

- [react-pouchdb](https://github.com/ArnoSaine/react-pouchdb)