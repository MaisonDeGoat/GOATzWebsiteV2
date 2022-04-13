import Container from "@mui/material/Container";
import Image from "next/image";
import style from "./benefits.module.scss";
import BenefitsCover from "../../public/images/benefits.png";
import Head from "next/head";
const Benefits = () => {
  return (
    <div className={style.wrapper}>
      <Container>
        <Head>
          <title>GOATz - Benefits</title>
        </Head>
        <Image src={BenefitsCover} alt="goatz" />
        <p className={style.content}>
          For an in-depth look at everything we are building for GOATz, please check out our <a href="roadmap">Roadmap 2.0</a>
        </p>
      </Container>
    </div>
  );
};

export default Benefits;
