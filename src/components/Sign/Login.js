import "./SignUtils/CSS/Sign.css"
import "./SignUtils/CSS/style.css.map"
import "./SignUtils/fonts/material-icon/css/material-design-iconic-font.min.css"
import signinimage from "./SignUtils/images/signin-image.jpg"
import { useState} from 'react';
import { Link } from 'react-router-dom';
import Nav_bar from "../Navbar/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { authService } from "../../services/api";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const loginSuccess = () => toast.success("Login Success",{
        // position: toast.POSITION.TOP_CENTER,
        className: "toast-message",
    });
    const loginFailed = (message) => toast.error(message || `Invalid Details or User Doesn't exist`,{
        // position: toast.POSITION.TOP_CENTER,
        className: "toast-message",
    });

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const userData = response.data;
            
            // Save token and user data to localStorage
            localStorage.setItem('token', userData.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            loginSuccess();
            setTimeout(() => {
                navigate('/User', { state: { voterst: userData } });
            }, 2000);
        } 
        catch (error) {
            console.error('Login failed:', error);
            loginFailed(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
            <Nav_bar />
            <section className="sign-in">
                <div className="container">
                <p>Use user@gmail.com as email and 123 as password</p>


                    <div className="signin-content">
                    
                        <div className="signin-image">
                            <figure><img src={signinimage} alt="sing up image" /></figure>
                            <Link to="/Signup" className="signup-image-link">Create an account</Link>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Sign In</h2>
                            {/* <form method="" className="register-form" id="login-form"> */}
                            <ToastContainer />
                                <div className="form-group">
                                    <label for="email"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input type="email" name="email" id="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label for="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input type="password" name="pass" id="pass" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group form-button">
                                    <button onClick={handleLogin} disabled={loading}>{loading ? <div className="spinner"></div> : 'Login'}</button>
                                    
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </section>

        </div>

    )
}
export default Login;