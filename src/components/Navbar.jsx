/* eslint no-undef: "off"*/

import * as React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';


import { ethers } from 'ethers';
import Alert from '@mui/material/Alert';



const LNR = require("../utils/lnr-ethers-1.1.0")
const LNR_WEB = require('../utils/lnr-web-0.1.5')

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar() {
  const [name, setName] = useState('Connect');
  const [address, setAddress] = useState();
  const [searchName, setSearchName] = useState();
  const [showAlert, setShowAlert] = useState();
  const [showLogo, setShowLogo] = useState(true);



  const provider = new ethers.providers.Web3Provider(window.ethereum);


  const handleAlert = (msg) =>{
    //console.log("msg is", msg)
    if(msg && msg.includes("Error loading asset at derp://0x000")){
      setShowAlert("Website not published.")
      setTimeout(() => {
        setShowAlert()
      }, 3000);
      return
      ////console.log("go")
      //setShowAlert()
    }
    else if(msg && msg == "con"){
      setShowAlert("Please connect to explore")
      setTimeout(() => {
        setShowAlert()
      }, 3000);
      return
    }
    else{
      setShowAlert("oops! Something went wrong.")
      setTimeout(5000);
      setTimeout(() => {
        setShowAlert()
      }, 3000);
      return
    }
  }

  var signer;

  const handleSearch = async()=>{

    if(!address){
      return(handleAlert("con"))
    }

    if(searchName && searchName.length > 1 && searchName.endsWith(".og")){
      if(typeof(window.og.lnrWeb) === "undefined"){
        return(handleAlert("con"))
      }
      try{
        var website = await window.og.lnrWeb.getWebsite(searchName)
        if(website){
          setShowLogo(false)
          document.getElementById('chain_frame').srcdoc = website.finalData;
        }
        else{
          handleAlert("oops")

        }
      }
      catch(e){
        //console.log(e)
        handleAlert(e)
      }

    }
    if(searchName && searchName.length > 1 && !searchName.endsWith(".og")){
      if(typeof(window.og.lnrWeb) === "undefined"){
        return(handleAlert("con"))
      }
      setSearchName(searchName + ".og")
      try{
        var website = await window.og.lnrWeb.getWebsite(searchName + ".og")
        if(website){
          document.getElementById('chain_frame').srcdoc = website.finalData;
        }
        else{
          handleAlert("oops")

        }
      }
      catch(e){
        //console.log(e)
        handleAlert(e)
      }

    }



    
  }





  // //console.log("lnr is", LNR)

  async function connectWallet(){

    if(!address){
      let og = {
        ethers: ethers,
        signer: null,
        provider: null,
        lnr: null,
        lnrWeb: null,
        website: null
      }
  
      //console.log("clicked")
      await provider.send("eth_requestAccounts", []);
      var signer = provider.getSigner();
      var lnr = new LNR(ethers, signer);
      
      var lnrWeb = new LNR_WEB(lnr, provider);
      let wallet = await signer.getAddress();
      //console.log("lnrweb is", wallet, lnrWeb);
      og.signer = signer;
      og.provider = provider;
      og.lnr = lnr;
      og.lnrWeb = lnrWeb;
      window.og = og;
  
      if(wallet){
        setAddress(wallet)
        return(await handleName(wallet))
      }
    }

    if(address){
      await await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{eth_accounts: {}}]
    })
    setAddress()
    setName('Connect')
    }


    return

    //document.getElementById('eth_login_button').innerHTML = "Wallet:" + wallet.substring(0,6) + "..." + wallet.slice(wallet.length-4);

    //document.getElementById('web3Buttons').style.display = "inline-block";
  }


  const handleName = async(address) =>{
    try{
      var name = await window.og.lnr.lookupAddress(address);
      if(name){
        setName(name)
      }
      else{
        setName(address.substring(0,6) + "..." + address.slice(address.length-4))
      }
    } 
    catch(e){
      setName(address.substring(0,6) + "..." + address.slice(address.length-4))
    }
  }





  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleOpenNavMenu = (event) => {
    //console.log("opening")
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const openLinagee = ()=>{
    //console.log("clkicked")
    const url = 'https://linagee.vision/';
    window.open(url, '_blank', 'noreferrer');

  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      <MenuItem onClick={()=>(openLinagee(), handleMenuClose)}>
      <ListItemIcon>
      <img className='black' width="30px" height="30px" src={'logo.svg'} />
      </ListItemIcon>
        Linagee.vision
        </MenuItem>
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Drawer

      anchor={"top"}
      id={mobileMenuId}
      keepMounted

      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      style={{textAlign: "center", alignItems: "center", justifyContent: 'center'}}
    >

      <Button className="btn" onClick={connectWallet} style={{marginLeft: "25%", marginRight: "25%", marginTop: "10px", marginBottom: "10px"}} variant="outlined" color="primary">{name}</Button>
    
    </Drawer>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleOpenNavMenu}
          >
       =
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <img width="50px" height="50px" src={'logo.svg'} />
          </Typography>
          <Search>
            <StyledInputBase
              placeholder="search.og …"
              inputProps={{ 'aria-label': 'search' }}
              value={searchName || ""}
              onChange={(event)=>setSearchName(event.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  handleSearch()
                  ev.preventDefault();
                }
              }}
            />
            <IconButton onClick={handleSearch}>
            <img width="20px" height="20px" src={'searchicon.svg'} />
            </IconButton>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button className="btn" variant="outlined" color="secondary" onClick={connectWallet}>{name}</Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <img width="15px" height="25px" src={'more.svg'} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {showAlert &&(
        <Alert className="alrt fadeOut" severity="warning">{showAlert} </Alert>
      )}
        {showLogo &&(
   
        <img className="mainLogo fadeOut" width="200px" height="200px" src={'logo.svg'} />
    
      )}
    </Box>
  );
}