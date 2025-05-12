import React from 'react';
import Link from 'next/link';
import repo from '../repo/repo';
import { logout } from '@/app/actions/server-actions.js';

export default async function Page() {
  const user = await repo.getLoggedInUser();

  return (
    <>
      <header className="info">
        <button className="menu-toggle">☰</button>
        <div id="student-info">
          <div className="user-info-container">
            <img src="../images/image.png" alt="User Image" />
            <div>
              <div id="username">{user.username}</div>
              <div id="role">{user.role}</div>
            </div>
          </div>
        </div>
      </header>

      <nav id="buttons">
        <img src="/images/qu_logo-01.png" alt="QU-LOGO" />
        <Link href="/Instructor/stat">
          <button className="nav-button">
            <i className="fas fa-chart-bar"></i> Stats
          </button>
        </Link>
        <button onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </nav>
    </>
  );
}
