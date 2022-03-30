import { useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import style from "../styles/home.module.scss";
import BenefitsBackground from "../public/images/benefits-background.svg";
import Benefits from "../public/images/benefits-image.png";
import BenefitsButton from "../public/images/benefits-button.svg";
import { Button, Container, Grid, Typography } from "@mui/material";
import RoadMap from "@components/home/RoadMap";
import Tree from "@components/home/Tree";
import Stacking from "@components/home/Stacking";
import Forge from "@components/home/Forge";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sideFadeAnimation: Variants = {
    offscreen: (offset: number) => ({
      opacity: 0,
      x: offset,
    }),
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <div className={style.container}>
      <Head>
        <title>GOATz</title>
      </Head>
      <div>
        <div className={style.home}>
          <div className={style.homeContent}>
            <Typography variant="h4">A THRIVING COMMUNITY OF DREAMERS, REBELS, AND DOERS </Typography>
            <Button
              onClick={() => router.push("/benefits")}
              disableElevation
              variant="contained"
              className={style.homeButton}
            >
              READ MORE
            </Button>
          </div>
        </div>
        <div className={style.benefits}>
          <div className={style.benefitImage}>
            <Image src={BenefitsBackground} lazyBoundary="500px" layout="responsive" objectFit="contain" alt="cover" />
          </div>
          <Container maxWidth="lg">
            <Grid container spacing={isMobile ? 0 : 10} className={style.benefitContent}>
              <Grid item xs={12} md={6}>
                <Box maxWidth="600px" margin="auto">
                  <motion.div
                    initial="offscreen"
                    whileInView="onscreen"
                    custom={typeof window !== "undefined" ? -window.innerWidth / 3 : 0}
                    viewport={{
                      once: false,
                      amount: 0.2,
                    }}
                    variants={sideFadeAnimation}
                    className={style.benefitDescription}
                  >
                    <Image src={Benefits} objectFit="contain" alt="benefits-image" />
                  </motion.div>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial="offscreen"
                  whileInView="onscreen"
                  custom={typeof window !== "undefined" ? window.innerWidth / 3 : 0}
                  viewport={{
                    once: false,
                    amount: 0.5,
                  }}
                  variants={sideFadeAnimation}
                  className={style.benefitDescription}
                >
                  <Typography variant="h4">WELCOME TO GOATz</Typography>
                  <Typography variant="body1">
                    GOATz launched in July 2021 and are the 1st ever deﬂationary PFP NFT that enables owners to customize their NFTS through a process called The Forge. GOATz scarcity is always increasing and the art is always being enhanced. Owning a GOAT will unlock the doors to an amazing community and everything we are developing exclusively for GOATz in the different metaverses like The Sandbox and NFT Worlds. 
                  </Typography>
                  <Link href="/benefits">
                    <a className={style.benefitsButton}>
                      <Image src={BenefitsButton} objectFit="contain" alt="benefits-image" />
                    </a>
                  </Link>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <RoadMap />
        <Tree />
        <Stacking />
        <Forge />
      </div>
      <Box></Box>
    </div>
  );
}
