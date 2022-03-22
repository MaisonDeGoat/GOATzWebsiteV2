import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import style from "./roadMap.module.scss";
import RoadMapDesktopBackground from "../../../public/images/roadmap-background-desktop.png";
import RoadMapMobileBackground from "../../../public/images/roadmap-background-mobile.png";
import RoadMapImage from "../../../public/images/roadmap-image.png";
import RoadMapButton from "../../../public/images/roadmap-button.svg";
import Link from "next/link";

const RoadMap = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className={style.roadMap} id="roadmap">
      <div>
        <Image
          src={isMobile ? RoadMapMobileBackground : RoadMapDesktopBackground}
          layout="responsive"
          objectFit="contain"
          alt="road-map-background"
        />
      </div>

      {!isMobile && (
        <Container className={style.roadMapContent}>
          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <div className={style.roadMapImage}>
                <Image src={RoadMapImage} alt="road-map-background" />
                <Link href="/roadmap">
                  <a className={style.roadMapButton}>
                    <Image src={RoadMapButton} objectFit="contain" alt="benefits-image" />
                  </a>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Container>
      )}

      {isMobile && (
        <div className={style.roadMapContent}>
          <div className={style.roadMapImage}>
            <Image src={RoadMapImage} alt="road-map-background" />
            <Link href="/roadmap">
              <a className={style.roadMapButton}>
                <Image src={RoadMapButton} objectFit="contain" alt="benefits-image" />
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadMap;
