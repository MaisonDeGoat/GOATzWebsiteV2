import Container from "@mui/material/Container";
import Image from "next/image";
import style from "./forge.module.scss";
import ForgeCover from "../../public/images/forge-image.png";
import Head from "next/head";
const Forge = () => {
  return (
    <div className={style.wrapper}>
      <Head>
        <title>GOATz - Forge</title>
      </Head>
      <Container>
        <Image src={ForgeCover} layout="responsive" alt="staking" />
        <p className={style.content}>
          <b>Forge SZN 9 Opening April 22nd 9AM PDT</b>
          <br/>
          <br/>
          <b>The What</b>
          <br/>
          2 GOATz go in and 1 GOAT comes out! They say greatness is forged in fire! Through a token burning
          contract you will be able to take two of your GOATz and choose which traits you want your combined
          GOAT to have. The traits you didnʼt choose disappear from the ecosystem forever! There is no cost
          associated with Forging however you will pay gas. We have had 8 Forge SZNs, taking the total supply
          of GOATz to 7,131 (from the original 10,000 minted). The Forge SZNs will be announced at different
          times for those who wish to combine the traits they want their GOATz to carry forward and continue
          the community mission of reducing supply.
          <br/>
          <br/>
          <b>The How</b>
          <br/>
          Owners of 2 or more GOATz will connect their wallet to the Forge via the website. 
          Once the GOATz are loaded, select the 2 you wish to Forge. From there,
          select the Traits and Token ID# you wish to carry forward. Lastly, Forged
          GOATz will have a house built in their honor within GOATzVille, the GOATz
          estate in the Sandbox Metaverse. Be sure to select the house you want and
          Forge away! Within 24 hours after your Forge, the GOAT that remained in
          your wallet will become your Forged GOAT. Be sure to refresh the metadata
          on OpenSea. The GOAT who didnʼt make it is sent to the Burn Address and
          youʼve helped reduce supply in the Deflationary spirit of the project.
          <br/>
          <br/>
          <b>The Why</b>
          <br/>
          Forging is a personal decision and one that doesnʼt come easy for
          everyone. Donʼt feel pressure to Forge. But, here are some reasons
          some choose to Forge:
          <br/>
          Forge can increase rarity ranking (see Traits Infographic for more)
          <br/>
          Forging can create highly Personalized or Aesthetically pleasing PFPs
          <br/>
          Deflation. Deflation. Deflation. As we curate the Herd the remaining GOATz become more and more unique!
          <br/>
          A home in GOATzVILLE

        </p>
      </Container>
    </div>
  );
};

export default Forge;
