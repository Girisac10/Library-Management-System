import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css';

const EditBook = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [imagefile, setImageFile] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get('http://localhost:8001/book/book/' + id)
      .then(res => {
        setName(res.data.name);
        setAuthor(res.data.author);
        setImageFile(res.data.imagefile);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 1 * 1024 * 1024; 

    if (file) {
      if (!validFormats.includes(file.type)) {
        setImageFile(null);
        toast.error('Invalid file format. Please select a JPEG, JPG, PNG, or GIF image.', { position: 'top-center' });
        e.target.value = null; 
      } else if (file.size > maxSize) {
        setImageFile(null);
        toast.error('Your file size is more than 1 MB.', { position: 'top-center' });
        e.target.value = null; 
      } else {
        setImageFile(file);
        toast.success('Valid image file selected', { position: 'top-center' });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    if (imagefile) {
      formData.append('image', imagefile); 
    }

    const editbookPromise = axios
      .put('http://localhost:8001/book/book/' + id, formData)
      .then(res => {
        if (res.data.updated) {
          navigate('/books');
          return 'Book edited successfully';
        } else {
          console.log(res);
          throw new Error('Failed to update the book');
        }
      })
      .catch(err => {
        console.log(err);
        throw new Error('An error occurred while updating the book');
      });

    toast.promise(editbookPromise, {
      loading: 'Editing...',
      success: (message) => message,
      error: (err) => err.message,
    }, {
      position: 'top-center',
    });
  };

  return (
    <div className="student-form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Edit Book</h2>
        <div className="form-group">
          <label htmlFor="book">Book Name:</label>
          <input
            type="text"
            id="book"
            name="book"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author Name:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload images link:</label>
          <input
            type="file"
            id="image"
            name="image"
            style={{ width: '310px', height: '40px' }} 
            onChange={handleFileChange} 
          />
        </div>
        <button 
          disabled={!name || !author}
          className={`btn-login ${(!name || !author) ? 'btn-disabled' : ''}`}
          type="submit">Update</button>
      </form>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default EditBook;
