import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <Link to="/">Home/</Link>
      <Link to="/login">Login/</Link>
      <Link to="/dashboard">Dashboard/</Link>
      <Link to="/survey">Survey/</Link>
      <Link to="/schedule">Schedule/</Link>
      <Link to="/schedule/manage">Schedule Manage/</Link>
      <Link to="/schedule/timetable">Schedule Timetable/</Link>
      <Link to="/schedule/generate">Schedule Generate/</Link>
      <Link to="/professorprofile">Professor Profile</Link>
    </div>
  );
}

export default Header;
