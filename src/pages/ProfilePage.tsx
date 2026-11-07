import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import {
  getProfile,
  updateAccountInfo,
  updateProfile,
} from "@/service/profileService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const ProfilePage = () => {
  const { isAuthenticated, isCheckingAuthentication } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [nameHasError, setNameHasError] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordHasError, setPasswordHasError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
      })
      .catch(() => setProfileError("We couldn't load your profile right now."))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  if (isCheckingAuthentication || (isAuthenticated && isLoading)) {
    return <p className="py-12 text-center">Loading profile...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameMessage("");
    setNameHasError(false);

    if (!name.trim()) {
      setNameMessage("Enter your name before saving.");
      setNameHasError(true);
      return;
    }

    try {
      await updateProfile({ name });
      setNameMessage("Your name has been updated.");
    } catch {
      setNameMessage("We couldn't update your name. Please try again.");
      setNameHasError(true);
    }
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailMessage("");
    setEmailHasError(false);

    try {
      await updateAccountInfo({ newEmail: email });
      setEmailMessage("Check your inbox to confirm your new email address.");
    } catch {
      setEmailMessage("We couldn't update your email. Please try again.");
      setEmailHasError(true);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordHasError(false);

    if (newPassword !== confirmPassword) {
      setPasswordMessage("The new passwords do not match.");
      setPasswordHasError(true);
      return;
    }

    try {
      await updateAccountInfo({
        oldPassword: currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Your password has been updated.");
    } catch {
      setPasswordMessage(
        "We couldn't update your password. Check your current password and try again.",
      );
      setPasswordHasError(true);
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:py-12">
      <div>
        <p className="font-medium text-primary">Your account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      {profileError ? (
        <p className="rounded-lg border border-destructive/30 bg-card p-4 text-sm text-destructive" role="alert">
          {profileError}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>Update the name shown on your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                  <Input
                    id="profile-name"
                    value={name}
                    maxLength={100}
                    onChange={(event) => {
                      setName(event.target.value);
                      setNameMessage("");
                      setNameHasError(false);
                    }}
                    required
                  />
                </Field>
                <Field>
                  {nameHasError ? (
                    <FieldError>{nameMessage}</FieldError>
                  ) : (
                    <FieldDescription>{nameMessage}</FieldDescription>
                  )}
                  <Button type="submit">Save name</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email address</CardTitle>
            <CardDescription>Change the email used to log in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailMessage("");
                      setEmailHasError(false);
                    }}
                    required
                  />
                </Field>
                <Field>
                  {emailHasError ? (
                    <FieldError>{emailMessage}</FieldError>
                  ) : (
                    <FieldDescription>{emailMessage}</FieldDescription>
                  )}
                  <Button type="submit">Save email</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Enter your current password before choosing a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit}>
            <FieldGroup>
              <div className="grid gap-5 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => {
                      setCurrentPassword(event.target.value);
                      setPasswordMessage("");
                      setPasswordHasError(false);
                    }}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setPasswordMessage("");
                      setPasswordHasError(false);
                    }}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setPasswordMessage("");
                      setPasswordHasError(false);
                    }}
                    required
                  />
                </Field>
              </div>
              <Field>
                {passwordHasError ? (
                  <FieldError>{passwordMessage}</FieldError>
                ) : (
                  <FieldDescription>{passwordMessage}</FieldDescription>
                )}
                <Button type="submit" className="w-full sm:w-auto">
                  Change password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
