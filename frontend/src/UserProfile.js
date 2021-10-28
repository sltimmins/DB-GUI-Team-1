import React from "react";


class UserProfile extends React.Component {
    
    constructor(props) {
        super(props);
        this.values = React.createRef(); 
        this.state = {
            firstName: props.firstName,
            lastName: props.lastName,
            Bio: props.Bio
        }
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.Bio = props.Bio;

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            firstName: this.firstName,
            lastName: this.lastName,
            Bio: this.Bio
        });
    }

    changeFName = e => {
        this.firstName = e.target.value;
    }

    changeLName = e => {
        this.lastName = e.target.value;
    }

    changeBio = e => {
        this.Bio = e.target.Bio;
    }

    render() {
        return (
            <div>
                <nav style={navStyle} >
                    <img src="https://via.placeholder.com/200" alt="" style={image}/>
                    <h1 style={headerStyle}>{this.state.firstName + " " + this.state.lastName}</h1>
                </nav>
                <main style={{margin: "1rem 10rem", textAlign: "left"}}>      
                    <form>
                        <table style={table} style={center}>
                            <div style={row}>
                                <div style={cell}>
                                    <h4>First Name:</h4>  
                                    <input type="text" onChange={this.changeFName} style={mRight} defaultValue={this.firstName}></input>              
                                    <h4 >Last Name:</h4>
                                    <input type="text" onChange={this.changeLName} defaultValue={this.props.lastName}></input>
                                    </div>
                                    <div style={cell}>
                                        <h4>Bio:</h4>
                                        <textarea type="text" onChange={this.changeBio} style={bio} defaultValue={this.props.Bio}></textarea>
                                </div>
                            </div>
                        </table>
                    </form>
                </main>
                <footer>
                    <button id="btn" onClick={this.handleClick} style={btn}>save</button>             
                </footer>
            </div>    
        );    
    }

    
}

UserProfile.defaultProps = {
    firstName: "Paul",
    lastName: "Creenis",
    Bio: "SMASHY BROS??? I KNOW THAT GAME!!! FALCON PUNCH ARE YOU OK SHOW ME YA MOVES WOOOOOOO SMASHY BROS LETS GO PIKACHU!"
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
