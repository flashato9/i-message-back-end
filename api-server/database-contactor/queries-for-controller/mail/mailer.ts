import { send, setApiKey } from "@sendgrid/mail";
import { emailErrorLogger, emailInfoLogger } from "../../../../misc/loggers";
import { UserTuple } from "../../models/internal-to-queries-interal/models";

setApiKey(<string>process.env.SENDGRID_API_KEY);

export async function sendConfirmationCodeToEmail(user: UserTuple) {
  const msg = {
    to: `${user.email}`,
    from: "ato_koomson@hotmail.ca", // Use the email address or domain you verified above
    subject: "French Trillion: Authentication",
    text: "French Trillion here, your authentication code is ...",
    html: `<h1>Hi ${user.username}, welcome to French Trillion</h1>
    <main>
      <p>Here is your verification code: ${user.confirmation_code}</p>
    </main>
    `,
  };
  emailInfoLogger(`Sending confirmation code email to "${user.email}"`);
  const result = await send(msg);
  emailInfoLogger(`Email confirmation code successfuly sent to "${user.email}"`, result);
  try {
  } catch (error) {
    emailErrorLogger(`Error occured when sending confirmation code email to "${user.email}"`, error);
    throw { code: "temp code", message: `Error occured when sending confirmation code email to "${user.email}"` };
  }
}
