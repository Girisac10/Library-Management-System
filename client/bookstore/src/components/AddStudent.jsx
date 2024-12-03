import React, { useState, useEffect } from 'react'
import axios from 'axios'
import  {useNavigate} from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';


const AddStudent = () => {
    const [roll, setRoll] = useState('')
    const [username, setUsername] = useState('')
    const [grade, setGrade] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({roll: '', username: '', grade: '', password: '' });
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
	    const { name, value } = e.target;
	    setFormData({
	      ...formData,
	      [name]: value,
	    });
    };
    
    const validate = () => {
	    let errors = {};
	    
	    if (!formData.roll) {
	      errors.roll = 'Roll No is required';
	    }
	    else
	    errors.roll = '';
	
	    if (!formData.username) {
	      errors.username = 'Username is required';
	    }
	    else
	    errors.username = '';
	    
	    if (!formData.grade) {
	      errors.grade = 'Grade is required';
	    }
	    else
	    errors.grade = '';
	  
	  if (!formData.password) {
	    errors.password = 'Password is required';
	  }
	  else
	  errors.password = '';
	
	    return errors;
    };
    
    const handleSubmit = (e) => {
	    e.preventDefault();
	    const validationErrors = validate();
	    if (Object.keys(validationErrors).length > 0) {
	      setErrors(validationErrors);
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


    const handleFormSubmit = (e) => {
        //e.preventDefault()
        const addstudentPromise = axios
        .post('http://localhost:8001/student/register', {roll, username, password, grade})
        .then(res => { 
            if(res.data.registered) {
                navigate('/dashboard')
                return 'Student added successfully'
            }
            console.log(res)
        })
        .catch(err => console.log(err))

        toast.promise(addstudentPromise, {
          loading: 'Adding...',
          success: (message) => message,
          error: (err) => err.message,
        }, {
          position: 'top-center',
        });
    }
      
      const handleCombinedSubmit = (event) => {
	     event.preventDefault();
	    handleSubmit(event);
	    handleFormSubmit(event);
      };

  return (
    <div className="student-form-container">
      <form onSubmit={handleCombinedSubmit} className="student-form">
        <h2>Add Student</h2>
        <div className="form-group">
          <label htmlFor="roll">Roll No:</label>
          <input 
            type="text"
            placeholder="Enter Roll No" 
            id="roll" 
            name="roll" 
            value={formData.roll}
            onChange={(e) => { setRoll(e.target.value); handleChange(e); }}
          />
          {errors.roll && <span style={{ color: 'red' }}>{errors.roll}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="username">User Name:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Enter User Name"
            value={formData.username}
            onChange={(e) => { setUsername(e.target.value); handleChange(e); }}
          />
          {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="grade">Grade:</label>
          <input 
            type="text" 
            id="grade" 
            name="grade" 
            placeholder="Enter Grade"
            value={formData.grade}
            onChange={(e) => { setGrade(e.target.value); handleChange(e); }}
          />
          {errors.grade && <span style={{ color: 'red' }}>{errors.grade}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
             type="password"
             name="password"
             placeholder="Enter Password"
             value={formData.password}
             onChange={(e) => { setPassword(e.target.value); handleChange(e); }}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <button 
            disabled={!formData.roll || !formData.username || !formData.grade || !formData.password} 
            className={`btn-login ${(!formData.roll || !formData.username || !formData.grade || !formData.password) ? 'btn-disabled' : ''}`} 
            type="submit"
        > 
          Register
        </button>
      </form>
      <Toaster
          position="top-center"
          reverseOrder={false}
      />
    </div>
  )
}

export default AddStudent
