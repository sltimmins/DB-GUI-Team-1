import axios from 'axios';
import { AppContext } from '../AppContext'
import React, { useContext, useState, useEffect } from 'react';
import '../styles/favorites.css';

export default function Favorite ({ isFav, candidateId }) {
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

    const deleteFav = () => {
        axios.delete(baseURL + '/favorites/candidates/', { data: { accountNumber: user.accountNumber, candidateID: candidateId } }).then((res) => {
            setFav(!fav);
        })
    }

    return  <button type="button" className="heart btn" onClick={() => {
                    if(!fav) {
                        addFav()
                    } else {
                        deleteFav()
                    }}}>
                        {fav}
                <i className={fav ? 'full_heart' : 'empty_heart'}/>
            </button>
}