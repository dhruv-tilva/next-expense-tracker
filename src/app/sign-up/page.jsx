"use client";
import Logo from "@/components/common/logo";
import PageTitle from "@/components/common/page-title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/validation";
import { EyeIcon } from "@/assets/eye-icon";
import { EyeOffIcon } from "@/assets/eye-off-icon";
import clsx from "clsx";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { signUpWithEmailPassWord } from "@/api/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const { setLoading, loading } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isPassShow, setIsPassShow] = useState(false);
  const signUpForm = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const signUp = async () => {
    let { first_name } = signUpForm.getValues();
    let { last_name } = signUpForm.getValues();
    let { email } = signUpForm.getValues();
    let { password } = signUpForm.getValues();
    let name = first_name + " " + last_name;
    setLoading(true);
    await signUpWithEmailPassWord({
      auth,
      email,
      password,
      name,
      first_name,
      last_name,
    })
      .then((res) => {
        console.log(res);
        router.replace("/sign-in");
        toast({
          variant: "success",
          title: "Create account successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className="flex flex-col justify-center flex-1 h-screen">
        <div className="w-full max-w-lg flex flex-col items-stretch self-center p-2.5 pt-0">
          <Logo />
          <PageTitle title="Sign Up" />
          <Form {...signUpForm}>
            <form action="" onSubmit={signUpForm.handleSubmit(signUp)}>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  key="first_name"
                  control={signUpForm.control}
                  name="first_name"
                  className="w-1/2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <FormLabel>Name</FormLabel>
                          <Input
                            type="text"
                            maxLength="256"
                            name="first_name"
                            data-name="first_name"
                            placeholder="Enter your name"
                            id="sign-in-name"
                            disabled={loading}
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key="last_name"
                  control={signUpForm.control}
                  name="last_name"
                  className="w-1/2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <FormLabel>Surname</FormLabel>
                          <Input
                            type="text"
                            maxLength="256"
                            name="last_name"
                            data-name="last_name"
                            placeholder="Enter your surname"
                            id="sign-in-surname"
                            disabled={loading}
                            {...field}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                key="email"
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="block mt-2">
                    <FormControl>
                      <>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          maxLength="256"
                          name="email"
                          data-name="email"
                          placeholder="Email"
                          id="sign-in-email"
                          required
                          autoFocus
                          disabled={loading}
                          {...field}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                key="password"
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <>
                        <FormLabel>Password</FormLabel>
                        <div className="relative flex items-center justify-center">
                          <Input
                            type={isPassShow ? "text" : "password"}
                            maxLength="256"
                            name="password"
                            data-name="password"
                            placeholder="Password"
                            id="sign-in-password"
                            autoFocus
                            onInput={(e) => {
                              if (/\s/g.test(e.target.value))
                                e.target.value = e.target.value.replaceAll(
                                  " ",
                                  ""
                                );
                            }}
                            {...field}
                          />
                          {isPassShow ? (
                            <EyeIcon
                              className={clsx(
                                "absolute h-5 w-5 right-2.5 cursor-pointer",
                                {
                                  visible: field.value,
                                  invisible: !field.value,
                                }
                              )}
                              onClick={() => setIsPassShow(!isPassShow)}
                            />
                          ) : (
                            <EyeOffIcon
                              className={clsx(
                                "absolute h-5 w-5 right-2.5 cursor-pointer",
                                {
                                  visible: field.value,
                                  invisible: !field.value,
                                }
                              )}
                              onClick={() => setIsPassShow(!isPassShow)}
                            />
                          )}
                        </div>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="default"
                className="w-full rounded-3xl mt-5"
                disabled={loading}
                varient="destructive"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
