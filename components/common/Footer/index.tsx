import { Container, Grid, Stack, Typography } from "@mui/material";
import Box from "@mui/system/Box";
import Link from "next/link";
import Image from "next/image";
import style from "./footer.module.scss";
import Logo from "../../../public/images/goatz-logo.png";
import DiscordIcon from "../../../public/images/discord-footer-icon.png";
import TwitterIcon from "../../../public/images/twitter-footer-icon.png";
import TikTokIcon from "../../../public/images/tiktok-footer-icon.png";
import YoutubeIcon from "../../../public/images/youtube-footer-icon.png";
import TwitchIcon from "../../../public/images/twitch-footer-icon.png";

const Footer = () => {
  return (
    <div className={style.wrapper}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6}>
            <div>
              <div className={style.logoContainer}>
                <Box mb="10px">
                  <Image src={Logo} alt="logo" objectFit="contain" height={70} width={250} />
                </Box>
                <Stack direction="row" spacing={2}>
                  <a>
                    <Image src={DiscordIcon} height={30} width={30} objectFit="contain" alt="discord-icon" />
                  </a>
                  <a>
                    <Image src={TwitterIcon} height={30} width={30} objectFit="contain" alt="twitter-icon" />
                  </a>
                  <a>
                    <Image src={TikTokIcon} height={30} width={30} objectFit="contain" alt="tiktok-icon" />
                  </a>
                  <a>
                    <Image src={YoutubeIcon} height={30} width={30} objectFit="contain" alt="youtube-icon" />
                  </a>
                  <a>
                    <Image src={TwitchIcon} height={30} width={30} objectFit="contain" alt="twitch-icon" />
                  </a>
                </Stack>
              </div>

              <div className={style.signUp}>
                <label>Email Signup</label>
                <input />
                <button>SUBMIT</button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Stack className={style.list} spacing={2}>
              <Link href="./home">
                <a>Home</a>
              </Link>
              <Link href="./home">
                <a>Roadmap</a>
              </Link>
              <Link href="./home">
                <a>Forge</a>
              </Link>
              <Link href="./home">
                <a>Staking</a>
              </Link>
              <Link href="./home">
                <a>Staking</a>
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Stack className={style.list} spacing={2}>
              <Link href="./home">
                <a>Getting Started</a>
              </Link>
              <Link href="./home">
                <a>Opensea</a>
              </Link>
              <Link href="./home">
                <a>Contracts</a>
              </Link>
              <Link href="./home">
                <a>Dev Wallet</a>
              </Link>
              <Link href="./home">
                <a>Whitepaper </a>
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Stack className={style.list} spacing={2}>
              <Link href="./home">
                <a>Terms of Use</a>
              </Link>
              <Link href="./home">
                <a>Privacy Policy</a>
              </Link>
              <Link href="./home">
                <a>Code of Conduct</a>
              </Link>
              <Link href="./home">
                <a>FAQ</a>
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Box mt={5}>
              <Typography textAlign="center" color="#fff" fontWeight="bold">
                ALL RIGHTS RESERVED (c) 2022 KRHFT STUDIOS LLC
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;
