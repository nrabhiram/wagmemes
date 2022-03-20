import { useEffect, useState } from "react";
import { ethers } from "ethers";
import memeNFT from "../utils/MemeNFT.json"
import { 
    Box, 
    Button, 
    FormControl, 
    FormHelperText, 
    FormLabel, 
    Image, 
    Input, 
    Link, 
    Spacer, 
    Stack, 
    Text, 
    useToast 
} from "@chakra-ui/react";
import { FaEdit, FaGift } from "react-icons/fa"

const MintMeme = ({ 
    meme, 
    image, 
    connectedAccount, 
    goBack,
    connectWallet
}) => {
    const [address, setAddress] = useState(connectedAccount); // The address the meme NFT will be minted to
    const [name, setName] = useState(meme.name); // The name of the meme NFT; defaults to the meme template's name
    const [description, setDescription] = useState(''); // The description of the meme NFT; will be stored as metadata
    const [loading, setLoading] = useState(false); // loading indicator to determine whether the transaction has been mined

    const toast = useToast();

    useEffect(() => {
        onMemeMinted();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // update address NFT is minted to based on user's input
    const updateAddress = (e) => {
        // Check if the user input is an empty string
        if (/^\s+$/.test(e.target.value) || e.target.value === "") {
            setAddress(connectedAccount);
        } else {
            // Remove whitespaces before storing user input
            setAddress(e.target.value.trim());
        }
    }

    // update the description that will be stored in the token's metadata based on user's input
    const updateDescription = (e) => {
        // Check if the user input is an empty string
        if (/^\s+$/.test(e.target.value) || e.target.value === "") {
            setDescription("");
        } else {
            // Remove whitespaces before storing user input
            setDescription(e.target.value.trim());
        }
    }

    // update the name that will be stored in the token's metadata based on user's input
    const updateName = (e) => {
        // Check if the user input is an empty string
        if (/^\s+$/.test(e.target.value) || e.target.value === "") {
            setName(meme.name);
        } else {
            // Remove whitespaces before storing user input
            setName(e.target.value.trim());
        }
    }

    const handleMint = async () => {
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // get contract address

        const tokenData = {
            address: address,
            name: name,
            description: description,
            image: image
        }

        try {
            const { ethereum } = window;
            // Check if user has Metamask installed
            if (ethereum) {
                setLoading(true) // render loading indicator
                if (!connectedAccount) {
                    await connectWallet();
                }
                // Check whether the input address matches with an Ethereum address's general regex
                if (!/^0x[a-fA-F0-9]{40}$/.test(tokenData.address)) {
                    throw new Error("The address you typed is invalid");
                }

                const provider = new ethers.providers.Web3Provider(ethereum); // This is how we talk to Ethereum nodes
                const signer = provider.getSigner(); // Used to sign messages and transactions while executing state-changing operations
                const connectedContract = new ethers.Contract(contractAddress, memeNFT.abi, signer); // Connection to our contract
                
                // Call the mint function in our contract
                let nftTxn = await connectedContract.mintMemeNFT(
                    tokenData.address,
                    tokenData.name,
                    tokenData.description,
                    tokenData.image
                );
                // Wait for the transaction to be mined
                await nftTxn.wait();

                setLoading(false); // stop rendering loading indicator
                
                // Display toast notification that says that the transaction has been mined
                toast({
                    title: (
                        <Text>
                            Transaction has been mined! View it <Link href={`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`} isExternal={true} style={{textDecoration: "underline"}}>here</Link>.
                        </Text>
                    ),
                    status: 'info',
                    isClosable: true,
                    position: 'bottom-right'
                })
            } else {
                // If user doesn't have Metamask installed
                throw new Error("No crypto wallet found. Please install Metamask");
            }
        } catch (err) {
            // Display toast notification that gives the reason for an error
            toast({
                title: err.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
            setLoading(false); // stop rendering loading indicator
        }
    }

    // Event Listener function for when a new meme is minted as an NFT
    const onMemeMinted = () => {
        const { ethereum } = window;

        // Check if user has Metamask installed
        if (ethereum) {
            const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // get contract address
            const provider = new ethers.providers.Web3Provider(ethereum); // This is how we talk to Ethereum nodes
            const signer = provider.getSigner(); // Used to sign messages and transactions while executing state-changing operations
            const connectedContract = new ethers.Contract(contractAddress, memeNFT.abi, signer); // Connection to our contract
            
            connectedContract.on("NewMemeMinted", (sender, tokenId) => {
                // Display a toast notification when NewMemeMinted (event) is emitted to indicate that a new meme was created
                toast({
                    title: (
                        <Text>
                            Your meme was minted, hooray 🎉. Click {" "}
                            <Link 
                                href={`https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`}
                                isExternal={true} 
                                style={{textDecoration: "underline"}}
                            >
                                here
                            </Link> to view your NFT on Opensea.
                        </Text>
                    ),
                    status: 'success',
                    isClosable: true,
                    position: 'bottom-right'
                })
            })
        }
    }

    return (
        <>
            {image && (
                <Box 
                    maxW='350px' 
                    borderWidth='1px' 
                    borderRadius='lg'  
                    mx="auto" 
                    p={4}
                >
                    <Image src={image} objectFit='cover' />
                </Box>    
            )}
            <Stack spacing={8}>
                <FormControl>
                    <FormLabel>Gift Receiver Address</FormLabel>
                    <Input
                        size='md'
                        placeholder={connectedAccount ? connectedAccount : ""}
                        onChange={(e) => updateAddress(e)}
                    />
                    <FormHelperText>Drop the address of the person you want to gift the meme to. If left blank, the NFT will be minted to your address</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        size='md'
                        placeholder={meme.name}
                        onChange={(e) => updateName(e)}
                    />
                    <FormHelperText>Name your creation before minting it as an NFT!</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                        size='md'
                        onChange={(e) => updateDescription(e)}
                    />
                    <FormHelperText>Briefly describe the meme you've created</FormHelperText>
                </FormControl>
                <Stack
                    direction={{ base: "column", sm: "row" }}
                    mb={{ base: 4, md: 8 }}
                    spacing={2}
                    justifyContent={{ md: "center" }}
                >
                    <Button 
                        onClick={goBack} 
                        leftIcon={<FaEdit />}
                    >
                        Edit Meme
                    </Button>
                    <Spacer />
                    <Button
                        isLoading={loading}
                        rightIcon={<FaGift />}
                        onClick={handleMint}
                        spinnerPlacement='start'
                        loadingText="Minting Meme..."
                    >
                        Mint Meme
                    </Button>
                </Stack>
            </Stack>
        </>
    );
}
 
export default MintMeme;