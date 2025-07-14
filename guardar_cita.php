<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/vendor/autoload.php'; // Autoload para PhpSpreadsheet
//librerias de gmail
require 'libs/PHPMailer-master/src/PHPMailer.php';
require 'libs/PHPMailer-master/src/SMTP.php';
require 'libs/PHPMailer-master/src/Exception.php';
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

// Obtener datos JSON desde JS
$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data["nombre"];
$correo = $data["correo"];
$proyecto = $data["proyecto"];
$fechaCita = $data["fecha"]; // Fecha que escribió el usuario

// Ruta del archivo de Excel acumulativo
$excel_file = "citas_bot_xd.xlsx";

if (file_exists($excel_file)) {
    $spreadsheet = IOFactory::load($excel_file);
    $sheet = $spreadsheet->getActiveSheet();
    $ultimaFila = $sheet->getHighestRow() + 1;
} else {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Encabezados
    $sheet->setCellValue('A1', 'Nombre');
    $sheet->setCellValue('B1', 'Correo');
    $sheet->setCellValue('C1', 'Proyecto');
    $sheet->setCellValue('D1', 'Fecha');

    // Estilo encabezado neón magenta
    $sheet->getStyle('A1:D1')->applyFromArray([
        'font' => ['bold' => true, 'color' => ['rgb' => 'FF00FF']], // magenta neón
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '000000']], // negro puro
        'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'FF00FF']]],
        'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    ]);

    // Autoajustar columnas
    foreach (range('A', 'D') as $col) {
        $sheet->getColumnDimension($col)->setAutoSize(true);
    }

    $ultimaFila = 2;
}

// Escribir datos
$sheet->setCellValue("A$ultimaFila", $nombre);
$sheet->setCellValue("B$ultimaFila", $correo);
$sheet->setCellValue("C$ultimaFila", $proyecto);
$sheet->setCellValue("D$ultimaFila", $fechaCita );

// Estilo para filas alternas: fila par cyan neón, impar verde neón, fondo negro
$colorTexto = ($ultimaFila % 2 == 0) ? '00FFFF' : '39FF14'; // cyan o verde neón
$colorFondo = '000000'; // negro puro

$sheet->getStyle("A$ultimaFila:D$ultimaFila")->applyFromArray([
    'font' => ['color' => ['rgb' => $colorTexto], 'bold' => true],
    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $colorFondo]],
    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => $colorTexto]]],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT],
]);

// Opcional: Ajustar la altura de fila para más estética
$sheet->getRowDimension($ultimaFila)->setRowHeight(22);

// Guardar archivo Excel
$writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
$writer->save($excel_file);

// ✉️ Enviar correo con el Excel adjunto
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'juliocesarin550@gmail.com';
    $mail->Password = 'boiufzzspfzfwvok'; // la contraseña sin espacios
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('juliocesarin550@gmail.com', '🤖 Bot del Portafolio');
    $mail->addAddress('sherifguti40@gmail.com');

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = '🗓️ Nueva cita agendada';
$mail->Body = "
<html>
<head>
    <title>📅 Nueva cita desde tu portafolio</title>
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
            mix-blend-mode:multiply;
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
    <h2>📅 ¡Nueva cita agendada!</h2>
    <div class='info'>
        <p><span class='etiqueta'>🙋‍♂️ Nombre:</span> <span class='valor'>$nombre</span></p>
        <p><span class='etiqueta'>📧 Correo:</span> <span class='valor'>$correo</span></p>
        <p><span class='etiqueta'>🛠️ Proyecto:</span> <span class='valor'>$proyecto</span></p>
        <p><span class='etiqueta'>🕒 Fecha de la cita:</span> <span class='valor'>$fechaCita</span></p>
    </div>
    <div class='footer'>
        <p>⚡ Archivo Excel adjunto con todas las citas agendadas</p>
        <p>
            <a href='https://wa.me/5217228540415' target='_blank'>📱 WhatsApp</a> | 
            <a href='https://github.com/sherifguti' target='_blank'>🐱 GitHub</a>
        </p>
    </div>
</body>
</html>
";
$mail->addAttachment($excel_file);
$mail->send();

header('Content-Type: application/json; charset=utf-8');
echo json_encode(["success" => true, "msg" => "📥 Cita guardada y Excel enviado con éxito"]);
exit;
} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["success" => false, "msg" => "❌ Error al enviar el correo: " . $mail->ErrorInfo]);
    exit;
}
?>
