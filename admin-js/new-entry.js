// modules/NavLink.js
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  formSubmit(e) {
    console.log(e.currentTarget.action)
    e.preventDefault()
    fetch(e.currentTarget.action, {
      method: "POST",
      body: new FormData(e.currentTarget)
    }).then(res=>res.json()).then(res=>{
      swal("Good job!", res.message, res.status)
      console.log(res)
    })
  },
  render() {
    return (
      <div className="content-upper">
        <h1 className="page-header">Create New Entry</h1>
        <form onSubmit={this.formSubmit} action="http://localhost:3002/createEvent">
          <input name="city" className="form-control" type="text" placeholder="City" />
          <input name="majorEvent" className="form-control" type="checkbox" />
          <input name="title" className="form-control" type="text" placeholder="Title" />
          <input name="link" className="form-control" type="text" placeholder="Official Announcement Link" />
          <input name="begin" className="form-control" type="text" placeholder="Date begin" />
          <input name="end" className="form-control" type="text" placeholder="Date end" />
          <textarea name="address" className="form-control" type="text" placeholder="Address" />
          <input name="map" className="form-control" type="text" placeholder="Google Maps Link" />
          <textarea name="description" className="form-control" type="text" placeholder="Description" />
          <input type="submit" />
        </form>
      </div>
      );
  }
})
