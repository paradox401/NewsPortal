import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Category from "../pages/Category";
import NewsDetails from "../pages/NewsDetails";
import Search from "../pages/Search";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Wrap all pages inside MainLayout using 'element' */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
