import styles from '@/app/login.module.css';
import { handleLogin } from '@/app/actions/server-actions.js';

export default function LoginPage() {

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