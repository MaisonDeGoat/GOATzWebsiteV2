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
            <div className={style.content}>
              <div className={style.logoContainer}>
                <Box mb="10px">
                  <Image src={Logo} alt="logo" objectFit="contain" height={70} width={250} />
                </Box>
                <Stack direction="row" spacing={2} className={style.socialLogos}>
                  <a href="https://discord.gg/GOATZ">
                    <Image src={DiscordIcon} height={30} width={35} objectFit="contain" alt="discord-icon" />
                  </a>
                  <a href="https://twitter.com/MaisonDeGOAT">
                    <Image src={TwitterIcon} height={30} width={35} objectFit="contain" alt="twitter-icon" />
                  </a>
                  <a href="https://tiktok.com">
                    <Image src={TikTokIcon} height={30} width={35} objectFit="contain" alt="tiktok-icon" />
                  </a>
                  <a href="https://www.youtube.com/channel/UC4J0oY9FNjHm0U1AO_QXiyA">
                    <Image src={YoutubeIcon} height={30} width={35} objectFit="contain" alt="youtube-icon" />
                  </a>
                  <a href="https://www.twitch.com/">
                    <Image src={TwitchIcon} height={30} width={35} objectFit="contain" alt="twitch-icon" />
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
              <Link href="/">
                <a>Home</a>
              </Link>
              <Link href="/roadmap">
                <a>Roadmap</a>
              </Link>
              <Link href="/the-forge">
                <a>Forge</a>
              </Link>
              <Link href="/staking">
                <a>Staking</a>
              </Link>
              <a href="https://www.goatzmerch.com" rel="noreferrer" target="_blank">
                Merch
              </a>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Stack className={style.list} spacing={2}>
              <Link href="/">
                <a>Getting Started</a>
              </Link>
              <Link href="/">
                <a>Opensea</a>
              </Link>
              <Link href="/">
                <a>Contracts</a>
              </Link>
              <Link href="/">
                <a>Dev Wallet</a>
              </Link>
              <Link href="/white-paper">
                <a>Whitepaper </a>
              </Link>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <Stack className={style.list} spacing={2}>
              <Link href="/terms">
                <a>Terms of Use</a>
              </Link>
              <Link href="/privacy-policy">
                <a>Privacy Policy</a>
              </Link>
              <Link href="/code-of-conduct">
                <a>Code of Conduct</a>
              </Link>
              <Link href="/faqs">
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
