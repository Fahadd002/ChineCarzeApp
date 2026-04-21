import LoginForm from "@/components/modules/Auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  const message = params.message;
  return (
    <LoginForm redirectPath={redirectPath} message={message}/>
  )
}

export default LoginPage