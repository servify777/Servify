import './static/output.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import Navbar from './Navbar';
import Offer from './Offer';
import Home from './Home';
import PI from './PI';
import Settings from './Settings';
import About from './About';
import About_Page from './About_Page';
import Help from './Help';
import Auction from './Auction';
import Search from './Search';
import AddProject from './AddProject';
import './static/input.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/' index={true} element={<><Offer /> <Navbar /><Home /> </>} />
          <Route path='/personal-informations' element={<><PI /></>} />
          <Route path='/settings' element={<><Settings /></>} />
          <Route path='/about' element={<><Offer /><Navbar /><About_Page /><About /></>} />
          <Route path='/help' element={<Help />}/>
          <Route path='/auctions' element={<><Offer /><Navbar /><Auction /><About /></>} />
          <Route path='/search/:searchterm' element={<><Offer /><Navbar /><Search /><About /></>} />
          <Route path='/add' element={<><Offer /> <Navbar /> <AddProject /> <About /></>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
