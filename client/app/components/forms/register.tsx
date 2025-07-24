import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterPropsType } from "~/types/register/registerPropsType";
import { Field } from "../field/field";
import { useAddRegisterMutation } from "~/redux/features/auth/authApi";
import { Link, useNavigate } from "@remix-run/react";
import { ReactIcons } from "~/utils/reactIcons";
import CountryList from "country-list";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [addRegister, { isLoading }] = useAddRegisterMutation();
  const [isShow, setIsShow] = useState({
    password: false,
    confirm_password: false,
  });
  const [hovered, setHovered] = useState(false);
  const [publicIp, setPublicIp] = useState<string>("");
  const [countries, setCountries] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterPropsType>();

  const { IoMdEyeOff, IoEye } = ReactIcons;

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setPublicIp(data.ip))
      .catch(() => setPublicIp(""));
    const countriesList = CountryList.getNames();
    setCountries(countriesList);
  }, []);

  const togglePasswordVisibility = (field: "password" | "confirm_password") => {
    setIsShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmitForm = async (formData: RegisterPropsType) => {
    try {
      const dataWithIp = { ...formData, local_ip: publicIp || undefined, phone: phoneNumber };
      console.log('dataWithIp : ', dataWithIp);
      await addRegister(dataWithIp).unwrap();
      alert("Registered successfully!");
      reset();
      navigate("/login/");
    } catch (err: any) {
      alert("Something went wrong during registration.");
    }
  };

  return (
    <form className="flex flex-col flex-wrap gap-y-5 w-full" onSubmit={handleSubmit(onSubmitForm)}>
      {/* Name Field */}
      <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
        <Field label="" error={errors.name}>
          <input
            {...register("name", { required: "Name is required" })}
            id="name"
            placeholder="Name"
            type="text"
            className="input"
          />
        </Field>
      </div>

      {/* Email Field */}
      <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
        <Field label="" error={errors.email}>
          <input
            {...register("email", { required: "Email is required" })}
            id="email"
            placeholder="Email"
            type="email"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5 w-full">
        {/* Phone Number Field with Country Code */}
        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.number}>
            <PhoneInput
              international
              defaultCountry="BD"
              value={phoneNumber}
              onChange={(value: string | undefined) => setPhoneNumber(value)} // Value is a string or undefined
              className="input"
              placeholder="Enter your phone number"
            />
          </Field>
        </div>

        {/* Country Field */}
        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.country}>
            <select
              {...register("country", { required: "Country is required" })}
              className="input"
            >
              <option value="">Select Country</option>
              {/* Map the countries fetched using the country-list package */}
              {countries.map((country: string, index: number) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Date of Birth Field */}
      <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
        <Field label="" error={errors.date_of_birth}>
          <input
            {...register("date_of_birth", {
              required: "Date of birth is required",
            })}
            id="date_of_birth"
            type="date"
            className="input"
          />
        </Field>
      </div>

      {/* Password and Confirm Password Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.password}>
            <div className="relative w-full">
              <input
                {...register("password", { required: "Password is required" })}
                id="password"
                type={isShow.password ? "text" : "password"}
                placeholder="Password"
                className="input w-full"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {isShow.password ? (
                  <IoMdEyeOff className="text-gray-600 text-lg" />
                ) : (
                  <IoEye className="text-gray-600 text-lg" />
                )}
              </button>
            </div>
          </Field>
        </div>

        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.confirm_password}>
            <div className="relative w-full">
              <input
                {...register("confirm_password", {
                  required: "Confirm password is required",
                })}
                id="confirm_password"
                type={isShow.confirm_password ? "text" : "password"}
                placeholder="Confirm Password"
                className="input w-full"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm_password")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {isShow.confirm_password ? (
                  <IoMdEyeOff className="text-gray-600 text-lg" />
                ) : (
                  <IoEye className="text-gray-600 text-lg" />
                )}
              </button>
            </div>
          </Field>
        </div>
      </div>

      {/* Signature Field */}
      <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
        <Field label="" error={errors.signature}>
          <input
            {...register("signature", { required: "Signature is required" })}
            id="signature"
            placeholder="Signature"
            type="text"
            className="input"
          />
        </Field>
      </div>

      {/* Gender and Role Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.gender}>
            <select {...register("gender", { required: "Gender is required" })} className="input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <Field label="" error={errors.role}>
            <select {...register("role", { required: "Account type is required" })} className="input">
              <option value="">Account Type</option>
              <option value="crypto">Crypto</option>
              <option value="e-commerce">E-commerce</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="flex flex-col flex-wrap gap-y-2.5 justify-center items-center lg:justify-normal lg:items-start w-full">
          <Field label="" error={errors.terms_accepted}>
            <div className="flex items-center gap-2.5">
              <input
                {...register("terms_accepted", {
                  required: "You must accept the terms",
                })}
                type="checkbox"
                id="terms_accepted"
                className="w-4 lg:w-5 h-4 lg:h-5"
              />
              <span className="text-sm lg:text-base">
                I agree to the{" "}
                <Link to="/terms-and-conditions/" className="text-secondary underline">
                  Terms & Conditions
                </Link>
              </span>
            </div>
          </Field>
        </div>

        <div className="flex flex-col flex-wrap gap-y-2.5 w-full">
          <div className="flex flex-col justify-center lg:justify-end items-center lg:items-end">
            <Link className="text-secondary text-sm lg:text-base underline" to="/login/">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col flex-wrap w-full">
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`text-base font-medium py-4 px-5 rounded-md uppercase transition-all duration-300 text-title outline-2 outline-transparent bg-gradient-to-r from-primary to-secondary hover:bg-none hover:outline-primary ${hovered ? "bg-transparent outline-primary" : "bg-gradient-to-r from-primary to-secondary"
            }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};
