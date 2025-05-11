
import Link from 'next/link';
import { logout } from '@/app/actions/server-actions.js';
import repo from '../repo/repo';

export default async function NavBar() {
    const user = await repo.getLoggedInUser();


    return (
        <>
            <header className="info">
                <button className="menu-toggle">☰</button>
                <div id="student-info">
                    <div className="user-info-container">
                        <img src="../images/image.png" alt="User Image"></img>
                        <div>
                            <div id="username">{user.username}</div>
                            <div id="role">{user.role}</div>
                        </div>
                    </div>
                </div>
            </header>

            <nav id="buttons">
                <Link href="">
                    <img src="/images/qu_logo-01.png" alt="QU-LOGO" />
                </Link>

                <Link href="/student">
                    <button id="searchButton">
                        <i className="fas fa-home"></i>
                        Home
                    </button>
                </Link>

                <Link href="/student/registeredStudent">
                    <button id="registeredCoursesButton">
                        <i className="fas fa-hourglass-half"></i>
                        Registered Courses
                    </button>
                </Link>

                <Link href="/student/currently">
                    <button id="CurrentCoursesButton">
                        <i className="fas fa-book"></i>
                        Current Courses
                    </button>
                </Link>

                <Link href="/student/finished">
                    <button id="FinishedCoursesButton">
                        <i className="fas fa-check-circle"></i>
                        Finished Courses
                    </button>
                </Link>

                <button onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </nav>
        </>

    );
}