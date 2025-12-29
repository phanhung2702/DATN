import ProtectedRoute from './components/auth/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* homepage inside main layout */}
          <Route element={<ProtectedRoute />}>  
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
