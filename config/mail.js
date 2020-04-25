'use strict'

const config = require('./config')
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const boardMailAddress = config.boardMailAddress
const mailSender = config.mailSender
const useGmail = config.useGmail
const emailLogPath = path.join(config.logPath, 'emails.log')

const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailUser,
    pass: config.gmailPassword,
  },
})

const sendmailTransporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
})

const transporter = useGmail === '1' ? gmailTransporter : sendmailTransporter

function callback(error, info) {
  let logEntry
  if (error) {
    logEntry = 'Error: Date: ' + new Date() + ', ' + 'Error: ' + JSON.stringify(error) + '\n'
  } else {
    logEntry = 'Success: Date: ' + new Date() + ', ' + 'Info: ' + JSON.stringify(info) + '\n'
  }
  fs.appendFileSync(emailLogPath, logEntry, function(err) {
    if (err) console.log(err)
  })
}

module.exports = { boardMailAddress, mailSender, transporter, callback }
