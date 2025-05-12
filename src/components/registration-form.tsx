'use client'
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { User } from "@/constants/data"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"

type RegistrationFormProps = React.ComponentProps<"div"> & {
  initialData?: User
}

export function RegistrationForm({
  className,
  initialData,
  ...props
}: RegistrationFormProps) {
  const router = useRouter()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      emailAddress: formData.get("emailAddress") as string,
      address: formData.get("address") as string,
    }

    try {
      const response = await axios.post("/api/users", data)
      console.log("User created:", response)
      toast.success("User created successfully!")
      // router.push("/dashboard/users")
    } catch (error) {
      console.error("User creation failed:", error)
      toast.error("User creation failed. Please try again.")
      if (error instanceof Error) {
        toast.error(error.message)
      }
      if (error instanceof Response) {
        const errorData = await error.json()
        toast.error(errorData.message)
      }
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Request was aborted.")
      }
      if (error instanceof TypeError) {
        toast.error("Network error. Please check your connection.")
      }
      if (error instanceof SyntaxError) {
        toast.error("Response was not valid JSON.")
      }
      if (error instanceof RangeError) {
        toast.error("Range error occurred.")
      }
      if (error instanceof ReferenceError) {
        toast.error("Reference error occurred.")
      } 
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Edit Profile" : "Create an Account"}</CardTitle>
          <CardDescription>
            {initialData
              ? "Update your information below."
              : "Fill in the details to register."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={initialData?.firstName ?? ""}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={initialData?.lastName ?? ""}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="emailAddress">Email</Label>
                <Input
                  id="emailAddress"
                  name="emailAddress"
                  type="emailAddress"
                  defaultValue={initialData?.emailAddresses?.[0] ?? ""}
                  required
                />
              </div>
             
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={initialData?.publicMetadata?.address ?? ""}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {initialData ? "Update" : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
