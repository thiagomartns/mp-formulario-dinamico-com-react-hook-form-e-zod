import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { userRegisterSchema, type UserRegister } from "../schema";

export default function Form() {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({ resolver: zodResolver(userRegisterSchema) });

  const maskRegister = useHookFormMask(register);

  async function handleBlurZipCode(
    e: React.FocusEvent<HTMLInputElement, Element>
  ) {
    const zipCode = e.target.value;

    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipCode}`);

    if (res.ok) {
      const data = await res.json();
      setValue("address", data.street);
      setValue("city", data.city);
    }
  }

  async function onSubmit(values: FieldValues) {
    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      for (const field in resData.errors) {
        setError(field as keyof UserRegister, {
          type: "manual",
          message: resData.errors[field],
        });
      }
      console.log(resData.errors);
    }
    console.log(resData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register("name")} />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="name" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register("email")} />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="email" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={isShowPassword ? "text" : "password"}
            id="password"
            {...register("password")}
          />

          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password" />
          </p>

          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {!isShowPassword ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={isShowPassword ? "text" : "password"}
            id="confirm-password"
            {...register("password_confirmation")}
          />
          <p className="text-xs text-red-400 mt-1">
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {!isShowPassword ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...maskRegister("phone", "(99) 99999-9999")}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="phone" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" {...maskRegister("cpf", "cpf")} />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="cpf" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...maskRegister("zipcode", "99999-999", {
            onBlur: handleBlurZipCode,
          })}
        />
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="zipcode" />
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          {...register("address")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
          {...register("city")}
        />
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms")}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="text-xs text-red-400 mt-1">
          <ErrorMessage errors={errors} name="terms" />
        </p>
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:opacity-10 flex justify-center items-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
}
