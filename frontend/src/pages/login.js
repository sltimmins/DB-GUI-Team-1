import React, { useState } from "react";

export function Login(props) {
  const [values, setValues] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <div className="text-center">
        <h1>Login</h1>
      </div>
      {props.banner}
      <div className="form-group mb-3">
        <label htmlFor="username">Username</label>
        <input name="username" onChange={handleInputChange} value={values.username} type="text" className="form-control input-lg" id="username" placeholder="Enter username" />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password">Password</label>
        <input name="password" onChange={handleInputChange} value={values.password} type="password" className="form-control input-lg" id="password" placeholder="Password" />
      </div>
      <div className="text-center">
        <button type="button" onClick={() => {props.doLogin(values.username, values.password)}} className="btn btn-primary mx-auto">Submit</button>
      </div>
      <div className="mt-3 text-center">
        <p>
          Not a member?{" "}
          <a className="text-primary" onClick={() => props.toggleRegisterMode()}>Register</a>
        </p>
      </div>
    </>
  );
}
