
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import {ToastContainer} from 'react-toastify';
import Home from './pages/Home';
import Main from './components/Main';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/chat" element={<Home/>}/>
        </Routes>
        <ToastContainer  />
      </Router>
    </div>
  )
}

export default App
