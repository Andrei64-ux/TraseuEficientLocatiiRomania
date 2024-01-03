import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useLogin } from "../hooks/auth";
import { useForm } from "react-hook-form";
import { emailValidate, passwordValidate } from "../utils/formValidate";
import { HOME, SIGN_UP } from "../utils/constants";
import { LoginInfo } from "../interfaces/auth";
import NextLink from "next/link";
import { usePasswordReset } from "../hooks/auth";

export default function Login() {
  const { login, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>();
    getValues, // Adăugăm aici getValues pentru a-l putea utiliza în cod
  } = useForm<LoginInfo>();
  const { sendResetEmail, isLoading: resetLoading } = usePasswordReset();
  const toast = useToast();

  async function handleLogin(data: LoginInfo) {
    login({
      email: data.email,
      password: data.password,
      redirect: HOME.path,
    });
  }

  async function handlePasswordReset() {
    const email = getValues("email"); // Obținem adresa de email folosind getValues

    if (!email) {
      toast({
        title: "Complete Email Field",
        description: "Please enter your email address to reset your password.",
        status: "warning",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
      return;
    }

    await sendResetEmail(email);
  }

  return (
    <Center w="100%" h="100vh">
      <Box mx="1" maxW="md" p="9" borderWidth="1px" borderRadius="lg">
        <Heading mb="4" size="lg" textAlign="center">
          Log In
        </Heading>

        <form onSubmit={handleSubmit(handleLogin)}>
          <FormControl isInvalid={Boolean(errors.email)} py="2">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="user@email.com"
              {...register("email", emailValidate)}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.password)} py="2">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="password123"
              {...register("password", passwordValidate)}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            mt="4"
            type="submit"
            colorScheme="teal"
            size="md"
            w="full"
            isLoading={isLoading}
            loadingText="Logging In"
          >
            Log In
          </Button>
          <Button
            mt="4"
            colorScheme="red"
            size="md"
            w="full"
            isLoading={resetLoading}
            onClick={handlePasswordReset}
          >
            Reset Password
          </Button>
        </form>

        <Text fontSize="xlg" align="center" mt="6">
          Don't have an account?{" "}
          <Link
            as={NextLink}
            href={SIGN_UP.path}
            color="teal.800"
            fontWeight="medium"
            textDecor="underline"
            _hover={{ background: "teal.100" }}
          >
            Register
          </Link>{" "}
          instead!
        </Text>
      </Box>
    </Center>
  );
}
