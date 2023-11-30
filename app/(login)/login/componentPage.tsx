"use client";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { KeyRound, Mail, PersonStanding, User } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

type LoginTypes = {
  Username: string;
  Password: string;
};

export default function LoginPage() {
  //Yup Validator
  const schema = yup.object().shape({
    Username: yup.string().required(),
    Password: yup.string().required().min(8).max(32),
  });

  //Consts
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginTypes>({ resolver: yupResolver(schema) });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //States
  const [signInError, setSignInError] = useState<string>("");

  //Methods
  useLayoutEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      username: data.Username,
      password: data.Password,
      redirect: false,
    });
    if (res?.error) {
      reset();
      setSignInError(res.error);
    } else {
      router.push("/");
    }
  });

  //Components
  const ForgotPasswordForm = () => {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Forgot my password
              </ModalHeader>
              <ModalBody>
                <p>
                  To retrieve your password, provide your account email.
                  <br />
                  We will send a recover mail to the email provided in the next
                  input, you&apos;ll only need to follow the steps into the
                  mail.
                </p>
                <Input
                  autoFocus
                  endContent={<Mail />}
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Send email
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="flex flex-1">
        <video
          className="relative md:absolute w-screen h-20 md:h-screen object-cover  md:object-fill -z-10"
          autoPlay
          loop
          muted
        >
          <source src={"/backgroundLogin.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="w-full md:w-1/2 h-full md:h-screen px-10 sm:px-20 md:px-0 flex flex-col justify-center items-center gap-3 rounded-l-3xl bg-white z-0">
        <h1 className="absolute top-4 md:top-2 right-auto md:right-2 text-xl font-bold flex flex-row items-center gap-2">
          <PersonStanding size={24} /> System
        </h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 w-full md:w-[400px]"
          id="loginForm"
        >
          <h1 className="font-bold text-2xl text-center">Welcome back</h1>
          <p className="text-md text-center">Please enter your details.</p>
          <Input
            type="text"
            label="Username"
            variant="bordered"
            isInvalid={errors?.Username?.message || signInError ? true : false}
            errorMessage={
              errors?.Username?.message ? errors?.Username?.message : " "
            }
            className="w-full"
            isClearable
            placeholder="JohnDoe"
            labelPlacement="outside"
            startContent={<User />}
            autoComplete="email"
            {...register("Username", {
              onBlur: (e) => setSignInError(""),
            })}
          />
          <Input
            type="password"
            label="Password"
            variant="bordered"
            isInvalid={errors?.Password?.message || signInError ? true : false}
            errorMessage={
              errors?.Password?.message ? errors?.Password?.message : " "
            }
            className="w-full"
            isClearable
            placeholder="••••••••"
            labelPlacement="outside"
            startContent={<KeyRound />}
            autoComplete="current-password"
            {...register("Password", {
              onBlur: (e) => setSignInError(""),
            })}
          />
          {signInError && (
            <p className="text-danger mb-3 text-center -mt-5">{signInError}</p>
          )}
          <Button type="submit" variant="ghost" color="primary">
            Log In
          </Button>
        </form>
        <div>
          <Button
            onPress={onOpen}
            variant="light"
            size="sm"
            className="text-sm"
          >
            Forgot your password?
          </Button>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
