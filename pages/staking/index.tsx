import Container from "@mui/material/Container";
import { useState, useRef } from 'react'
import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import style from "./staking.module.scss";
import StakingCover from "../../public/images/staking.png";
import gmilk1 from '../../public/images/gmilk1.png'
import Link from "next/link";
import RoadMapButton from "../../public/images/buttonBgConnect.png";
import Head from "next/head";
import CloseIcon from '@mui/icons-material/Close';
import toastr from 'toastr';
import { STAKING_ABI_ADDRESS } from "@config/abi-config";

export default class Stacking extends React.Component<any, any> {
  state: any = {};

  constructor(props: any) {
    super(props);
    this.state = {
      isEnabled: this.props.isEnabled,
      account: this.props.account,
      web3: this.props.web3,
      mintWeb3Inst: this.props.mintWeb3Inst,
      showModal: false,
      claimCheckInputValue: '',
      claimCheckStatus: 'STATUS',
      isAlreadyConnected: false,
      totalGoatz: '',
      mintedGoatzIdList: null,
      mintedGoatzObjList: [],
      selectedGoat: [],

      totalUnstakedKidz: 0,
      allUnstakedKidz: [],
      selectedUnstakedKidz: [],
      totalStakedGmilkKidz: 0,
      unstakedKidsInput: 0,
      showUnstakeKidzModal: false,

      totalStakedKidz: 0,
      allStakedKidz: [],
      selectedStakedKidz: [],
      showStakeKidzToUnstakeModal: false,

      transactionStatus: 'start'
    };
    toastr.options = {
      // positionClass: 'toast-top-full-width',
      hideDuration: 300,
      timeOut: 3000,
    };
    // console.log(this.props)
  }

  componentDidMount() {
    if (this.state.isEnabled) {
      this.onLoadData();
    }
  }

  componentWillReceiveProps(newProps: any) {
    this.setStateFromWithNewProps(newProps)
  }

  async setStateFromWithNewProps(props: any) {
    // console.log("new Props:::", props)
    // console.log(this.state)
    let canUpdate = false;
    if (props.isEnabled && !this.state.isEnabled) {
      canUpdate = true;
    }
    await this.setState({
      isEnabled: props.isEnabled,
      account: props.account,
      web3: props.web3,
      mintWeb3Inst: props.mintWeb3Inst,
    })

    if (canUpdate && !this.state.isAlreadyConnected) {
      this.onLoadData()
    }

  }

  async onLoadData() {
    await this.setState({ isAlreadyConnected: true })
    this.getMintedGoatz();
    this.getUnstakedKidz();
    this.getStakedKidz();
  }

  async getMintedGoatz() {
    try {
      let totalGoatz = await this.props.goatzWeb3Inst.methods.balanceOf(this.state.account).call();
      console.log("totalGoatz", totalGoatz)
      this.setState({ totalGoatz: totalGoatz })
      if (totalGoatz > 0) {
        let list: any[] = [];
        this.getMintedGoatzList(list, totalGoatz, 0);
      }
    } catch (e) {

    }
  }

  async getMintedGoatzList(list: any[], totalGoatz: number, index: number) {
    if (index <= totalGoatz - 1) {
      let temp = await this.props.goatzWeb3Inst.methods.tokenOfOwnerByIndex(this.state.account, index).call();
      list.push(temp)

      await this.getMintedGoatzList(list, totalGoatz, index + 1);
    } else if (index > totalGoatz - 1) {
      //set in state
      // console.log(list)
      await this.setState({ mintedGoatzIdList: list });
      if (list && list.length > 0) {
        this.getMintedGoatzObj([], 0, list.length, list)
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
            // console.log(result);
            for (let attr of result?.attributes) {
              result[attr.trait_type] = attr.value;
            }
            result['id'] = list[index];
            goatzList.push(result);
            this.getMintedGoatzObj(goatzList, index + 1, totalLength, list)
          },
          (error) => {
            console.error("Error:::", error)
            this.getMintedGoatzObj(goatzList, index, totalLength, list)
          }
        )
    } else if (index > totalLength - 1) {
      // console.log(goatzList)
      this.setState({ mintedGoatzObjList: goatzList })
    }
  }

  getLeftPanelGoatz() {
    if (this.state.mintedGoatzObjList && this.state.mintedGoatzObjList.length > 0) {
      return this.state.mintedGoatzObjList.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.imageSelection(e) }} alt="" />;
      })
    } else {
      return <h4 style={{ textAlign: 'center' }}>No any GOATz to CLAIM!</h4>;
    }
  }

  imageSelection(goatzObj: any) {
    let tempSelectedGoat = this.state.selectedGoat;
    let inx = tempSelectedGoat.indexOf(goatzObj['id']);
    if (inx >= 0) {
      goatzObj['selected'] = false;
      tempSelectedGoat.splice(inx, 1);
    } else {
      goatzObj['selected'] = true;
      tempSelectedGoat.push(goatzObj['id']);
    }
    this.setState({ selectedGoat: tempSelectedGoat })
    // onTempRefreshChange(goatzObj)
  }

  async getUnstakedKidz() {
    try {
      let allKidz = await this.props.kidzWeb3Inst.methods.walletOfOwner(this.state.account).call();
      let length = allKidz ? allKidz.length : 0;
      this.setState({ totalUnstakedKidz: length })
      this.getUnstakedKidzObj([], 0, length, allKidz)
    } catch (e) {

    }
  }

  isAnyTransactionInProgress() {
    console.log("test",
    this.state.transactionStatus == "inprogress",
    this.state.transactionStatus)
    if (this.state.transactionStatus == "inprogress") {
      return true;
    }
    return false;
  }

  async getUnstakedKidzObj(kidzList: any[], index: number, totalLength: number, list: string[]) {
    if (index <= totalLength - 1) {
      fetch('https://goatz.mypinata.cloud/ipfs/QmdyFz4XFd48pazKyEcL9dS8fjpUSMeGJuqoWwLtsyjfDY/' + list[index])
        .then(res => res.json())
        .then(
          (result) => {
            // console.log(result);
            for (let attr of result?.attributes) {
              result[attr.trait_type] = attr.value;
            }
            result['id'] = list[index];
            kidzList.push(result);
            this.getUnstakedKidzObj(kidzList, index + 1, totalLength, list)
          },
          (error) => {
            console.error("Error:::", error)
            this.getUnstakedKidzObj(kidzList, index, totalLength, list)
          }
        )
    } else if (index > totalLength - 1) {
      // console.log(kidzList)
      this.setState({ allUnstakedKidz: kidzList })
    }
  }

  getLeftPanelUnstakedKidz() {
    if (this.state.allUnstakedKidz && this.state.allUnstakedKidz.length > 0) {
      return this.state.allUnstakedKidz.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.unstakedKidzImageSelection(e) }} alt="" />;
      })
    } else {
      return <h4 style={{ textAlign: 'center' }}>No any UNSTAKED KIDz!</h4>;
    }
  }

  unstakedKidzImageSelection(goatzObj: any) {
    if (this.state.transactionStatus == 'start') {
      let tempSelectedKidz = this.state.selectedUnstakedKidz;
      let inx = tempSelectedKidz.indexOf(goatzObj['id']);
      if (inx >= 0) {
        goatzObj['selected'] = false;
        tempSelectedKidz.splice(inx, 1);
      } else {
        goatzObj['selected'] = true;
        tempSelectedKidz.push(goatzObj['id']);
      }
      this.setState({ selectedUnstakedKidz: tempSelectedKidz, unstakedKidsInput: tempSelectedKidz.length });
      // onTempRefreshChange(goatzObj)
    }
  }

  //Staked Kidz
  async getStakedKidz() {
    try {
      let allKidz = await this.props.stakingWeb3Inst.methods.depositsOf(this.state.account).call();
      let length = allKidz ? allKidz.length : 0;
      this.setState({ totalStakedKidz: length })
      this.getStakedKidzObj([], 0, length, allKidz);
      let totalGMilkList = await this.props.stakingWeb3Inst.methods.calculateRewards(this.state.account, allKidz).call();
      let total = 0;
      for (let item of totalGMilkList) {
        total = total + item;
      }
      this.setState({ totalStakedGmilkKidz: total / 1e18 });
    } catch (e) {
      console.error(e)
    }
  }

  async getStakedKidzObj(kidzList: any[], index: number, totalLength: number, list: string[]) {
    if (index <= totalLength - 1) {
      fetch('https://goatz.mypinata.cloud/ipfs/QmdyFz4XFd48pazKyEcL9dS8fjpUSMeGJuqoWwLtsyjfDY/' + list[index])
        .then(res => res.json())
        .then(
          (result) => {
            // console.log(result);
            for (let attr of result?.attributes) {
              result[attr.trait_type] = attr.value;
            }
            result['id'] = list[index];
            kidzList.push(result);
            this.getStakedKidzObj(kidzList, index + 1, totalLength, list)
          },
          (error) => {
            console.error("Error:::", error)
            this.getStakedKidzObj(kidzList, index, totalLength, list)
          }
        )
    } else if (index > totalLength - 1) {
      // console.log(kidzList)
      this.setState({ allStakedKidz: kidzList })
    }
  }

  getLeftPanelStakedKidz() {
    if (this.state.allStakedKidz && this.state.allStakedKidz.length > 0) {
      return this.state.allStakedKidz.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.stakedKidzImageSelection(e) }} alt="" />;
      })
    } else {
      return <h4 style={{ textAlign: 'center' }}>No any STAKED KIDz!</h4>;
    }
  }

  stakedKidzImageSelection(goatzObj: any) {
    if (this.state.transactionStatus == 'start') {
      let tempSelectedKidz = this.state.selectedStakedKidz;
      let inx = tempSelectedKidz.indexOf(goatzObj['id']);
      if (inx >= 0) {
        goatzObj['selected'] = false;
        tempSelectedKidz.splice(inx, 1);
      } else {
        goatzObj['selected'] = true;
        tempSelectedKidz.push(goatzObj['id']);
      }
      this.setState({ selectedStakedKidz: tempSelectedKidz })
      // onTempRefreshChange(goatzObj)
    }
  }

  getShortAccountId() {
    let address = "" + (this.state.account ? this.state.account : "");
    return (
      address.slice(0, 8) +
      "....." +
      address.slice(address.length - 3, address.length)
    );
  }

  scrollTop() {
    console.log('first')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  setShowModal(value: boolean) {
    this.setState({ showModal: value })
  }

  setUnstakedKidzModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      this.setState({ showUnstakeKidzModal: value })
    }
  }

  setStakedKidzToUnstakeModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      this.setState({ showStakeKidzToUnstakeModal: value })
    }
  }

  onUnstakedKidsInputInputChanged(value: string) {
    if (this.state.transactionStatus == 'start') {
      let number = Number(value);
      if (value == '.') {
        value = '0';
        number = 0;
      }
      if (!isNaN(number) && number < 10000000000) {
        let dec = (value + '').split('.');
        if (dec[1]) {
          // return;
        }
        this.setState({ unstakedKidsInput: dec[0] });
      }
    }
  }

  onClaimCheckInputChanged(value: string) {
    let number = Number(value);
    if (value == '.') {
      value = '0';
      number = 0;
    }
    if (!isNaN(number) && number < 10000000000) {
      let dec = (value + '').split('.');
      if (dec[1]) {
        // return;
      }
      this.setState({ claimCheckInputValue: dec[0] });
    }
  }

  async onClaimCheck() {
    try {
      if (this.state.isEnabled) {
        let isClaimed = await this.props.stakingWeb3Inst.methods.goatzClaimed(this.state.claimCheckInputValue).call();
        toastr.success(isClaimed ? "GOATz already claimed!" : "GOATz is available to claim!")
        this.setState({ claimCheckStatus: isClaimed ? 'CLAIMED' : 'UNCLAIMED' })
      } else {
        toastr.error("Please connect your wallet.")
        this.setState({ claimCheckStatus: 'STATUS' })
      }
    } catch (e) {
      this.setState({ claimCheckStatus: 'STATUS' })
    }
  }


  async onUnstakeToStakeKidz() {
    try {
      if (this.state.isEnabled) {
        if (this.state.transactionStatus != 'start') {
          toastr.warning("One Transaction is In-Progress!");
          return
        }
        await this.setState({ transactionStatus: 'inprogress' });
        let isApproved = await this.props.kidzWeb3Inst.methods.isApprovedForAll(this.state.account, STAKING_ABI_ADDRESS).call();
        console.log("isApproved::", isApproved)
        if (!isApproved) {
          await this.props.kidzWeb3Inst.methods.setApprovalForAll(STAKING_ABI_ADDRESS, true).send({
            from: this.state.account
          }).then(async (result: any) => {
            isApproved = true;
            await this.stakeKidz();
          }).catch((error: any) => {
            isApproved = false
            toastr.error("Approve Failed");
          });
        }

        if (isApproved) {
          await this.stakeKidz();
        }

      } else {
        await this.setState({ transactionStatus: 'start' });
        toastr.error("Please connect your wallet.")
      }
    } catch (e) {
      await this.setState({ transactionStatus: 'start' });
    }
  }

  async stakeKidz() {
    let ids = [];

    // for (let item of this.state.selectedUnstakedKidz) {
    //   ids.push(item.id)
    // }
    // console.log(typeof ids, ids, this.state.selectedUnstakedKidz);
    try {
      let gaslimit = await this.props.stakingWeb3Inst.methods.deposit(this.state.selectedUnstakedKidz).estimateGas({
        from: this.state.account
      });
    }
    catch (e) {
      throw e;
    }
    await this.props.stakingWeb3Inst.methods.deposit(this.state.selectedUnstakedKidz).send({
      from: this.state.account
    }).then(async (result: any) => {
      await this.getUnstakedKidz();
      await this.getStakedKidz();
      toastr.success("Stake succesfully done")
    }).catch(async (error: any) => {
      await this.getUnstakedKidz();
      await this.getStakedKidz();
      toastr.error("Stake Failed");
    });
    await this.setState({ transactionStatus: 'start' });
  }

  async unstakeKidz() {
    try {
      if (this.state.isEnabled) {
        if (this.state.transactionStatus != 'start') {
          toastr.warning("One Transaction is In-Progress!");
          return
        }
        await this.setState({ transactionStatus: 'inprogress' });
        let ids = [];

        // for (let item of this.state.selectedStakedKidz) {
        //   ids.push(item.id)
        // }
        await this.props.stakingWeb3Inst.methods.withdraw(this.state.selectedStakedKidz).send({
          from: this.state.account
        }).then((result: any) => {
          toastr.success("Stake succesfully done")
        }).catch((error: any) => {
          toastr.error("Stake Failed");
        });
        this.getMintedGoatz();
        this.getUnstakedKidz();
        this.getStakedKidz();
        await this.setState({ transactionStatus: 'start' });

      } else {
        await this.setState({ transactionStatus: 'start' });
        toastr.error("Please connect your wallet.")
      }
    } catch (e) {
      await this.setState({ transactionStatus: 'start' });
    }
  }

  render() {
    return (
      <div className={style.wrapper}>
        <Head>
          <title>GOATz - Staking</title>
        </Head>
        {this.state.showModal && <div className={style.modal} > {this.scrollTop()}
          <span className={style.icon} onClick={() => this.setShowModal(false)}><CloseIcon /></span>
          <div>
            <p >YOU ARE ABOUT TO CLAIM 8420 GMILK WITH 40% TAX</p>
            <Link href="/roadmap">
              <a className={style.roadMapButton}>
                <Image src={RoadMapButton} objectFit="none" alt="benefits-image" />
              </a>
            </Link>
          </div>
        </div>}

        {(this.isAnyTransactionInProgress()) ? (<div id="toast-container" className="toast-top-right">
          <div className="toast toast-info" aria-live="assertive">
            <div className="toast-message">Transaction is in progress.</div>
          </div>
        </div>) : ''}

        {this.state.showUnstakeKidzModal && <div className={style.modal} > {this.scrollTop()}
          <span className={style.icon} onClick={() => this.setUnstakedKidzModal(false)}><CloseIcon /></span>
          <div>
            <p >YOU ARE ABOUT TO STAKE {this.state.selectedUnstakedKidz && this.state.selectedUnstakedKidz.length > 0 ? this.state.selectedUnstakedKidz.length : 0} KIDz</p>
            {this.state.selectedUnstakedKidz && this.state.selectedUnstakedKidz.length > 0 ? <Button onClick={() => { this.onUnstakeToStakeKidz() }}>
              <a className={style.connectButton}>
                CONFIRM
              </a>
            </Button> : ''}
          </div>
        </div>}

        {this.state.showStakeKidzToUnstakeModal && <div className={style.modal} > {this.scrollTop()}
          <span className={style.icon} onClick={() => this.setStakedKidzToUnstakeModal(false)}><CloseIcon /></span>
          <div>
            <p >YOU ARE ABOUT TO UNSTAKE {this.state.selectedStakedKidz && this.state.selectedStakedKidz.length > 0 ? this.state.selectedStakedKidz.length : 0} KIDz</p>
            {this.state.selectedStakedKidz && this.state.selectedStakedKidz.length > 0 ? <Button onClick={() => { this.unstakeKidz() }}>
              <a className={style.connectButton}>
                CONFIRM
              </a>
            </Button> : ''}
          </div>
        </div>}

        <Container>
          <Image src={StakingCover} layout="responsive" alt="staking" />
          <p className={style.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
            est laborum.
          </p>
        </Container>
        <Container>
          {this.state.isEnabled ?
            <Button>
              <a className={style.connectedButton}>
                {this.getShortAccountId()}
              </a>
            </Button>
            :
            <Button onClick={() => { this.props.connect() }}>
              <a className={style.connectButton}>
                Connect
              </a>
            </Button>}

          {/* <a className={style.roadMapButton}>
                <Image src={RoadMapButton} objectFit="none" alt="benefits-image" />
              </a> */}

          <div className={style.gmilk1}>
            <img src={gmilk1.src} alt="" />
            <h1>TIME FOR SOME <br /> $GMILK</h1>
          </div>

          <div className={style.content}>
            <div>
              <span>KIDz UNSTAKED</span>
              <div className={style.card}>
                {this.getLeftPanelUnstakedKidz()}
              </div>
            </div>
            <div  >
              <span> &nbsp; </span>
              {/* <p className={style.yellowbg}> 6 </p> */}
              <input className={style.cardinput} style={{ textAlign: 'center', 'fontWeight': 'bold', 'fontSize': '30px' }}
                type='text' value={this.state.unstakedKidsInput}
                placeholder="0"
                onChange={(event) => this.onUnstakedKidsInputInputChanged(event.target.value)} />
              <div className={`${style.btngroup} ${style.btn100}`} >
                <button className={this.state.selectedUnstakedKidz && this.state.selectedUnstakedKidz.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setUnstakedKidzModal(true)}> STAKE </button>
              </div>
            </div>
          </div>

          <div className={style.content}>
            <div>
              <span>KIDz STAKED</span>
              <div className={style.card}>
                {this.getLeftPanelStakedKidz()}
              </div>
            </div>
            <div>
              <span> &nbsp; </span>
              <p className={style.yellowbg}> {this.state.totalStakedGmilkKidz} GMILK </p>
              <div className={style.btngroup}>
                <button className={this.state.allStakedKidz && this.state.allStakedKidz.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setShowModal(true)}> CLAIM </button>
                <button className={this.state.selectedStakedKidz && this.state.selectedStakedKidz.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setStakedKidzToUnstakeModal(true)}> UNSTAKE </button>
              </div>
            </div>
          </div>

          <div className={style.content}>
            <div>
              <span>GOATz UNCLAIMED</span>
              <div className={style.card}>
                {this.getLeftPanelGoatz()}
              </div>
            </div>
            <div >
              <span> &nbsp; </span>
              <p className={style.yellowbg}> 46k GMILK </p>
              <div className={`${style.btngroup} ${style.btn100}`}>
                <button className={this.state.selectedGoat && this.state.selectedGoat.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setShowModal(true)}> CLAIM </button>
              </div>
            </div>
          </div>

          <div className={style.content}>
            <div>
              <span>GOATz ID # CLAIM CHECK</span>
              <input className={style.cardinput} type='text' value={this.state.claimCheckInputValue} onChange={(event) => this.onClaimCheckInputChanged(event.target.value)} />

            </div>
            <div >
              <p></p>
              <div className={style.btngroup}>
                <button className={this.state.claimCheckInputValue ? style.yellowbtn : style.disabledbtn} disabled={this.state.claimCheckInputValue ? false : true} onClick={() => this.onClaimCheck()}> CHECK </button>
                <button className={(this.state.claimCheckStatus == 'UNCLAIMED' ? style.unclaimedBtn : (this.state.claimCheckStatus == 'CLAIMED' ? style.claimedBtn : style.disabledbtn))} disabled={true}> {this.state.claimCheckStatus} </button>
              </div>
            </div>
          </div>
        </Container >

      </div >
    );
  };
}