import React from 'react'

function UserProfile(props) {
    return (
        <div>
            <nav style={navStyle} >
                <img src="https://via.placeholder.com/200" alt="" style={image}/>
                <h1 style={headerStyle}>{props.firstName + " " + props.lastName}</h1>
            </nav>
            <main>
                <h3>Bio:</h3>
                <p>{props.bio}</p>
            </main>
            <footer>
                <button style={btn}>save</button>
            </footer>
        </div>
    )
}

document.querySelectorAll('p').forEach(e => {
    e.style.border = ".1rem solid black";
    e.style.padding = "2rem 2rem"
});

document.querySelectorAll('main').forEach(e => {
    e.style.margin = "1rem 5rem";
   e.style.textAlign = "left";
});

UserProfile.defaultProps = {
    firstName: "Paul",
    lastName: "Creenis",
    bio: "SMASHY BROS??? I KNOW THAT GAME!!! FALCON PUNCH ARE YOU OK SHOW ME YA MOVES WOOOOOOO SMASHY BROS LETS GO PIKACHU!"
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
