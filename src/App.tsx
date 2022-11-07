import "quill/dist/quill.snow.css"; // Add css for snow theme
import { Header } from "components";
import { Outlet, Route, Routes } from "react-router-dom";
import { HomeView } from "views/Home";
import { CreatePost } from "views/CreatePost";

export const App = () => (
  <div>
    <Header />

    <div className="layout-container">
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index path="home" element={<HomeView />} />
          <Route path="create" element={<CreatePost />} />
        </Route>
      </Routes>
    </div>
  </div>
);
