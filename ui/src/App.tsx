import './App.css';
import HomePage from './pages/HomePage/HomePage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Header from './components/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
