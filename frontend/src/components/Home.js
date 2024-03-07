import React from "react";
import { Route, Routes } from "react-router-dom";

import Feed from "./Feed.js";
import Shop from "./Shop.js";
import Navigation from "./Navigation.js";

import { useAuth } from "./AuthContext";

const Home = () => {
  const { userName } = useAuth();

  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </div>
  );
};

export default Home;
