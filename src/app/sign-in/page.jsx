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
import { loginFormSchema } from "@/validation";
import { EyeIcon } from "@/assets/eye-icon";
import { EyeOffIcon } from "@/assets/eye-off-icon";
import clsx from "clsx";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { loginWithEmailPassword } from "@/api/auth";
import { auth } from "@/firebase";
import { setTokenCookie, setUserCookie } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const { setLoading, loading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPassShow, setIsPassShow] = useState(false);
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async () => {
    let { email } = loginForm.getValues();
    let { password } = loginForm.getValues();
    setLoading(true);
    const res = await loginWithEmailPassword({ auth, email, password })
      .then((res) => {
        console.log(res);
        setTokenCookie(res?.user?.accessToken);
        setUserCookie(res?.user);
        toast({
          varient: "success",
          title: "Login Successfully",
        });
        setTimeout(() => {
          router.replace("/home");
        }, 300);
      })
      .catch((error) => {
        console.log(error.message);
        toast({
          varient: "destructive",
          title:
            error.message === "Firebase: Error (auth/invalid-credential)."
              ? "Invalid Credentials!!"
              : "Something went wrong!!",
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className="flex flex-col justify-center flex-1 h-screen">
        <div className="w-full max-w-lg flex flex-col items-stretch self-center p-2.5 pt-0">
          <Logo />
          <PageTitle title="Sign In" />
          <Form {...loginForm}>
            <form action="" onSubmit={loginForm.handleSubmit(login)}>
              <FormField
                key="email"
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="block mt-2">
                    <FormControl>
                      <>
                        <FormLabel className="text-primary">Email</FormLabel>
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
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <>
                        <FormLabel className="text-primary">Password</FormLabel>
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
                                "absolute h-5 w-5 right-2.5 cursor-pointer text-primary",
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
                                "absolute h-5 w-5 right-2.5 cursor-pointer text-primary",
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
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
