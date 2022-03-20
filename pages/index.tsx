import Head from "next/head";
import Image from "next/image";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import style from "../styles/home.module.scss";
import HomeCover from "../public/images/home-cover.png";
import BenefitsBackground from "../public/images/benefits-background.svg";
import Benefits from "../public/images/benefits-image.png";
import BenefitsButton from "../public/images/benefits-button.svg";
import { Button, Container, Grid, Typography } from "@mui/material";
import RoadMap from "@components/home/RoadMap";
import Tree from "@components/home/Tree";
import Stacking from "@components/home/Stacking";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={style.container}>
      <Head>
        <title>Create Next App</title>
      </Head>
      <div>
        <div className={style.home}>
          {/* <div className={style.homeImage}>
            <Image src={HomeCover} layout="fill" objectFit="cover" alt="cover" />
          </div> */}
          <div className={style.homeContent}>
            <Typography variant="h2">
              WELCOME <br /> TO <br /> GOATz
            </Typography>
            <Typography variant="h4">A THRIVING COMMUNITY OF DREAMERS, REBELS, AND DOERS </Typography>
            <Button disableElevation variant="contained" className={style.homeButton}>
              READ MORE
            </Button>
          </div>
        </div>
        <div className={style.benefits}>
          <div className={style.benefitImage}>
            <Image src={BenefitsBackground} layout="responsive" objectFit="contain" alt="cover" />
          </div>
          <Container>
            <Grid container spacing={isMobile ? 5 : 10} className={style.benefitContent}>
              <Grid item xs={12} md={6}>
                <Box maxWidth="600px" margin="auto">
                  <Image src={Benefits} objectFit="contain" alt="benefits-image" />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className={style.benefitDescription}>
                  <Typography variant="h4">WELCOME TO GOATz</Typography>
                  <Typography variant="body1">
                    GOATz are the 1st ever deﬂationary PFP NFT that enables owners to customize their NFTS through a
                    process called The Forge. The total supply of GOATz is always decreasing and the art is always being
                    enhanced. They are ERC-721 Tokens and exist on the Ethereum blockchain. Owning a GOAT is not just
                    about having a personalized avatar, it's also about gaining access to a vibrant, successful, and
                    generous community.
                  </Typography>

                  <div role="button" className={style.benefitsButton}>
                    <Image src={BenefitsButton} objectFit="contain" alt="benefits-image" />
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>

        <RoadMap />
        <Tree />
        <Stacking />
      </div>
      <Box></Box>
    </div>
  );
}
