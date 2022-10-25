import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <div className={styles.headerLogo}>
        <nav>
          <img src="/images/Logo.svg" alt="Logo" />
        </nav>
      </div>
    </header>
  );
}
