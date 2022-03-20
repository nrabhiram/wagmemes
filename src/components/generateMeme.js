import { useEffect, useState } from "react";
import { 
    Box, 
    Button, 
    Image, 
    Input, 
    Stack,  
    FormControl, 
    Text, 
    useToast, 
    Spacer 
} from "@chakra-ui/react";
import { GiExitDoor } from 'react-icons/gi';
import { RiMagicFill } from 'react-icons/ri'

const GenerateMeme = ({ 
    meme, 
    image, 
    memeData, 
    proceedToMinting, 
    updateMemeImage, 
    updateMemeData 
}) => {
    const [memeCaptions, setMemeCaptions] = useState([]); // user's input for meme captions
    const [loading, setLoading] = useState(false); // loading indicator for when the meme is uploaded

    const toast = useToast();

    // Add input fields for captions when form is first rendered
    useEffect(() => {
        setMemeCaptions(Array(meme.box_count).fill(''))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // update the caption whenever the user's input changes
    const updateCaption = (e, index) => {
        const updatedCaption = e.target.value.trim();
        const newCaptionsArray = memeCaptions.map((caption, i) => {
            if (i === index) {
                return updatedCaption;
            } else {
                return caption;
            }
        })
        setMemeCaptions(newCaptionsArray);
    }

    // make API call to post form data post in order to get the edited meme
    const createNewMeme = async (memeCaptions) => {
        const formData = new FormData();
        
        formData.append('username', 'mrmemez01');
        formData.append('password', 'ilovememes1');
        formData.append('template_id', meme.id);
        memeCaptions.forEach((caption, index) => formData.append(`boxes[${index}][text]`, caption));

        setLoading(true); // Loading indicator

        fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then((data) => {
            setLoading(false);
            if (!data.success) {
                toast({
                    title: data.error_message,
                    status: 'error',
                    isClosable: true,
                    position: 'bottom-right'
                })
                return;
            }
            proceedToMinting(); // Go to minting form section
            updateMemeImage(data.data.url); // Update the meme image with the one the user edited
            updateMemeData(data); // Store result
        })
        .catch((err) => {
            // In case of error, display a toast notification
            toast({
                title: err.message,
                status: 'error',
                isClosable: true,
                position: 'bottom-right'
            })
        })
    }

    return (
        <>
            {meme && !image && (
                <Box 
                    maxW='350px' 
                    borderWidth='1px' 
                    borderRadius='lg'  
                    mx="auto" 
                    p={4}
                >
                    <Image src={meme.url} objectFit='cover' />
                </Box>
            )}
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
            <Stack spacing={3}>
                {memeCaptions && <Text fontWeight="500">Captions</Text>}
                {memeCaptions && memeCaptions.map((caption, index) => {
                    return (
                        <FormControl key={index}>
                            <Input
                                placeholder={`Caption Line ${index + 1}`}
                                size='md'
                                onChange={(e) => updateCaption(e, index)}
                            />
                        </FormControl> 
                    )
                })}
            </Stack>
            <Stack
                direction={{ base: "column", sm: "row" }}
                mb={{ base: 4, md: 8 }}
                spacing={2}
                justifyContent={{ md: "center" }}
                my="8"
            >
                <Button
                    leftIcon={<RiMagicFill />}
                    isLoading={loading} 
                    loadingText='Generating Meme' 
                    onClick={() => createNewMeme(memeCaptions)}
                >
                    Create Meme
                </Button>
                <Spacer />
                {memeData && (
                    <Button
                        rightIcon={<GiExitDoor />}
                        isDisabled={loading}
                        onClick={proceedToMinting}
                    >
                        Proceed to Minting
                    </Button>
                )}
            </Stack>
        </>
    );
}
 
export default GenerateMeme;