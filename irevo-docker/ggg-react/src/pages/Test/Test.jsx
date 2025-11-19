import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Test() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/users')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('エラー:', error);
            });
    }, []);

    return (
        <div>
            <h1>企業情報リスト</h1>
            <ul>
                {console.log(items)}
                {items.map(item => (
                    <li key={item.id}>{item.c_name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Test;