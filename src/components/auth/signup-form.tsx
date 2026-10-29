import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { register } from "@/service/AuthService"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check each Identity password rule separately.
    // .test() returns true if the password contains that kind of character.
    const hasUpper = /[A-Z]/.test(password)        // at least one uppercase letter
    const hasLower = /[a-z]/.test(password)        // at least one lowercase letter
    const hasNumber = /\d/.test(password)          // at least one digit
    const hasSpecial = /[^A-Za-z0-9]/.test(password) // at least one non-letter/non-number character

    // Password is valid only if it's 6+ characters and every rule passes
    const validPassword =
      password.length >= 6 && hasUpper && hasLower && hasNumber && hasSpecial

    if (!validPassword) {
      console.log("Password does not meet requirements")
      return
    }
    if (password !== confirmPassword) {
      console.log("Passwords do not match")
      return
    }

    try {
      await register(email, password);
      navigate("/login");
    } catch (err) {
      console.log("Error", err);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <FieldDescription>
                Must be at least 6 characters and include an uppercase letter, a lowercase letter, a number, and a special character.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
