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
import Logo from "../../../asset/NewGOATzlogo.svg";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("xl"));
  const toggleDrawer = () => setDrawer(!drawer);

  const handleMobileLink = (link: string) => {
    router.push(link);
    toggleDrawer();
  };

  return (
    <div className={style.wrapper}>
      
        <div className={style.container} style={{ marginTop: router.asPath === "/" ? "16px" : "1px" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Link href="/" passHref>
              <a className={style.logo} style={{ marginTop: router.asPath === "/" ? "16px" : "0px" }}>
                <Image
                  src={Logo}
                  alt="logo"
                  objectFit="contain"
                  width = "76px"
                  height = "80px"
              
                />
              </a>
            </Link>
            

          
          {router.route ==="/" ? <div> </div> : <div><Stack direction="row" spacing="10px">
              <Link href="/">
                <a className={style.link}>
                  <Typography>HOME |</Typography>
                </a>
              </Link>
            
              <Link href="/the-forge">
                <a className={style.link}>
                  <Typography>FORGE |</Typography>
                </a>
              </Link>
              <Link href="/staking">
                <a className={style.link}>
                  <Typography>STAKING |</Typography>
                </a>
              </Link>
              <Link href="/marketplace">
                <a className={style.link}>
                  <Typography>MARKETPLACE |</Typography>
                </a>
              </Link>
              <Link href="/">
                <a className={style.link}>
                  <Typography>SOCIALS</Typography>
                </a>
              </Link>  
            </Stack></div>}

            <IconButton onClick={toggleDrawer}>
                <MenuIcon className={style.menuIcon} />
            </IconButton>
            </Box>
            
          
        </div>

      <Drawer anchor="right" open={drawer} onClose={toggleDrawer} >
        <Box width="282px" bgcolor="#D8C200" height="100vh" color="#fff" >
          <div className={style.menu}>
            <p style={{paddingRight:"10px",paddingTop:"10px"}}> MENU </p>
            <MenuIcon className={style.menuIcon1} />
          </div>
          <ListItem button onClick={() => handleMobileLink("/")}>
            <ListItemText disableTypography className={style.listItemText} primary="HOME" />
          </ListItem>
          {/*<ListItem button onClick={() => handleMobileLink("/roadmap")}>
            <ListItemText disableTypography className={style.listItemText} primary="ROADMAP" />
          </ListItem>*/}
          <ListItem button onClick={() => handleMobileLink("/the-forge")}>
            <ListItemText disableTypography className={style.listItemText} primary="FORGE" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/staking")}>
            <ListItemText disableTypography className={style.listItemText} primary="STAKING" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/marketplace")}>
            <ListItemText disableTypography className={style.listItemText} primary="MARKET" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("https://www.goatzmerch.com")}>
            <ListItemText disableTypography className={style.listItemText} primary="MERCH" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/goatz")}>
            <ListItemText disableTypography className={style.listItemText} primary="GOATZ" />
          </ListItem>
          <ListItem button onClick={() => handleMobileLink("/kidz")}>
            <ListItemText disableTypography className={style.listItemText} primary="KIDZ" />
          </ListItem>
          <ListItem button >
            <ListItemText disableTypography className={style.listItemText} primary="SOCIALS" />
          </ListItem>

          {/*<ListItem button onClick={() => handleMobileLink("/")}>
            <ListItemText disableTypography className={style.listItemText} primary="MORE" />
        </ListItem>*/}
        </Box>
      </Drawer>
    </div>
  );
};

export default Header;
