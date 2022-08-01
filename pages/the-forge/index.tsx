import { useState, useRef } from "react";
import React from "react";
import Container from "@mui/material/Container";
import Image from "next/image";
import Head from "next/head";
import { Button } from "@mui/material";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import toastr from "toastr";
import BigNumber from "bignumber.js";
import { GoogleSpreadsheet } from "google-spreadsheet";

import style from "./forge.module.scss";
import ForgeCover from "../../public/images/forge-image.png";
import { Util } from "util/util";
import {
  FORGE_SCREEN_STATUS, SPREADSHEET_ID, LIST_ABI_GOATz,
  LIST_ABI_ACCESSTOKEN, GOATZ_ABI_ADDRESS, ACCESSTOKEN_ABI_ADDRESS, CLIENT_EMAIL,
  PRIVATE_KEY, SHEET_ID, SHEET_ID_ALL, SHEET_ID_TEMP, SHEET_ID_ALL_TEMP, SHEET_ALL_ACCESSTOKEN_ID
} from "@config/abi-config";
import { list } from "@config/listedAddress"
import StakingCover from "../../public/images/staking.png";
import gmilk1 from "../../public/images/gmilk1.png";
import loadingImg from "../../public/images/Spin.gif";
import RoadMapButton from "../../public/images/buttonBgConnect.png";
import WalletList from "@components/home/Stacking/WalletList";

const urls = {
  Fur: 'https://goatz.mypinata.cloud/ipfs/QmXSGrnbjkgPZx8YNcFA3VrNC76b1QqKd4v4MsEK1qmGLf/',
  Mouth: 'https://goatz.mypinata.cloud/ipfs/QmVhbezPHBPjC7DdcCHi9iejy84uC5h89gLn1F7h6vhfyx/',
  Outfit: 'https://goatz.mypinata.cloud/ipfs/QmWUtJ9G2AZshX1juHucphHGBPdBiNtcT1rkqAbVXFmJtb/',
  Eyes: 'https://goatz.mypinata.cloud/ipfs/QmPWmBTgKWzny6S7X2ttTuz1Tn9oF3DZTacVFpJ2YAmfKA/',
  Horns: 'https://goatz.mypinata.cloud/ipfs/QmeicGvFaxTmD4yrrv9Myv5ZoKMTZ9wRK5CzuH3sShixKw/',
  Earring: 'https://goatz.mypinata.cloud/ipfs/QmV4Qsf53XrLxdbysZXZVqUHbnkdoWvWJjTrdnMEwNpevx/',
  Background: 'https://goatz.mypinata.cloud/ipfs/QmT7Exx662DCzqH8C6VVh3EhbNe93u15RVe3ysTyYFt5WU/'
}

const doc: any = new GoogleSpreadsheet(SPREADSHEET_ID);

export default class Forge extends React.Component<any, any> {
  state: any = {};

  constructor(props: any) {
    super(props);
    this.state = {
      //If isForgeActive is true means forge view is active, and false means only showing content
      isForgeActive: FORGE_SCREEN_STATUS,

      isEnabled: this.props.isEnabled,
      account: this.props.account,
      web3: this.props.web3,
      isAlreadyConnected: false,

      isMinting: false,
      isForge: false,
      mintedGoatz: 0,
      mintedGoatzIdList: [],
      mintedGoatzObjList: [],
      firstSelectedGoat: null,
      secondSelectedGoat: null,
      background: 0,
      fur: 0,
      outfit: 0,
      earring: 0,
      eyes: 0,
      mouth: 0,
      horns: 0,
      id: 0,
      ville: '',
      isWalletList: false,
      unstakedGoatzLoading: false,
    };
    toastr.options = {
      // positionClass: 'toast-top-full-width',
      hideDuration: 300,
      timeOut: 3000,
    };
  }

  componentDidMount() {
    if (this.state.isEnabled) {
      this.onLoadData();
    }
  }

  componentDidUpdate(newProps: any) {
    this.setStateFromWithNewProps(newProps);
  }

  async setStateFromWithNewProps(props: any) {
    let canUpdate = false;
    if (props.isEnabled && !this.state.isEnabled) {
      canUpdate = true;
    }
    if (
      props.isEnabled != this.state.isEnabled ||
      props.account != this.state.account ||
      props.web3 != this.state.web3
    ) {
      await this.setState({
        isEnabled: props.isEnabled,
        account: props.account,
        web3: props.web3,
      });
    }

    if (canUpdate && !this.state.isAlreadyConnected) {
      this.onLoadData();
    }
  }

  async onLoadData() {
    await this.setState({ isAlreadyConnected: true });
    this.getMintedGoatz();
  }

  async getMintedGoatz() {
    try {
      this.setState({
        totalGoatz: "",
        mintedGoatzIdList: null,
        mintedGoatzObjList: [],
        selectedGoat: [],
        unstakedGoatzLoading: true,
      });
      let totalGoatz = await this.props.goatzWeb3Inst.methods.balanceOf(this.state.account).call();
      this.setState({ mintedGoatz: totalGoatz });
      if (totalGoatz > 0) {
        let list: any[] = [];
        this.getMintedGoatzList(list, totalGoatz, 0);
      } else {
        this.setState({ unstakedGoatzLoading: false });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getMintedGoatzList(list: any[], totalGoatz: number, index: number) {
    if (index <= totalGoatz - 1) {
      let temp = await this.props.goatzWeb3Inst.methods.tokenOfOwnerByIndex(this.state.account, index).call();
      list.push(temp)

      this.getMintedGoatzList(list, totalGoatz, index + 1);
    } else if (index > totalGoatz - 1) {
      //set in state
      this.setState({ mintedGoatzIdList: list });
      if (list && list.length > 0) {
        this.getMintedGoatzObj([], 0, list.length, list)
      } else {
        this.setState({ mintedGoatzObjList: [], unstakedGoatzLoading: false });
      }
    }
  }

  async getMintedGoatzObj(goatzList: any[], index: number, totalLength: number, list: string[]) {
    if (index <= totalLength - 1) {
      let url = await this.props.goatzWeb3Inst.methods.tokenURI(list[index]).call();
      fetch(url)
        // fetch("https://goatz.mypinata.cloud/ipfs/QmUmJ25CAhPhExapS2fLgD6Qbr9fExyxUGtzzY7Nkwykai/" + list[index])
        .then(res => res.json())
        .then(
          (result) => {
            for (let attr of result?.attributes) {
              result[attr.trait_type] = attr.value;
            }
            result['id'] = list[index];
            goatzList.push(result);
            this.getMintedGoatzObj(goatzList, index + 1, totalLength, list)
          },
          (error) => {
            this.getMintedGoatzObj(goatzList, index, totalLength, list)
          }
        )
    } else if (index > totalLength - 1) {
      this.setState({ mintedGoatzObjList: goatzList })
    }
  }

  getLeftPanelGoatz() {
    if (this.state.mintedGoatzObjList && this.state.mintedGoatzObjList.length > 0) {
      return this.state.mintedGoatzObjList.map((e: any, key: any) => {
        return (
          <div className="col-md-6" key={key}>
            <>
              <style jsx>{`
                .mintedGoatzObjList__border { border: ${e.selected ? 'solid 3px red' : 'none'} }
              `}</style>
              <img
                className="mb-4 mintedGoatzObjList__border"
                src={e.image}
                onClick={() => {
                  this.imageSelection(e);
                }}
                alt=""
              />
            </>
          </div>
        );
      });
    } else if (!this.state.unstakedGoatzLoading) {
      return <h4 style={{ textAlign: "center" }}>No GOATz to FORGE!</h4>;
    } else if (this.state.unstakedGoatzLoading) {
      return (
        <h4 style={{ textAlign: "center", margin: "0px" }}>
          <img src={loadingImg.src} style={{ height: '50px', width: '50px' }} alt="" />
          <div>Loading...</div>
        </h4>
      );
    }
  }

  imageSelection(goatzObj: any) {
    if (!this.state.firstSelectedGoat) {
      goatzObj['selected'] = true;
      this.setState({ firstSelectedGoat: goatzObj })
    } else if (!this.state.secondSelectedGoat && goatzObj['id'] != this.state.firstSelectedGoat['id']) {
      goatzObj['selected'] = true;
      this.setState({ secondSelectedGoat: goatzObj })
    }
  }

  getImageParamFrom(optionType: number, fieldType: string) {
    if (optionType == 1) {
      return this.state.firstSelectedGoat[fieldType] + '.png';
    } else if (optionType == 2) {
      return this.state.secondSelectedGoat[fieldType] + '.png';
    }
    return ''
  }

  getParamFrom(optionType: number, fieldType: string) {
    if (optionType == 1) {
      return this.state.firstSelectedGoat[fieldType];
    } else if (optionType == 2) {
      return this.state.secondSelectedGoat[fieldType];
    }
    return ''
  }

  getRevParamFrom(optionType: number, fieldType: string) {
    if (optionType == 2) {
      return this.state.firstSelectedGoat[fieldType];
    } else if (optionType == 1) {
      return this.state.secondSelectedGoat[fieldType];
    }
    return ''
  }

  onResetAll() {
    this.setState({ background: 0, fur: 0, outfit: 0, earring: 0, eyes: 0, mouth: 0, horns: 0, id: 0, ville: null, firstSelectedGoat: null, secondSelectedGoat: null })

    if (this.state.mintedGoatzObjList && this.state.mintedGoatzObjList.length > 0) {
      for (let i = 0; i < this.state.mintedGoatzObjList.length; i++) {
        this.resetObj(this.state.mintedGoatzObjList[i]);
      }
    }
  }

  onForge() {
    if (this.isAllOption()) {
      if (this.state.isMinting) {
        toastr.success("Do Not REFRESH! Forge In Progress..")
        return;
      }
      let commonStr = "";
      let burnedStrCheck = "";
      let simpleStrCheck = "";
      commonStr = commonStr + this.getRevParamFrom(this.state.background, 'Background');
      commonStr = commonStr + this.getRevParamFrom(this.state.fur, 'Fur');
      commonStr = commonStr + this.getRevParamFrom(this.state.outfit, 'Outfit');
      commonStr = commonStr + this.getRevParamFrom(this.state.earring, 'Earring');
      commonStr = commonStr + this.getRevParamFrom(this.state.eyes, 'Eyes');
      commonStr = commonStr + this.getRevParamFrom(this.state.mouth, 'Mouth');
      commonStr = commonStr + this.getRevParamFrom(this.state.horns, 'Horns');
      burnedStrCheck = '' + commonStr;

      if (list.indexOf(commonStr) >= 0) {
        toastr.error("This exact GOAT already exists, please try a different combination");
        return;
      }

      commonStr = commonStr + this.state.ville;
      commonStr = commonStr + '#' + this.getRevParamFrom(this.state.id, 'id');
      let notBurned = "";
      notBurned = notBurned + this.getParamFrom(this.state.background, 'Background');
      notBurned = notBurned + this.getParamFrom(this.state.fur, 'Fur');
      notBurned = notBurned + this.getParamFrom(this.state.outfit, 'Outfit');
      notBurned = notBurned + this.getParamFrom(this.state.earring, 'Earring');
      notBurned = notBurned + this.getParamFrom(this.state.eyes, 'Eyes');
      notBurned = notBurned + this.getParamFrom(this.state.mouth, 'Mouth');
      notBurned = notBurned + this.getParamFrom(this.state.horns, 'Horns');
      simpleStrCheck = '' + notBurned;
      notBurned = notBurned + '#' + this.getParamFrom(this.state.id, 'id');

      let allColsData = {
        "Token ID": this.getParamFrom(this.state.id, 'id'),
        "Background": this.getParamFrom(this.state.background, 'Background'),
        "Fur": this.getParamFrom(this.state.fur, 'Fur'),
        "Outfit": this.getParamFrom(this.state.outfit, 'Outfit'),
        "Earring": this.getParamFrom(this.state.earring, 'Earring'),
        "Eyes": this.getParamFrom(this.state.eyes, 'Eyes'),
        "Mouth": this.getParamFrom(this.state.mouth, 'Mouth'),
        "Horns": this.getParamFrom(this.state.horns, 'Horns'),

        "Token ID Burned": this.getRevParamFrom(this.state.id, 'id'),
        "Background Burned": this.getRevParamFrom(this.state.background, 'Background'),
        "Fur Burned": this.getRevParamFrom(this.state.fur, 'Fur'),
        "Outfit Burned": this.getRevParamFrom(this.state.outfit, 'Outfit'),
        "Earring Burned": this.getRevParamFrom(this.state.earring, 'Earring'),
        "Eyes Burned": this.getRevParamFrom(this.state.eyes, 'Eyes'),
        "Mouth Burned": this.getRevParamFrom(this.state.mouth, 'Mouth'),
        "Horns Burned": this.getRevParamFrom(this.state.horns, 'Horns'),

        "House Selection": this.state.ville
      }

      let burnId = this.getRevParamFrom(this.state.id, 'id')
      let unBurnId = this.getParamFrom(this.state.id, 'id')
      this.setState({ isMinting: true })
      this.appendSpreadsheet({ commonString: notBurned, 'commonString Burned': commonStr }, allColsData, burnId, unBurnId, burnedStrCheck, simpleStrCheck)
    } else {
      if (!this.state.ville) {
        toastr.error("You have not chosen a house type in GOATzVILLE");
      } else {
        toastr.error("You have not made a selection on all traits");
      }
    }
  }

  isAllOption() {
    if (this.state.background && this.state.fur && this.state.outfit && this.state.earring && this.state.eyes && this.state.mouth && this.state.horns && this.state.id && this.state.ville) {
      return true;
    } else {
      return false
    }
  }

  resetObj(goatzObj: any) {
    goatzObj['selected'] = false;
  }

  async appendSpreadsheet(newRow: any, newRowAll: any, burnId: any, unBurnId: any, burnedStrCheck: string, simpleStrCheck: string) {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];
      const sheetAll = doc.sheetsById[SHEET_ID_ALL];

      const sheetTemp = doc.sheetsById[SHEET_ID_TEMP];
      const sheetAllTemp = doc.sheetsById[SHEET_ID_ALL_TEMP];

      const rows = await sheet.getRows();

      const sheetAccessToken = doc.sheetsById[SHEET_ALL_ACCESSTOKEN_ID];
      const rowsAccessToken = await sheetAccessToken.getRows();
      let matchCount = 0;
      let isCountMatched = false;
      if (rowsAccessToken && rowsAccessToken.length > 0) {
        for (let row of rowsAccessToken) {
          if ([burnId, unBurnId].indexOf(row['ID']) >= 0) {
            matchCount = matchCount + 1;
            if (matchCount == [burnId, unBurnId].length) {
              isCountMatched = true;
              break;
            }
          }
        }
      }

      if (!isCountMatched) {
        toastr.error('Either of GOATz have been claimed')
        this.setState({ isMinting: false })
        return;
      }

      if (!rows || (rows && rows.length == 0)) {
        const result = await sheetTemp.addRow(newRow);
        const result2 = await sheetAllTemp.addRow(newRowAll);
        this.burn(burnId, sheet, sheetAll, sheetTemp, sheetAllTemp, newRow, newRowAll);
      } else {
        let canSave: boolean = true;
        for (let row of rows) {
          if (row['commonString'].endsWith('#' + burnId) || row['commonString'].endsWith('#' + unBurnId) ||
            row['commonString Burned'].endsWith('#' + burnId) || row['commonString Burned'].endsWith('#' + unBurnId)) {
            toastr.error("At least 1 of your tokens have been used in the Forge")
            canSave = false;
            break;
          } else if (
            row['commonString'].includes(burnedStrCheck) || row['commonString'].includes(simpleStrCheck) ||
            row['commonString Burned'].includes(burnedStrCheck) || row['commonString Burned'].includes(simpleStrCheck) ||
            row['commonString'] == newRow['commonString'] || row['commonString Burned'] == newRow['commonString Burned']) {
            toastr.error("This exact GOAT already exists, please try a different combination");
            canSave = false;
            break;
          }
        }

        if (canSave) {
          const result = await sheetTemp.addRow(newRow);
          const result2 = await sheetAllTemp.addRow(newRowAll);
          this.burn(burnId, sheet, sheetAll, sheetTemp, sheetAllTemp, newRow, newRowAll)
        } else {
          this.setState({ isMinting: false, isForge: false })
        }
      }
    } catch (e) {
      console.error('Error: ', e);
      this.setState({ isMinting: false, isForge: false })
    }
  };

  async burn(burnId: any, sheet: any, sheetAll: any, sheetTemp: any, sheetAllTemp: any, newRow: any, newRowAll: any) {
    try {
      if (this.state.isEnabled) {
        if (this.props.goatzWeb3Inst) {

          this.setState({ isMinting: true })
          let gasPriceAsync = await this.state.web3.eth.getGasPrice();

          gasPriceAsync = Number(gasPriceAsync) + Number(10000000000);

          this.setState({ isForge: false })
          await this.props.goatzWeb3Inst.methods.burn(burnId).send({
            from: this.state.account,
            gasPrice: this.state.web3.utils.toHex(gasPriceAsync.toString())
          }).then(async (result: any) => {
            newRowAll['transactionHash'] = result.transactionHash;
            const result1 = await sheet.addRow(newRow);
            const result2 = await sheetAll.addRow(newRowAll);
            this.updateRow(sheetAllTemp, newRowAll, result.transactionHash);
            this.setState({ isMinting: false, isForge: false })
            this.onResetAll();
            this.getMintedGoatz()
            toastr.success("Forge Successfully done.");
          }).catch(async (error: any) => {
            this.setState({ isMinting: false, isForge: false })
            toastr.error("Forge Failed");
          });

        }
      } else {
        toastr.info("Please connect your wallet.")
        this.setState({ isMinting: false, isForge: false })
      }
    } catch (e) {
      toastr.error("Forge Failed due to some error.")
      this.setState({ isMinting: false })
    }

  }

  async updateRow(sheetAll: any, newRowAll: any, transactionHash: string) {
    const rows2 = await sheetAll.getRows();
    let rowCounter = 0;
    for (let obj of rows2) {
      // console.log("=====>")
      let counter = 0;
      let matchCount = 0;
      for (let keys of Object.keys(newRowAll)) {
        if (obj[keys] == newRowAll[keys]) {
          matchCount = matchCount + 1;
        }
        counter = counter + 1;
      }
      if (counter - 1 == matchCount) {
        rows2[rowCounter]['transactionHash'] = transactionHash
        await rows2[rowCounter].save();
        break;
      }

      rowCounter = rowCounter + 1;
    }
  }

  setCustomState(type: string, value: any) {
    let obj: any = {};
    obj[type] = value
    this.setState(obj)
  }

  getShortAccountId() {
    let address = "" + (this.state.account ? this.state.account : "");
    return address.slice(0, 8) + "....." + address.slice(address.length - 3, address.length);
  }

  render() {

    return (
      <>
        <div className={style.wrapper}>
          <Head>
            <title>GOATz - Forge</title>
          </Head>

          {!this.state.isForgeActive ? <Container>
            <Image src={ForgeCover} layout="responsive" alt="staking" />
            <p className={style.content}>
              <b>Forge SZN 11 is now closed!</b>
              <br />
              <br />
              <b>The What</b>
              <br />
              2 GOATz go in and 1 GOAT comes out! They say greatness is forged in fire! Through a token burning
              contract you will be able to take two of your GOATz and choose which traits you want your combined
              GOAT to have. The traits you didnʼt choose disappear from the ecosystem forever! There is no cost
              associated with Forging however you will pay gas. We have had 8 Forge SZNs, taking the total supply
              of GOATz to 7,131 (from the original 10,000 minted). The Forge SZNs will be announced at different
              times for those who wish to combine the traits they want their GOATz to carry forward and continue
              the community mission of reducing supply.
              <br /><br />
              <b>The How</b>
              <br />
              Owners of 2 or more GOATz will connect their wallet to the Forge via the website.
              Once the GOATz are loaded, select the 2 you wish to Forge. From there,
              select the Traits and Token ID# you wish to carry forward. Lastly, Forged
              GOATz will have a house built in their honor within GOATzVille, the GOATz
              estate in the Sandbox Metaverse. Be sure to select the house you want and
              Forge away! Within 24 hours after your Forge, the GOAT that remained in
              your wallet will become your Forged GOAT. Be sure to refresh the metadata
              on OpenSea. The GOAT who didnʼt make it is sent to the Burn Address and
              youʼve helped reduce supply in the Deflationary spirit of the project.
              <br />
              <br />
              <b>The Why</b>
              <br />
              Forging is a personal decision and one that doesnʼt come easy for
              everyone. Donʼt feel pressure to Forge. But, here are some reasons
              some choose to Forge:
              <br />
              Forge can increase rarity ranking (see Traits Infographic for more)
              <br />
              Forging can create highly Personalized or Aesthetically pleasing PFPs
              <br />
              Deflation. Deflation. Deflation. As we curate the Herd the remaining GOATz become more and more unique!
              <br />
              A home in GOATzVILLE

            </p>
          </Container> :
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-2 left-bg">
                  <h1 style={{ fontSize: 'calc(1.7vw + 1.6rem)', margin: '0px' }}>GOATz</h1>
                  {
                    this.state.isEnabled ? <a className="w-100 btn btn-wlt" style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>{this.getShortAccountId()} </a>
                      :
                      <a className="w-100 btn btn-wlt" style={{ fontSize: 'calc(0.08vw + 1.6rem)' }} onClick={() => { this.props.connectWallet() }}>CONNECT WALLET &nbsp;
                        <i className="fas fa-angle-right"></i>
                      </a>
                  }

                  <p className="ln-count" style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Your GOATz <span className="count">{this.state.mintedGoatz}</span></p>

                  <div className="row sidebar-goat-list">
                    {this.getLeftPanelGoatz()}
                  </div>

                </div>
                <div className="col-lg-5 middle-bg">
                  <h1 style={{ fontSize: 'calc(1.7vw + 1.6rem)', margin: '0px' }}>The Forge</h1>
                  <p className="description" style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Choose two GOATz to start customizing your Forged GOAT</p>

                  {(this.state.firstSelectedGoat && this.state.secondSelectedGoat) ? <div className="goat-list">
                    {this.state.firstSelectedGoat ?
                      <div className="list-item">
                        <a><img src={this.state.firstSelectedGoat.image} alt="" /></a>
                      </div>
                      : ''}
                    {this.state.secondSelectedGoat ?
                      <div className="list-item">
                        <a><img src={this.state.secondSelectedGoat.image} alt="" /></a>
                      </div>
                      : ''}
                  </div> : ''}
                  <div className="goat-single">
                    {/* <img src="images/b3.jpg" alt="" /> */}
                    {this.state.background > 0 ? <img src={urls['Background'] + this.getImageParamFrom(this.state.background, 'Background')} alt="" /> : null}
                    {this.state.fur > 0 ? <img src={urls['Fur'] + this.getImageParamFrom(this.state.fur, 'Fur')} alt="" /> : null}
                    {this.state.outfit > 0 ? <img src={urls['Outfit'] + this.getImageParamFrom(this.state.outfit, 'Outfit')} alt="" /> : null}
                    {this.state.earring > 0 ? <img src={urls['Earring'] + this.getImageParamFrom(this.state.earring, 'Earring')} alt="" /> : null}
                    {this.state.eyes > 0 ? <img src={urls['Eyes'] + this.getImageParamFrom(this.state.eyes, 'Eyes')} alt="" /> : null}
                    {this.state.mouth > 0 ? <img src={urls['Mouth'] + this.getImageParamFrom(this.state.mouth, 'Mouth')} alt="" /> : null}
                    {this.state.horns > 0 ? <img src={urls['Horns'] + this.getImageParamFrom(this.state.horns, 'Horns')} alt="" /> : null}
                  </div>

                </div>
                <div className="col-lg-3 right-bg">
                  <h2 style={{ fontSize: 'calc(1.7vw + 1.6rem)', margin: '0px' }}>Personalization</h2>
                  <span style={{ fontSize: 'calc((1.4 - 1) * 1vw + 1rem)', color: 'red' }}>MUST READ: </span>
                  <span style={{ fontSize: 'calc((1.4 - 1) * 1vw + 1rem)' }}>You may not see v2 traits in the preview, but they Will transfer over. The token ID you do NOT select will be burned; the token ID you do select will be updated ON MONDAY 8/1 with the new combined traits!</span>

                  {/* <p className="updated-time">Last Updated: 20:59 UTC</p> */}
                  {(this.state.firstSelectedGoat && this.state.secondSelectedGoat) ? <div>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Background</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.background == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('background', 1)}>{this.state.firstSelectedGoat.Background}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.background == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('background', 2)}>{this.state.secondSelectedGoat.Background}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Fur</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.fur == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('fur', 1)}>{this.state.firstSelectedGoat.Fur}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.fur == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('fur', 2)}>{this.state.secondSelectedGoat.Fur}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Outfit</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.outfit == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('outfit', 1)}>{this.state.firstSelectedGoat.Outfit}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.outfit == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('outfit', 2)}>{this.state.secondSelectedGoat.Outfit}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Earring</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.earring == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('earring', 1)}>{this.state.firstSelectedGoat.Earring}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.earring == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('earring', 2)}>{this.state.secondSelectedGoat.Earring}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Eyes</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.eyes == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('eyes', 1)}>{this.state.firstSelectedGoat.Eyes}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.eyes == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('eyes', 2)}>{this.state.secondSelectedGoat.Eyes}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Mouth</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.mouth == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('mouth', 1)}>{this.state.firstSelectedGoat.Mouth}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.mouth == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('mouth', 2)}>{this.state.secondSelectedGoat.Mouth}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Horn</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.horns == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('horns', 1)}>{this.state.firstSelectedGoat.Horns}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.horns == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('horns', 2)}>{this.state.secondSelectedGoat.Horns}</a>

                    <h3 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>Token ID</h3>
                    <a className={"w-50 btn btn-cst " + ((this.state.id == 1) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('id', 1)} >#{this.state.firstSelectedGoat.id}</a>
                    <a className={"w-50 btn btn-cst " + ((this.state.id == 2) ? "active" : '')} style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }} onClick={() => this.setCustomState('id', 2)} >#{this.state.secondSelectedGoat.id}</a>

                    <div className="btn-wrapper">
                      {/* <a className="forge-btn" style={{ cursor: isAllOption() ? '' : 'no-drop' }} onClick={() => onForge()}><img src={isMinting ? "images/forge-btn-running.png" : "images/forge-btn.png"} alt="" /></a> */}
                      <a className="w-50 btn btn-cst forge-btn" style={{ borderRadius: '30px', fontSize: 'calc(1vw + 1.6rem)', borderWidth: '2px', cursor: this.isAllOption() ? '' : 'no-drop', backgroundColor: this.state.isMinting ? '#f0cf67' : '', color: this.state.isMinting ? '#000' : '' }} onClick={() => this.onForge()} >FORGE</a>
                      <a className="delete-btn" onClick={() => this.onResetAll()}><img src="images/delete-btn.png" alt="" style={{ height: '57px' }} /></a>
                    </div>
                  </div> : ''}

                </div>

                <div className="col-lg-2 right-bg">
                  <h2 style={{ fontSize: 'calc((1.4 - 1) * 1.2vw + 1.6rem)' }}>GOATzVILLE</h2>
                  {this.state.isEnabled ? <div className="row sidebar-goat-list" style={{ textAlign: 'center' }}>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Cabin')}>
                        <img className="mb-4" style={{ width: '150px', marginTop: '10px', border: (this.state.ville == 'Cabin' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Cabin.png" alt="" />
                      </a>
                    </div>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Cottage')}>
                        <img className="mb-4" style={{ width: '150px', border: (this.state.ville == 'Cottage' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Cottage.png" alt="" />
                      </a>
                    </div>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Farmhouse')}>
                        <img className="mb-4" style={{ width: '150px', border: (this.state.ville == 'Farmhouse' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Farmhouse.png" alt="" />
                      </a>
                    </div>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Modern')}>
                        <img className="mb-4" style={{ width: '150px', border: (this.state.ville == 'Modern' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Modern.png" alt="" />
                      </a>
                    </div>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Spanish')}>
                        <img className="mb-4" style={{ width: '150px', border: (this.state.ville == 'Spanish' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Spanish.png" alt="" />
                      </a>
                    </div>
                    <div className="col-md-12">
                      <a onClick={() => this.setCustomState('ville', 'Villa')}>
                        <img className="mb-4" style={{ width: '150px', border: (this.state.ville == 'Villa' ? 'solid 3px red' : 'none') }} src="https://goatz.mypinata.cloud/ipfs/QmdNSfejVBDH5hD4SPKHXsh6TyTmRD3hg4FoXimZtK6BS6/Villa.png" alt="" />
                      </a>
                    </div>
                  </div> : ''}
                </div>
              </div>
            </div>}


          {(this.state.isForge) ? (<div id="toast-container" className="toast-top-right">
            <div className="toast toast-info" aria-live="assertive">
              <div className="toast-message">Do not REFRESH! Forge in Progress...</div>
            </div>
          </div>) : ''}
        </div>
      </>
    );
  }
}
