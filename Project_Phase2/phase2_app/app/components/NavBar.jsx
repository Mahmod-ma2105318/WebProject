'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { logout } from '@/app/actions/server-actions.js';

export default function NavBar() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <header className="info">
                <button className="menu-toggle">☰</button>
                <div id="student-info">
                    <div className="user-info-container">
                        <img src="../images/image.png" alt="User Image"></img>
                        <div>
                            <div id="username">username</div>
                            <div id="role">role</div>
                        </div>
                    </div>
                </div>
            </header>

            <nav id="buttons">
                <Link href="/">
                    <img src="/images/qu_logo-01.png" alt="QU-LOGO" />
                </Link>

                <Link href="/">
                    <button id="searchButton">
                        <i className="fas fa-home"></i>
                        Home
                    </button>
                </Link>

                <Link href="/courses/registered">
                    <button id="registeredCoursesButton">
                        <i className="fas fa-hourglass-half"></i>
                        Registered Courses
                    </button>
                </Link>

                <Link href="/courses/current">
                    <button id="CurrentCoursesButton">
                        <i className="fas fa-book"></i>
                        Current Courses
                    </button>
                </Link>

                <Link href="/courses/finished">
                    <button id="FinishedCoursesButton">
                        <i className="fas fa-check-circle"></i>
                        Finished Courses
                    </button>
                </Link>

                <button onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </nav>
        </>

    );
}