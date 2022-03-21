import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "./forge.module.scss";
import ForgeButton from "../../../public/images/forge-button.svg";
import ForgeImage from "../../../public/images/forge-image.png";

const Forge = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={style.wrapper}>
      <Container>
        <Grid container spacing={isMobile ? 5 : 10} className={style.content}>
          <Grid item xs={12} md={6}>
            <Box className={style.description}>
              <Typography variant="h4">THE FORGE</Typography>
              <Typography variant="body1">
                2 GOATz go in and 1 GOAT comes out! They say greatness is forged in ﬁre! Through a token burning
                contract you will be able to take two of your GOATz and choose which traits you want your combined GOAT
                to have. The traits you didnʼt choose disappear from the ecosystem forever!
              </Typography>

              <div role="button" className={style.forgeButton}>
                <Image src={ForgeButton} objectFit="contain" alt="benefits-image" />
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box maxWidth="600px" margin="auto">
              <Image src={ForgeImage} objectFit="contain" alt="forge-image" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Forge;
