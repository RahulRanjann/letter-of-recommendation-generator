"use client"

import { useState, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Form from "@/components/form"
import Preview from "@/components/preview"
import PDFGenerator from "@/components/pdf-generator"
import type { FormData } from "@/types"

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  // Initialize form with default values
  const methods = useForm<FormData>({
    defaultValues: {
      internName: "",
      skills: "",
      recommenderName: "",
      recommenderTitle: "",
      companyName: "",
      companyAddress: "",
      phoneNumber: "",
      email: "",
      date: new Date().toISOString().split("T")[0],
      signature: null,
      companyStamp: null,
      companyLogo: null,
    },
  })

  // Load saved data from localStorage on component mount
  useEffect(() => {
    setIsClient(true)
    const savedData = localStorage.getItem("letterFormData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // We can't restore file inputs from localStorage, so we omit those
      Object.keys(parsedData).forEach((key) => {
        if (key !== "signature" && key !== "companyStamp" && key !== "companyLogo") {
          methods.setValue(key as keyof FormData, parsedData[key])
        }
      })
    }
  }, [methods])

  // Save form data to localStorage on form change
  const saveToLocalStorage = (data: FormData) => {
    const dataToSave = { ...data }
    // Remove file objects before saving to localStorage
    delete dataToSave.signature
    delete dataToSave.companyStamp
    delete dataToSave.companyLogo
    localStorage.setItem("letterFormData", JSON.stringify(dataToSave))
  }

  // Clear form and localStorage
  const handleClearForm = () => {
    methods.reset({
      internName: "",
      skills: "",
      recommenderName: "",
      recommenderTitle: "",
      companyName: "",
      companyAddress: "",
      phoneNumber: "",
      email: "",
      date: new Date().toISOString().split("T")[0],
      signature: null,
      companyStamp: null,
      companyLogo: null,
    })
    localStorage.removeItem("letterFormData")
  }

  // Watch form values for preview and localStorage
  const formValues = methods.watch()

  useEffect(() => {
    if (isClient) {
      saveToLocalStorage(formValues)
    }
  }, [formValues, isClient])

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Letter of Recommendation Generator</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FormProvider {...methods}>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <Form onClearForm={handleClearForm} />
            </div>

            <div className="flex flex-col">
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                {isClient && <Preview formData={formValues} />}
              </div>

              <div className="mt-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <PDFGenerator formData={formValues} />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </main>
  )
}
