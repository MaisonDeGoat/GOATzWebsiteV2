import Container from "@mui/material/Container";
import Image from "next/image";
import style from "./goatz.module.scss";
import GoatzCover from "../../public/images/goatz.png";
const Goatz = () => {
  return (
    <div className={style.wrapper}>
      <Container style={{paddingTop:"40px"}}>
        <Image src={GoatzCover} layout="responsive" alt="goatz" />
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

export default Goatz;
