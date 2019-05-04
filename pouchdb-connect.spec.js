import React from 'react'
import PouchDB from 'pouchdb'
import { mount } from 'enzyme'
import connect from './pouchdb-connect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'

configure({ adapter: new Adapter() })

describe('pouchdb-connect', function () {
  let db, withDb, ConnectedBook

  const id = '1'
  const title = 'Ready Player One'
  const price = 19.99
  
  function Book({ title, price }) { 
    return <>
      <i className='title'>{title}</i> 
      <i className='price'>{price}</i>
    </>
  }
  
  async function getData({ id }) {
    return db.get(id)
      .then(data => {
        console.log('data:', data)
        return data
      })
      .catch(console.log)
  }
  
  function shouldUpdate(changeEvent, props) {
    const isAffected = changeEvent.affects({ _id: props.id })
    console.log({ isAffected })
    return isAffected
  }

  beforeEach(async () => {
    await new PouchDB('test').destroy()
    db = new PouchDB('test')
    withDb = connect(db)
    ConnectedBook = withDb(getData, shouldUpdate)(Book)
  })

  xit('should render title before document exists', function () {
    const wrapper = mount(<ConnectedBook id={id} />)
    expect(wrapper.html()).toBe('<i class="title"></i><i class="price"></i>')
    wrapper.unmount()
  })

  it('should update price', async function () {
    let wrapper
    act(async () => {
      await db.put({ _id: id, title, price })
      wrapper = mount(<ConnectedBook id={id} />)
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.find('.price')).toBe(19.99)
    wrapper.unmount()
  })
})