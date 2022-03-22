import Container from "@mui/material/Container";
import Image from "next/image";
import style from "./forge.module.scss";
import ForgeCover from "../../public/images/forge-image.png";
const Forge = () => {
  return (
    <div className={style.wrapper}>
      <Container>
        <Image src={ForgeCover} layout="responsive" alt="staking" />
        <p className={style.content}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </Container>
    </div>
  );
};

export default Forge;
