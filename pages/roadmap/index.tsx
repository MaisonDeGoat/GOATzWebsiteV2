import Container from "@mui/material/Container";
import Image from "next/image";
import style from "./roadmap.module.scss";
import RoadMapCover from "../../public/images/roadmap-image.png";
import Head from "next/head";
const RoadMap = () => {
  return (
    <div className={style.wrapper}>
      <Head>
        <title>GOATz - Roadmap</title>
      </Head>
      <Container>
        <Image src={RoadMapCover} alt="goatz" layout="responsive" />
        <p className={style.content}>
          Our Mission for Roadmap 2.0  is Community + Gamification
Our Mantra that we continue to live by is Organic, Sustainable and Meaningful Growth.
We have listened to the community, and have aligned our roadmap with what you see is valuable to GOATz and where we need to allocate our budget and effort. 
$GMILK is short for GOATzMILK and our in-game utility token for the GOATz Universe! 
1 GMILK = 1 GMILK
How you will obtain GMILK is through staking which brings us to another bottle, The KIDz Academy. Here you will drop off your KIDz at the academy through a staking contract that will allow you to gain GMILK over time staked. You can find our whitepaper here.
GMILK will become the utility currency in which things are purchased in the GOATz Universe. You will be able to personalize and name your GOATz going forward for a small GMILK fee. You’ll be able to unlock AUT’d /unforgeable GOATz with GMILK. And a major one for many, You’ll be able to combine your properties in GOATzVILLE to gain some pretty awesome upgrades. This is just scratching the surface of what can be done with GMILK and we will continue to add utility to this token.
Discord Upgrade – Because Discord is the current home for our community, we will be investing some time and effort in upgrading our Discord interactivity and security.
Site Overhaul – As we continue to add utility and add to our modular ecosystem it is necessary that our website makes it easy for owners to navigate and do what they want to do.
The Forge = Our identity is obviously in The Forge and that will continue going forward as we add new innovative incentives for users.
GOATz X – GOATz X is about creating partnerships and collaborations this year. Going forward there will be a focus on creating meaningful partnerships and collaborating across different IPs. We will be allocating dedicated resources and it will be a personal focus area of mine to lock in and activate these partnerships. We have already established partnerships with VHS, NiftyGateway, and Sandbox.
IRL Events -  We are currently planning on an event at NFT NYC in June. If 2 or more GOATz are gathering, we would love to support it, financially and with our presence. Let us know what you have planned.
GOATzVille – GOATzVILLE is our 6x6 estate in the Sandbox near many other projects like BAYC, ZED RUN, and CyberKongs. It will contain our Maison De GOAT, the exclusive clubhouse mansion for GOATz as well as the 1000+ houses built in honor of all of our actively Forged GOATz. We will be launching as soon as Sandbox opens up their Public Beta release.
Downtown – We have decided to dedicate part of our Sandbox land specifically a 2x1 portion, to a GOATz Downtown which will include things like a fire station, school, and hospital. We are currently working on this build and can’t wait to share more!
New Merch - We will continue to rotate products in and out and keep the brand fresh and always moving. You can find our merch here.
GOATZ University -  We will be providing materials in the form of infographics, youtube videos, and even branching out to new mediums of social media for us. In addition we recognize for a lot of new GOATz it might be their first NFT they ever buy. Providing resources for first time people jumping into NFTs is also important to us. 
Adventure Land - It is a metaverse exclusive to KIDz owners where you will be able to compete against other KIDz in mini games themed around a carnival/theme park for prizes. Adventure land is being built in NFT worlds currently.
Legacy Challenges -  A new ongoing series of challenges where owners must have certain matching traits between their GOATz and KIDz to enter.
Community + Gamification will be the cornerstones of the GOATz Universe going forward.

        </p>
      </Container>
    </div>
  );
};

export default RoadMap;
