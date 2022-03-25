import { useContext, useEffect, useState } from 'react';
import { UserContext } from './../context/UserContext'
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { FaWallet, FaEthereum } from 'react-icons/fa';
  
  export default function Navbar({ checkIfWalletIsConnected, connectWallet }) {
    const [copied, setCopied] = useState(false); // If the user is connected to the site, has the address been copied to their clipboard
    const { isOpen, onToggle } = useDisclosure();

    // the user's account that is connected to the site
    const {connectedAccount, setConnectedAccount} = useContext(UserContext);
    
    useEffect(() => {
      checkIfWalletIsConnected();

      // Handler function for when the user's connected account changes
      const onAccountChanged = (accounts) => {
        setConnectedAccount(accounts[0]);
      }

      // Handler function for when the user disconnects from the site
      const clearAccount = () => {
        setConnectedAccount('');
      };

      if (window.ethereum) {
        // Set up event listener for when the user's account changes
        window.ethereum.on('accountsChanged', onAccountChanged);
        // Set up event listener for when the user disconnects from the website
        window.ethereum.on('disconnect', clearAccount);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Address shortener
    // Ex. 0xd43ec436005a847221aac23c905a0c6a1c3b93c3 => 0xd43...3c3
    // Used to render address once user connects their account to the site
    const formatAddress = (address) => {
      const firstPart = address.substring(0, 5); // First 5 characters of the user's address
      const secondPart = address.slice(address.length- 3); // Last 3 characters of the user's address
      return `${firstPart}...${secondPart}` // Return value: Formatted address
    }

    // Delay function
    const waitFor = (delay) => new Promise(resolve => setTimeout(resolve, delay));

    // onClick handler function to copy user's connected address to clipboard
    const copyAddressToClipboard = async () => {
      navigator.clipboard.writeText(connectedAccount); // Copy user's address to clipboard
      setCopied(true); // Conditionally render tooltip text, "Copied!"
      await waitFor(2000); // Delay
      setCopied(false); // Conditionally render tooltip text, "Copy address to clipboard"
    }
  
    return (
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          // borderBottom={1}
          // borderStyle={'solid'}
          // borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Link
              as={RouterLink}
              to="/"
              style={{textDecoration: "none"}}
            >
              <Image 
                src='/images/logo.png'
                alt='logo'
                maxW='60px'
              />
            </Link>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
  
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {connectedAccount ? (
              <Tooltip hasArrow label={copied ? 'Copied!' : 'Copy address to clipboard'} closeOnClick={false}>
                <Button
                  fontSize={{ base: 'xs', md: 'sm' }}
                  leftIcon={<FaEthereum />}
                  fontWeight={600}
                  onClick={copyAddressToClipboard}
                >
                  {formatAddress(connectedAccount)}
                </Button>
              </Tooltip>
            ) : (
              <Button
                fontSize={{ base: 'xs', md: 'sm' }}
                leftIcon={<FaWallet />}
                fontWeight={600}
                color={'white'}
                colorScheme="purple"
                onClick={connectWallet}
              >
                Connect
              </Button>
            )}
          </Stack>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    );
  }
  
  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  
    return (
      <Stack direction={'row'} spacing={4} alignItems="center">
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                {navItem.external ? (
                  <Link
                    p={2}
                    href={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    isExternal={navItem.external}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}>
                    {navItem.label}
                  </Link>
                ) : (
                  <Link
                    p={2}
                    as={RouterLink}
                    to={navItem.href ?? '#'}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    isExternal={navItem.external}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}>
                    {navItem.label}
                  </Link>
                )}
                
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => {
                      if (child.external) {
                        return(
                          <DesktopSubNav key={child.label} {...child} />
                        )
                      } else {
                        return(
                          <DesktopInternalSubNav key={child.label} {...child} />
                        )
                      }
                    })}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
  };
  
  const DesktopSubNav = ({ label, href, subLabel, external }: NavItem) => {
    return (
      <Link
        href={href}
        isExternal={external}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('purple.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'purple.400' }}
              fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'purple.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    );
  };

  const DesktopInternalSubNav = ({ label, href, subLabel, external }: NavItem) => {
    return (
      <Link
        as={RouterLink}
        to={href}
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('purple.50', 'gray.900') }}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'purple.400' }}
              fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}>
            <Icon color={'purple.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    );
  };
  
  const MobileNav = () => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {NAV_ITEMS.map((navItem) => {
          if (navItem.external) {
            return (
              <MobileNavItem key={navItem.label} {...navItem} />
            )
          } else {
            return (
              <MobileNavInternalItem key={navItem.label} {...navItem} />
            )
          }
        })}
      </Stack>
    );
  };
  
  const MobileNavItem = ({ label, children, href, external }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          isExternal={external}
          as={Link}
          href={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => {
                if (child.external) {
                  return (
                    <Link key={child.label} py={2} href={child.href} isExternal={child.external}>
                      {child.label}
                    </Link>
                  )
                } else {
                  return (
                    <Link 
                      key={child.label}
                      as={RouterLink} 
                      py={2} 
                      to={child.href ?? "#"}
                    >
                      {child.label}
                    </Link>
                  )
                }
            })}
          </Stack>
        </Collapse>
      </Stack>
    );
  };

  const MobileNavInternalItem = ({ label, children, href, external }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={RouterLink}
          to={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => {
                if (child.external) {
                  return (
                    <Link key={child.label} py={2} href={child.href} isExternal={child.external}>
                      {child.label}
                    </Link>
                  )
                } else {
                  return (
                    <Link 
                      key={child.label}
                      as={RouterLink} 
                      py={2} 
                      to={child.href ?? "#"}
                    >
                      {child.label}
                    </Link>
                  )
                }
            })}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  
  interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
    external?: Boolean;
  }
  
  const NAV_ITEMS: Array<NavItem> = [
    {
      label: 'Explore',
      children: [
        {
          label: 'Meme Templates',
          subLabel: 'Find your favourite meme template',
          href: '/explore-memes',
          external: false

        },
        {
          label: 'Collection',
          subLabel: 'View the collection of memes minted on Opensea',
          href: 'https://testnets.opensea.io/collection/meme-g0h41jhupt',
          external: true
        }
      ]
    },
    {
      label: 'GitHub',
      href: 'https://github.com/nrabhiram/wagmemes',
      external: true
    },
    {
      label: 'Contract',
      href: `https://rinkeby.etherscan.io/address/${process.env.REACT_APP_CONTRACT_ADDRESS}`,
      external: true
    }
  ];