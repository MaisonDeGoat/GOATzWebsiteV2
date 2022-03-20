import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import style from "./stacking.module.scss"
const Stacking = () => {
  return (
    <div>
      <div className={style.content}>
        <Typography variant="h2">STAKING</Typography>

        <Typography variant="body1">
          GOATz are the 1st ever deﬂationary PFP NFT that enables owners to customize their NFTS through a process
          called The Forge.The total supply of GOATz is always decreasing and the art is always being enhanced. They are
          ERC-721 Tokens and exist on the Ethereum blockchain. Owning a GOAT is not just about having a personalized
          avatar, it's also about gaining access to a vibrant, successful, and generous community.
        </Typography>
      </div>
    </div>
  );
};

export default Stacking;
