import Head from "next/head";
import Image from "next/image";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import style from "../styles/home.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import gmilk1 from "../asset/gmilk.svg";

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className={style.container} >
      <Head>
        <title>GOATz</title>
      </Head>
      <div>
        <div className={style.marqback}>
          <div className={style.marq}>NEW RELEASE NEW MERCH RELEASED 10/14 NEW RELEASE NEW MERCH RELEASED 10/14 NEW RELEASE NEW MERCH RELEASED 10/14</div>
        </div>
        <div className={style.home1}>
          <div className={style.glogo}></div>
          <div className={style.desc}>Customization | Connection | Entertainmenty</div>
          <div className={style.goat1}></div>
          <div className={style.backpic1}></div>
        </div> 
        <div className={style.wcgoat}>
          <div className={style.content} >
            <p className={style.got}>Welcome to the <br /> Maison De GOAT</p>
            <br/>
            The Greatest of All Time from every industry have gathered in their flagship clubhouse, The Maison De GOAT. 
            <br/><br/>
            Eager to join? <br />
            Purchase and Customize your GOAT to say something about who you are and what you will bringing to the Maison.
          </div>
          <div className={style.btnalign}>
            <button className={style.btn}>BUY A GOAT</button>
            <button className={style.btn} >CUSTOMIZE</button>
            <button className={style.btn}>LATEST</button>
          </div>
          <div className={style.goat2align} style={{backgroundSize: "contain",backgroundPosition:"bottom"}}>
            </div>     
        </div>
        <div className={style.backpic2}></div>
        <div className={style.craftgoat}>
          <div className={style.goat3align} style={{backgroundSize: "contain",backgroundPosition:"bottom"}}>
              </div> 
          <div className={style.content2} >
            <p  className={style.craft1}>Craft Your Own GOAT </p>
            <br/><br/>THE FORGE allows GOATz holders to take 2 GOATz and combine the best parts to form 1 GOAT
            personalized GOAT.<br/><br/> 
            The Forge is deflationary causing the collection size to reduce, the art to be enhanced, and GOATz to become more scarce.
            <br/><br/>
            <Link href="/the-forge" ><button className={style.btn} style={{marginRight:"87px"}}>FORGE</button></Link>
            <button className={style.btn} >UPGRADE</button>
          </div>
        </div>
        <div className={style.backpic3}></div>
        <div className={style.gmilkgoat}>
          <div className={style.content3} style={{marginRight:"29px"}}>
            <p className={style.gmilk}>$GMILK </p>
            <br/>
            The fuel to the GOATz Universe is GMILK, a token that can be earned by staking our KIDz collection.
            <br/><br/>
            It can be spent in our GOATz markeplace on GOAT Upgrades, Raffles, Merch, and Experiences.
          </div>
          <div className={style.btnalign} style={{paddingTop:"60px",paddingBottom:"20px"}}>
          <Link href="/staking" ><button className={style.btn} style={{marginBottom:"28px"}}>STAKING</button></Link>
          <Link href="/marketplace" ><button className={style.btn} style={{fontSize:"28px",marginBottom:"28px"}}>MARKETPLACE</button></Link>
          <Link href="/kidz" ><button className={style.btn} style={{marginBottom:"28px"}}>KIDz</button></Link>
          </div>
          <div className={style.goat4align}>
            <Image src={gmilk1.src} alt="" width="188px" height="345px" objectFit="contain" />
          </div>     
        </div>
        <div className={style.backpic4}></div>
        
      </div>
      <Box></Box>
    </div>
  );
}
