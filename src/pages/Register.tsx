import { SignupForm } from "@/components/auth/signup-form";

export default function Register() {
  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-sm md:max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
