import { useEffect, useState } from "react";
import MemeCard from "../components/memeCard";
import { 
    Box, 
    Input, 
    InputGroup, 
    InputLeftElement, 
    SimpleGrid, 
    Spinner, 
    Text, 
    useToast
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi"

const ExploreMemes = () => {
    const [memes, setMemes] = useState([]); // State for array of meme templates
    const [loading, setLoading] = useState(false); // State for conditionally rendering loading indicator when fetching data asynchronously
    const [searchFilter, setSearchFilter] = useState("");

    const toast = useToast();

    const handleSearchQueryChange = (e) => {
        setSearchFilter(e.target.value.trim());
    }

    // Fetch data of available meme templates when page component is first rendered
    useEffect(() => {
        setLoading(true);
        fetch('https://api.imgflip.com/get_memes')
        .then(res => {
            return res.json();
        })
        .then(data => {
            setMemes(data.data.memes);
            setLoading(false);
        })
        .catch(err => {
            toast({
                title: err.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    Explore Memes
                </Text>
                <Text>Browse through the available meme templates and select the one you would like to edit.</Text>
            </Box>
            <Box
                my={4} 
                w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                mx="auto"
            >
                <InputGroup maxW="420px">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<BiSearch color="gray"/>}
                    />
                    <Input 
                        onChange={(e) => handleSearchQueryChange(e)} 
                        placeholder="Search for your favourite meme here..."
                    />
                </InputGroup>
            </Box>
            {loading && (
                <Box 
                    display="flex" 
                    height={"60vh"}
                    justifyContent="center" 
                    alignItems={"center"}
                >
                    <Spinner color="purple" />
                </Box>
            )}
            {memes && (
                <Box
                    w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                    mx="auto"
                >
                    <SimpleGrid 
                        columns={[1, 2, 3]} 
                        spacing='40px'
                    >
                        {memes && memes.map((meme, index) => {
                            if (memes[index].name.toUpperCase().includes(searchFilter.toUpperCase())) {
                                return <MemeCard meme={meme} key={index} />
                            } else {
                                return null
                            } 
                        })}
                    </SimpleGrid>
                </Box>
            )}
        </Box>
    );
}
 
export default ExploreMemes;