import fs from 'fs'
import path from 'path'

import { addRequestId, morganError, morganSuccess } from '@middleware'
import cors from 'cors'
import express from 'express'
import asyncHandler from 'express-async-handler'
import multer from 'multer'
import { customAlphabet } from 'nanoid'
import puppeteer from 'puppeteer'

const nanoid = customAlphabet('1234567890abcdef', 10)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${nanoid()}-${file.originalname}`)
  },
})

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  storage: storage,
})

const app = express()

app.use(addRequestId)
app.use(morganSuccess)
app.use(morganError)
app.use(cors())

app.get('/ping', (_, res) => {
  res.json({ msg: 'pong' })
})

const convert = async ({ file }, res, _next) => {
  const page = await browser.newPage()

  const content = fs.readFileSync(
    `${path.join(__dirname, `/../${file.path}`)}`,
    { encoding: 'utf8', flag: 'r' }
  )

  await page.setContent(content)

  const pdf = await page.pdf({
    format: 'A5',
    margin: {
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
    },
  })

  await page.close()
  await fs.promises.unlink(`${path.join(__dirname, `/../${file.path}`)}`)

  res.contentType('application/pdf')
  res.send(pdf)
}

app.post('/convert', asyncHandler(upload.single('file')), asyncHandler(convert))

app.use(function (req, res) {
  res.status(404).json({
    msg: '404 not found',
  })
})

const PORT = 5000

let browser

const start = async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  })

  console.log(`Server started on port ${PORT}`)
}

app.listen(PORT, async () => await start())
