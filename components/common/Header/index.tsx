import { useState } from "react";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../public/images/goatz-logo.png";
import DiscordIcon from "../../../public/images/discord-icon.png";
import OpenseaIcon from "../../../public/images/opensea-icon.png";
import TwitterIcon from "../../../public/images/twitter-icon.png";
import Link from "next/link";

import style from "./header.module.scss";
import { IconButton } from "@mui/material";

const Header = () => {
  const [drawer, setDrawer] = useState<boolean>(false);

  const toggleDrawer = () => setDrawer(!drawer);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <Box display="flex" alignItems="center">
          <IconButton size="large" onClick={toggleDrawer}>
            <MenuIcon fontSize="large" color="inherit" />
          </IconButton>
          <Image src={Logo} alt="logo" objectFit="contain" height={55} width={237} />
        </Box>

        <div className={style.social}>
          <Image src={OpenseaIcon} height={20} width={30} objectFit="contain" alt="opensea-icon" />
          <Image src={DiscordIcon} height={20} width={30} objectFit="contain" alt="discord-icon" />
          <Image src={TwitterIcon} height={20} width={30} objectFit="contain" alt="twitter-icon" />
        </div>
        {/* <Stack direction="row" spacing="20px">
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                HOME
              </Typography>
            </a>
          </Link>
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                ROADMAP
              </Typography>
            </a>
          </Link>
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                FORGE
              </Typography>
            </a>
          </Link>
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                STACKING
              </Typography>
            </a>
          </Link>
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                MERCH
              </Typography>
            </a>
          </Link>
          <Link href="/home">
            <a>
              <Typography color="#fff" fontWeight={800}>
                MORE
              </Typography>
            </a>
          </Link>
        </Stack> */}
      </div>
      Î
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer}>
        <Box width="200px" bgcolor="#7a0019" height="100%" color="#fff">
          <div className={style.mobileLogo}>
            <Image src={Logo} alt="logo" objectFit="contain" height={40} width={120} />
          </div>
          <ListItem button>
            <ListItemText primary="HOME" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="ROADMAP" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="FORGE" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="STACKING" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="MERCH" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="MORE" />
          </ListItem>
        </Box>
      </Drawer>
    </div>
  );
};

export default Header;
