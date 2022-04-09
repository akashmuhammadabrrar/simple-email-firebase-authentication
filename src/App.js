import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import { useState } from 'react';



const auth = getAuth(app)

function App() {

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [registerd, setRegisterd] = useState(false);


  const handleNameBlur = event => {
    setName(event.target.value);
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value)
  }

  const handlePassBlur = event => {
    setPassword(event.target.value)
  }

  const handleRegisterd = event => {
    setRegisterd(event.target.checked);
  }

  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
      return;
    }

    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('password should conatain at one special character');
      return;
    }

    setValidated(true);
    setError('');

    if (registerd) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.log(error)
          setError(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
          setEmail('');
          setPassword('');
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.log(error);
          setError(error.message);
        })
    }
    event.preventDefault();
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('password reset email sent');
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(() => {
        console.log('updating name')
      })
      .catch(error => {
        console.log(error);
        setError(error.message);
      })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email Verification sent');
      })
  }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className='text-info text-center p-5'>Please {registerd ? 'Login' : 'Register'} Before You Enter!</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please choose a valid Email.
            </Form.Control.Feedback>
          </Form.Group>
          {!registerd && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Your Name" required />
            <Form.Control.Feedback type="invalid">
              Please Provide Your Name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePassBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please choose a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisterd} type="checkbox" label="Already Registerd?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <Button onClick={handlePasswordReset} variant='link'>Forget Password</Button>
          <br />
          <Button variant="primary" type="submit">
            {registerd ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;