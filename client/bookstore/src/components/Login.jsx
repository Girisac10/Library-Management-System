import ReCAPTCHA from 'react-google-recaptcha';
import { useState, useEffect } from 'react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { Toaster, toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = ({ setRoleVar }) => {
  const [role, setRole] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (!value) {
      setErrors({ ...errors, [name]: name === 'username' ? 'Username is required*' : 'Password is required*' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRole(value);
    if (!value) {
      setErrors({ ...errors, role: 'Role is required' });
    } else {
      setErrors({ ...errors, role: '' });
    }
  };

  const validate = () => {
    let errors = {};

    if (!formData.username) {
      errors.username = 'Username is required';
    } else {
      errors.username = '';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      errors.password = '';
    }

    if (!role || role === 'Select') {
      errors.role = 'Role is required';
    }

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
      // const timer = setTimeout(() => {
      //   setErrors({});
      // }, 4000);

      // return () => clearTimeout(timer);
    }
  }, [errors]);

  axios.defaults.withCredentials = true;
  const handleFormSubmit = () => {
    if (!formData.username || !formData.password || role === 'Select') {
      setLoginError('All fields are required');
      return;
    }

    toast.loading('Logging in...', { position: 'top-center', id: 'login-toast' });

    axios
      .post('http://localhost:8001/auth/login', { username: formData.username, password: formData.password, role, captchaToken })
      .then((res) => {
        setLoginError('');
        toast.dismiss('login-toast');
        if (res.data.login && res.data.role === 'admin') {
          setRoleVar('admin');
          navigate('/dashboard');
          toast.success('Successfully logged in as an Admin!', { position: 'top-center' });
        } else if (res.data.login && res.data.role === 'student') {
          setRoleVar('student');
          navigate('/');
          toast.success('Successfully logged in as an Student!', { position: 'top-center' });
        } else if (res.data.message) {
          // setLoginError(res.data.message);
          toast.error(res.data.message, { position: 'top-center' });
          // throw new Error(res.data.message);
        } else {
          toast.error('Something went wrong, please try again.', { position: 'top-center' });
          // throw new Error('❌');
        }
      })
      .catch((err) => {
        toast.dismiss('login-toast');
        console.log(err);
        toast.error('Login failed: Invalid credentials or account not available.', { position: 'top-center' });
        // return 'Something went wrong, please try again';
        // throw new Error('❌');
      })
      .finally(() => {
        setFormData({ username: '', password: '' });
      });
  };

  const handleCombinedSubmit = (event) => {
    event.preventDefault();
    handleSubmit(event);
    handleFormSubmit(event);
  };

  // if(formData.username&& formData.password&&formData.role){
  //   setCaptchaToken(true);
  // }else{
  //   setCaptchaToken(false);
  // }
 

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {loginError && <Alert variant="danger" onClose={() => setLoginError('')} dismissible>
          <Alert.Heading>Login Failed!</Alert.Heading>
          <p>{loginError}</p>
        </Alert>}
        <form onSubmit={handleCombinedSubmit} className="form-group">
          <div>
            <label htmlFor="username" className="container3">Username:</label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
          </div>
          <div>
            <label htmlFor="password" className="container3">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
          </div>
          <div className="form-group">
            <label className="container3" htmlFor="role">Role:</label>
            <select className="option" name="role" id="role" value={role} onChange={handleRoleChange}>
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            {errors.role && <span style={{ color: 'red' }}>{errors.role}</span>}
          </div>
          <div >
            {formData.username && formData.password && role  &&
              <ReCAPTCHA
                theme='dark'
                sitekey="6Le6bvIpAAAAAM3lOWehunXdgV1g1erjUJgN6nFw"
                onChange={(value) => setCaptchaToken(value)}
                className='recaptcha'
                
              />
            }
          </div>
          <button 
            disabled={!formData.username || !formData.password || !captchaToken} 
            className={`btn-login ${(!formData.username || !formData.password || !captchaToken ) ? 'btn-disabled' : ''}`} 
            type="submit"
          >
            Login
          </button>
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </div>
    </div>
  );
};

export default Login;
