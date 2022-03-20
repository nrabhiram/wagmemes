import { AspectRatio, Box, Image, Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

const MemeCard = ({ meme }) => {
  return (
    <Link 
      textDecoration='none' 
      as={RouterLink} 
      to={`/create-meme/${meme.id}`} 
      style={{textDecoration: 'none'}}
    >
      <Box 
        maxW='sm' 
        borderWidth='1px' 
        borderRadius='lg' 
        overflow='hidden'
      >
        <AspectRatio ratio={1}>
          <Image 
            src={meme.url} 
            alt={meme.name} 
          />
        </AspectRatio>
        <Box 
          p='4' 
          textAlign='center'
        >
          <Box
            mt='1'
            fontWeight='semibold'
            as='h4'
            lineHeight='tight'
            isTruncated
          >
            {meme.name}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
 
export default MemeCard;