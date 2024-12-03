import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBook = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [imagefile, setImageFile] = useState(null); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null); 

  const [formData, setFormData] = useState({ name: '', author: '', imagefile: null });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
  });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 1 * 1024 * 1024; 

    if (file) {
      if (allowedFormats.includes(file.type)) {
        if (file.size <= maxSize) {
          setImageFile(file);
          setFormData({
            ...formData,
            imagefile: file,
          });
          setErrors({ ...errors, imagefile: '' }); 
        } else {
          setImageFile(null);
          toast.error('Your file size is more than 1 MB.', { position: 'top-center' });
          setFormData({
            ...formData,
            imagefile: null,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } else {
        setImageFile(null);
        toast.error('Invalid file format. Allowed formats: jpeg, jpg, png, gif.', { position: 'top-center' });
        setFormData({
          ...formData,
          imagefile: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const validate = () => {
    let errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
    } else {
      errors.name = '';
    }

    if (!formData.author) {
      errors.author = 'Author is required';
    } else {
      errors.author = '';
    }

    if (!formData.imagefile) {
      errors.imagefile = 'Image file is required';
    } else {
      errors.imagefile = '';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleFormSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('image', imagefile);

    const addbookPromise = axios
      .post('http://localhost:8001/book/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data.added) {
          navigate('/books');
          return 'Book added successfully';
        } else {
          throw new Error('Failed to add the book.');
        }
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(addbookPromise, {
      loading: 'Adding...',
      success: (message) => message,
      error: (err) => err.message || 'An error occurred while adding the book.',
    }, {
      position: 'top-center',
    });
  };

  const handleCombinedSubmit = (event) => {
    event.preventDefault();
    handleSubmit(event);
    handleFormSubmit();
  };

  return (
    <div className="student-form-container">
      <form onSubmit={handleCombinedSubmit} className="student-form">
        <h2>Add Book</h2>
        <div className="form-group">
          <label htmlFor="book">Book Name:</label>
          <input
            type="text"
            id="book"
            name="name"
            placeholder="Enter Book Name"
            value={formData.name}
            onChange={(e) => { setName(e.target.value); handleChange(e); }}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="author">Author Name:</label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="Enter Author"
            value={formData.author}
            onChange={(e) => { setAuthor(e.target.value); handleChange(e); }}
          />
          {errors.author && <span style={{ color: 'red' }}>{errors.author}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload images link:</label>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef} 
            style={{ width: '310px', height: '40px' }} 
            onChange={handleFileChange} 
          />
          {errors.imagefile && <span style={{ color: 'red' }}>{errors.imagefile}</span>}
        </div>
        <button
          disabled={!formData.name || !formData.author || !formData.imagefile}
          className={`btn-login ${(!formData.name || !formData.author || !formData.imagefile) ? 'btn-disabled' : ''}`}
          type="submit"
        >
          Add
        </button>
      </form>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default AddBook;
