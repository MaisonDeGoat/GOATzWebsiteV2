import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "./forge.module.scss";
import ForgeButton from "../../../public/images/forge-button.png";
import ForgeImage from "../../../public/images/forge-image.png";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const Forge = () => {
  const theme = useTheme();
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
    <div className={style.wrapper} id="forge">
      <Container>
        <Grid container spacing={isMobile ? 5 : 10} className={style.content}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              custom={typeof window !== "undefined" ? -window.innerWidth / 3 : 0}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={sideFadeAnimation}
              className={style.description}
            >
              <Typography variant="h4">THE FORGE</Typography>
              <Typography variant="body1">
                2 GOATz go in and 1 GOAT comes out! They say greatness is forged in ﬁre! Through a token burning
                contract you will be able to take two of your GOATz and choose which traits you want your combined GOAT
                to have. The traits you didnʼt choose disappear from the ecosystem forever!
              </Typography>
              <Link href="/the-forge" passHref>
                <motion.a className={style.forgeButton} whileHover={{ scale: 1.2 }}>
                  <Image src={ForgeButton} lazyBoundary="500px" objectFit="contain" alt="benefits-image" />
                </motion.a>
              </Link>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box maxWidth="600px" margin="auto">
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                custom={typeof window !== "undefined" ? window.innerWidth / 3 : 0}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                variants={sideFadeAnimation}
              >
                <Image src={ForgeImage} lazyBoundary="500px" objectFit="contain" alt="forge-image" />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Forge;
