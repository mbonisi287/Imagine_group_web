/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
   const isActive = location.pathname === path;
  return (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={icon}
      rootStyles={{
        color: path === location.pathname && "#6870fa",
        background: isActive ? "#ffffff" : "transparent",
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
