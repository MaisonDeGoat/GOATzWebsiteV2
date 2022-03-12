import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Cover from "../public/images/home-cover.png";
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Image src={Cover} layout="fill" />
    </div>
  );
}
