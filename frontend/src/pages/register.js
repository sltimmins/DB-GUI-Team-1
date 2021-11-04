import React, { useState } from "react";

export function Register(props) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    user_type: "Candidate",
    party: "Republican",
    bio: "",
    profilePic: {}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleImageChange = (e) => {
    let reader = new FileReader();
    let inFile = e.target.files[0];
    reader.onload = () => {
      values.profilePic = inFile;
    };
    reader.readAsDataURL(inFile);
  }

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
          <option value="Prefer Not to Say">Prefer Not to Say</option>
        </select>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="bio">Bio</label>
        <textarea className="form-control" name="bio" id="bio" value={values.bio} onChange={handleInputChange} rows="3"/>
      </div>
      <div className="form-group mb-3">
        <label htmlFor="profilePic">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="form-control" id="profilePic"/>
      </div>
      <div className="col-12 text-center">
        <button type="button" onClick={() => props.doRegister(values.firstName, values.lastName, values.username, values.password, values.email, values.user_type, values.party, values.bio, values.profilePic)} className="btn btn-primary mx-auto" >Submit</button>
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
