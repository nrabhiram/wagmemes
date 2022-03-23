import { 
    Box, 
    Image, 
    Text 
} from "@chakra-ui/react";

const NotFound = () => {
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
                    404
                </Text>
                <Text>Oops... this page doesn't exist!</Text>
                
            </Box>
            <Box
                my={4} 
                display="flex"
                justifyContent="center"
            >
                <Image 
                    src='/images/404.png' 
                    alt='404' 
                />
            </Box>
        </Box>
    );
}
 
export default NotFound;