import Typography from "@mui/material/Typography";
import Image from "next/image";
import style from "./stacking.module.scss";
import StakingButton from "../../../public/images/staking-button.svg";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const Stacking = () => {
  const sideFadeAnimation: Variants = {
    offscreen: (offset: number) => ({
      opacity: 0,
      x: offset,
    }),
    onscreen: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <div className={style.wrapper} id="staking">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        custom={typeof window !== "undefined" ? -window.innerWidth / 3 : 0}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={sideFadeAnimation}
        className={style.content}
      >
        <Typography variant="h2">STAKING</Typography>

        <Typography variant="body1">
          GOATz are the 1st ever deﬂationary PFP NFT that enables owners to customize their NFTS through a process
          called The Forge.The total supply of GOATz is always decreasing and the art is always being enhanced. They are
          ERC-721 Tokens and exist on the Ethereum blockchain. Owning a GOAT is not just about having a personalized
          avatar, it&apos;s also about gaining access to a vibrant, successful, and generous community.
        </Typography>

        <Link href="/staking" passHref>
          <motion.a className={style.stakingButton} whileHover={{ scale: 1.2 }}>
            <Image src={StakingButton} lazyBoundary="500px" objectFit="contain" alt="benefits-image" />
          </motion.a>
        </Link>
      </motion.div>
    </div>
  );
};

export default Stacking;
