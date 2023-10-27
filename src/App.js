import './App.css';
import Header from './components/Header';
import DisplayData from './components/DisplayData';
import AddData from './components/AddData';
import { BrowserRouter, createBrowserRouter, Route, Router, RouterProvider, Routes} from 'react-router-dom';
function App() {
 
  const routes = createBrowserRouter([
    {
    path:"/",
    element:<DisplayData/>
    },
    {
      path:'/add',
      element:<AddData/>
    }
  ])

  return (
    
    <div className="App">
     <Header/>
     {/* <RouterProvider router={routes}/> */}
  <Routes>
    <Route path='/' element={<DisplayData/>}/>
    <Route path='/add' element={<AddData/>}/>
    </Routes>
    </div>
    
  );
}

export default App;
