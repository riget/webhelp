<h1>Fertig</h1>

<?php 
if (is_writable(TMP . 'not_yet_installed.txt'))
	unlink(TMP . 'not_yet_installed.txt');
else
{
	echo '<div class="error">Bitte l&ouml;schen Sie nun die Datei ' . TMP . 'not_yet_installed.txt !</div>';
}	

echo '<br><br>';

echo 'Zur ' . $html->link('Startseite', '/');

?>