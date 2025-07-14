<?php
// Incluir PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/PHPMailer-master/src/PHPMailer.php';
require 'libs/PHPMailer-master/src/SMTP.php';
require 'libs/PHPMailer-master/src/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $asunto = $_POST['asunto'];
    $mensaje = $_POST['mensaje'];

    // Validación básica
    if (!empty($nombre) && !empty($correo) && !empty($asunto) && !empty($mensaje)) {
        // Crear el cuerpo del correo en HTML
        $contenidoHTML = "
        <html>
        <head>
            <title>Nuevo mensaje desde tu portafolio</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600&display=swap');

                body {
                    background-color: #010101;
                    color: #e0e0e0;
                    font-family: 'Oxanium', sans-serif;
                    padding: 30px;
                    margin: 0;
                }
                .header-logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header-logo img {
                    width: 100px;
                    height: auto;
                    filter: drop-shadow(0 0 5px #00ffff);
                }
                h2 {
                    color: #00ffff;
                    text-align: center;
                    font-size: 28px;
                    text-shadow: 0 0 10px #00ffff;
                    margin-bottom: 30px;
                }
                .info {
                    background: linear-gradient(135deg, #1a1a1a, #0c0c0c);
                    padding: 25px;
                    border-radius: 16px;
                    box-shadow: 0 0 25px #00f0ff33, 0 0 10px #ff00ff44;
                    margin-bottom: 30px;
                }
                .etiqueta {
                    color: #39ff14;
                    font-weight: 600;
                    font-size: 16px;
                    text-shadow: 0 0 3px #39ff1499;
                }
                .valor {
                    color: #ffffff;
                    font-size: 15px;
                }
                p {
                    margin-bottom: 15px;
                }
                .footer {
                    text-align: center;
                    color: #999;
                    font-size: 13px;
                    font-style: italic;
                    border-top: 1px solid #222;
                    padding-top: 15px;
                }
                .footer a {
                    color: #00ffff;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 0 8px;
                    text-shadow: 0 0 4px #00ffff;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class='header-logo'>
                <img src='https://i.pinimg.com/736x/92/34/49/923449d2cca66c8625429e29212a782f.jpg' alt='Logo' />
            </div>
            <h2>📬 ¡Nuevo mensaje desde tu portafolio!</h2>
            <div class='info'>
                <p><span class='etiqueta'>🙋‍♂️ Nombre:</span> <span class='valor'>$nombre</span></p>
                <p><span class='etiqueta'>📧 Correo:</span> <span class='valor'>$correo</span></p>
                <p><span class='etiqueta'>📝 Asunto:</span> <span class='valor'>$asunto</span></p>
                <p><span class='etiqueta'>💬 Mensaje:</span><br><span class='valor'>$mensaje</span></p>
            </div>
            <div class='footer'>
                <p>⚡ Enviado desde tu portafolio</p>
                <p>
                    <a href='https://wa.me/5217228540415' target='_blank'>📱 WhatsApp</a> | 
                    <a href='https://github.com/sherifguti' target='_blank'>🐱 GitHub</a>
                </p>
            </div>
        </body>
        </html>
        ";

        // Configuración del correo
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'pixel7811@gmail.com'; // Tu correo de envío
            $mail->Password = 'rfid xrsq kxth qamm'; // Tu contraseña de aplicación
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Configurar remitente y destinatario
            $mail->setFrom($correo, $nombre);
            $mail->addAddress('sherifguti40@gmail.com'); // Tu correo de destino
            $mail->addReplyTo($correo, $nombre);

            // Contenido del mensaje
            $mail->isHTML(true);
            $mail->Subject = $asunto;
            $mail->Body = $contenidoHTML;

            // Enviar correo
            $mail->send();

            // Redirigir a página de éxito
            header("Location: gracias.html");
            exit();
        } catch (Exception $e) {
            // Redirigir a página de error
            header("Location: error.html");
            exit();
        }
    } else {
        // Datos incompletos
        header("Location: error.html");
        exit();
    }
} else {
    // Si no es POST, redirigir a landing (por seguridad)
    header("Location: landing.html");
    exit();
}
?>