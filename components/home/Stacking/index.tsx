import Typography from "@mui/material/Typography";
import Image from "next/image";
import style from "./stacking.module.scss";
import StakingButton from "../../../public/images/staking-button.svg";
import Link from "next/link";

const Stacking = () => {
  return (
    <div className={style.wrapper} id="staking">
      <div className={style.content}>
        <Typography variant="h2">STAKING</Typography>

        <Typography variant="body1">
          GOATz are the 1st ever deﬂationary PFP NFT that enables owners to customize their NFTS through a process
          called The Forge.The total supply of GOATz is always decreasing and the art is always being enhanced. They are
          ERC-721 Tokens and exist on the Ethereum blockchain. Owning a GOAT is not just about having a personalized
          avatar, it&apos;s also about gaining access to a vibrant, successful, and generous community.
        </Typography>

        <Link href="/staking">
          <a className={style.stakingButton}>
            <Image src={StakingButton} objectFit="contain" alt="benefits-image" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Stacking;
