// import React from 'react'
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


// const BookCard = ({book, role}) => {
//     const {name, author, imageUrl} = book;
//   return (
//     <div className='book-card'>
//         <img src={imageUrl} alt={name} className='book-image'/>
//         <div className="book-details">
//             <h3>{name}</h3>
//             <p>{author}</p>
//         </div>
//         {role === "admin" &&
//         <div className="book-actions">
//         <Link to={`/book/${book._id}`} className='btn-edit bg-primary'>Edit</Link>
//         <Link to={`/delete/${book._id}`} className='btn-del bg-danger'>Delete</Link>
//     </div>}
        
//     </div>
//   )
// }

// export default BookCard


import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const BASE_URL = 'http://localhost:8001/'; 

const BookCard = ({ book, role }) => {
  const { name, author, imageUrl } = book;
  const fullImageUrl = `${BASE_URL}${imageUrl}`; 

  return (
    <div className='book-card'>
      <img src={fullImageUrl} alt={name} className='book-image' />
      <div className="book-details">
        <h3>{name}</h3>
        <p>{author}</p>
      </div>
      {role === "admin" &&
        <div className="book-actions">
          <Link to={`/book/${book._id}`} className='btn-edit bg-primary'>Edit</Link>
          <Link to={`/delete/${book._id}`} className='btn-del bg-danger'>Delete</Link>
        </div>
      }
    </div>
  );
};

export default BookCard;
