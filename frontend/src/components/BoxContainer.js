import styles from "../assets/css/BoxContainer.module.css";

export default function BoxContainer({ children, className, ...kwargs }) {
  return (
    <div className={`${styles.container} ${className}`} {...kwargs}>
      {children}
    </div>
  );
}
