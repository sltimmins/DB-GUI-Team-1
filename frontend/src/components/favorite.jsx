import axios from 'axios';
import { AppContext } from '../AppContext'
import React, { useContext } from 'react';
import '../styles/favorites.css';

export default function Favorite ({ isFav, candidateId }) {

    const { baseURL, user } = useContext(AppContext);

    const addFav = () => {
        console.log("maybe?")
        axios.post(baseURL + '/favorites/candidates', { params: { accountNumber: user.accountNumber, candidateId: candidateId } }).then((res) => {
            isFav = true;
        })
    }

    return  <button type="button" className="heart btn" onClick={() => addFav}>
                <i className={isFav ? 'full_heart' : 'empty_heart'}/>
            </button>
}