import { useContext, useEffect, useState } from "react";
import { UserContext } from './../context/UserContext'
import { useParams, useHistory } from "react-router-dom";
import GenerateMeme from "../components/generateMeme";
import MintMeme from "../components/mintMeme";
import { ChainContext } from "../context/ChainContext";
import { 
    Box, 
    Button, 
    Spinner, 
    Alert, 
    AlertIcon, 
    Text, 
    useToast
} from "@chakra-ui/react";
import { VscDebugDisconnect } from 'react-icons/vsc'

const CreateMeme = ({ handleChainSwitch }) => {
    const [meme, setMeme] = useState(null); // meme template 
    const [loading, setLoading] = useState(false); // State for conditionally rendering loading indicator when fetching data asynchronously
    const [memeData, setMemeData] = useState(null); // data of the meme edited by the user
    const [formStage, setFormStage] = useState(0); // determines if the user is currently editing or minting the meme
    const [image, setImage] = useState(null); // Edited meme image displayed to the user

    const toast = useToast();

    const {connectedAccount} = useContext(UserContext);
    const {currentChainId} = useContext(ChainContext);

    // The meme id; used to fetch template info asynchronously
    const { id } = useParams();

    // Get an object that provides the history
    const history = useHistory();

    // Fetch data of selected meme template when page component is first rendered
    useEffect(() => {
        const invalidTemplateErrorMessage = "This meme template doesn't exist. Please select a valid template."
        setLoading(true);
        fetch('https://api.imgflip.com/get_memes')
        .then(res => {
            return res.json();
        })
        .then(data => {
            const meme = data.data.memes.find(meme => meme.id === id);
            if (!meme) {
                console.log("meme template does not exist")
                throw new Error(invalidTemplateErrorMessage);
            }
            setMeme(meme);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err)

            setLoading(false);
            // Check if the error is caused because the meme template is invalid
            if (err.message === invalidTemplateErrorMessage) {
                // If meme template is invalid, redirect the user to the 404 page
                history.push("/explore-memes");
                return;
            }
            toast({
                title: err.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    // Update the form stage so that you can mint the meme NFT
    const proceedToMinting = () => {
        if (formStage === 0) {
            setFormStage(1);
        }
    }

    // Update the edited meme image
    const updateMemeImage = (imageURL) => {
        setImage(imageURL);
    }

    // Update the edited meme's data
    const updateMemeData = (data) => {
        setMemeData(data);
    }

    // Update the form stage so that you can edit the meme
    const returnToEditing = () => {
        setFormStage(0);
    }

    return (
        <Box 
            px={8} 
            py={8} 
            mx="auto"
        >
            <Box 
                mb={4} 
                w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                mx="auto"
            >
                <Text
                    display={{ base: "block", lg: "inline" }}
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    as="h1"
                    w="full"
                    bgClip="text"
                    bgGradient="linear(to-r, green.400,purple.500)"
                    fontWeight="bold"
                >
                    Create Meme
                </Text>
                <Text>Browse through the available meme templates and select the one you would like to edit!</Text>
            </Box>
            {loading && (
                <Box 
                    display="flex" 
                    height={"60vh"} 
                    justifyContent="center" 
                    alignItems={"center"}
                >
                    <Spinner />
                </Box>
            )}
            {meme && currentChainId === "0x4" && connectedAccount && (
                <Box
                    w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                    mx="auto"
                >
                    {(formStage === 0) && meme && 
                        <GenerateMeme
                            meme={meme}
                            image={image}
                            memeData={memeData}
                            proceedToMinting={proceedToMinting}
                            updateMemeImage={updateMemeImage}
                            updateMemeData={updateMemeData}
                        />
                    }
                    {(formStage === 1) && meme &&
                        <MintMeme 
                            meme={meme}
                            image={image}
                            connectedAccount={connectedAccount}
                            goBack={returnToEditing}
                        />
                    }
                </Box>
            )}
            {(currentChainId !== "0x4" || !connectedAccount) && (
                <Box
                    w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                    mx="auto"
                >
                    <Alert
                        status='error'
                    >
                        <AlertIcon />
                        You either don't have a wallet or you're on the wrong chain. Please change the connected network to Polygon.
                    </Alert>
                    <Box
                        display="flex"
                        justifyContent={"center"}
                    >
                        <Button
                            as="a"
                            variant="solid"
                            alignItems="center"
                            justifyContent="center"
                            colorScheme="purple"
                            w={{ base: "full", sm: "auto" }}
                            mx="auto"
                            my="4"
                            size="lg"
                            isDisabled={currentChainId==="0x4"}
                            cursor="pointer"
                            leftIcon={<VscDebugDisconnect />}
                            onClick={() => handleChainSwitch('polygon')}
                        >
                            Switch to Polygon
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
 
export default CreateMeme;