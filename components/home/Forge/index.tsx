import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import style from "./forge.module.scss";
import ForgeButton from "../../../public/images/forge-button.svg";
import ForgeImage from "../../../public/images/forge-image.png";
import Link from "next/link";

const Forge = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={style.wrapper} id="forge">
      <Container>
        <Grid container spacing={isMobile ? 5 : 10} className={style.content}>
          <Grid item xs={12} md={6}>
            <Box className={style.description}>
              <Typography variant="h4">THE FORGE</Typography>
              <Typography variant="body1">
                One of the main reasons GOATz was created was to give control to the owners and allow them to craft an NFT that represents themselves, a story, or their ambitions!  Through The Forge, this is made possible. Owners can take 2 different GOATz and select their favorite traits from each GOAT to form 1 combined GOAT.
              </Typography>
              <Link href="/the-forge">
                <a className={style.forgeButton}>
                  <Image src={ForgeButton} objectFit="contain" alt="benefits-image" />
                </a>
              </Link>
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
