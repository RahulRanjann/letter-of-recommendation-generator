"use client"

import { useState } from "react"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { FormData } from "@/types"
import { formatDate } from "@/lib/utils"

interface PDFGeneratorProps {
  formData: FormData
}

export default function PDFGenerator({ formData }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()

      // Add a blank page (A4 size: 595x842 points)
      const page = pdfDoc.addPage([595, 842])

      // Embed the Times Roman font
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      // Set margins (1 inch = 72 points)
      const margin = 72
      const pageWidth = page.getWidth() - margin * 2

      // Current Y position (start from top)
      let yPosition = 842 - margin

      // Format company name for multiple lines
      const formatCompanyNameForPDF = (name: string) => {
        const words = name.split(" ")
        const lines = []

        if (words.length >= 3) {
          lines.push(words.slice(0, 2).join(" "))
          lines.push(words.slice(2, 4).join(" "))
          if (words.length > 4) {
            lines.push(words.slice(4).join(" "))
          }
        } else if (words.length === 2) {
          lines.push(words[0])
          lines.push(words[1])
        } else {
          lines.push(name)
        }

        return lines
      }

      // Add company logo if uploaded
      if (formData.companyLogo?.[0]) {
        const logoBytes = await formData.companyLogo[0].arrayBuffer()
        let logoImage

        try {
          logoImage = await pdfDoc.embedPng(logoBytes)
        } catch {
          // If not PNG, try as JPEG
          logoImage = await pdfDoc.embedJpg(logoBytes)
        }

        const logoWidth = 100
        const logoHeight = 100

        page.drawImage(logoImage, {
          x: margin,
          y: yPosition - logoHeight + 14, // Align with company name
          width: logoWidth,
          height: logoHeight,
        })

        // Company Header - Left side (Company Name) - with offset for logo
        const companyNameLines = formatCompanyNameForPDF(formData.companyName)
        let nameYPosition = yPosition

        for (const line of companyNameLines) {
          page.drawText(line.toUpperCase(), {
            x: margin + logoWidth + 10,
            y: nameYPosition,
            size: 14,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          })
          nameYPosition -= 16 // Move down for next line
        }
      } else {
        // Company Header - Left side (Company Name) - without logo
        const companyNameLines = formatCompanyNameForPDF(formData.companyName)
        let nameYPosition = yPosition

        for (const line of companyNameLines) {
          page.drawText(line.toUpperCase(), {
            x: margin,
            y: nameYPosition,
            size: 14,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
          })
          nameYPosition -= 16 // Move down for next line
        }
      }

      // Company Header - Right side (Address, Phone, Email)
      const addressText = formData.companyAddress
      const phoneText = `Phone: ${formData.phoneNumber}`
      const emailText = `Email: ${formData.email}`

      const addressWidth = timesRomanFont.widthOfTextAtSize(addressText, 12)
      const phoneWidth = timesRomanFont.widthOfTextAtSize(phoneText, 12)
      const emailWidth = timesRomanFont.widthOfTextAtSize(emailText, 12)

      page.drawText(addressText, {
        x: 595 - margin - addressWidth,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      yPosition -= 16

      page.drawText(phoneText, {
        x: 595 - margin - phoneWidth,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      yPosition -= 16

      page.drawText(emailText, {
        x: 595 - margin - emailWidth,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      // Adjust yPosition based on company name lines
      const companyNameLines = formatCompanyNameForPDF(formData.companyName)
      if (companyNameLines.length > 1) {
        yPosition -= (companyNameLines.length - 1) * 16
      }

      yPosition -= 32 // Extra space after header

      // Date
      page.drawText(formatDate(formData.date), {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      yPosition -= 32 // Extra space after date

      // Salutation
      page.drawText("To whom it may concern,", {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      yPosition -= 32 // Extra space after salutation

      // Process skills into a list
      const skillsList = formData.skills
        .split(/,|\n/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      const skillsText =
        skillsList.length > 1
          ? `${skillsList.slice(0, -1).join(", ")} and ${skillsList[skillsList.length - 1]}`
          : skillsList[0]

      // Function to draw text with specific words in bold
      const drawTextWithBoldWords = (
        paragraph: string,
        startX: number,
        startY: number,
        fontSize: number,
        boldWords: string[],
      ) => {
        // Split the paragraph into words
        const words = paragraph.split(" ")
        const currentX = startX
        let currentY = startY
        let currentLine = ""
        let currentLineWidth = 0
        let lineWords = []

        // Process each word
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          const space = i < words.length - 1 ? " " : ""
          const fullWord = word + space

          // Check if this word should be bold
          const shouldBeBold = boldWords.some(
            (boldWord) =>
              word === boldWord ||
              word.includes(boldWord + ",") ||
              word.includes(boldWord + ".") ||
              word.includes(boldWord + "?") ||
              word.includes(boldWord + "!"),
          )

          const font = shouldBeBold ? timesRomanBoldFont : timesRomanFont
          const wordWidth = font.widthOfTextAtSize(fullWord, fontSize)

          // Check if adding this word would exceed the line width
          if (currentLineWidth + wordWidth > pageWidth) {
            // Draw the current line
            let lineX = startX
            for (const lineWord of lineWords) {
              const isBold = boldWords.some(
                (boldWord) =>
                  lineWord.word === boldWord ||
                  lineWord.word.includes(boldWord + ",") ||
                  lineWord.word.includes(boldWord + ".") ||
                  lineWord.word.includes(boldWord + "?") ||
                  lineWord.word.includes(boldWord + "!"),
              )

              const wordFont = isBold ? timesRomanBoldFont : timesRomanFont
              page.drawText(lineWord.text, {
                x: lineX,
                y: currentY,
                size: fontSize,
                font: wordFont,
                color: rgb(0, 0, 0),
              })

              lineX += lineWord.width
            }

            // Move to the next line
            currentY -= fontSize * 1.15
            currentLine = ""
            currentLineWidth = 0
            lineWords = []
          }

          // Add the word to the current line
          lineWords.push({
            word: word,
            text: fullWord,
            width: wordWidth,
            isBold: shouldBeBold,
          })
          currentLineWidth += wordWidth
        }

        // Draw any remaining text
        if (lineWords.length > 0) {
          let lineX = startX
          for (const lineWord of lineWords) {
            const isBold = boldWords.some(
              (boldWord) =>
                lineWord.word === boldWord ||
                lineWord.word.includes(boldWord + ",") ||
                lineWord.word.includes(boldWord + ".") ||
                lineWord.word.includes(boldWord + "?") ||
                lineWord.word.includes(boldWord + "!"),
            )

            const wordFont = isBold ? timesRomanBoldFont : timesRomanFont
            page.drawText(lineWord.text, {
              x: lineX,
              y: currentY,
              size: fontSize,
              font: wordFont,
              color: rgb(0, 0, 0),
            })

            lineX += lineWord.width
          }
        }

        return currentY - fontSize * 1.5 // Return the new Y position
      }

      // Words that should be bold
      const boldWords = [
        formData.internName,
        ...skillsList,
        formData.recommenderName,
        formData.recommenderTitle,
        formData.companyName,
      ]

      // Letter body paragraphs
      const paragraphs = [
        `I am writing to highly recommend ${formData.internName} for any position or endeavor that requires a dedicated, skilled, and passionate individual. During their time at our company, ${formData.internName} has demonstrated exceptional abilities in ${skillsText}.`,

        `${formData.internName} consistently demonstrated a strong work ethic, excellent problem-solving abilities, and a willingness to take on new challenges. Their technical skills in ${skillsText} were invaluable to our team, and they quickly became a reliable resource for complex projects.`,

        `Beyond their technical capabilities, ${formData.internName} is an excellent communicator and team player. They collaborated effectively with colleagues across departments and consistently delivered high-quality work on time. Their positive attitude and eagerness to learn made them a pleasure to work with.`,

        `I am confident that ${formData.internName} will be an asset to any organization. They have my highest recommendation, and I am happy to provide further information if needed.`,
      ]

      // Draw paragraphs with bold words
      for (const paragraph of paragraphs) {
        yPosition = drawTextWithBoldWords(paragraph, margin, yPosition, 12, boldWords)
      }

      // Closing
      yPosition -= 8 // Extra space before closing

      page.drawText("Sincerely,", {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })

      yPosition -= 50 // Space for signature

      // Add signature image if uploaded
      if (formData.signature?.[0]) {
        const signatureBytes = await formData.signature[0].arrayBuffer()
        let signatureImage

        try {
          signatureImage = await pdfDoc.embedPng(signatureBytes)
        } catch {
          // If not PNG, try as JPEG
          signatureImage = await pdfDoc.embedJpg(signatureBytes)
        }

        const signatureDims = signatureImage.scale(1)
        const signatureWidth = 250
        const signatureHeight = (signatureDims.height / signatureDims.width) * signatureWidth

        page.drawImage(signatureImage, {
          x: margin,
          y: yPosition,
          width: signatureWidth,
          height: signatureHeight,
        })

        yPosition -= signatureHeight + 16
      }

      // Recommender info - with bold text
      page.drawText(formData.recommenderName, {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanBoldFont, // Bold
        color: rgb(0, 0, 0),
      })

      yPosition -= 16

      page.drawText(formData.recommenderTitle, {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanBoldFont, // Bold
        color: rgb(0, 0, 0),
      })

      yPosition -= 16

      page.drawText(formData.companyName, {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesRomanBoldFont, // Bold
        color: rgb(0, 0, 0),
      })

      // Add company stamp if uploaded
      if (formData.companyStamp?.[0]) {
        const stampBytes = await formData.companyStamp[0].arrayBuffer()
        let stampImage

        try {
          stampImage = await pdfDoc.embedPng(stampBytes)
        } catch {
          // If not PNG, try as JPEG
          stampImage = await pdfDoc.embedJpg(stampBytes)
        }

        const stampWidth = 150
        const stampHeight = 150

        // Position the stamp at the same level as the signature block
        const stampY = yPosition + 50 // Adjust this value to align with the signature

        page.drawImage(stampImage, {
          x: 595 - margin - stampWidth,
          y: stampY,
          width: stampWidth,
          height: stampHeight,
        })
      }

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save()

      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" })

      // Create a download link
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `Letter_of_Recommendation_${formData.internName.replace(/\s+/g, "_")}.pdf`
      link.click()

      // Clean up
      URL.revokeObjectURL(link.href)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setIsGenerating(false)
      alert("An error occurred while generating the PDF. Please try again.")
    }
  }

  const isFormValid = () => {
    return (
      formData.internName &&
      formData.skills &&
      formData.recommenderName &&
      formData.recommenderTitle &&
      formData.companyName &&
      formData.companyAddress &&
      formData.phoneNumber &&
      formData.email &&
      formData.date
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={generatePDF}
        disabled={isGenerating || !isFormValid()}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          "Generate PDF"
        )}
      </Button>

      {!isFormValid() && (
        <p className="text-center text-sm text-red-500">Please fill in all required fields to generate the PDF.</p>
      )}
    </div>
  )
}
