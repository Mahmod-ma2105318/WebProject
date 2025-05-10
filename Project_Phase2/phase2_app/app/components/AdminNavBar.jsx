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


        <Link href="/Admin">
          <button id="searchButton">
            <i className="fas fa-home"></i> Home
          </button>
        </Link>

        <Link href="/Admin/currentlyTakenCourse">
          <button id="registeredCoursesButton">
            <i className="fas fa-book-open"></i> Currently Taken Courses
          </button>
        </Link>

        <Link href="/Admin/pendingCourses">
          <button id="CurrentCoursesButton">
            <i className="fas fa-hourglass-half"></i> Pending Courses
          </button>
        </Link>

        <Link href="/Admin/">
          <button id="FinishedCoursesButton">
            <i className="fas fa-check-circle"></i> Validate Courses
          </button>
        </Link>

        <Link href="/Admin/upsert">
          <button id="AddCoursesButton">
            <i className="fas fa-plus-circle"></i> Add Courses
          </button>
        </Link>

        <button onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </nav>
    </>
  );
}
