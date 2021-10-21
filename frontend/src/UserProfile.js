import React from 'react';


class UserProfile extends React.Component {

    render() {
        return (
            <div>
                <nav style={navStyle} >
                    <img src="https://via.placeholder.com/200" alt="" style={image}/>
                    <h1 style={headerStyle}>{this.props.firstName + " " + this.props.lastName}</h1>
                </nav>
                <main style={{margin: "1rem 10rem", textAlign: "left"}}>      
                    <form>
                        <table style={table} style={center}>
                            <div style={row}>
                                <div style={cell}>
                                    <h4>First Name:</h4>  
                                    <input type="text" id="fName" style={mRight} defaultValue={this.props.firstName}></input>              
                                    <h4 >Last Name:</h4>
                                    <input type="text" id="lName" defaultValue={this.props.lastName}></input>
                                </div>
                                <div style={cell}>
                                    <h4>Bio:</h4>
                                    <input type="text" style={bio} id="bio" defaultValue={this.props.bio}></input>
                                </div>
                            </div>
                        </table>
                    </form>
                </main>
                <footer>
                    <button id="btn" onClick="save" style={btn}>save</button>
                    
                </footer>
            </div>
            
        );

    }

    save() {
        this.props.firstName = document.getElementById("fName").value;
        this.props.lastName = document.getElementById("lName").value;
        this.props.bio = document.getElementById("bio").value;
    }
}

UserProfile.defaultProps = {
    firstName: "Paul",
    lastName: "Creenis",
    bio: "SMASHY BROS??? I KNOW THAT GAME!!! FALCON PUNCH ARE YOU OK SHOW ME YA MOVES WOOOOOOO SMASHY BROS LETS GO PIKACHU!"
}

const table = {
    display: "table"
}

const row = {
    display: "table-row"
}

const cell = {
    marginLeft: "10rem",
    display: "table-cell"
}

const center = {
    marginLeft: "auto",
    marginRight: "auto"
}

const bio  = {
    marginRight: "10rem",
    width: "30rem", 
    height: "8rem"
}

const mRight = {
    marginRight: "1rem",
}

const image = {
    borderRadius: "50%",
    margin: "2rem",
}

const btn = {
    padding: ".5rem .7rem",
    margin: "1rem"
}

const navStyle = {
    backgroundColor: "#3498db",
    padding: "1rem",
}

const headerStyle = {
    margin: "1rem 1rem",
    bottom: "10rem",
    color: "white"
}

export default UserProfile
