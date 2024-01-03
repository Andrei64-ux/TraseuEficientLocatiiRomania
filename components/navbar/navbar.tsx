import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import { ColorThemeSwitch } from "./colorThemeSwitch";
// const Links = ["Dashboard", "Projects", "Team"];
import navStyles from "./navbar.module.css";
import { HOME, LOGIN, SIGN_UP, MAP } from "../../utils/constants";
import { useAuth, useLogout } from "../../hooks/auth";
import Router from "next/router";
import { auth } from "../../config/firebase";

const Links = [HOME, MAP];

const Actions = [LOGIN, SIGN_UP];

const NavLink = ({ children, path }: { children: ReactNode; path: string }) => (
  <Box
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
  >
    <Link href={path}>{children}</Link>
  </Box>
);

const LoginSignUp = () => (
  <>
    {Actions.map(({ name, path }) => (
      <Button
        variant={"solid"}
        colorScheme={"teal"}
        size={"sm"}
        mr={4}
        key={name}
        onClick={() => {
          Router.push(path);
        }}
      >
        {name}
      </Button>
    ))}
  </>
);

const UserInfo = ({ user }: { user: any }) => {
  const { logout } = useLogout();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {user?.username}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => logout()}>Log Out</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isLoading, error } = useAuth();

  return (
    <div className={navStyles.mobileNav}>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(({ name, path }) => (
                <NavLink key={path} path={path}>
                  {name}
                </NavLink>
              ))}
            </HStack>
            <ColorThemeSwitch />
          </HStack>
          <Flex alignItems={"center"} justifyContent={"center"}>
            {isLoading && <Spinner />}
            {!isLoading && !auth.currentUser && <LoginSignUp />}
            {!isLoading && auth.currentUser && user && <UserInfo user={user} />}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} ml={"20%"} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(({ name, path }) => (
                <NavLink key={path} path={path}>
                  {name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </div>
  );
}
