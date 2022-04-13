import Container from "@mui/material/Container";
import Head from "next/head";
import style from "./whitePaper.module.scss";
const WhitePaper = () => {
  return (
    <div className={style.wrapper}>
      <Head>
        <title>GOATz - White paper</title>
      </Head>
      <Container>
        <p className={style.content}>
          Click <a href="https://drive.google.com/uc?export=download&id=1-WWjx1c6XeT--sObLWyertp_ZLRwo8bS">Here</a> to Download The Whitepaper
        </p>
      </Container>
    </div>
  );
};

export default WhitePaper;
