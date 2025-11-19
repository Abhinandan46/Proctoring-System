import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateTest from './pages/CreateTest';
import ManageTests from './pages/ManageTests';
import Candidates from './pages/Candidates';
import Results from './pages/Results';
import CandidateDashboard from './pages/CandidateDashboard';
import TestAttempt from './pages/TestAttempt';
import ResultSummary from './pages/ResultSummary';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/manage-tests" element={<ManageTests />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/results" element={<Results />} />
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/test/:id" element={<TestAttempt />} />
          <Route path="/result-summary/:id" element={<ResultSummary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;