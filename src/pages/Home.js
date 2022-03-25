import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ChainContext } from "../context/ChainContext";
import Features from "../components/features";
import {
  Box,
  useColorModeValue,
  Button,
  Stack,
  Text,
  Heading,
  Link,
} from "@chakra-ui/react";
import { BsBinocularsFill } from 'react-icons/bs'
import { VscDebugDisconnect } from 'react-icons/vsc'

const Home = ({ handleChainSwitch }) => {
    const {currentChainId} = useContext(ChainContext);

    return (
        <Box 
            px={8} 
            py={24} 
            mx="auto"
        >
            <Box
                w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                mx="auto"
                textAlign={{ base: "left", md: "center" }}
            >
                <Heading
                    as="h1"
                    mb={6}
                    fontSize={{ base: "4xl", md: "6xl" }}
                    fontWeight="bold"
                    lineHeight="none"
                    letterSpacing={{ base: "normal", md: "tight" }}
                    color={useColorModeValue("gray.900", "gray.100")}
                >
                    Create {" "}
                    <Text
                        display={{ base: "block", lg: "inline" }}
                        w="full"
                        bgClip="text"
                        bgGradient="linear(to-r, green.400,purple.500)"
                        fontWeight="extrabold"
                    >
                        terrible memes
                    </Text>
                    {" "} and mint them as NFTs.
                </Heading>
                <Text
                    as="p"
                    px={{ base: 0, lg: 24 }}
                    mb={6}
                    fontSize={{ base: "lg", md: "xl" }}
                    color={useColorModeValue("gray.600", "gray.300")}
                >
                    Why invest in terrible NFTs when you can make them? Mint a meme to your own wallet or airdrop it to your frens! We're all going to make memes!
                </Text>
                <Stack
                    direction={{ base: "column", sm: "row" }}
                    mb={{ base: 4, md: 8 }}
                    spacing={2}
                    justifyContent={{ sm: "left", md: "center" }}
                >
                    <Button
                        variant="solid"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        colorScheme="purple"
                        w={{ base: "full", sm: "auto" }}
                        mb={{ base: 2, sm: 0 }}
                        size="lg"
                        isDisabled={currentChainId==="0x4"}
                        cursor="pointer"
                        leftIcon={<VscDebugDisconnect />}
                        onClick={() => handleChainSwitch('polygon')}
                    >
                        Switch to Polygon
                    </Button>
                    <Link 
                        as={RouterLink} 
                        to="/explore-memes"
                        style={{textDecoration: "none"}}
                    >
                        <Button
                            colorScheme="gray"
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            w={{ base: "full", sm: "auto" }}
                            mb={{ base: 2, sm: 0 }}
                            size="lg"
                            cursor="pointer"
                            leftIcon={<BsBinocularsFill />}
                        >
                            Explore Memes
                        </Button>
                    </Link>
                </Stack>
            </Box>
            <Features />
        </Box>
    );
};

export default Home;