import { ReactElement } from 'react';
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';
import { FcInTransit, FcIdea, FcTemplate } from 'react-icons/fc';

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function Features() {
  return (
    <Box 
        p={4}
        w={{ base: "full", md: 10 / 12 }}
        mx="auto"
        mt={20}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcTemplate} w={10} h={10} />}
          title={'Pick a meme template'}
          text={
            'Choose one of the 100 templates provided by imgflip that you love and get started on your "NFT collector" journey!'
          }
        />
        <Feature
          icon={<Icon as={FcIdea} w={10} h={10} />}
          title={'Edit the meme'}
          text={
            "Let your creative juices flow! Come up with cheeky captions for your meme NFT and edit the template to your heart's content."
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'Mint it as an NFT'}
          text={
            'Finally, once you are proud of your creation, it is time to unleash your masterpiece to the world by immortalizing it on the blockchain!'
          }
        />
      </SimpleGrid>
    </Box>
  );
}