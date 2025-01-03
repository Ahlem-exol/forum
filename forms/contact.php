<?php
use PHPMailer\PHPMailer\PHPMailer;
require __DIR__ . '/../vendor/autoload.php';
$response = ''; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']); // Sanitize the user input
    $email = htmlspecialchars($_POST['email']); // Sanitize the user input
    $subject = htmlspecialchars($_POST['subject']); // Sanitize the user input
    $message = nl2br(htmlspecialchars($_POST['message'])); // Sanitize the user input and preserve line breaks
    $mail = new PHPMailer();

    try {
    $mail->isSMTP(); 
    // Use IMAP server to authenticate (for sending emails, use SMTP)
    $mail->Host = 'fmme.dz';  // IMAP server address (ensure it's correct for your email provider)
    $mail->SMTPAuth = true;
    $mail->Username = 'contact@fmme.dz';  // Your email address
    $mail->Password = '';  // Your email password (or application-specific password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use STARTTLS encryption
    $mail->Port = 587;  // SMTP port for unencrypted connection (try 587 or 465)

    // Sender and recipient details
    $mail->setFrom($email , 'My_Web_Site');
    $mail->addAddress('contact@fmme.dz');  // Recipient's email address
    // Set email subject and body from form data
    $mail->Subject = "Message from: " . $name . " - " . $subject;
    $mail->Body    = "You have received a new message from the contact form:\n\n" .
                     "Name: " . $name . "\n" .
                     "Email: " . $email . "\n\n" .
                     "Message:\n" . $message;
    if ($mail->send()) {
            // Success message
    $response = 'OK';    }
    } catch (Exception $e) {
        // Error message
      $response = 'L\'envoi du formulaire a échoué.';  }

}
echo $response;

?>
