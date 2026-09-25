import { Webhook } from "npm:standardwebhooks@^1";
import { Resend } from "npm:resend@6";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");

const hookSecret = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace(
    "v1,whsec_",
    "",
);

type EmailData = {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new: string;
    token_hash_new: string;
};

type HookPayload = {
    user: {
        id: string;
        email: string;
    };
    email_data: EmailData;
};

Deno.serve(async (req: Request): Promise<Response> => {
    if (req.method !== "POST") {
        return new Response("not allowed", {
            status: 400,
        });
    }

    try {
        const payload = await req.text();
        const headers = Object.fromEntries(req.headers);

        const wh = new Webhook(hookSecret);

        const { user, email_data } = wh.verify(payload, headers) as HookPayload;

        const recipient = user.email;
        const token = email_data.token;

        let subject = "Your Vaulty verification code";
        let html = "";

        if (email_data.email_action_type === "signup") {
            subject = "Your Vaulty verification code";

            html = `
        <div style="
          margin:0;
          padding:40px 20px;
          background:#09070D;
          font-family:Arial,sans-serif;
        ">
          <div style="
            max-width:520px;
            margin:0 auto;
            padding:32px;
            background:#15111F;
            border:1px solid #30263D;
            border-radius:20px;
            text-align:center;
          ">

            <div style="
              margin-bottom:24px;
            ">
              <div style="
                font-size:14px;
                font-weight:bold;
                letter-spacing:3px;
                color:#D4AF37;
              ">
                SMART RENTAL VAULT
              </div>

              <div style="
                margin-top:6px;
                font-size:12px;
                letter-spacing:2px;
                color:#7F758F;
              ">
                VAULTY
              </div>
            </div>

            <h2 style="
              margin:0;
              color:#F8F4FF;
              font-size:26px;
            ">
              Verify your email
            </h2>

            <p style="
              margin-top:12px;
              color:#A9A0B8;
              font-size:15px;
              line-height:24px;
            ">
              Welcome to Vaulty. Enter the verification code
              below in the app to finish creating your account.
            </p>

            <div style="
              margin:28px 0;
              padding:20px;
              background:#211A2E;
              border:1px solid #D4AF37;
              border-radius:16px;
            ">
              <div style="
                font-size:34px;
                font-weight:bold;
                letter-spacing:10px;
                color:#F1D77A;
              ">
                ${token}
              </div>
            </div>

            <p style="
              margin:0;
              color:#7F758F;
              font-size:13px;
              line-height:20px;
            ">
              This is your one-time verification code.
            </p>

            <p style="
              margin-top:24px;
              color:#7F758F;
              font-size:12px;
              line-height:18px;
            ">
              If you did not create a Vaulty account,
              you can safely ignore this email.
            </p>

          </div>
        </div>
      `;
        } else if (email_data.email_action_type === "recovery") {
            subject = "Your Vaulty password reset code";

            html = `
        <div style="
          margin:0;
          padding:40px 20px;
          background:#09070D;
          font-family:Arial,sans-serif;
        ">
          <div style="
            max-width:520px;
            margin:0 auto;
            padding:32px;
            background:#15111F;
            border:1px solid #30263D;
            border-radius:20px;
            text-align:center;
          ">

            <div style="
              font-size:14px;
              font-weight:bold;
              letter-spacing:3px;
              color:#D4AF37;
              margin-bottom:24px;
            ">
              SMART RENTAL VAULT
            </div>

            <h2 style="
              margin:0;
              color:#F8F4FF;
              font-size:26px;
            ">
              Reset your password
            </h2>

            <p style="
              margin-top:12px;
              color:#A9A0B8;
              font-size:15px;
              line-height:24px;
            ">
              Enter the code below in Vaulty to continue.
            </p>

            <div style="
              margin:28px 0;
              padding:20px;
              background:#211A2E;
              border:1px solid #D4AF37;
              border-radius:16px;
            ">
              <div style="
                font-size:34px;
                font-weight:bold;
                letter-spacing:10px;
                color:#F1D77A;
              ">
                ${token}
              </div>
            </div>

          </div>
        </div>
      `;
        } else if (email_data.email_action_type === "email_change") {
            subject = "Confirm your new Vaulty email";

            html = `
        <div style="
          margin:0;
          padding:40px 20px;
          background:#09070D;
          font-family:Arial,sans-serif;
        ">
          <div style="
            max-width:520px;
            margin:0 auto;
            padding:32px;
            background:#15111F;
            border:1px solid #30263D;
            border-radius:20px;
            text-align:center;
          ">

            <div style="
              font-size:14px;
              font-weight:bold;
              letter-spacing:3px;
              color:#D4AF37;
              margin-bottom:24px;
            ">
              SMART RENTAL VAULT
            </div>

            <h2 style="
              margin:0;
              color:#F8F4FF;
              font-size:26px;
            ">
              Confirm your email
            </h2>

            <p style="
              margin-top:12px;
              color:#A9A0B8;
              font-size:15px;
              line-height:24px;
            ">
              Enter this code in Vaulty to confirm your
              email change.
            </p>

            <div style="
              margin:28px 0;
              padding:20px;
              background:#211A2E;
              border:1px solid #D4AF37;
              border-radius:16px;
            ">
              <div style="
                font-size:34px;
                font-weight:bold;
                letter-spacing:10px;
                color:#F1D77A;
              ">
                ${token}
              </div>
            </div>

          </div>
        </div>
      `;
        } else {
            return new Response(
                JSON.stringify({
                    error: "Unsupported email action type",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const { data, error } = await resend.emails.send({
            from: "Vaulty <kyutashishu@gmail.com>",
            to: [recipient],
            subject,
            html,
        });

        if (error) {
            console.error("Resend error:", error);

            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        console.log("Email sent:", data);

        return new Response(JSON.stringify({}), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Send email hook error:", error);

        const message =
            error instanceof Error ? error.message : "Unknown error";

        return new Response(
            JSON.stringify({
                error: {
                    message,
                },
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
});
