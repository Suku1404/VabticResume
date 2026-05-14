// import express from 'express'
// import multer from 'multer'
// import { classifyResumeWithAI } from '../utils/aiResumeClassifier'
// import { calculateATSScore } from '../utils/calculateATSScore'

// const { PDFParse } = require('pdf-parse')

// const router = express.Router()

// const upload = multer({
//   storage: multer.memoryStorage()
// })

// router.post('/ats-check-score', upload.single('resume'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: 'Resume file is required'
//       })
//     }

//     let resumeText = ''

//     // Extract text based on file type
//     // if (req.file.mimetype === 'application/pdf') {
//     //   try {
//     //     const pdfData = await pdf(req.file.buffer)
//     //     resumeText = pdfData.text
//     //   } catch (pdfError: any) {
//     //     console.error('PDF Parse Error Details:', pdfError.message || pdfError)
//     //     return res.status(400).json({
//     //       success: false,
//     //       message:
//     //         'Could not parse PDF file. Please ensure it is a valid PDF with readable text.',
//     //       debugError: pdfError.message
//     //     })
//     //   }
//     // } 
//     if (req.file.mimetype === 'application/pdf') {
//   try {
//     const pdfData = await pdf(req.file.buffer)
//     resumeText = pdfData.text

//     console.log("Extracted text length:", resumeText.length)
//   } catch (pdfError: any) {
//     console.error('PDF Parse Error Details:', pdfError)

//     return res.status(400).json({
//       success: false,
//       message: 'Could not parse PDF file. Please upload a valid text-based PDF resume.',
//       debugError: pdfError.message
//     })
//   }
// }
//     else {
//       // For now, return a message for non-PDF files
//       return res.status(400).json({
//         success: false,
//         message:
//           'Currently only PDF files are supported. Please upload a PDF resume.'
//       })
//     }

//     if (!resumeText || resumeText.trim().length < 300) {
//       return res.status(400).json({
//         success: false,
//         message: 'This PDF does not contain enough readable text'
//       })
//     }

//     const aiCheck = await classifyResumeWithAI(resumeText)

//     if (!aiCheck.isResume || aiCheck.confidence < 70) {
//       return res.status(400).json({
//         success: false,
//         message: 'Uploaded PDF does not look like a resume.',
//         aiReason: aiCheck.reason,
//         confidence: aiCheck.confidence
//       })
//     }

//     const atsResult = calculateATSScore(resumeText)

//     return res.status(200).json({
//       success: true,
//       message: 'ATS score calculated successfully',
//       aiCheck,
//       ...atsResult
//     })
//   } catch (error: any) {
//     console.error('ATS Check Error:', error)
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Something went wrong while checking ATS score'
//     })
//   }
// })

// export default router


import express from 'express'
import multer from 'multer'
import { classifyResumeWithAI } from '../utils/aiResumeClassifier'
import { calculateATSScore } from '../utils/calculateATSScore'

const { PDFParse } = require('pdf-parse')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage()
})

const getSafeErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return 'Unknown error'
}

router.post('/ats-check-score', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      })
    }

    let resumeText = ''

    if (req.file.mimetype === 'application/pdf') {
      try {
        const parser = new PDFParse({ data: req.file.buffer })
        const pdfData = await parser.getText()
        resumeText = pdfData.text

        console.log('Extracted text length:', resumeText.length)
      } catch (pdfError: any) {
        console.error('PDF Parse Error:', getSafeErrorMessage(pdfError))

        return res.status(400).json({
          success: false,
          message: 'Could not parse PDF file. Please upload a valid text-based PDF resume.',
          debugError: pdfError.message
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Currently only PDF files are supported.'
      })
    }

    if (!resumeText || resumeText.trim().length < 300) {
      return res.status(400).json({
        success: false,
        message: 'This PDF does not contain enough readable text'
      })
    }

    const aiCheck = await classifyResumeWithAI(resumeText)

    if (!aiCheck.isResume || aiCheck.confidence < 70) {
      return res.status(400).json({
        success: false,
        message: 'Uploaded PDF does not look like a resume.',
        aiReason: aiCheck.reason,
        confidence: aiCheck.confidence
      })
    }

    const jobDescription = typeof req.body?.jobDescription === 'string'
      ? req.body.jobDescription
      : ''

    const atsResult = calculateATSScore(resumeText, jobDescription)

    return res.status(200).json({
      success: true,
      message: 'ATS score calculated successfully',
      aiCheck,
      ...atsResult
    })
  } catch (error: any) {
    console.error('ATS Check Error:', getSafeErrorMessage(error))

    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while checking ATS score'
    })
  }
})

export default router;
