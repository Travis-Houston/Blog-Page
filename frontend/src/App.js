import React from 'react';
import {BrowserRouter, Route, Routes, routes} from "react-router-dom";
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';
import BlogList from './pages/BlogList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<BlogList/>}/>
        <Route path="/write" element = {<WriteBlog/>}/>
        <Route path="/blog/:firstParam" element = {<BlogDetail/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
