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
          In the GOATz universe, the KIDz are the long term earners! By staking our companion NFT, KIDz, you will earn $GMILK over time. $GMILK is our in-game currency and can be used to purchase items and experiences within our ecosystem. If you have more questions check out our white paper.
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
