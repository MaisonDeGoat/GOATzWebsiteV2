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
          once: false,
          amount: 0.5,
        }}
        variants={sideFadeAnimation}
        className={style.content}
      >
        <Typography variant="h2">STAKING</Typography>

        <Typography variant="body1">
          In the GOATz universe, the KIDz are the long term earners! By staking our companion NFT, KIDz, you will earn $GMILK over time. $GMILK is our in-game currency and can be used to purchase items and experiences within our ecosystem. If you have more questions check out our white paper.
        </Typography>

        <Link href="/staking">
          <a className={style.stakingButton}>
            <Image src={StakingButton} lazyBoundary="500px" objectFit="contain" alt="benefits-image" />
          </a>
        </Link>
      </motion.div>
    </div>
  );
};

export default Stacking;
