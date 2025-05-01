
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import {ToastContainer} from 'react-toastify';
import Home from './components/Home';
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
