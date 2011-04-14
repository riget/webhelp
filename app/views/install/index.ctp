<h1>Installation der Webhelp-Software:</h1>

Pr&uuml;fen der Dateirechte:

<?php 
echo '<br><br>';
$error = false;
foreach($checkdirs as $key => $dir):
	echo $dir . ' hat Schreibrechte: ';
	if (!$errors[$key]):
		echo '<div style="color: green; display: inline;">OK</div>';
	else:
		echo '<div class="error" style="display: inline;">NOK!</div>';
		$error = true;
	endif;
	echo '<br>';
endforeach;

echo '<br><br>';

if ($error):
	echo 'Bitte geben Sie den entsprechenden Verzeichnissen/Dateien die Schreibrechte!';
else:
	echo $html->link('Weiter', 'database');
endif;