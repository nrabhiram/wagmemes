import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import ExploreMemes from './pages/ExploreMemes';
import CreateMeme from './pages/CreateMeme';
import { UserContext } from './context/UserContext';
import { ChainContext } from './context/ChainContext';
import { useToast } from '@chakra-ui/react';

function App() {
  const [currentChainId, setCurrentChainId] = useState(null); // The chain the user is currently connected to
  const [connectedAccount, setConnectedAccount] = useState(null); // the user's account that is connected to the site
  
  // Hook to add toast notifications within the application
  const toast = useToast();

  const userProviderValue = useMemo(() => ({connectedAccount, setConnectedAccount}), [connectedAccount, setConnectedAccount]);
  const chainProviderValue = useMemo(() => ({currentChainId, setCurrentChainId}), [currentChainId, setCurrentChainId]);

  // Object of all of the chains the site works on
  const networks = {
    polygon: {
      chainId: `0x${Number(137).toString(16)}`,
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [
        "https://polygon-rpc.com/",
        "https://rpc-mainnet.matic.network",
        "https://matic-mainnet.chainstacklabs.com",
        "https://rpc-mainnet.maticvigil.com",
        "https://rpc-mainnet.matic.quiknode.pro",
        "https://matic-mainnet-full-rpc.bwarelabs.com"
      ],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  }

  // Event handler function for when the user changes chain
  const onChainChanged = (chainId) => {
    setCurrentChainId(chainId)
  }

  // Manually change network in case the user is on the wrong one
  const chainChange = async (networkName) => {
    try {
      const { ethereum } = window;
      // Check if Metamask is installed
      if (!ethereum) {
        // Error will occur if Metamask isn't installed
        throw new Error("No crypto wallet found. Please install Metamask");
      }
      // Add new Ethereum chain to the wallet's configuration
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName]
          }
        ]
      });
    } catch (err) {
      // Toast notification that displays the error message
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }
  // Pass this function down as prop to page components where a "Network Change" button will be rendered
  const handleChainSwitch = async (networkName) => {
    await chainChange(networkName);
  }

  // Get the chain the user is currently on
  const getCurrentChain = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);
    // If Metamask isn't installed, currentChainId shall be invalid
    } else {
      setCurrentChainId(null);
    }
  }

  // Check if the user's wallet is connected to the site when the site is first rendered
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      // User doesn't have Metamask installed
      if (!ethereum) {
        throw new Error("No crypto wallet found. Please install Metamask")
      }
      // Get the user's accounts
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      // Check if the user has at least one account
      if (accounts.length > 0) {
        // Grab the first account and connect it to the site
        setConnectedAccount(accounts[0]);
      }
    } catch (err) {
      // Display error toast notification
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }

  // onClick handler function to connect user's account to the site
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      // User doesn't have Metamask installed
      if (!ethereum) {
        throw new Error("No crypto wallet found. Please install Metamask")
      }
      // Get the user's accounts
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      // Check if the user has at least one account
      if (accounts.length > 0) {
        // Grab the first account and connect it to the site
        setConnectedAccount(accounts[0]);
      }
    } catch (err) {
      // Display error toast notification
      toast({
        title: err.message,
        status: 'error',
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }

  useEffect(() => {
    // Get the chain the user is on when the app first renders
    getCurrentChain();
    if (window.ethereum) {
      // Bind function to the chainChanged event
      window.ethereum.on("chainChanged", onChainChanged);

      // Remove event listener for chainChanged when the component unmounts
      return () => {
        window.ethereum.removeListener("chainChanged", onChainChanged)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={userProviderValue}>
          <Navbar
            checkIfWalletIsConnected={checkIfWalletIsConnected}
            connectWallet={connectWallet}
          />
        </UserContext.Provider>
        <Switch>
          <Route exact path="/">
            <ChainContext.Provider value={chainProviderValue}>
              <Home handleChainSwitch={handleChainSwitch} />
            </ChainContext.Provider>
          </Route>
          <Route path="/explore-memes">
            <ExploreMemes />
          </Route>
          <Route path="/create-meme/:id">
            <ChainContext.Provider value={chainProviderValue}>
              <UserContext.Provider value={userProviderValue}>
                <CreateMeme 
                  handleChainSwitch={handleChainSwitch}
                  connectWallet={connectWallet}
                />
              </UserContext.Provider>
            </ChainContext.Provider>
          </Route>
        </Switch> 
      </Router>
    </div>
  );
}

export default App;
