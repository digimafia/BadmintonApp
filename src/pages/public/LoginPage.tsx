import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="h-12 w-auto text-3xl font-extrabold text-gray-900">
            Badminton Tournament Platform
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your tournaments with ease
          </p>
        </div>
        <LoginForm />
        <p className="text-sm text-gray-500">
          Demo credentials: Use any 10-digit number starting with 6-9
        </p>
      </div>
    </div>
  )
}

export default LoginPage
