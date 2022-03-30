import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import style from "./roadMap.module.scss";
import RoadMapDesktopBackground from "../../../public/images/roadmap-background-desktop.png";
import RoadMapMobileBackground from "../../../public/images/roadmap-background-mobile.png";
import RoadMapImage from "../../../public/images/roadmap-image.png";
import RoadMapButton from "../../../public/images/roadmap-button.svg";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const RoadMap = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraLarge = useMediaQuery(theme.breakpoints.down("xl"));

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
    <div className={style.roadMap} id="roadmap">
      <div className={style.topBlendGradient}></div>
      <div>
        <Image
          src={isMobile ? RoadMapMobileBackground : RoadMapDesktopBackground}
          layout="responsive"
          objectFit="contain"
          alt="road-map-background"
        />
      </div>

      {!isMobile && (
        <Container maxWidth={isExtraLarge ? "lg" : "xl"} className={style.roadMapContent}>
          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                custom={typeof window !== "undefined" ? window.innerWidth / 3 : 0}
                viewport={{
                  once: false,
                  amount: 0.5,
                }}
                variants={sideFadeAnimation}
                className={style.roadMapImage}
              >
                <Image src={RoadMapImage} alt="road-map-background" />
                <Link href="/roadmap">
                  <a className={style.roadMapButton}>
                    <Image src={RoadMapButton} objectFit="contain" alt="benefits-image" />
                  </a>
                </Link>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      )}

      {isMobile && (
        <div className={style.roadMapContent}>
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            custom={typeof window !== "undefined" ? window.innerWidth / 3 : 0}
            viewport={{
              once: false,
              amount: 0.5,
            }}
            variants={sideFadeAnimation}
            className={style.roadMapImage}
          >
            <Image src={RoadMapImage} lazyBoundary="500px" alt="road-map-background" />
            <Link href="/roadmap">
              <a className={style.roadMapButton}>
                <Image src={RoadMapButton} objectFit="contain" alt="benefits-image" />
              </a>
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoadMap;
