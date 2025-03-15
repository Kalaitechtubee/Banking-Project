// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route
//           path="/dashboard"
//           element={
//             <>
//               <SignedIn>
//                 <Dashboard />
//               </SignedIn>
//               <SignedOut>
//                 <SignIn />
//               </SignedOut>
//             </>
//           }
//         />
//         <Route path="/sign-up" element={<SignUp />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Routes>
          {/* First Page - Authentication */}
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <div className="flex items-center justify-center w-full h-screen">
                    <SignIn />
                  </div>
                </SignedOut>
                <SignedIn>
                  <Navigate to="/home" />
                </SignedIn>
              </>
            }
          />

          {/* Home Page (Protected) */}
          <Route
            path="/home"
            element={
              <SignedIn>
                <Home />
              </SignedIn>
            }
          />

          {/* Dashboard Page (Protected) */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />

          {/* Sign-up Page - Center Aligned */}
          <Route
            path="/sign-up"
            element={
              <div className="flex items-center justify-center w-full h-screen">
                <SignUp />
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
