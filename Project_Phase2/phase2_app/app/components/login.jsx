'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/login.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        router.push('/courses');
    };

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
                        className={styles.loginInput}
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                    />

                    <label className={styles.loginLabel} htmlFor="password">
                        Password
                    </label>
                    <input
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