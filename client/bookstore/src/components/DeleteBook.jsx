import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteBook = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        
        const confirmed = window.confirm("Are you sure you want to delete this book?");
       
        if (confirmed) {
            
            axios.delete('http://localhost:8001/book/book/' + id)
                .then(res => {
                    if (res.data.deleted) {
                        alert("Book successfully deleted!");
                        navigate('/books');
                    }
                }).catch(err => console.log(err));
        } else {
            alert("Deletion cancelled.");
            navigate('/books');
        }
    }, [id, navigate]);

    return null; 
};

export default DeleteBook;
