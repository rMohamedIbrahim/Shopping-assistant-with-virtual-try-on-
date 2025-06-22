  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { Suspense, lazy } from 'react';
  import { AuthProvider } from './context/AuthContext';


  import { ThemeProvider } from './context/ThemeContext';
  import { AvatarProvider } from './context/AvatarContext';
  import Header from './components/layout/Header';
  import Sidebar from './components/layout/Sidebar';
  import Footer from './components/layout/Footer';
  import Loader from './components/ui/Loader';

  // Lazy load pages for better performance
  const Home = lazy(() => import('./pages/Home'));
  const Gallery = lazy(() => import('./pages/Gallery'));
  const Profile = lazy(() => import('./pages/Profile'));
  const AvatarGenerator = lazy(() => import('./pages/AvatarGenerator'));
  const TryOn = lazy(() => import('./pages/TryOn'));
  const Settings = lazy(() => import('./pages/Settings'));
  const SignIn = lazy(() => import('./components/forms/SignInForm'));
  const SignUp = lazy(() => import('./components/forms/SignUpForm'));

  function App() {
    return (
      <AuthProvider>
        <ThemeProvider>
          <AvatarProvider>
            <Router>
              <div className="app-container">
                <Header />
                <div className="content-wrapper">
                  <Sidebar />
                  <main className="main-content">
                    <Suspense fallback={<Loader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/generator" element={<AvatarGenerator />} />
                        <Route path="/try-on" element={<TryOn />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
                <Footer />
              </div>
            </Router>
          </AvatarProvider>
        </ThemeProvider>
      </AuthProvider>
    );
  }

  export default App;