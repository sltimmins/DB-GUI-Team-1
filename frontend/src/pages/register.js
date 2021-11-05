import React, { useState } from "react";
import mapboxgl from "mapbox-gl";

export function Register(props) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    user_type: "Candidate",
    party: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <div className="col-12 mb-3 text-center">
        <h1>Register</h1>
      </div>
      {props.banner}
      <div className="form-group mb-3">
        <label htmlFor="firstName">First Name</label>
        <input name="firstName" value={values.firstName} onChange={handleInputChange} type="text" className="form-control" id="firstName" placeholder="Enter first name" required/>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="lastName">Last Name</label>
        <input name="lastName" value={values.lastName} onChange={handleInputChange} type="text" className="form-control" id="lastName" placeholder="Enter last name" />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="email">Email Address</label>
        <input name="email" value={values.email} onChange={handleInputChange} type="text" className="form-control" id="email" placeholder="Enter email" />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="username">Username</label>
        <input name="username" value={values.username} onChange={handleInputChange} type="text" className="form-control" id="username" placeholder="Enter username" />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password">Password</label>
        <input name="password" value={values.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="user_type">I am a...</label>
        <select className="form-select" name="user_type" value={values.user_type} onChange={handleInputChange} >
          <option value="Candidate">Candidate</option>
          <option value="Enthusiast">Enthusiast</option>
        </select>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="party">I am a...</label>
        <select className="form-select" name="party" value={values.party} onChange={handleInputChange} >
          <option value="Republican">Republican</option>
          <option value="Independent">Independent</option>
          <option value="Democrat">Democrat</option>
        </select>
      </div>
      <div className="col-12 text-center">
        <button type="button" onClick={() => props.doRegister(values.firstName, values.lastName, values.username, values.password, values.email, values.user_type, values.party)} className="btn btn-primary mx-auto" >Submit</button>
      </div>
      <div className="col-12 mt-3 text-center">
        <p>
          Back to login?{" "}
          <a className="text-primary" onClick={() => props.toggleRegisterMode()}>Login</a>
        </p>
      </div>
    </>
  );
}
