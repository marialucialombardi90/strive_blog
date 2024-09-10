import React, { useEffect } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { loadPosts } from "./data/fetch";
import AuthContextProvider from "./context/AuthContextProvider";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./views/profile/ProfilePage";

function App() {
  useEffect(() => {
    loadPosts().then((data) => console.log(data));
  }, []);

  return (
    <AuthContextProvider>
      <Router>
        <NavBar />
        <div className="body-main">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/edit/blog/:id" element={<NewBlogPost />} />/
            <Route path="/new" element={<NewBlogPost />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/*" element={<Navigate to="/404" />} />
            {/* <Route path="/blogPosts/:id" element={<SingleBlogPost />} /> */}
            {/* <Route path="/authors" element={<AuthorList />} /> da creare */}
            {/* <Route path="/authors/:id" element={<SingleAuthor />} /> da creare */}
          </Routes>
        </div>
        <Footer />
        <Toaster position="bottom-left" reverseOrder={false} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
