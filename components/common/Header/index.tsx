import { useState } from "react";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../public/images/goatz-logo.png";
import DiscordIcon from "../../../public/images/discord-icon.png";
import OpenseaIcon from "../../../public/images/opensea-icon.png";
import TwitterIcon from "../../../public/images/twitter-icon.png";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import style from "./header.module.scss";
import { useRouter } from "next/router";

const Header = () => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const toggleDrawer = () => setDrawer(!drawer);

  const handleMobileLink = (link: string) => {
    router.push(link);
    toggleDrawer();
  };

  return (
    <div className={style.wrapper}>
      <Container>
        <div className={style.container} style={{ backgroundColor: router.asPath === "/" ? "#7a0019" : "black" }}>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton size={isMobile ? "small" : "large"} onClick={toggleDrawer}>
                <MenuIcon fontSize={isMobile ? "small" : "large"} className={style.menuIcon} />
              </IconButton>
            )}
            <Link href="/" passHref>
              <a className={style.logo}>
                <Image
                  src={Logo}
                  alt="logo"
                  objectFit="contain"
                  height={isMobile ? 18 : 55}
                  width={isMobile ? 75 : 237}
                />
              </a>
            </Link>
          </Box>
          <div className={style.social}>
            <a href="https://opensea.io/collection/maisondegoat" rel="noreferrer" target="_blank">
              <Image src={OpenseaIcon} height={18} width={30} objectFit="contain" alt="opensea-icon" />
            </a>
            <a href="https://discord.gg/GOATZ" rel="noreferrer" target="_blank">
              <Image src={DiscordIcon} height={20} width={30} objectFit="contain" alt="discord-icon" />
            </a>
            <a href="https://twitter.com/MaisonDeGOAT" rel="noreferrer" target="_blank">
              <Image src={TwitterIcon} height={20} width={30} objectFit="contain" alt="twitter-icon" />
            </a>
          </div>
          {!isMobile && (
            <Stack direction="row" spacing="20px">
              <Link href="/">
                <a className={style.link}>
                  <Typography>HOME</Typography>
                </a>
              </Link>
              <Link href="/roadmap">
                <a className={style.link}>
                  <Typography>ROADMAP</Typography>
                </a>
              </Link>
              <Link href="/the-forge">
                <a className={style.link}>
                  <Typography>FORGE</Typography>
                </a>
              </Link>
              <Link href="/staking">
                <a className={style.link}>
                  <Typography>STAKING</Typography>
                </a>
              </Link>
              <Link href="/marketplace">
                <a className={style.link}>
                  <Typography>MARKETPLACE</Typography>
                </a>
              </Link>
              <a href="https://www.goatzmerch.com" rel="noreferrer" target="_blank" className={style.link}>
                <Typography>MERCH</Typography>
              </a>

              <Link href="/">
                <a className={style.link}>
                  <Typography>MORE</Typography>
                </a>
              </Link>
            </Stack>
          )}
        </div>
      </Container>
      Î
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer}>
        <Box width="200px" bgcolor="#7a0019" height="100%" color="#fff">
          <div className={style.mobileLogo}>
            <Image src={Logo} alt="logo" objectFit="contain" height={40} width={120} />
          </div>
          <ListItem button onClick={() => handleMobileLink("/")}>
            <ListItemText disableTypography className={style.listItemText} primary="HOME" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/roadmap")}>
            <ListItemText disableTypography className={style.listItemText} primary="ROADMAP" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/the-forge")}>
            <ListItemText disableTypography className={style.listItemText} primary="FORGE" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/staking")}>
            <ListItemText disableTypography className={style.listItemText} primary="STAKING" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/marketplace")}>
            <ListItemText disableTypography className={style.listItemText} primary="MARKETPLACE" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("https://www.goatzmerch.com")}>
            <ListItemText disableTypography className={style.listItemText} primary="MERCH" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/")}>
            <ListItemText disableTypography className={style.listItemText} primary="MORE" />
          </ListItem>
        </Box>
      </Drawer>
    </div>
  );
};

export default Header;
