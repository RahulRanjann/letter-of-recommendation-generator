"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "@/types"

interface FormProps {
  onClearForm: () => void
}

export default function Form({ onClearForm }: FormProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormData>()

  // Watch file inputs to show file names
  const logoFile = watch("companyLogo")
  const signatureFile = watch("signature")
  const stampFile = watch("companyStamp")

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Letter Information</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="internName" className="font-medium">
            Intern&apos;s Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="internName"
            placeholder="John Doe"
            {...register("internName", { required: "Intern name is required" })}
            className={errors.internName ? "border-red-500" : ""}
          />
          {errors.internName && <p className="text-sm text-red-500">{errors.internName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills" className="font-medium">
            Skills / Technologies <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="skills"
            placeholder="React, TypeScript, Next.js, etc."
            {...register("skills", { required: "Skills are required" })}
            className={`min-h-[100px] ${errors.skills ? "border-red-500" : ""}`}
          />
          {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommenderName" className="font-medium">
            Recommender&apos;s Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="recommenderName"
            placeholder="Jane Smith"
            {...register("recommenderName", { required: "Recommender name is required" })}
            className={errors.recommenderName ? "border-red-500" : ""}
          />
          {errors.recommenderName && <p className="text-sm text-red-500">{errors.recommenderName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommenderTitle" className="font-medium">
            Recommender&apos;s Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="recommenderTitle"
            placeholder="Director | Founder"
            {...register("recommenderTitle", { required: "Recommender title is required" })}
            className={errors.recommenderTitle ? "border-red-500" : ""}
          />
          {errors.recommenderTitle && <p className="text-sm text-red-500">{errors.recommenderTitle.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="font-medium">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Acme Inc."
            {...register("companyName", { required: "Company name is required" })}
            className={errors.companyName ? "border-red-500" : ""}
          />
          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo" className="font-medium">
            Company Logo (Optional)
          </Label>
          <Input
            id="companyLogo"
            type="file"
            accept="image/*"
            {...register("companyLogo")}
            className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
          />
          {logoFile?.[0] && (
            <p className="text-xs text-green-600">
              Selected file: {logoFile[0].name} ({Math.round(logoFile[0].size / 1024)} KB)
            </p>
          )}
          <p className="text-xs text-gray-500">Upload a company logo image (PNG/JPG)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress" className="font-medium">
            Company Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyAddress"
            placeholder="123 Business St, City, State, ZIP"
            {...register("companyAddress", { required: "Company address is required" })}
            className={errors.companyAddress ? "border-red-500" : ""}
          />
          {errors.companyAddress && <p className="text-sm text-red-500">{errors.companyAddress.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            placeholder="(123) 456-7890"
            {...register("phoneNumber", { required: "Phone number is required" })}
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@company.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="font-medium">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "Date is required" })}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature" className="font-medium">
            Signature Upload (Optional)
          </Label>
          <Input
            id="signature"
            type="file"
            accept="image/*"
            {...register("signature")}
            className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
          />
          {signatureFile?.[0] && (
            <p className="text-xs text-green-600">
              Selected file: {signatureFile[0].name} ({Math.round(signatureFile[0].size / 1024)} KB)
            </p>
          )}
          <p className="text-xs text-gray-500">Upload a signature image (PNG/JPG)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyStamp" className="font-medium">
            Company Stamp Upload (Optional)
          </Label>
          <Input
            id="companyStamp"
            type="file"
            accept="image/*"
            {...register("companyStamp")}
            className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
          />
          {stampFile?.[0] && (
            <p className="text-xs text-green-600">
              Selected file: {stampFile[0].name} ({Math.round(stampFile[0].size / 1024)} KB)
            </p>
          )}
          <p className="text-xs text-gray-500">Upload a company stamp image (PNG/JPG)</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClearForm}>
          Clear Form
        </Button>
      </div>
    </div>
  )
}
