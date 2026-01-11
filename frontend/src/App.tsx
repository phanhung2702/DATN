import ProtectedRoute from './components/auth/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import { Toaster } from 'sonner'
import AdminUploadPage from './pages/admin/AdminUploadPage'
import AdminLibrary from './pages/admin/AdminLibrary'
import SearchPage from './pages/user/SearchPage'
import ThemeInit from './components/ThemInit'   // 👈 thêm dòng này
import { useEffect } from 'react';
import { useThemeStore } from './stores/useThemeStore';
import LibraryPage from './pages/user/LibraryPage'
import CreatePlaylistPage from './pages/user/CreatePlaylistPage'
import FavoritePage from './pages/user/FavoritePage'
import UsersPage from './pages/admin/AdminUserPage'

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <>
      <ThemeInit /> {/* 👈 QUAN TRỌNG */}
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />

            <Route
              path="/search"
              element={
                <MainLayout>
                  <SearchPage />
                </MainLayout>
              }
            />

            <Route
  path="/library"
  element={
    <MainLayout>
      <LibraryPage />
    </MainLayout>
  }
/>
<Route
  path="/playlist/create"
  element={
    <MainLayout>
      <CreatePlaylistPage />
    </MainLayout>
  }
/>

<Route
  path="/liked"
  element={
    <MainLayout>
      <FavoritePage />
    </MainLayout>
  }
/>


            {/* admin */}
            <Route
              path="/admin/"
              element={
                <AdminLayout>
                  <AdminUploadPage />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/library"
              element={
                <AdminLayout>
                  <AdminLibrary />
                </AdminLayout>
              }
            />

              <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <UsersPage />
                </AdminLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
