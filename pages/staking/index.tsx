import Container from "@mui/material/Container";
import { useState, useRef } from 'react'
import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import style from "./staking.module.scss";
import StakingCover from "../../public/images/staking.png";
import gmilk1 from '../../public/images/gmilk1.png'
import loadingImg from '../../public/images/Spin.gif'
import Link from "next/link";
import RoadMapButton from "../../public/images/buttonBgConnect.png";
import Head from "next/head";
import CloseIcon from '@mui/icons-material/Close';
import toastr from 'toastr';
import { STAKING_ABI_ADDRESS } from "@config/abi-config";
import { Util } from 'util/util';
import BigNumber from 'bignumber.js';

export default class Stacking extends React.Component<any, any> {
  state: any = {};

  constructor(props: any) {
    super(props);
    this.state = {
      isEnabled: this.props.isEnabled,
      account: this.props.account,
      web3: this.props.web3,
      claimCheckInputValue: '',
      claimCheckStatus: 'STATUS',
      isAlreadyConnected: false,
      totalGoatz: '',
      mintedGoatzIdList: null,
      mintedGoatzObjList: [],
      selectedGoat: [],
      unstakedGoatzLoading: false,

      totalUnstakedKidz: 0,
      allUnstakedKidz: [],
      selectedUnstakedKidz: [],
      totalStakedGmilkKidz: 0,
      unstakedKidsInput: '',
      showUnstakeKidzModal: false,
      showClaimKidzModal: false,
      actualClaimmableRewards: '',
      taxAmount: '',
      unstakedKidzLoading: false,

      totalStakedKidz: 0,
      allStakedKidz: [],
      selectedStakedKidz: [],
      showStakeKidzToUnstakeModal: false,
      showClaimGoatzModal: false,
      stakedKidzLoading: false,

      transactionStatus: 'start'
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
    this.setStateFromWithNewProps(newProps)
  }

  async setStateFromWithNewProps(props: any) {
    let canUpdate = false;
    if (props.isEnabled && !this.state.isEnabled) {
      canUpdate = true;
    }
    if (props.isEnabled != this.state.isEnabled || props.account != this.state.account || props.web3 != this.state.web3) {
      await this.setState({
        isEnabled: props.isEnabled,
        account: props.account,
        web3: props.web3,
      })
    }

    if (canUpdate && !this.state.isAlreadyConnected) {
      this.onLoadData()
    }

  }

  getWeiFormated = (number: any, decimals: any) => {
    let baseNum: any = new BigNumber(10);
    let decimalBig: any = new BigNumber(decimals);
    return this.getFormated(new BigNumber(number).dividedBy(baseNum ** decimalBig).toFixed(6));
  }

  getFormated(str: any) {
    if (str.endsWith('.000000')) {
      return str.replace('.000000', '');
    } else if (str.endsWith('.00000')) {
      return str.replace('.00000', '');
    } else if (str.endsWith('.0000')) {
      return str.replace('.0000', '');
    } else if (str.endsWith('.000')) {
      return str.replace('.000', '');
    } else if (str.endsWith('.00')) {
      return str.replace('.00', '');
    } else if (str.endsWith('.0')) {
      return str.replace('.0', '');
    } else {
      return this.removeTrailingZeros(str)
    }
  }

  removeTrailingZeros(value: any) {
    // # if not containing a dot, we do not need to do anything
    if (!value || value.indexOf('.') === -1) {
      return value;
    }

    // # as long as the last character is a 0 or a dot, remove it
    while ((value.slice(-1) === '0' || value.slice(-1) === '.') && value.indexOf('.') !== -1) {
      value = value.substr(0, value.length - 1);
    }
    return value;
  }

  async onLoadData() {
    await this.setState({ isAlreadyConnected: true })
    this.getMintedGoatz();
    this.getUnstakedKidz();
    this.getStakedKidz();
  }

  async getMintedGoatz() {
    try {
      this.setState({
        totalGoatz: '',
        mintedGoatzIdList: null,
        mintedGoatzObjList: [],
        selectedGoat: [],
        unstakedGoatzLoading: true
      })
      let allGoatzCount = await this.props.goatzWeb3Inst.methods.balanceOf(this.state.account).call();
      if (allGoatzCount > 0) {
        let list: any[] = [];
        this.getMintedGoatzList(list, allGoatzCount, 0);
      } else {
        this.setState({ unstakedGoatzLoading: false })
      }
    } catch (e) {
      console.error(e)
    }
  }

  async getMintedGoatzList(list: any[], allGoatzCount: number, index: number) {
    if (index <= allGoatzCount - 1) {
      let temp = await this.props.goatzWeb3Inst.methods.tokenOfOwnerByIndex(this.state.account, index).call();
      list.push(temp)
      await this.getMintedGoatzList(list, allGoatzCount, index + 1);
    } else if (index > allGoatzCount - 1) {
      //set in state
      let unstakedIdList = await this.props.stakingWeb3Inst.methods.getUnclaimedGoatz(list).call();
      this.setState({ totalGoatz: unstakedIdList.length })
      await this.setState({ mintedGoatzIdList: unstakedIdList });
      if (unstakedIdList && unstakedIdList.length > 0) {
        if (unstakedIdList.length > 1 || (unstakedIdList.length == 1 && unstakedIdList[0] != 0)) {
          this.getMintedGoatzObj([], 0, unstakedIdList.length, unstakedIdList);
        } else {
          this.setState({ mintedGoatzObjList: [], unstakedGoatzLoading: false });
        }
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
            console.error("Error:::", error)
            this.getMintedGoatzObj(goatzList, index, totalLength, list)
          }
        )
    } else if (index > totalLength - 1) {
      this.setState({ mintedGoatzObjList: goatzList, unstakedGoatzLoading: false })
    }
  }

  getGoatzBalance(count: any) {
    try {
      let perGoatPrice = new BigNumber(5.555);
      let amount: any = new BigNumber(count).multipliedBy(perGoatPrice);
      return this.getFormated(amount.toFixed(3)) + (amount.gt(new BigNumber(0)) ? 'K' : '')
    } catch (e) {
      return '-'
    }
  }

  getLeftPanelGoatz() {
    if (this.state.mintedGoatzObjList && this.state.mintedGoatzObjList.length > 0) {
      return this.state.mintedGoatzObjList.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.imageSelection(e) }} alt="" />;
      })
    } else if (!this.state.unstakedGoatzLoading) {
      return <h4 style={{ textAlign: 'center' }}>No any GOATz to CLAIM!</h4>;
    } else if (this.state.unstakedGoatzLoading) {
      return <h4 style={{ textAlign: 'center', margin: '0px' }}><img src={loadingImg.src} style={{ width: '50px', height: '50px' }} /><div>Loading...</div></h4>;
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
      this.setState({
        totalUnstakedKidz: 0,
        allUnstakedKidz: [],
        selectedUnstakedKidz: [],
        totalStakedGmilkKidz: 0,
        unstakedKidsInput: '',
        unstakedKidzLoading: true
      })
      let allKidz = await this.props.kidzWeb3Inst.methods.walletOfOwner(this.state.account).call();
      let length = allKidz ? allKidz.length : 0;
      this.setState({ totalUnstakedKidz: length })
      this.getUnstakedKidzObj([], 0, length, allKidz)
    } catch (e) {

    }
  }

  isAnyTransactionInProgress() {
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
      this.setState({ allUnstakedKidz: kidzList, unstakedKidzLoading: false })
    }
  }

  getLeftPanelUnstakedKidz() {
    if (this.state.allUnstakedKidz && this.state.allUnstakedKidz.length > 0) {
      return this.state.allUnstakedKidz.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.unstakedKidzImageSelection(e) }} alt="" />;
      })
    } else if (!this.state.unstakedKidzLoading) {
      return <h4 style={{ textAlign: 'center' }}>No any UNSTAKED KIDz!</h4>;
    } else if (this.state.unstakedKidzLoading) {
      return <h4 style={{ textAlign: 'center', margin: '0px' }}><img src={loadingImg.src} style={{ width: '50px', height: '50px' }} /><div>Loading...</div></h4>;
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
      this.setState({ selectedUnstakedKidz: tempSelectedKidz, unstakedKidsInput: tempSelectedKidz.length ? tempSelectedKidz.length : '' });
      // onTempRefreshChange(goatzObj)
    } else {
      toastr.warning("One Transaction is In-Progress!");
    }
  }

  //Staked Kidz
  async getStakedKidz() {
    try {
      await this.setState({
        totalStakedKidz: 0,
        allStakedKidz: [],
        selectedStakedKidz: [],
        stakedKidzLoading: true
      })
      let allKidz = await this.props.stakingWeb3Inst.methods.depositsOf(this.state.account).call();
      let length = allKidz ? allKidz.length : 0;
      this.setState({ totalStakedKidz: length })
      this.getStakedKidzObj([], 0, length, allKidz);
      let totalGMilkList = await this.props.stakingWeb3Inst.methods.calculateRewards(this.state.account, allKidz).call();
      let total = new BigNumber(0);
      for (let item of totalGMilkList) {
        total = total.plus(new BigNumber(item));
      }
      this.setState({ totalStakedGmilkKidz: this.getWeiFormated(total, 18) });
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
      this.setState({ allStakedKidz: kidzList, stakedKidzLoading: false })
    }
  }

  getLeftPanelStakedKidz() {
    if (this.state.allStakedKidz && this.state.allStakedKidz.length > 0) {
      return this.state.allStakedKidz.map((e: any, key: any) => {
        return <img className="mb-4" style={{ border: (e.selected ? '7px solid #17fe00' : 'none') }} key={key} src={e.image} onClick={() => { this.stakedKidzImageSelection(e) }} alt="" />;
      })
    } else if (!this.state.stakedKidzLoading) {
      return <h4 style={{ textAlign: 'center' }}>No any STAKED KIDz!</h4>;
    } else if (this.state.stakedKidzLoading) {
      return <h4 style={{ textAlign: 'center', margin: '0px' }}><img src={loadingImg.src} style={{ width: '50px', height: '50px' }} /><div>Loading...</div></h4>;
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
    } else {
      toastr.warning("One Transaction is In-Progress!");
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
    // window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  setUnstakedKidzModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      if (this.state.selectedUnstakedKidz && this.state.selectedUnstakedKidz.length > 0) {
        this.setState({ showUnstakeKidzModal: value })
      } else {
        toastr.error("Please select Kidz to Stake.")
      }
    } else {
      toastr.warning("One Transaction is In-Progress!");
    }
  }

  setStakedKidzToUnstakeModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      if (this.state.selectedStakedKidz && this.state.selectedStakedKidz.length > 0) {
        this.setState({ showStakeKidzToUnstakeModal: value })
      } else {
        toastr.error("Please select Kidz to Unstake.")
      }
    } else {
      toastr.warning("One Transaction is In-Progress!");
    }
  }

  async setClaimKidzModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      if (this.state.totalStakedKidz && this.state.totalStakedKidz > 0) {
        let actualClaimmableRewards = ''
        let totalStakedGmilkKidz = ''
        let taxAmount = 0;
        try {
          if (value) {
            let ids: any = [];
            for (let item of this.state.allStakedKidz) {
              ids.push(item.id)
            }
            actualClaimmableRewards = await this.props.stakingWeb3Inst.methods.actualClaimmableRewards([19, 20]).call({
              from: this.state.account
            });

            let totalGMilkList = await this.props.stakingWeb3Inst.methods.calculateRewards(this.state.account, ids).call();
            let total = new BigNumber(0);
            for (let item of totalGMilkList) {
              total = total.plus(new BigNumber(item));
            }
            this.setState({ totalStakedGmilkKidz: this.getWeiFormated(total, 18) });

            totalStakedGmilkKidz = this.getWeiFormated(total, 18);

            actualClaimmableRewards = this.getWeiFormated(actualClaimmableRewards, 18);

            taxAmount = Number(totalStakedGmilkKidz) - Number(actualClaimmableRewards);
          }
          this.setState({
            showClaimKidzModal: value,
            totalStakedGmilkKidz: totalStakedGmilkKidz,
            actualClaimmableRewards: actualClaimmableRewards,
            taxAmount: taxAmount.toFixed(5)
          });
        } catch (e) {

        }
      } else {
        toastr.error("You don't have Kidz for Claim.")
      }
    } else {
      toastr.warning("One Transaction is In-Progress!");
    }
  }

  setClaimGoatzModal(value: boolean) {
    if (this.state.transactionStatus == 'start') {
      if (this.state.selectedGoat && this.state.selectedGoat.length > 0) {
        this.setState({ showClaimGoatzModal: value })
      } else {
        toastr.error("Please select Goatz to Claim.")
      }

    } else {
      toastr.warning("One Transaction is In-Progress!");
    }
  }

  async onUnstakedKidsInputInputChanged(value: string) {
    if (this.state.transactionStatus == 'start') {
      let number = Number(value);
      if (value == '.') {
        value = '';
        number = NaN;
      }
      if (!isNaN(number) && number < 10000000000) {
        let dec = (value + '').split('.');
        if (dec[1]) {
          // return;
        }

        if (this.state.allUnstakedKidz && this.state.allUnstakedKidz.length > 0 && number <= this.state.allUnstakedKidz.length) {

          let tempSelectedKidz: any = [];
          let currentInx = 0;
          let allUnstakedKidzArr: any = [].concat(this.state.allUnstakedKidz)
          for (let item of allUnstakedKidzArr) {
            item['selected'] = false;
            if (currentInx < number) {
              tempSelectedKidz.push(item.id)
              item['selected'] = true;
            }
            currentInx = currentInx + 1;
          }
          await this.setState({ allUnstakedKidz: [] })
          await this.setState({ allUnstakedKidz: allUnstakedKidzArr, selectedUnstakedKidz: tempSelectedKidz, unstakedKidsInput: tempSelectedKidz.length ? tempSelectedKidz.length : '' });

          // this.setState({ unstakedKidsInput: dec[0] });
        }

      }
    } else {
      toastr.warning("One Transaction is In-Progress!");
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
        if (!this.state.claimCheckInputValue) {
          toastr.error("Please enter valid Goatz ID #.")
          return;
        }
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
        if (!(this.state.selectedUnstakedKidz && this.state.selectedUnstakedKidz.length > 0)) {
          toastr.error("Please select Kidz to Stake.")
          return;
        }
        await this.setState({ transactionStatus: 'inprogress' });
        let isApproved = await this.props.kidzWeb3Inst.methods.isApprovedForAll(this.state.account, STAKING_ABI_ADDRESS).call();
        if (!isApproved) {
          await this.props.kidzWeb3Inst.methods.setApprovalForAll(STAKING_ABI_ADDRESS, true).send({
            from: this.state.account
          }).then(async (result: any) => {
            isApproved = true;
            await this.stakeKidz();
          }).catch((error: any) => {
            isApproved = false
            this.setState({ transactionStatus: 'start' });
            if (error.code === 4001) {
              toastr.error(error.message);
            } else {
              toastr.error("Oops! Something went wrong. Please REFRESH your browser and try again");
            }
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
    try {
      let gaslimit = await this.props.stakingWeb3Inst.methods.deposit(this.state.selectedUnstakedKidz).estimateGas({
        from: this.state.account
      });

      await this.props.stakingWeb3Inst.methods.deposit(this.state.selectedUnstakedKidz).send({
        from: this.state.account
      }).then(async (result: any) => {
        await this.setState({ transactionStatus: 'start' });
        this.setUnstakedKidzModal(false);
        await this.getUnstakedKidz();
        await this.getStakedKidz();
        toastr.success("Stake succesfully done")
      }).catch(async (error: any) => {
        await this.setState({ transactionStatus: 'start' });
        this.setUnstakedKidzModal(false);
        if (error.code === 4001) {
          toastr.error(error.message);
        } else {
          toastr.error("Oops! Something went wrong. Please REFRESH your browser and try again");
        }
      });
    }
    catch (e) {
      throw e;
    }
  }

  async unstakeKidz() {
    try {
      if (this.state.isEnabled) {
        if (this.state.transactionStatus != 'start') {
          toastr.warning("One Transaction is In-Progress!");
          return
        }
        if (!(this.state.selectedStakedKidz && this.state.selectedStakedKidz.length > 0)) {
          toastr.error("Please select Kidz to Unstake.")
          return;
        }
        await this.setState({ transactionStatus: 'inprogress' });
        await this.props.stakingWeb3Inst.methods.withdraw(this.state.selectedStakedKidz).send({
          from: this.state.account
        }).then(async (result: any) => {
          toastr.success("Unstake succesfully done")
          await this.setState({ transactionStatus: 'start' });
          this.setStakedKidzToUnstakeModal(false);
          this.getUnstakedKidz();
          this.getStakedKidz();
        }).catch(async (error: any) => {
          await this.setState({ transactionStatus: 'start' });
          this.setStakedKidzToUnstakeModal(false);
          if (error.code === 4001) {
            toastr.error(error.message);
          } else {
            toastr.error("Oops! Something went wrong. Please REFRESH your browser and try again");
          }
        });

      } else {
        await this.setState({ transactionStatus: 'start' });
        toastr.error("Please connect your wallet.")
      }
    } catch (e) {
      await this.setState({ transactionStatus: 'start' });
    }
  }

  async claimKidz() {
    try {
      if (this.state.isEnabled) {
        if (this.state.transactionStatus != 'start') {
          toastr.warning("One Transaction is In-Progress!");
          return
        }
        if (!(this.state.totalStakedKidz && this.state.totalStakedKidz > 0)) {
          toastr.error("You don't have Kidz for Claim.")
        }
        let ids: any = [];
        for (let item of this.state.allStakedKidz) {
          ids.push(item.id)
        }
        await this.setState({ transactionStatus: 'inprogress' });
        await this.props.stakingWeb3Inst.methods.claimRewards(ids).send({
          from: this.state.account
        }).then(async (result: any) => {
          await this.setState({ transactionStatus: 'start' });
          this.setClaimKidzModal(false);
          this.getUnstakedKidz();
          this.getStakedKidz();
          toastr.success("Claim succesfully done");
        }).catch(async (error: any) => {
          await this.setState({ transactionStatus: 'start' });
          this.setClaimKidzModal(false);
          if (error.code === 4001) {
            toastr.error(error.message);
          } else {
            toastr.error("Oops! Something went wrong. Please REFRESH your browser and try again");
          }
        });
        await this.setState({ transactionStatus: 'start' });

      } else {
        await this.setState({ transactionStatus: 'start' });
        toastr.error("Please connect your wallet.")
      }
    } catch (e) {
      console.error(e)
      await this.setState({ transactionStatus: 'start' });
    }
  }

  async claimGoatz() {
    try {
      if (this.state.isEnabled) {
        if (this.state.transactionStatus != 'start') {
          toastr.warning("One Transaction is In-Progress!");
          return
        }
        if (!(this.state.selectedGoat && this.state.selectedGoat.length > 0)) {
          toastr.error("Please select Goatz to Claim.")
        }
        this.setState({ transactionStatus: 'inprogress' });
        await this.props.stakingWeb3Inst.methods.claimGoatzRewards(this.state.selectedGoat).send({
          from: this.state.account
        }).then(async (result: any) => {
          await this.setState({ transactionStatus: 'start' });
          this.setClaimGoatzModal(false);
          this.getMintedGoatz();
          toastr.success("Claim succesfully done");
        }).catch(async (error: any) => {
          await this.setState({ transactionStatus: 'start' });
          this.setClaimGoatzModal(false);
          if (error.code === 4001) {
            toastr.error(error.message);
          } else {
            toastr.error("Oops! Something went wrong. Please REFRESH your browser and try again");
          }
        });
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

        {this.state.showClaimKidzModal && <div className={style.modal} > {this.scrollTop()}
          <span className={style.icon} onClick={() => this.setClaimKidzModal(false)}><CloseIcon /></span>
          <div>
            <p >YOU ARE ABOUT TO CLAIM {this.state.totalStakedGmilkKidz} GMILK WITH {this.state.taxAmount} GMILK TAX</p>
            {this.state.totalStakedKidz && this.state.totalStakedKidz > 0 ? <Button onClick={() => { this.claimKidz() }}>
              <a className={style.connectButton}>
                CONFIRM
              </a>
            </Button> : ''}
          </div>
        </div>}


        {this.state.showClaimGoatzModal && <div className={style.modal} > {this.scrollTop()}
          <span className={style.icon} onClick={() => this.setClaimGoatzModal(false)}><CloseIcon /></span>
          <div>
            <p >YOU ARE ABOUT TO CLAIM {this.getGoatzBalance(this.state.selectedGoat.length)} GMILK</p>
            {this.state.selectedGoat && this.state.selectedGoat.length > 0 ? <Button onClick={() => { this.claimGoatz() }}>
              <a className={style.connectButton}>
                CONFIRM
              </a>
            </Button> : ''}
          </div>
        </div>}

        <Container>
          {/* <Image src={StakingCover} layout="responsive" alt="staking" /> */}
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

          <div className={style.gmilk1}>
            <img src={gmilk1.src} alt="" />
            <h1>TIME FOR SOME <br /> $GMILK</h1>
          </div>

          <div className={style.content}>
            <div className={style.wrapperScroll}>
              <span>KIDz UNSTAKED</span>
              <div className={style.card}>
                {this.getLeftPanelUnstakedKidz()}
              </div>
            </div>
            <div  >
              <span> &nbsp; </span>
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
                <button className={this.state.allStakedKidz && this.state.allStakedKidz.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setClaimKidzModal(true)}> CLAIM </button>
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
              <p className={style.yellowbg}> {this.getGoatzBalance(this.state.mintedGoatzObjList.length)} GMILK </p>
              <div className={`${style.btngroup} ${style.btn100}`}>
                <button className={this.state.selectedGoat && this.state.selectedGoat.length > 0 ? style.greenbtn : style.yellowbtn} onClick={() => this.setClaimGoatzModal(true)}> CLAIM </button>
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