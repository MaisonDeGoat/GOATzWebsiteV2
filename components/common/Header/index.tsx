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
            <Image src={Logo} alt="logo" objectFit="contain" height={isMobile ? 18 : 55} width={isMobile ? 75 : 237} />
          </Box>
          <div className={style.social}>
            <Image src={OpenseaIcon} height={20} width={30} objectFit="contain" alt="opensea-icon" />
            <Image src={DiscordIcon} height={20} width={30} objectFit="contain" alt="discord-icon" />
            <Image src={TwitterIcon} height={20} width={30} objectFit="contain" alt="twitter-icon" />
          </div>
          {!isMobile && (
            <Stack direction="row" spacing="20px">
              <Link href="/home">
                <a className={style.link}>
                  <Typography>HOME</Typography>
                </a>
              </Link>
              <Link href="/home">
                <a className={style.link}>
                  <Typography>ROADMAP</Typography>
                </a>
              </Link>
              <Link href="/home">
                <a className={style.link}>
                  <Typography>FORGE</Typography>
                </a>
              </Link>
              <Link href="/home">
                <a className={style.link}>
                  <Typography>STACKING</Typography>
                </a>
              </Link>
              <Link href="/home">
                <a className={style.link}>
                  <Typography>MERCH</Typography>
                </a>
              </Link>
              <Link href="/home">
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
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="HOME" />
          </ListItem>
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="ROADMAP" />
          </ListItem>
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="FORGE" />
          </ListItem>
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="STACKING" />
          </ListItem>
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="MERCH" />
          </ListItem>
          <ListItem button>
            <ListItemText disableTypography className={style.listItemText} primary="MORE" />
          </ListItem>
        </Box>
      </Drawer>
    </div>
  );
};

export default Header;
