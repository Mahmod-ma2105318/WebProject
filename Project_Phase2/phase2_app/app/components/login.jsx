'use client';
import { signIn } from 'next-auth/react';
import styles from '@/app/login.module.css';
import { handleLogin } from '../actions/server-actions';

export default function LoginPage() {
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const formData = new FormData(event.target);
    //     const username = formData.get('username');
    //     const password = formData.get('password');

    //     const result = await signIn('credentials', {
    //         redirect: false,
    //         username,
    //         password,
    //     });

    //     if (result.error) {
    //         alert('Invalid login credentials');
    //     } else {
    //         // Redirect based on the role
    //         switch (result.user.role) {
    //             case 'STUDENT':
    //                 window.location.href = '/courses';
    //                 break;
    //             case 'ADMINISTRATOR':
    //                 window.location.href = '/Admin';
    //                 break;
    //             case 'INSTRUCTOR':
    //                 window.location.href = '/Instructor';
    //                 break;
    //             default:
    //                 alert('Unknown role');
    //                 break;
    //         }
    //     }
    // };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <img
                    src="/images/qu_logo-01.png"
                    alt="QU-LOGO"
                    className={styles.loginLogo}
                />
                <h2>Login</h2>

                <form className={styles.loginForm} action={handleLogin} autoComplete="off">
                    <label className={styles.loginLabel} htmlFor="username">
                        Username
                    </label>
                    <input
                        name="username"
                        className={styles.loginInput}
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                    />

                    <label className={styles.loginLabel} htmlFor="password">
                        Password
                    </label>
                    <input
                        name="password"
                        className={styles.loginInput}
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                    />

                    <button type="submit" className={styles.loginButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
