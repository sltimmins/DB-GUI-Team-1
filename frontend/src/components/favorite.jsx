import axios from 'axios';
import { AppContext } from '../AppContext'
import React, { useContext, useState, useEffect } from 'react';
import '../styles/favorites.css';

export default function Favorite ({ isFav, candidateId }) {
    console.log(isFav, candidateId);
    const { baseURL, user } = useContext(AppContext);
    const [fav, setFav] = useState(undefined);

    useEffect(() => {
        setFav(isFav);
    }, [])

    const addFav = () => {
        console.log(user.accountNumber)
        console.log(candidateId)
        axios.post(baseURL + '/favorites/candidates', { accountNumber: user.accountNumber, candidateId: candidateId }).then((res) => {
            setFav(!fav);
        })
    }

    return  <button type="button" className="heart btn" onClick={() => addFav()}>
                <i className={fav ? 'full_heart' : 'empty_heart'}/>
            </button>
}