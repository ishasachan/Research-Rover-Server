const User = require('../models/user');
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Function to check the last email date and send an email if it's been more than a week
async function sendWeeklyEmails() {
  try {
    const users = await User.find();
    const currentDate = new Date();

    for (const user of users) {
      const { name, email, emailDay, emailTime, interests, lastEmailDate } = user;

      console.log(`Checking email schedule for user: ${email}`);
      console.log(`Email Day: ${emailDay}`);
      console.log(`Email Time: ${emailTime}`);
      console.log(`Last Email Date: ${lastEmailDate}`);
      console.log(`Current Time: ${currentDate}`);

      if (lastEmailDate instanceof Date) {
        // Calculate the time difference in milliseconds between the last email date and the current date
        const timeDiff = currentDate.getTime() - lastEmailDate.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        console.log(`Days since last email: ${daysDiff}`);

        // Check if it's been more than a week since the last email
        if (daysDiff >= 7) {
          const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
          const currentTime = currentDate.toLocaleTimeString('en-US', { timeStyle: 'short' });

          // Check if the user's preference day and time match the current day and time
          if (currentDay === emailDay && currentTime === emailTime) {
            console.log(`Sending weekly email to ${name} (${email})`);

            // Generate the email content
            const emailContent = generateEmailContent(name, interests);

            // Send the email
            await sendEmail(email, 'Weekly Research Paper Recommendations', emailContent);

            // Update the last email date to the current date
            user.lastEmailDate = new Date();
            await user.save();

            console.log(`Email sent to ${name} (${email})`);
          } else {
            console.log(`Not sending email to ${name} (${email}). Current day and time do not match the specified schedule.`);
          }
        } else {
          console.log(`Not sending email to ${name} (${email}). Last email sent less than a week ago.`);
        }
      } else {
        console.log(`Not sending email to ${name} (${email}). Invalid last email date.`);
      }
    }
  } catch (error) {
    console.error('Error sending weekly emails:', error);
  }
}


// Function to generate the email content
function generateEmailContent(User, interests) {
  
  try {
    // let emailContent = '';

  // interests.forEach((interest) => {
  //   emailContent += `
  //     <div style="margin-bottom: 20px;">
  //       <h2 style="font-size: 20px; margin-bottom: 10px;">${interest.name}</h2>
  //   `;

  //   interest.researchPapers.forEach((paper) => {
  //     emailContent += `
  //       <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
  //         <p style="font-weight: bold; margin-bottom: 5px;">Title: ${paper.title}</p>
  //         <p style="margin-bottom: 5px;">Authors: ${paper.creators.join(', ')}</p>
  //         <p style="margin-bottom: 5px;">HTML URL: <a href="${paper.htmlUrl}">${paper.htmlUrl}</a></p>
  //         <p style="margin-bottom: 5px;">PDF URL: <a href="${paper.pdfUrl}">${paper.pdfUrl}</a></p>
  //       </div>
  //     `;
  //   });

  //   emailContent += '</div>';

  let emailContent = '';    
  emailContent += `
  <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Noto+Serif" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css2?family=Inter&amp;family=Work+Sans:wght@700&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
  }

  a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  #MessageViewBody a {
    color: inherit;
    text-decoration: none;
  }

  p {
    line-height: inherit
  }

  .desktop_hide,
  .desktop_hide table {
    mso-hide: all;
    display: none;
    max-height: 0px;
    overflow: hidden;
  }

  .image_block img+div {
    display: none;
  }

  @media (max-width:720px) {
    .desktop_hide table.icons-inner {
      display: inline-block !important;
    }

    .icons-inner {
      text-align: center;
    }

    .icons-inner td {
      margin: 0 auto;
    }

    .row-content {
      width: 100% !important;
    }

    .mobile_hide {
      display: none;
    }

    .stack .column {
      width: 100%;
      display: block;
    }

    .mobile_hide {
      min-height: 0;
      max-height: 0;
      max-width: 0;
      overflow: hidden;
      font-size: 0px;
    }

    .desktop_hide,
    .desktop_hide table {
      display: table !important;
      max-height: none !important;
    }

    .row-2 .column-1 .block-1.paragraph_block td.pad>div {
      text-align: center !important;
    }

    .row-7 .column-1 .block-1.button_block a span,
    .row-7 .column-1 .block-1.button_block div,
    .row-7 .column-1 .block-1.button_block div span {
      line-height: 2 !important;
    }

    .row-7 .column-1 .block-1.button_block .alignment a,
    .row-7 .column-1 .block-1.button_block .alignment div {
      width: [object Object] !important;
    }

    .row-2 .column-1 {
      padding: 5px 25px 20px !important;
    }

    .row-5 .column-1 {
      padding: 25px !important;
    }

    .row-8 .column-1 {
      padding: 5px !important;
    }
  }
</style>
</head>
<body style="background-color: #f7f7f7; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f7f7;">
  <tbody>
    <tr>
      <td>
        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <div class="spacer_block block-1" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4f5aba; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7826/Header-bg.png'); background-repeat: no-repeat; background-size: cover; border-radius: 0; color: #000000; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 25px; padding-right: 30px; padding-top: 5px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td class="pad" style="padding-bottom:20px;padding-top:20px;">
                              <div style="color:#ffffff;direction:ltr;font-family:Inter, sans-serif;font-size:32px;font-weight:700;letter-spacing:0px;line-height:200%;text-align:center;mso-line-height-alt:64px;">
                                <p style="margin: 0;">Research Rover</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 35px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td class="pad" style="padding-top:30px;">
                              <div style="color:#201f42;direction:ltr;font-family:Inter, sans-serif;font-size:18px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:left;mso-line-height-alt:32.4px;">
                                <p style="margin: 0; margin-bottom: 0px;">Hello ${User},</p>
                                <p style="margin: 0;"><br>Here is your weekly newsletter by Research Rover. These Journals are based on your preferences. You can edit them anytime you like by justing visiting our website.</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-size: auto; color: #000000; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-top: 2px solid #4F5ABA; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 25px; vertical-align: top; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="pad" style="text-align:center;width:100%;">
                              <h2 style="margin: 0; color: #4f5aba; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 34px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Newsletter</span></h2>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
  `;
  interests.forEach((interest) => {
    emailContent += `
    <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
    <tbody>
      <tr>
        <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-size: auto; color: #000000; width: 700px;" width="700">
            <tbody>
              <tr>
                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                  <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                    <tr>
                      <td class="pad" style="text-align:center;width:100%;">
                        <h2 style="margin: 0; color: #201f42; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">${interest.name}</span></h2>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
    `;
    interest.researchPapers.forEach((paper) => {
      emailContent += `
      <div>
        <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #fff; padding-bottom: 10px; padding-left: 25px; padding-right: 25px; padding-top: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td class="pad">
                              <div style="color:#4f5aba;direction:ltr;font-family:Inter, sans-serif;font-size:18px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:21.599999999999998px;">
                                <p style="margin: 0;">${paper.title}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td class="pad">
                              <div style="color:#101112;direction:ltr;font-family:Inter, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                <p style="margin: 0;">Authors: ${paper.creators.join(', ')}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

                  <!-- PDF and HTML URL -->
        <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; background-color: #ffffff; width: 700px;" width="700">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="button_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-top:10px;text-align:center;">
                              <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com" style="height:46px;width:151px;v-text-anchor:middle;" arcsize="0%" strokeweight="1.5pt" strokecolor="#201F42" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#201f42; font-family:Georgia, serif; font-size:16px"><![endif]--><a href="${paper.htmlUrl}" target="_blank" style="text-decoration:none;display:inline-block;color:#201f42;background-color:#ffffff;border-radius:0px;width:auto;border-top:2px solid #201F42;font-weight:400;border-right:2px solid #201F42;border-bottom:2px solid #201F42;border-left:2px solid #201F42;padding-top:5px;padding-bottom:5px;font-family:'Noto Serif', Georgia, serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">HTML URL</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="button_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-top:10px;text-align:center;">
                              <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com" style="height:46px;width:134px;v-text-anchor:middle;" arcsize="0%" strokeweight="1.5pt" strokecolor="#201F42" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#201f42; font-family:Georgia, serif; font-size:16px"><![endif]--><a href="${paper.pdfUrl}" target="_blank" style="text-decoration:none;display:inline-block;color:#201f42;background-color:#ffffff;border-radius:0px;width:auto;border-top:2px solid #201F42;font-weight:400;border-right:2px solid #201F42;border-bottom:2px solid #201F42;border-left:2px solid #201F42;padding-top:5px;padding-bottom:5px;font-family:'Noto Serif', Georgia, serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">PDF URL</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      `;
    });
});
emailContent += `
 <!-- Footer -->
  <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tbody>
      <tr>
        <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4f5aba; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7826/Header-bg.png'); background-repeat: no-repeat; background-size: cover; border-radius: 0; color: #000000; width: 700px;" width="700">
            <tbody>
              <tr>
                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 30px; padding-left: 25px; padding-right: 25px; padding-top: 30px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                  <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                    <tr>
                      <td class="pad" style="padding-bottom:20px;padding-top:5px;text-align:center;width:100%;">
                        <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 40px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">Latest papers at you hands</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    <tbody>
      <tr>
        <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
            <tbody>
              <tr>
                <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                  <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                    <tr>
                      <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                              <!--[if !vml]><!-->
                              <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                            
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
</tbody>
</table><!-- End -->
</body>
</html>
    `;
return emailContent;
  } catch (error) {
    console.error('Error sending weekly emails:', error);
  }
  
}

// Function to send an email
async function sendEmail(recipient, subject, content) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    const message = {
      from: config.smtpUser,
      to: recipient,
      subject: subject,
      html: content,
    };

    await transporter.sendMail(message);
  } catch (error) {
    throw new Error('Error sending email:', error);
  }
}

// Call the sendWeeklyEmails function every 10 seconds
// setInterval(sendWeeklyEmails, 3600000);
setInterval(sendWeeklyEmails, 60000);

module.exports = { sendWeeklyEmails, generateEmailContent, sendEmail };
