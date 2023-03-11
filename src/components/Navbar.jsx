import * as React from 'react';
import { useState, useEffect, lazy } from 'react';
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
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
import { ethers, BrowserProvider } from 'ethers';
import Alert from '@mui/material/Alert';

import LNR from '../modules/lnr.mjs';
import LNR_WEB from '../modules/lnr_web.mjs'


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
  const [searchName, setSearchName] = useState("lnrforever.og");
  const [showAlert, setShowAlert] = useState();
  const [showLogo, setShowLogo] = useState(true);
  const [ogPage, setOgPage] = useState();
  const [sw, setSw] = useState(false)
  const [log2, setlog2 ] = useState(['start'])


  // define a new console
var console=(function(oldCons){

  const pushto = (text) =>{
    setlog2(oldArray => [...oldArray,text] );
  }

  return {
    
      log: function(text){
          oldCons.log(text);
          pushto(text)

          // Your code
      },
      info: function (text) {
          oldCons.info(text);
          pushto(text)
          // Your code
      },
      warn: function (text) {
          oldCons.warn(text);
          pushto(text)
          // Your code
      },
      error: function (text) {
          oldCons.error(text);
          pushto(text)
          // Your code
      }
  };
}(window.console));

//Then redefine the old console
window.console = console;



  //const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());


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

  const isOg = (name)=>{
    if(!name || name.length < 1){
      return(false)
    }

    if(name){
      console.log("checking name")
      console.log(name)
      var nameArray = name.split('.')
      if(nameArray[1] == "og"){
        return(true)
      }
    }
    return(false)
    
  }


  const handleParams = async (p) =>{
    if(p){
      console.log("p is", p)
      await handleSearch(p.toString())
      
    }
  }

  const handleURL = (searched) =>{

    if(searched !== ogPage){
      const url = new URL(window.location);
      console.log("id is", id, url)
      window.history.pushState('data', "", searched);
    }

  }


  const handleSearch = async(p="null")=>{
    var toSearch = searchName
    if(p && p !== "null" && typeof(p) == "string"){
      var toSearch = p
    }

    //window.history.replaceState("", "",/toSearch)

    

    // console.log("param is", typeof(param), toSearch)

    // if(toSearch.length <1){
    //   return
    // }


    if(toSearch && toSearch.length > 1 && isOg(toSearch)){
      console.log("to search is", toSearch)
      handleURL(toSearch);
      if(typeof(window.og.lnrWeb) === "undefined"){
        return(handleAlert("con"))
      }
      try{
        setSearchName(toSearch)
        var website = await window.og.lnrWeb.getWebsite(toSearch)
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
    if(toSearch && toSearch.length > 1 && !isOg(toSearch)){
      handleURL(toSearch+".og");
      if(typeof(window.og) === "undefined" || typeof(window.og.lnrWeb) === "undefined"){
        return(handleAlert("con"))
      }
      setSearchName(toSearch + ".og")
      try{
        var website = await window.og.lnrWeb.getWebsite(toSearch + ".og")
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

  const connectWallet = async()=>{
    
    if(!provider){
      return
    }

      var og = {
        ethers: ethers,
        signer: null,
        provider: null,
        lnr: null,
        lnrWeb: null,
        website: null,
        redirect: null
      }
  
      console.log("CONNECTING")
      console.log(provider)
      

      try{
        await provider.send("eth_requestAccounts", []);
      }
      catch(e){
        console.log("e is", e)
      }


      const signer = provider.getSigner();

      console.log("provider ios", provider)
      
      var lnr = new LNR(ethers, signer);
      if(!provider){
        return(handleAlert("oops"))
      }
      
      var lnrWeb = new LNR_WEB(lnr, provider);
      if(!lnrWeb){
        return(handleAlert("oops"))
      }
      
      var wallet = await signer.getAddress();
      console.log("lnrweb is", wallet);
      console.log(wallet)
      og.signer = signer;
      og.provider = provider;
      og.lnr = lnr;
      og.lnrWeb = lnrWeb;
      window.og = og;
      og.redirect = async function(domain){
        setOgPage(domain)
      }


      if(wallet){
        setSw(true)
        setAddress(wallet)
        await handleName(wallet)
      }

      var pathArray = (id.pathname).split('/')
      if(pathArray[1] == "og" && (pathArray[2]).length > 0){
        handleParams(pathArray[2])
        // setSearchName(pathArray[2])
        // if(typeof(pathArray[2]) == "string"){
        //   await handleSearch(pathArray[2])
        // }
        
      }
      else{
        await handleSearch(searchName)
      }


    return

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


  const id = useLocation();
  useEffect(() => {
    var pathArray = (id.pathname).split('/')
    if(pathArray[1] == "og" && (pathArray[2]).length > 0){
      setOgPage(pathArray[2])
    }
  });


  useEffect(() =>{

    const tryConnect = async () => {
      await connectWallet();
    }

    if(window.ethereum && !address && !window.ethereum?.selectedAddress){
      handleAlert("con")
    }
    else{
      handleAlert("con")
      console.log("not connected")
    }

  },[])


  useEffect(()=>{
    const tryConnect = async () => {
      await connectWallet();
    }

     if(window.ethereum && window.ethereum?.selectedAddress !== address && ethers.utils.isAddress(window.ethereum?.selectedAddress) && sw !== true){
      console.log("here")
        tryConnect();
     }


   })

   useEffect(()=>{
    if(window.og?.redirect){
        window.og.redirect = async function(domain){
          console.log("new domain is ", domain);
          console.log(domain)
          if(window.ethereum  && domain && address && window.ethereum?.selectedAddress && ethers.utils.isAddress(window.ethereum?.selectedAddress) ){
            const url = 'https://web.linagee.vision/og/'+domain;
            window.open(url, '_blank', 'noreferrer');    
          }

      }
    }
   })


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
      <img className='black' width="30px" height="30px" src={'/logo.svg'} />
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
            <img width="50px" height="50px" src={'/logo.svg'} />
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
            <img width="20px" height="20px" src={'/searchicon.svg'} />
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
              <img width="15px" height="25px" src={'/more.svg'} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {log2}
      {showAlert &&(
        <Alert className="alrt fadeOut" severity="warning">{showAlert} </Alert>
      )}
        {showLogo &&(
   
        <img className="mainLogo fadeOut" width="200px" height="200px" src={'/logo.svg'} />
    
      )}
    </Box>
  );
}