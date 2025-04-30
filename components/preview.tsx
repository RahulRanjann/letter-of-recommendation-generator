"use client"

import type { FormData } from "@/types"
import { formatDate } from "@/lib/utils"
import { useEffect, useState } from "react"

interface PreviewProps {
  formData: FormData
}

export default function Preview({ formData }: PreviewProps) {
  // State to store object URLs
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null)
  const [stampUrl, setStampUrl] = useState<string | null>(null)

  // Format company name to display on multiple lines
  const formatCompanyName = (name: string) => {
    // Split the company name into words
    const words = name.split(" ")

    // If there are 3 or more words, format them into multiple lines
    if (words.length >= 3) {
      return (
        <>
          {words.slice(0, 2).join(" ")}
          <br />
          {words.slice(2, 4).join(" ")}
          <br />
          {words.slice(4).join(" ")}
        </>
      )
    } else if (words.length === 2) {
      return (
        <>
          {words[0]}
          <br />
          {words[1]}
        </>
      )
    }

    // If it's just one word, return it as is
    return name
  }

  // Update object URLs when files change
  useEffect(() => {
    // Clean up previous URLs
    if (logoUrl) URL.revokeObjectURL(logoUrl)
    if (signatureUrl) URL.revokeObjectURL(signatureUrl)
    if (stampUrl) URL.revokeObjectURL(stampUrl)

    // Create new URLs if files exist
    if (formData.companyLogo?.[0] instanceof File) {
      setLogoUrl(URL.createObjectURL(formData.companyLogo[0]))
    } else {
      setLogoUrl(null)
    }

    if (formData.signature?.[0] instanceof File) {
      setSignatureUrl(URL.createObjectURL(formData.signature[0]))
    } else {
      setSignatureUrl(null)
    }

    if (formData.companyStamp?.[0] instanceof File) {
      setStampUrl(URL.createObjectURL(formData.companyStamp[0]))
    } else {
      setStampUrl(null)
    }

    // Cleanup function
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl)
      if (signatureUrl) URL.revokeObjectURL(signatureUrl)
      if (stampUrl) URL.revokeObjectURL(stampUrl)
    }
  }, [formData.companyLogo, formData.signature, formData.companyStamp])

  // Generate letter content with the intern's skills
  const generateLetterContent = (internName: string, skills: string) => {
    const skillsList = skills
      .split(/,|\n/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)

    const formattedSkills =
      skillsList.length > 1
        ? `${skillsList.slice(0, -1).join(", ")} and ${skillsList[skillsList.length - 1]}`
        : skillsList[0]

    return (
      <>
        <p className="mb-4">
          I am writing to highly recommend <span className="font-bold">{internName}</span> for any position or endeavor
          that requires a dedicated, skilled, and passionate individual. During their time at our company,{" "}
          <span className="font-bold">{internName}</span> has demonstrated exceptional abilities in{" "}
          <span className="font-bold">{formattedSkills}</span>.
        </p>
        <p className="mb-4">
          <span className="font-bold">{internName}</span> consistently demonstrated a strong work ethic, excellent
          problem-solving abilities, and a willingness to take on new challenges. Their technical skills in{" "}
          <span className="font-bold">{formattedSkills}</span> were invaluable to our team, and they quickly became a
          reliable resource for complex projects.
        </p>
        <p className="mb-4">
          Beyond their technical capabilities, <span className="font-bold">{internName}</span> is an excellent
          communicator and team player. They collaborated effectively with colleagues across departments and
          consistently delivered high-quality work on time. Their positive attitude and eagerness to learn made them a
          pleasure to work with.
        </p>
        <p className="mb-4">
          I am confident that <span className="font-bold">{internName}</span> will be an asset to any organization. They
          have my highest recommendation, and I am happy to provide further information if needed.
        </p>
      </>
    )
  }

  return (
    <div className="preview-container mx-auto max-w-[595px] overflow-auto bg-white p-4 font-serif text-black">
      <div className="letter-content" style={{ fontFamily: "Times New Roman, serif" }}>
        {/* Company Header */}
        <div className="company-header mb-6 flex justify-between">
          <div className="left-header flex items-start">
            {logoUrl && (
              <div className="mr-3 h-[100px] w-[100px]">
                <img src={logoUrl || "/placeholder.svg"} alt="Company Logo" className="h-full w-auto object-contain" />
              </div>
            )}
            <h1 className="text-lg font-bold uppercase">{formatCompanyName(formData.companyName)}</h1>
          </div>
          <div className="right-header text-right">
            <p className="text-sm">{formData.companyAddress}</p>
            <p className="text-sm">{formData.phoneNumber}</p>
            <p className="text-sm">{formData.email}</p>
          </div>
        </div>

        {/* Date */}
        <div className="date mb-6">
          <p className="text-sm">{formData.date ? formatDate(formData.date) : ""}</p>
        </div>

        {/* Salutation */}
        <div className="salutation mb-6">
          <p className="text-sm">To whom it may concern,</p>
        </div>

        {/* Letter Body */}
        <div className="letter-body mb-6 text-sm" style={{ textAlign: "justify", lineHeight: "1.15" }}>
          {formData.internName && formData.skills ? (
            generateLetterContent(formData.internName, formData.skills)
          ) : (
            <p className="text-gray-400">Letter content will appear here as you fill out the form...</p>
          )}
        </div>

        {/* Signature */}
        <div className="signature mb-6 flex justify-between">
          <div className="left-signature">
            <p className="mb-2 text-sm">Sincerely,</p>

            {signatureUrl && (
              <div className="mb-2 h-[100px] w-[250px]">
                <img
                  src={signatureUrl || "/placeholder.svg"}
                  alt="Signature"
                  className="h-full w-auto object-contain"
                />
              </div>
            )}

            <p className="text-sm font-bold">{formData.recommenderName}</p>
            <p className="text-sm font-bold">{formData.recommenderTitle}</p>
            <p className="text-sm font-bold">{formData.companyName}</p>
          </div>

          {/* Company Stamp (if uploaded) */}
          {stampUrl && (
            <div className="company-stamp h-[150px] w-[150px] self-end">
              <img src={stampUrl || "/placeholder.svg"} alt="Company Stamp" className="h-full w-auto object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
