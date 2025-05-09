'use client';
import styles from '@/app/login.module.css';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            alert('Invalid login credentials');
        }
    };

    useEffect(() => {
        if (session?.user?.role) {
            switch (session.user.role) {
                case 'STUDENT':
                    router.push('/courses');
                    break;
                case 'ADMINISTRATOR':
                    router.push('/Admin');
                    break;
                case 'INSTRUCTOR':
                    router.push('/Instructor');
                    break;
                default:
                    router.push('/');
                    break;
            }
        }
    }, [session]);
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <img
                    src="/images/qu_logo-01.png"
                    alt="QU-LOGO"
                    className={styles.loginLogo}
                />
                <h2>Login</h2>

                <form className={styles.loginForm} onSubmit={handleSubmit} autoComplete="off">
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
