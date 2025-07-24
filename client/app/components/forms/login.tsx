import { Link, useNavigate } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAddLoginMutation } from "~/redux/features/auth/authApi";
import { LoginPropsType } from "~/types/login/loginPropsType";
import { ReactIcons } from "~/utils/reactIcons";
import { Field } from "../field/field";

export const LoginForm: React.FC = () => {
  const [addLogin, { isLoading }] = useAddLoginMutation();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [publicIp, setPublicIp] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginPropsType>();
  const { IoEye, IoMdEyeOff } = ReactIcons;

  // Fetch user's public IP on mount
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setPublicIp(data.ip))
      .catch(() => setPublicIp(""));
  }, []);

  const onSubmitForm = async (formData: LoginPropsType) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || undefined };
      await addLogin(dataWithIp).unwrap();
      alert("Login successfully");
      navigate("/");
      reset();
    } catch (err: any) {
      alert("Something went wrong");
    }
  };

  return (
    <form className="flex flex-col flex-wrap gap-y-5 w-full" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="flex flex-col flex-wrap w-full">
        <Field label={""} error={errors.email}>
          <input
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </Field>
      </div>
      <div className="flex flex-col flex-wrap w-full">
        <Field label={""} error={errors.password}>
          <div className="flex flex-row flex-wrap w-full relative">
            <input
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full"
              type={isShow ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2" type="button" onClick={() => setIsShow(!isShow)}>
              {isShow ? <IoMdEyeOff className="text-gray-600 text-lg" /> : <IoEye className="text-gray-600 text-lg" />}
            </button>
          </div>
        </Field>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-between w-full">
        <Link className="text-secondary underline" to={"/register/"}>
          Create New Account?
        </Link>
        <Link className="text-secondary underline" to={"/forgot-password/"}>
          Forgot Password?
        </Link>
      </div>
      <div className="flex flex-col flex-wrap w-full">
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-300 text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary hover:bg-none hover:outline-primary ${
            hovered ? "bg-transparent outline-primary" : "bg-gradient-to-r from-primary to-secondary"
          }`}
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
