import prisma from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";
import mailjet from "node-mailjet";

const mailClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET
);

export async function registerUser(
  username: string,
  password: string,
  email: string
) {
  if (!username || !password || !email) {
    throw new Error("All fields are required.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    // Send welcome email
    const welcomeEmail = {
      Messages: [
        {
          From: {
            Email: "admin@planifo.com",
            Name: "Planifo",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Welcome to Planifo!",
          TextPart: `Hello ${username},\n\nWelcome to our Planifo! We're excited to have you with us.`,
          HTMLPart: `<!DOCTYPE html>  
                      <html lang="en">  
                      <head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <style>  
    body {  
      font-family: 'Arial', sans-serif;  
      background-color: #f4f4f9;  
      color: #333;  
      margin: 0;  
      padding: 0;  
    }  
    .container {  
      max-width: 600px;  
      margin: 0 auto;  
      padding: 20px;  
      background-color: #ffffff;  
      border-radius: 8px;  
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);  
    }  
    h3 {  
      color: #2a2a2a;  
      font-size: 24px;  
      margin-bottom: 10px;  
    }  
    p {  
      font-size: 16px;  
      line-height: 1.6;  
      color: #555;  
    }  
    .footer {  
      margin-top: 20px;  
      font-size: 14px;  
      color: #888;  
      text-align: center;  
    }  
  </style>  
</head>  
<body>  
  <div class="container">  
    <h3>Hello ${username},</h3>  
    <p>Welcome to <strong>Planifo</strong>! We’re thrilled to have you join our community. Get ready to take your projects to the next level with us.</p>  
    <p>Let’s make it extraordinary,</p>  
    <p><strong>The Planifo Team</strong></p>  
  </div>  
  <div class="footer">  
    <p>© 2025 Planifo. All rights reserved.</p>  
  </div>  
</body>  
</html>  `,
        },
      ],
    };

    await mailClient.post("send", { version: "v3.1" }).request(welcomeEmail);

    return user;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Username or Email already exists.");
    }
    throw err;
  }
}
