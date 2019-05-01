function createFunctionFromClass(ComponentClass) {
  function FunctionalComponent() {
    return Reflect.construct(ComponentClass, arguments, this.constructor)
  }
  Reflect.setPrototypeOf(FunctionalComponent.prototype, ComponentClass.prototype)
  Reflect.setPrototypeOf(FunctionalComponent, ComponentClass)
  return FunctionalComponent
}

function getWrappedComponent(ComponentClass, db) {
  const Component = createFunctionFromClass(ComponentClass)
  function WrappedComponent() {
    Component.call(this)
    this.data = {}
    db.components.push(this)
    this.onDbChange()
  }
  WrappedComponent.prototype = new Component()
  WrappedComponent.prototype.constructor = WrappedComponent
  WrappedComponent.prototype.onDbChange = async function (change) {
    if (change && this.onChangeShouldUpdate) {
      const shouldRender = await this.onChangeShouldUpdate(change)
      if (!shouldRender) return
    }
    if (!this.getData) return
    this.data = await this.getData()
    this.setState({ state: this.state })    
  }
  return WrappedComponent
}

function decorateDb(db) {
  if (db.components) return

  db.components = []
  
  db.changes({
    since: 'now',
    live: true,
    include_docs: true
  })
  .on('change', change => {
    db.components.forEach(async component => {
      const { doc } = change 
      change.isInsert = doc._rev.substring(0, 2) === '1-'
      if (!change.isInsert) {
        const revs = await db.get(doc._id, { 
          revs_info: true,
          revs: true
        })
        const rev = revs._revs_info[1].rev
        change.previousDoc = await db.get(doc._id, { rev })
      }
      change.affects = function (selector) {
        const isAffected = Object.keys(selector).some(property => {
          const value = selector[property]
          // TODO: support for $ mango operators
          if (typeof value === 'object') return true
          if (change.doc[property] === value) return true
          if (change.previousDoc && change.previousDoc[property] === value) return true
        })
        return isAffected
      }
      component.onDbChange(change)
    })
  })
  .on('error', err => {
    console.log('changes error:', err)
  })
}

export default function connect(db) {
  decorateDb(db)
  return Component => getWrappedComponent(Component, db)
}