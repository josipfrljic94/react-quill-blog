import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { Header, PostCard, withRichForm } from "components";

const formInputs = [
  {
    name: "title",
    type: "text",
  },
  {
    name: "description",
    type: "text",
  },
];

const RichForm = () =>
  withRichForm("http://localhost:8000/api/posts", formInputs)();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <h1>404 Not found</h1>,
//     children: [
//       {
//         path: "create",
//         element: <RichForm />,
//       },
//     ],
//     // children: [
//     //   {
//     //     path: "/home",
//     //     element: <h1>Home</h1>,
//     //   },
//     //   {
//     //     path: "/create",
//     //     element: <RichForm />,
//     //   },
//     // ],
//   },
// ]);

root.render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
